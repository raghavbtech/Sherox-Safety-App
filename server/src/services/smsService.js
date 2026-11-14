const config = require('../config');

/**
 * Sends SMS via Fast2SMS API or returns mock response in test/dev when API key is not set.
 * @param {string|string[]} toNumbers - Phone number(s) (comma-separated string or array)
 * @param {string} message - Message text
 * @returns {Promise<object>} Response from Fast2SMS API
 */
async function sendSms(toNumbers, message) {
  const numbersStr = Array.isArray(toNumbers) ? toNumbers.join(',') : toNumbers;

  // In test environment or if no API key is provided, mock the SMS delivery
  if (config.nodeEnv === 'test' || !config.fast2smsApiKey) {
    return {
      return: true,
      request_id: 'mock_req_' + Date.now(),
      message: ['SMS sent successfully (Mock mode)'],
      numbers: numbersStr,
      content: message,
    };
  }

  const url = 'https://www.fast2sms.com/dev/bulkV2';
  const params = new URLSearchParams();
  params.append('route', 'q');
  params.append('message', message);
  params.append('language', 'english');
  params.append('flash', '0');
  params.append('numbers', numbersStr);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: config.fast2smsApiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = {
  sendSms,
};
