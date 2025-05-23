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

      // Create a mock File
      const mockFile = new File(['test file content'], 'test-image.jpg', { type: 'image/jpeg' });
      formData.append('image', mockFile);

      formData.append('name', 'Test Creator');
      formData.append('email', 'test@example.com');

      // Call the handler
      await shareMealHandler(formData);

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
      expect(redirect).toHaveBeenCalledWith('/meals');
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

      // Expect the handler to throw an error
      await expect(shareMealHandler(formData)).rejects.toThrow('Invalid meal information');

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

      // Expect the handler to throw an error
      await expect(shareMealHandler(formData)).rejects.toThrow('Invalid meal information');

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

      // Expect the handler to throw an error
      await expect(shareMealHandler(formData)).rejects.toThrow('Invalid meal information');

      // Check that saveMeal was not called
      expect(saveMeal).not.toHaveBeenCalled();
    });
  });
});
