import { render, screen } from '@testing-library/react';
import MealsSharePage from '../app/meals/share/page';
import '@testing-library/jest-dom';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill }: { src: string; alt: string; fill?: boolean }) => (
    <img src={src} alt={alt} data-testid="mock-image" />
  ),
}));

// Mock the server action
jest.mock('../lib/actions', () => ({
  shareMealHandler: jest.fn(),
}));

// Mock the FormData class
global.FormData = class {
  get() {
    return '';
  }
};

describe('MealsSharePage', () => {
  it('renders the heading with correct text', () => {
    render(<MealsSharePage />);

    // Check for the main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Share your favorite meal');
  });

  it('renders the form with all required fields', () => {
    render(<MealsSharePage />);

    // Check for form fields
    expect(screen.getByLabelText('Your name')).toBeInTheDocument();
    expect(screen.getByLabelText('Your email')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Short Summary')).toBeInTheDocument();
    expect(screen.getByLabelText('Instructions')).toBeInTheDocument();

    // Check for the submit button
    const submitButton = screen.getByRole('button', { name: 'Share Meal' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('renders the ImagePicker component', () => {
    render(<MealsSharePage />);

    // Check for the ImagePicker component
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByText('Pick an image')).toBeInTheDocument();
  });
});
