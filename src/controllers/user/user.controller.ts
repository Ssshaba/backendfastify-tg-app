import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // Создайте экземпляр PrismaClient

interface UserData {
    name: string;
    tgId: string;
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
        reply.status(500).send({ error: error.message }); // Отправляем сообщение об ошибке
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
    tgId?: string;
    role?: string;
    status?: string;
    age?: number;
    hobbies?: string;
    department?: string;
    photoLink?: string;
}

export const UpdateUser = async (req: FastifyRequest<{ Params: { tgId: string } }>, reply: FastifyReply) => {
    try {
        const tgId = req.params.tgId; // Не преобразовываем tgId в число

        // Находим пользователя по tgId
        const user = await prisma.user.findFirst({ where: { tgId } });

        // Проверяем, найден ли пользователь
        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        // Используем найденный id для обновления пользователя
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: req.body as UpdateUserData,
        });

        reply.code(200).send(updatedUser);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};

export const GetStocks = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const allStocks = await prisma.stock.findMany();
        reply.code(200).send(allStocks);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'An error occurred' });
    } finally {
        await prisma.$disconnect();
    }
};
