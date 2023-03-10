const http = require('http');
const app = require('./app');

/**
 * Port normalize
 * @param {String} val String representation of the port number
 * @returns {String}  Normalisedport number
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if(isNaN(port)) {
      return val;
  }
  if(port >=0) {
      return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);

/**
 * Handles server startup errors related to port binding
 * @param {Error} error The error related to port binding
 */
const errorHandler = (error) => {
  if(error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' +
    address: 'port' + port;
  switch(error.code) {
    case 'EACCES':
      console.error(bind + 'Requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'Is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe' + address: 'port: ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
