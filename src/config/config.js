'use strict';

require('dotenv').config();

const config = {
    API_KEYS: {
        SERVICE_A: process.env.SERVICE_A_KEY,
        SERVICE_B: process.env.SERVICE_B_KEY,
    },
    PORTS: {
        API_PORT: process.env.API_PORT || 3000,
        DB_PORT: process.env.DB_PORT || 5432,
    },
    MODEL_SETTINGS: {
        DEFAULT_MODEL: 'model_v1',
        MAX_RETRIES: 5,
    }
};

module.exports = config;