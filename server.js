'use strict';

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 🎬 Scene splitter
function splitIntoScenes(script) {
    const sentences = script.split('.');
    return sentences
        .filter(s => s.trim() !== '')
        .map((line, index) => ({
            scene: index + 1,
            text: line.trim(),
            duration: 3
        }));
}

// 🚀 Generate Script Route
app.post('/generate-script', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.API_KEYS.OPENROUTER}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.MODEL_SETTINGS.DEFAULT_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: `Create a viral short video script about: ${prompt}`
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices) {
            return res.status(500).json({ error: 'AI response failed', data });
        }

        const script = data.choices[0].message.content;

        const scenes = splitIntoScenes(script);

        res.json({
            script,
            scenes
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🌐 Start Server
app.listen(config.PORTS.API_PORT, () => {
    console.log(`Server running on http://localhost:${config.PORTS.API_PORT}`);
});
