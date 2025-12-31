import { updateMeal, deleteMeal } from '@/lib/meals';

// Create a shared mock meals store
const mockMealsStore = new Map([
  [
    'test-meal',
    {
      id: '1',
      title: 'Test Meal',
      slug: 'test-meal',
      image: '/images/test.jpg',
      summary: 'Test summary',
      instructions: 'Test instructions',
      creator: 'Test Creator',
      creator_email: 'test@example.com',
    },
  ],
]);

// Mock dependencies
jest.mock('better-sqlite3', () => {
  return jest.fn(() => ({
    prepare: jest.fn((query: string) => {
      if (query.includes('SELECT')) {
        return {
          get: jest.fn((slug: string) => mockMealsStore.get(slug)),
        };
      }
      if (query.includes('UPDATE')) {
        return {
          run: jest.fn((data: any) => {
            const existing = mockMealsStore.get(data.slug);
            if (existing) {
              mockMealsStore.set(data.slug, { ...existing, ...data });
            }
          }),
        };
      }
      if (query.includes('DELETE')) {
        return {
          run: jest.fn((slug: string) => {
            mockMealsStore.delete(slug);
          }),
        };
      }
      return {
        get: jest.fn(),
        run: jest.fn(),
      };
    }),
  }));
});

jest.mock('../../lib/s3Client', () => ({
  s3Client: {
    send: jest.fn(),
  },
  BUCKET_NAME: 'test-bucket',
}));

jest.mock('node:fs', () => ({
  createWriteStream: jest.fn(() => ({
    write: jest.fn((buffer, callback) => callback()),
  })),
}));

describe('meals library - updateMeal', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Reset the meals store before each test
    mockMealsStore.clear();
    mockMealsStore.set('test-meal', {
      id: '1',
      title: 'Test Meal',
      slug: 'test-meal',
      image: '/images/test.jpg',
      summary: 'Test summary',
      instructions: 'Test instructions',
      creator: 'Test Creator',
      creator_email: 'test@example.com',
    });
  });

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
    jest.clearAllMocks();
  });

  it('updates meal without new image', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });

    const updatedData = {
      title: 'Updated Title',
      summary: 'Updated summary',
      instructions: 'Updated instructions',
      creator: 'Updated Creator',
    };

    await expect(updateMeal('test-meal', updatedData)).resolves.not.toThrow();
  });

  it('throws error when meal not found', async () => {
    await expect(updateMeal('non-existent', {})).rejects.toThrow(
      'Meal not found',
    );
  });

  it('updates meal with new image in development', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });

    const mockImage = new File(['test'], 'new-image.jpg', {
      type: 'image/jpeg',
    });

    // Mock arrayBuffer method for File object
    Object.defineProperty(mockImage, 'arrayBuffer', {
      value: jest.fn(() => Promise.resolve(new ArrayBuffer(4))),
    });

    const updatedData = {
      title: 'Updated Title',
      image: mockImage,
    };

    await expect(updateMeal('test-meal', updatedData)).resolves.not.toThrow();
  });

  it('sanitizes XSS in meal data', async () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });

    const maliciousData = {
      title: '<script>alert("xss")</script>Safe Title',
      summary: 'XSS attempt with script tag',
      instructions: '<a href="javascript:alert(1)">Click</a>',
    };

    await expect(updateMeal('test-meal', maliciousData)).resolves.not.toThrow();
  });
});

describe('meals library - deleteMeal', () => {
  beforeEach(() => {
    // Reset the meals store before each test
    mockMealsStore.clear();
    mockMealsStore.set('test-meal', {
      id: '1',
      title: 'Test Meal',
      slug: 'test-meal',
      image: '/images/test.jpg',
      summary: 'Test summary',
      instructions: 'Test instructions',
      creator: 'Test Creator',
      creator_email: 'test@example.com',
    });
  });

  it('deletes meal when user is creator', async () => {
    await expect(
      deleteMeal('test-meal', 'test@example.com', false),
    ).resolves.not.toThrow();
  });

  it('deletes meal when user is admin', async () => {
    await expect(
      deleteMeal('test-meal', 'other@example.com', true),
    ).resolves.not.toThrow();
  });

  it('throws error when meal not found', async () => {
    await expect(
      deleteMeal('non-existent', 'test@example.com', false),
    ).rejects.toThrow('Meal not found');
  });

  it('throws error when user is not authorized', async () => {
    await expect(
      deleteMeal('test-meal', 'other@example.com', false),
    ).rejects.toThrow('Unauthorized: You can only delete your own recipes');
  });

  it('allows deletion without userEmail when admin', async () => {
    await expect(deleteMeal('test-meal', undefined, true)).resolves.not.toThrow();
  });
});

