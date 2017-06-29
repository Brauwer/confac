function getBackend() {
  // Port 9000 is hardcoded in backend/config-xxx.json
  // Could just use: process.env.PUBLIC provided by react-create-app?
  switch (process.env.REACT_APP_DEPLOY) {
  case 'jos':
    return window.location.origin + '/api';
  case 'pongit':
    return window.location.origin + '/api';
  default:
    return window.location.origin + '/api';
  }
}

if (process.env.REACT_APP_DEPLOY) {
  const backend = getBackend();
  module.exports = {backend: backend, environment: process.env.NODE_ENV || '???'};
} else {
  module.exports = {backend: 'http://localhost:3001/api', environment: process.env.NODE_ENV || 'dev'};
}

if (process.env.REACT_APP_DEPLOY === 'pongit-test') {
  module.exports.environment = 'test'; // o'rly
}