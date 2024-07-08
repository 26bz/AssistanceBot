const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'interaction_logs.json');

function logInteraction(message, supportedChannels) {
    try {
        const logData = {
            userId: message.author.id,
            channelId: message.channel.id,
            timestamp: new Date().toISOString(),
            content: message.content
            // Add more metadata as needed
        };

        // Check if the channel is allowed for logging
        if (supportedChannels.includes(logData.channelId)) {
            fs.appendFileSync(logFilePath, JSON.stringify(logData) + '\n');
        }
    } catch (error) {
        console.error(`Error logging interaction: ${error.message}`);
    }
}

module.exports = {
    logInteraction
};
