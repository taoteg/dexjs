/**
 *
 * This module provides console logging capabilities.
 *
 * @module dex/console
 * @name console
 * @memberOf dex
 *
 */

/**
 *
 * @type {{TRACE: number, DEBUG: number, NORMAL: number, WARN: number, FATAL: number, NONE: number}}
 */
var logLevels = {
  'TRACE'  : 5,
  'DEBUG'  : 4,
  'NORMAL' : 3,
  'WARN'   : 2,
  'FATAL'  : 1,
  'NONE'   : 0
};

exports.logLevels = logLevels;

var logLevel = logLevels.NORMAL;

exports.logLevel = logLevel;

////
//
// dex.console : This module provides routines assisting with console output.
//
////

/**
 * Log this message if the current log level is greater than or equal
 * to dex.console.logLevel.
 *
 * @param msgLevel The log level for this message.
 * @param msg One or more messages to be logged.  Strings will simply
 * use console.log while objects will use console.dir.
 *
 * @returns {dex.console}
 */
exports.logWithLevel = function (msgLevel, msg) {
//  console.log(dex.console.logLevel());
//  console.log(msgLevel);
//  console.dir(msg);

  if (dex.console.logLevel() >= msgLevel) {
    for (i = 0; i < msg.length; i++) {
      if (typeof msg[i] == 'object') {
        console.dir(msg[i]);
      }
      else {
        console.log(msg[i]);
      }
    }
  }
  return this;
}

/**
 * Write one or more TRACE level messages.
 *
 * @param msg One or more TRACE messages to log.
 *
 * @returns {dex.console|*}
 */
exports.trace = function () {
  return dex.console.logWithLevel(logLevels.TRACE, arguments)
};

/**
 * Write one or more DEBUG level messages.
 *
 * @param msg One or more DEBUG messages to log.
 *
 * @returns {dex.console|*}
 */
exports.debug = function () {
  return dex.console.logWithLevel(logLevels.DEBUG, arguments)
};

/**
 * Write one or more NORMAL level messages.
 *
 * @param msg One or more NORMAL messages to log.
 *
 * @returns {dex.console|*}
 *
 */
exports.log = function () {
  //console.log("caller is " + arguments.callee.caller.toString());
  return dex.console.logWithLevel(logLevels.NORMAL, arguments)
};

/**
 * Write one or more WARN level messages.
 *
 * @param msg One or more WARN messages to log.
 *
 * @returns {dex.console|*}
 *
 */
exports.warn = function () {
  return dex.console.logWithLevel(logLevels.WARN, arguments)
};

/**
 * Write one or more FATAL level messages.
 *
 * @param msg One or more FATAL messages to log.
 *
 * @returns {dex.console|*}
 */
exports.fatal = function () {
  return dex.console.logWithLevel(logLevels.FATAL, arguments)
};

/**
 * This function returns the current log level.
 *
 * @returns The current log level.
 *
 */
exports.logLevel = function (_) {
  if (!arguments.length) return logLevel;
  logLevel = logLevels[_];
  return logLevel;
};

exports.logLevels = function () {
  return logLevels;
};
