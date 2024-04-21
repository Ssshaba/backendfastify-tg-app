import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import path from "path";
import crypto from "crypto";
import fs from "fs";

import shortid from 'shortid';
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



export const UploadUserPhoto = async (req: FastifyRequest<{ Params: { tgId: string } }>, reply: FastifyReply) => {
    try {
        const tgId = req.params.tgId;
        const body = req.body as { file?: { toBuffer: () => Promise<Buffer> } };

        if (!body.file) {
            return reply.code(400).send({ error: 'No file uploaded' });
        }
        let fileValue: Buffer | undefined;

        // @ts-ignore
        const filename = body.file ? req.body.file.filename : 'файл не загружен';
        const fileExtension = path.extname(filename).slice(1); // slice(1) убирает точку перед расширением
        const hashedFilename = crypto.createHash('sha256').update(filename).digest('hex');
        // const timestamp = new Date().getTime();
        const uniqueFilename = `${shortid.generate()}.${fileExtension}`; // ${timestamp}-${filename}
        let fileFileLink: string | undefined;
        let fileLink: string | undefined;

        if (body.file) {
            fileValue = await body.file.toBuffer();
            // @ts-ignore

            if (fileValue) {
                const filePath = '/opt/upload/' + uniqueFilename;// локально const filePath = `../upload/${uniqueFilename}`;

                fs.writeFile(filePath, fileValue, (err) => {
                    if (err) {
                        console.error('Ошибка при сохранении файла:', err);
                    } else {
                        console.log('Файл успешно сохранен с именем:', filename);
                    }
                });
            }
            fileLink = `https://persikivk.ru/uploads/${uniqueFilename}`;
        }
        // Находим пользователя по tgId
        const user = await prisma.user.findFirst({ where: { tgId } });

        // Проверяем, найден ли пользователь
        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        // Используем найденный id для обновления пользователя
        const updatedUser = await prisma.user.update({
            where: { id: user.id }, // Используем уникальное поле пользователя (например, id)
            data: { photoLink: fileLink },
        });


        reply.code(200).send(updatedUser);

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: 'An error occurred' });
    }
}



