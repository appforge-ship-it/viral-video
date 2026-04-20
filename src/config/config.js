'use strict';

const config = {
    API_KEYS: {
        SERVICE_A: 'your_service_a_key',
        SERVICE_B: 'your_service_b_key',
    },
    PORTS: {
        API_PORT: 3000,
        DB_PORT: 5432,
    },
    MODEL_SETTINGS: {
        DEFAULT_MODEL: 'model_v1',
        MAX_RETRIES: 5,
    }
};

module.exports = config;
