import { render, screen } from '@testing-library/react';
import MealsLoadingPage from '../app/meals/loading';
import '@testing-library/jest-dom';

describe('MealsLoadingPage', () => {
  it('renders the loading message', () => {
    render(<MealsLoadingPage />);
    
    // Check if the loading message is rendered
    const loadingMessage = screen.getByText('Fetching meals...');
    expect(loadingMessage).toBeInTheDocument();
    
    // Check if the loading message has the correct class
    expect(loadingMessage).toHaveClass('loading');
  });
});