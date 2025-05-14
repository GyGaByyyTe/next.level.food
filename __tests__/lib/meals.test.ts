import { getMeals } from '@/lib/meals';
import { Meal } from '@/types/meals';

// Mock the better-sqlite3 module
jest.mock('better-sqlite3', () => {
  // Mock data
  const mockMeals = [
    {
      id: '1',
      title: 'Test Meal 1',
      slug: 'test-meal-1',
      image: 'test-image-1.jpg',
      summary: 'This is test meal 1',
      creator: 'Test Creator 1',
    },
    {
      id: '2',
      title: 'Test Meal 2',
      slug: 'test-meal-2',
      image: 'test-image-2.jpg',
      summary: 'This is test meal 2',
      creator: 'Test Creator 2',
    },
  ];

  const mockPrepare = jest.fn().mockReturnValue({
    all: jest.fn().mockReturnValue(mockMeals)
  });

  return jest.fn().mockReturnValue({
    prepare: mockPrepare
  });
});

describe('meals library', () => {
  describe('getMeals', () => {
    // Mock the setTimeout function to avoid waiting in tests
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return an array of meals', async () => {
      // Start the async operation
      const mealsPromise = getMeals();

      // Fast-forward the timer to avoid waiting
      jest.advanceTimersByTime(5000);

      // Wait for the promise to resolve
      const meals = await mealsPromise;

      // Check that the function returns an array
      expect(Array.isArray(meals)).toBe(true);

      // Check that the array has the expected length
      expect(meals.length).toBe(2);

      // Check that the array contains Meal objects with the expected properties
      expect(meals[0]).toHaveProperty('id', '1');
      expect(meals[0]).toHaveProperty('title', 'Test Meal 1');
      expect(meals[0]).toHaveProperty('slug', 'test-meal-1');
      expect(meals[0]).toHaveProperty('image', 'test-image-1.jpg');
      expect(meals[0]).toHaveProperty('summary', 'This is test meal 1');
      expect(meals[0]).toHaveProperty('creator', 'Test Creator 1');

      expect(meals[1]).toHaveProperty('id', '2');
      expect(meals[1]).toHaveProperty('title', 'Test Meal 2');
      expect(meals[1]).toHaveProperty('slug', 'test-meal-2');
      expect(meals[1]).toHaveProperty('image', 'test-image-2.jpg');
      expect(meals[1]).toHaveProperty('summary', 'This is test meal 2');
      expect(meals[1]).toHaveProperty('creator', 'Test Creator 2');
    });

    it('should call the database with the correct SQL query', async () => {
      // Reset the mock before the test
      jest.clearAllMocks();

      // Get the mock function
      const betterSqlite3 = require('better-sqlite3');
      const mockDb = betterSqlite3();
      const mockPrepare = mockDb.prepare;

      // Start the async operation
      const mealsPromise = getMeals();

      // Fast-forward the timer to avoid waiting
      jest.advanceTimersByTime(5000);

      // Wait for the promise to resolve
      await mealsPromise;

      // Check that the prepare method was called with the correct SQL query
      expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM meals');

      // Check that the all method was called
      const mockAll = mockPrepare().all;
      expect(mockAll).toHaveBeenCalled();
    });
  });
});
