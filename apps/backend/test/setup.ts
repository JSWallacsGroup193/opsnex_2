// Jest setup file for backend tests
// This file runs once before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';

// Set longer timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise during tests (optional)
// Uncomment these lines if you want to suppress console output during tests
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Global test utilities can be added here
// For example: database setup, global mocks, etc.

export {};
