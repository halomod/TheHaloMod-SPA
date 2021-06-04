/*
 * Used to do some boilerplate and return the axios object with retries enabled.
 */

import axios from 'axios';
import axiosRetry from 'axios-retry';

axios.defaults.withCredentials = true;
axiosRetry(axios, {
  retries: 3,
  shouldResetTimeout: true,
  retryDelay: axiosRetry.exponentialDelay, // Exponential back-off retry delay between requests
  // retryCondition: () => true, // retry no matter what
  // If true it will retry
  retryCondition: (error) => {
    if (error.response) {
      return (error.response.status !== 500 && error.response.status > 299);
    }
    // Always retry if no server response
    return true;
  },
});

export default axios;
