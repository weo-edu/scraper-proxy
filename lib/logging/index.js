var winston = require('winston');
require('winston-papertrail').Papertrail;

module.exports = function(appName) {
  var logger = new winston.Logger({
    transports: [
      new winston.transports.Papertrail({
          host: 'logs2.papertrailapp.com',
          port: 15920,
          handleExceptions: true,
          colorize: true,
          program: appName
      })
    ]
  });

  var write = process.stdout.write;

  process.stdout.write = function(data) {
    logger.info(data);
    return write.apply(this, arguments);
  };

  process.stderr.write = function(data) {
    logger.error(data);
    return write.apply(this, arguments);
  };

  return logger;
};