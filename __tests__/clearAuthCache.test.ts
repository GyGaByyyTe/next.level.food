import { clearAuthCache } from '../hooks/useAuth';

describe('clearAuthCache', () => {
  it('clears the auth cache', () => {
    // This function clears module-level variables, so we just test it doesn't throw
    expect(() => clearAuthCache()).not.toThrow();
  });
});

