const pdf = require('pdf-extraction');

process.on('message', async (message) => {
    if (message.type === 'START_PARSE') {
        try {
            // Buffer is sent as a specialized buffer object or array from the parent
            // We need to convert it back to a Buffer if serialized
            const buffer = Buffer.from(message.buffer);

            const data = await pdf(buffer);
            process.send({ type: 'SUCCESS', text: data.text });
        } catch (error) {
            process.send({ type: 'ERROR', error: error.message });
        }
    }
});
