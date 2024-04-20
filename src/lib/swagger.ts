import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { FastifyRegisterOptions } from 'fastify';

/* eslint-disable space-before-function-paren */
export const swaggerOptions = {
  swagger: {
    info: {
      title: 'DD-api Documentation',
      version: '0.1.0',
    },
    host: '',
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  hideUntagged: true,
  exposeRoute: true,
};

export const swaggerUiOptions: FastifyRegisterOptions<FastifySwaggerUiOptions> = {
  routePrefix: '/api/docs',
  uiConfig: {
    docExpansion: 'none',
    deepLinking: false,
  },
  uiHooks: {
    onRequest(_request: any, _reply: any, next: () => void) {
      next();
    },
    preHandler(_request: any, _reply: any, next: () => void) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header: any) => header,
};
