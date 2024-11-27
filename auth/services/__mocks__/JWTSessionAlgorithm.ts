
export const JWTSessionAlgorithm = jest.fn().mockImplementation(() => {
  return {
    create: jest.fn(),
    validate: jest.fn()
  };
});
