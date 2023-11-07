// Get the backend url
const config = require('../config.json');
const BACKEND_URL = `http://localhost:${config.BACKEND_PORT}`;

export default BACKEND_URL;
