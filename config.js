'use strict';

require('dotenv').config();

const config = Object.freeze({
    API_KEYS: {
        OPENROUTER: process.env.OPENROUTER_API_KEY,
    },
    PORTS: {
        API_PORT: process.env.API_PORT || 3000,
    },
    MODEL_SETTINGS: {
        DEFAULT_MODEL: 'openai/gpt-4o-mini',
        MAX_RETRIES: 3,
    }
});

module.exports = config;
