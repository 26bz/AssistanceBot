const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Configure winston logger with daily rotation
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            filename: path.join(logDirectory, 'pattern_matches-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '100m',
            maxFiles: '14d' // Keep logs for 14 days
        })
    ]
});

// Function to log pattern matches
function logPatternMatch(message, pattern) {
    const logData = {
        user: message.author.tag,
        userId: message.author.id,
        message: message.content,
        pattern: pattern,
        date: new Date().toISOString(),
        channelId: message.channel.id,
        channelName: message.channel.name
    };

    logger.info(logData);
}

module.exports = {
    logger,
    logPatternMatch
};
