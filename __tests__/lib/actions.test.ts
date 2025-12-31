import { shareMealHandler, updateMealHandler, deleteMealHandler } from '../../lib/actions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Mock dependencies
jest.mock('../../lib/meals', () => ({
  saveMeal: jest.fn(),
  updateMeal: jest.fn(),
  deleteMeal: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('../../lib/auth', () => ({
  auth: jest.fn(() => Promise.resolve(null)),
}));

// Get mocked functions
const { saveMeal, updateMeal, deleteMeal } = require('../../lib/meals');

describe('actions', () => {
  describe('shareMealHandler', () => {
    const initialState = {
      meal: null,
      error: '',
      message: '',
    };

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

      // Create a mock File
      const mockFile = new File(['test file content'], 'test-image.jpg', { type: 'image/jpeg' });
      formData.append('image', mockFile);

      formData.append('name', 'Test Creator');
      formData.append('email', 'test@example.com');

      // Call the handler with initialState
      await shareMealHandler(initialState, formData);

      // Check that saveMeal was called with the correct data
      expect(saveMeal).toHaveBeenCalledWith({
        title: 'Test Meal',
        summary: 'This is a test meal',
        instructions: 'Test instructions',
        image: mockFile,
        creator: 'Test Creator',
        creator_email: 'test@example.com',
      });

      // Check that revalidatePath was called with the correct path
      expect(revalidatePath).toHaveBeenCalledWith('/meals');

      // Check that redirect was called with the correct path
      expect(redirect).toHaveBeenCalledWith('/meals?success=created');
    });

    it('should throw an error for invalid input', async () => {
      // Create a FormData with invalid inputs
      const formData = new FormData();
      formData.append('title', '  '); // Empty after trim
      formData.append('summary', 'Valid summary');
      formData.append('instructions', 'Valid instructions');
      formData.append('name', 'Valid name');
      formData.append('email', 'invalid-email'); // Missing @

      // Empty file
      const emptyFile = new File([''], 'empty.jpg', { type: 'image/jpeg' });
      formData.append('image', emptyFile);

      // Call the handler - it should return an error state, not throw
      const result = await shareMealHandler(initialState, formData);

      // Check that result has error
      expect(result.error).toBeTruthy();

      // Check that saveMeal was not called
      expect(saveMeal).not.toHaveBeenCalled();

      // Check that revalidatePath was not called
      expect(revalidatePath).not.toHaveBeenCalled();

      // Check that redirect was not called
      expect(redirect).not.toHaveBeenCalled();
    });

    it('should throw an error when image is missing', async () => {
      // Create a FormData with valid inputs but no image
      const formData = new FormData();
      formData.append('title', 'Valid Title');
      formData.append('summary', 'Valid summary');
      formData.append('instructions', 'Valid instructions');
      formData.append('name', 'Valid name');
      formData.append('email', 'valid@example.com');

      // No image appended

      // Call the handler - it should return an error state, not throw
      const result = await shareMealHandler(initialState, formData);

      // Check that result has error
      expect(result.error).toBeTruthy();

      // Check that saveMeal was not called
      expect(saveMeal).not.toHaveBeenCalled();
    });

    it('should throw an error when email format is invalid', async () => {
      // Create a FormData with valid inputs but invalid email
      const formData = new FormData();
      formData.append('title', 'Valid Title');
      formData.append('summary', 'Valid summary');
      formData.append('instructions', 'Valid instructions');

      const mockFile = new File(['test file content'], 'test-image.jpg', { type: 'image/jpeg' });
      formData.append('image', mockFile);

      formData.append('name', 'Valid name');
      formData.append('email', 'invalidemail'); // Missing @

      // Call the handler - it should return an error state, not throw
      const result = await shareMealHandler(initialState, formData);

      // Check that result has error
      expect(result.error).toBeTruthy();

      // Check that saveMeal was not called
      expect(saveMeal).not.toHaveBeenCalled();
    });
  });

  describe('updateMealHandler', () => {
    const initialState = {
      meal: null,
      error: '',
      message: '',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return error when user is not authenticated', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue(null);

      const formData = new FormData();
      const result = await updateMealHandler('test-slug', initialState, formData);

      expect(result.error).toBe('Unauthorized');
      expect(result.message).toBe('You must be logged in to update a meal.');
      expect(updateMeal).not.toHaveBeenCalled();
    });

    it('should return error for invalid meal data', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue({
        user: { email: 'test@example.com' },
      });

      const formData = new FormData();
      formData.append('title', '   '); // Invalid - empty
      formData.append('summary', 'Valid summary');
      formData.append('instructions', 'Valid instructions');
      formData.append('name', 'Test User');

      const result = await updateMealHandler('test-slug', initialState, formData);

      expect(result.error).toBe('Invalid meal information');
      expect(updateMeal).not.toHaveBeenCalled();
    });

    it('should successfully update meal', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue({
        user: { email: 'test@example.com' },
      });

      (updateMeal as jest.Mock).mockResolvedValue(undefined);
      const mockRedirect = redirect as unknown as jest.Mock;
      mockRedirect.mockImplementation(() => {
        throw { digest: 'NEXT_REDIRECT;replace;/meals/test-slug?success=updated' };
      });

      const formData = new FormData();
      formData.append('title', 'Updated Title');
      formData.append('summary', 'Updated summary');
      formData.append('instructions', 'Updated instructions');
      formData.append('name', 'Test User');

      await expect(
        updateMealHandler('test-slug', initialState, formData)
      ).rejects.toHaveProperty('digest');

      expect(updateMeal).toHaveBeenCalledWith('test-slug', expect.any(Object));
      expect(revalidatePath).toHaveBeenCalledWith('/meals');
      expect(revalidatePath).toHaveBeenCalledWith('/meals/test-slug');
    });

    it('should handle update errors', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue({
        user: { email: 'test@example.com' },
      });

      (updateMeal as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const formData = new FormData();
      formData.append('title', 'Updated Title');
      formData.append('summary', 'Updated summary');
      formData.append('instructions', 'Updated instructions');
      formData.append('name', 'Test User');

      const result = await updateMealHandler('test-slug', initialState, formData);

      expect(result.error).toBe('Update Operation Failed');
      expect(result.message).toBe('Update failed');
    });
  });

  describe('deleteMealHandler', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when user is not authenticated', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue(null);

      await expect(deleteMealHandler('test-slug')).rejects.toThrow(
        'You must be logged in to delete a meal.'
      );

      expect(deleteMeal).not.toHaveBeenCalled();
    });

    it('should successfully delete meal', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue({
        user: { email: 'test@example.com', isAdmin: false },
      });

      (deleteMeal as jest.Mock).mockResolvedValue(undefined);
      const mockRedirect = redirect as unknown as jest.Mock;
      mockRedirect.mockImplementation(() => {
        throw { digest: 'NEXT_REDIRECT;replace;/meals' };
      });

      await expect(deleteMealHandler('test-slug')).rejects.toHaveProperty('digest');

      expect(deleteMeal).toHaveBeenCalledWith('test-slug', 'test@example.com', false);
      expect(revalidatePath).toHaveBeenCalledWith('/meals');
    });

    it('should handle delete errors', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue({
        user: { email: 'test@example.com', isAdmin: false },
      });

      (deleteMeal as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      await expect(deleteMealHandler('test-slug')).rejects.toThrow('Delete failed');
    });

    it('should delete as admin', async () => {
      const { auth } = require('../../lib/auth');
      (auth as jest.Mock).mockResolvedValue({
        user: { email: 'admin@example.com', isAdmin: true },
      });

      (deleteMeal as jest.Mock).mockResolvedValue(undefined);
      const mockRedirect = redirect as unknown as jest.Mock;
      mockRedirect.mockImplementation(() => {
        throw { digest: 'NEXT_REDIRECT;replace;/meals' };
      });

      await expect(deleteMealHandler('test-slug')).rejects.toHaveProperty('digest');

      expect(deleteMeal).toHaveBeenCalledWith('test-slug', 'admin@example.com', true);
    });
  });
});


