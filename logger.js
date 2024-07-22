const fs = require('fs');
const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

// Ensure the log directory exists
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Configure winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logDirectory, 'interaction_logs-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

// Separate logger for errors
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: path.join(logDirectory, 'error_logs.json') })
    ]
});

// Check if logging is enabled
const loggingEnabled = process.env.LOGGING_ENABLED === 'true';

/**
 * Log an error.
 * @param {Error} error - The error to log.
 */
function logError(error) {
    if (!loggingEnabled) return;

    errorLogger.error({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack
    });
}

/**
 * Log an interaction.
 * @param {Message} message - The message to log.
 * @param {Array<string>} supportedChannels - Array of supported channel IDs.
 */
function logInteraction(message, supportedChannels) {
    if (!loggingEnabled) return;

    const logData = {
        userId: message.author.id,
        username: message.author.tag,
        channelId: message.channel.id,
        channelName: message.channel.name,
        timestamp: new Date().toISOString(),
        content: message.content,
        messageType: message.type
    };

    if (supportedChannels.includes(logData.channelId)) {
        logger.info(logData);
    }
}

/**
 * Log a pattern match.
 * @param {Message} message - The message that matched the pattern.
 * @param {string} pattern - The pattern that was matched.
 */
function logPatternMatch(message, pattern) {
    if (!loggingEnabled) return;

    logger.info({
        userId: message.author.id,
        username: message.author.tag,
        channelId: message.channel.id,
        channelName: message.channel.name,
        timestamp: new Date().toISOString(),
        content: message.content,
        messageType: message.type,
        matchedPattern: pattern
    });
}

module.exports = {
    logInteraction,
    logError,
    logPatternMatch
};
