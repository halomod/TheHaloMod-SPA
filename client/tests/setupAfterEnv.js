import BACKEND_CONSTANTS from '@/constants/backend_constants';

const constants = JSON.stringify(BACKEND_CONSTANTS);

// Make sure that constants are not modified
global.afterEach(() => {
  expect(JSON.stringify(BACKEND_CONSTANTS)).toBe(constants);
});

// Make sure that console errors will fail tests
// Credit: https://github.com/vuejs/vue/issues/9083#issuecomment-439693837
const spies = {};
beforeEach((done) => {
  function failIfError(error) {
    if (error instanceof Error) {
      done.fail(error);
    }
  }
  spies.consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(failIfError);
  done();
});
afterEach(() => {
  spies.consoleError.mockRestore();
});
