import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImagePicker from '../components/ImagePicker';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string; fill?: boolean }) => (
    <img src={src} alt={alt} data-testid="mock-image" />
  ),
}));

// Mock the FileReader API
// Using a type assertion to tell TypeScript that our mock implementation satisfies the FileReader interface
// This is a common pattern when mocking complex objects for testing
global.FileReader = class {
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  onload: (() => void) | null = () => {};
  readAsDataURL() {
    // Simulate reading a file and calling onload with a data URL
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
  result: string = 'data:image/jpeg;base64,mockImageData';
} as unknown as typeof FileReader;

describe('ImagePicker Component', () => {
  it('renders with default state', () => {
    render(<ImagePicker name="test-image" />);

    // Check if the component renders with the correct initial state
    expect(screen.getByText('No image selected')).toBeInTheDocument();
    expect(screen.getByText('Pick an image')).toBeInTheDocument();

    // Check if the file input exists with correct attributes
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    expect(fileInput.type).toBe('file');
    expect(fileInput.name).toBe('test-image');
    expect(fileInput.accept).toBe('image/png, image/jpeg');
  });

  it('renders with custom label', () => {
    render(<ImagePicker name="test-image" label="Custom Label" />);

    // Check if the custom label is rendered
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(<ImagePicker name="test-image" />);

    // Create a mock file
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });

    // Get the file input and simulate file selection
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;

    // Mock the file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    // Use act to wrap the state update
    await act(async () => {
      // Trigger the change event
      fireEvent.change(fileInput);

      // Wait for the FileReader onload to be called
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // The "No image selected" text should be replaced by the Image component
    expect(screen.queryByText('No image selected')).not.toBeInTheDocument();

    // Check if the image is rendered with correct alt text
    expect(screen.getByTestId('mock-image')).toBeInTheDocument();
  });

  it('handles button click to trigger file selection', () => {
    render(<ImagePicker name="test-image" />);

    // Mock the click method of the file input
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const clickSpy = jest.spyOn(fileInput, 'click');

    // Click the button
    const button = screen.getByText('Pick an image');
    fireEvent.click(button);

    // Check if the file input's click method was called
    expect(clickSpy).toHaveBeenCalled();
  });
});
