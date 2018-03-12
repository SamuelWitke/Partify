const logger = require('../lib/logger')
//const ip = require('ip');

logger.info('Starting server...')

const PORT = process.env.PORT || 3000; 
require('../../server/main').listen(PORT, () => {
  logger.success('Server is running at ',PORT)
})
