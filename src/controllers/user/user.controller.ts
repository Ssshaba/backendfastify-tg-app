import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient

interface UserData {
    name: string;
    tgId: number;
    role?: string;
    status?: string;
}


export const CreateUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const userData = req.body as UserData;

        const newUser = await prisma.user.create({
            data: {
                name: userData.name,
                tgId: userData.tgId,
                role: userData.role,
                status: userData.status,
            },
        });

        reply.code(201).send(newUser);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};
export const GetAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const allUsers = await prisma.user.findMany();
        reply.code(200).send(allUsers);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};

export const GetRandomUser = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const randomUser = await prisma.user.findFirst({
            orderBy: { id: 'asc' }, // или 'desc' для случайного порядка
            skip: Math.floor(Math.random() * await prisma.user.count()),
        });
        reply.code(200).send(randomUser);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};

interface UpdateUserData {
    name?: string;
    tgId?: number;
    role?: string;
    status?: string;
}

export const UpdateUser = async (req: FastifyRequest<{ Params: { tgId: string } }>, reply: FastifyReply) => {
    try {
        const userId = parseInt(req.params.tgId);

        const userData = req.body as UpdateUserData;

        const updatedUser = await prisma.user.update({
            where: { tgId: userId },
            data: userData,
        });

        reply.code(200).send(updatedUser);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};