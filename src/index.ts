import fastify, {FastifyReply, FastifyRequest} from 'fastify'
import fastifyCors from '@fastify/cors';
import fjwt, { FastifyJWT } from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {swaggerOptions, swaggerUiOptions} from "./lib/swagger";
import dotenv from 'dotenv';
import userRoutes from "./routes/user/user.route";


dotenv.config();

const server = fastify()

async function start() {

    await server.register(fastifySwagger, swaggerOptions);
    await server.register(fastifySwaggerUi, swaggerUiOptions);

    // Включите плагин fastify-cors
    await server.register(fastifyCors, {
        origin: '*',
    });
    await server.register(userRoutes, {
        prefix: '/api/users',
    });

    server.get('/ping', async (request, reply) => {
        return 'pong\n'
    })

    server.listen({ port: 8080 }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
}
start();