import { shareMealHandler } from '../../lib/actions';
import { saveMeal } from '../../lib/meals';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Mock dependencies
jest.mock('../../lib/meals', () => ({
  saveMeal: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('actions', () => {
  describe('shareMealHandler', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });

    it('should process form data correctly', async () => {
      // Create a mock FormData
      const formData = new FormData();
      formData.append('title', 'Test Meal');
      formData.append('summary', 'This is a test meal');
      formData.append('instructions', 'Test instructions');
      formData.append('image', 'test-image.jpg');
      formData.append('name', 'Test Creator');
      formData.append('email', 'test@example.com');

      // Call the handler
      await shareMealHandler(formData);

      // Check that saveMeal was called with the correct data
      expect(saveMeal).toHaveBeenCalledWith({
        title: 'Test Meal',
        summary: 'This is a test meal',
        instructions: 'Test instructions',
        image: 'test-image.jpg',
        creator: 'Test Creator',
        creator_email: 'test@example.com',
      });

      // Check that revalidatePath was called with the correct path
      expect(revalidatePath).toHaveBeenCalledWith('/meals');

      // Check that redirect was called with the correct path
      expect(redirect).toHaveBeenCalledWith('/meals');
    });

    it('should handle missing form data with empty strings', async () => {
      // Create an empty FormData
      const formData = new FormData();

      // Call the handler
      await shareMealHandler(formData);

      // Check that saveMeal was called with empty strings for missing data
      expect(saveMeal).toHaveBeenCalledWith({
        title: '',
        summary: '',
        instructions: '',
        image: '',
        creator: '',
        creator_email: '',
      });

      // Check that revalidatePath was called with the correct path
      expect(revalidatePath).toHaveBeenCalledWith('/meals');

      // Check that redirect was called with the correct path
      expect(redirect).toHaveBeenCalledWith('/meals');
    });
  });
});
