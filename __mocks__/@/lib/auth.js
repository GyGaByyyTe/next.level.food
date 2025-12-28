module.exports = {
  auth: jest.fn(() => Promise.resolve(null)),
  signIn: jest.fn(() => Promise.resolve()),
  signOut: jest.fn(() => Promise.resolve()),
};

