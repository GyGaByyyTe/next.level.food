import { render, screen } from '@testing-library/react';
import { SignIn, SignOut } from '@/components/auth-components';

// Mock the lib/auth module
jest.mock('../lib/auth', () => ({
  auth: jest.fn(() => Promise.resolve(null)),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe('Auth Components', () => {
  describe('SignIn', () => {
    it('renders sign in button', () => {
      render(<SignIn />);
      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toBeInTheDocument();
    });

    it('renders a form element', () => {
      const { container } = render(<SignIn />);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('SignOut', () => {
    it('renders sign out button', () => {
      render(<SignOut />);
      const button = screen.getByRole('button', { name: /sign out/i });
      expect(button).toBeInTheDocument();
    });

    it('renders a form element', () => {
      const { container } = render(<SignOut />);
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });
});

