import { FastifyInstance } from 'fastify';
import {
    CreateUser, GetAllUsers, GetRandomUser, GetStocks, UpdateUser

} from "../../controllers/user/user.controller";

const userRoutes = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {

    fastify.post('/create', CreateUser );
    fastify.put('/update/:tgId', UpdateUser);
    fastify.get('/', GetAllUsers );
    fastify.get('/random-user', GetRandomUser );


    fastify.get('/stocks', GetStocks );

    next();
};
export default userRoutes;