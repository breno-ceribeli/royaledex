import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RoyaleDex API',
      version: '1.0.0',
      description: 'Backend API for RoyaleDex — Clash Royale stats app',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development',
      },
      {
        url: 'https://royaledex.onrender.com',
        description: 'Production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase ID Token',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // onde o Swagger vai procurar os comentários
}

export const swaggerSpec = swaggerJsdoc(options)