
import { PortfolioLogger } from '@/services/logging/PortfolioLogger';
import { LogLevels } from '@/services/logging/LogLevels';

import { PassThrough } from 'stream';

test('We do not log levels less than minimum.', () => {
  const pass_through = new PassThrough();
  const logger = new PortfolioLogger('Unique Log Name', LogLevels.INFO);
  logger.setDestination(pass_through);

  logger.debug('Testing');
  expect(pass_through.read()).toBe(null);
});

test('We log the name we set for the logger.', () => {
  const pass_through = new PassThrough();
  const logger = new PortfolioLogger('Unique Log Name', LogLevels.DEBUG);
  logger.setDestination(pass_through);

  logger.info('Testing');
  expect(pass_through.read().includes('Unique Log Name')).toBe(true);
});

test('We can log debug levels to our logger.', () => {
  const pass_through = new PassThrough();
  const logger = new PortfolioLogger('Unique Log Name', LogLevels.DEBUG);
  logger.setDestination(pass_through);

  logger.info('Testing');
  expect(pass_through.read().includes('Testing')).toBe(true);
});

test('We can log info levels to our logger.', () => {
  const pass_through = new PassThrough();
  const logger = new PortfolioLogger('Unique Log Name');
  logger.setDestination(pass_through);

  logger.info('Testing');
  expect(pass_through.read().includes('Testing')).toBe(true);
});


test('We can log warning levels to our logger.', () => {
  const pass_through = new PassThrough();
  const logger = new PortfolioLogger('Unique Log Name');
  logger.setDestination(pass_through);

  logger.info('Testing');
  expect(pass_through.read().includes('Testing')).toBe(true);
});

test('We can log error levels to our logger.', () => {
  const pass_through = new PassThrough();
  const logger = new PortfolioLogger('Unique Log Name');
  logger.setDestination(pass_through);

  logger.info('Testing');
  expect(pass_through.read().includes('Testing')).toBe(true);
});

test('We can log objects.', () => {
  const pass_through = new PassThrough();
  const logger = new PortfolioLogger('Unique Log Name');
  logger.setDestination(pass_through);

  logger.info({ testing: 'Hello there!' });
  expect(pass_through.read().includes('Hello there!')).toBe(true);
})
