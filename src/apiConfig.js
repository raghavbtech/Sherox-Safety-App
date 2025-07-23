const isProduction = process.env.NODE_ENV === 'production';

const API_BASE_URL = isProduction
  ? 'https://your-live-api.com'  // replace this with your deployed URL later
  : 'http://localhost:5000';     // local development server

export default API_BASE_URL;
