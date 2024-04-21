import { FastifyInstance } from 'fastify';
import {
    CreateUser, GetAllUsers, GetRandomUser, GetStocks, UpdateUser, UploadUserPhoto

} from "../../controllers/user/user.controller";

const userRoutes = (fastify: FastifyInstance, opts: any, next: (err?: Error) => void) => {

    fastify.post('/create', CreateUser );
    fastify.put('/update/:tgId', UpdateUser);
    fastify.get('/', GetAllUsers );
    fastify.get('/random-user', GetRandomUser );


    fastify.put('/upload-user-photo/:tgId', UploadUserPhoto );


    fastify.get('/stocks', GetStocks );

    next();
};
export default userRoutes;