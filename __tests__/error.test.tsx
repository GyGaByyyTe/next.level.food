import { render, screen } from '@testing-library/react';
import ErrorPage from '../app/meals/error';
import '@testing-library/jest-dom';

describe('ErrorPage', () => {
  it('renders the error message', () => {
    render(<ErrorPage />);
    
    // Check if the error heading is rendered
    const errorHeading = screen.getByRole('heading', { level: 1 });
    expect(errorHeading).toBeInTheDocument();
    expect(errorHeading).toHaveTextContent('An error occurred!');
    
    // Check if the error message is rendered
    const errorMessage = screen.getByText('Could not load meals.');
    expect(errorMessage).toBeInTheDocument();
  });
});