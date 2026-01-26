export const openApiConfig = {
    docs_url: '/docs',
    schema: {
        info: {
            title: 'Backend Store Check',
            version: '1.0.0',
            description: 'API for storage and management of products and users',
        },
        servers: [
            {
                url: 'https://api.example.com',
                description: 'Production server'
            },
            {
                url: 'http://127.0.0.1:8787',
                description: 'Development server'
            }
        ]
    }
};
