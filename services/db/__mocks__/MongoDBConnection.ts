export const mockConnected = jest.fn();
export const mockDisconnected = jest.fn();

export const MongoDBConnection = jest.fn().mockImplementation(() => {
  return {
    connect: jest.fn(),
    connected: mockConnected,
    disconnect: mockDisconnected,
    db: jest.fn(),
  };
});
