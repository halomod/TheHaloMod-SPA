import BACKEND_CONSTANTS from '@/constants/backend_constants';

const constants = JSON.stringify(BACKEND_CONSTANTS);

global.afterEach(() => {
  expect(JSON.stringify(BACKEND_CONSTANTS)).toBe(constants)
});
