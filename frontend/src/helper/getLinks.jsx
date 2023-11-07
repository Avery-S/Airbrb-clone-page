// Get the backend url
const config = require('../config.json');
const BACKEND_URL = `http://localhost:${config.BACKEND_PORT}`;

const DEFAULT_USER_PROFILE_IMG = './styles/defaultImg.jpg';

export { BACKEND_URL, DEFAULT_USER_PROFILE_IMG };
