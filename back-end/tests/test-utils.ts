import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import { Task, User } from "@prisma/client";

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "test",
            },
        });
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                username: "test",
                name: "test",
                password: await bcrypt.hash("test", 10),
                token: "test",
            },
        });
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: "test",
            },
        });
        if (!user) {
            throw new Error("User is not found!");
        }
        return user;
    }
}

export class TaskTest {
    static async create() {
        await prismaClient.task.create({
            data: {
                title: "test",
                description: "test",
                status: "test",
                username: "test",
            },
        });
    }

    static async get(): Promise<Task> {
        const note = await prismaClient.task.findFirst({
            where: {
                username: "test",
            },
        });
        if (!note) {
            throw new Error("Task is not found!");
        }
        return note;
    }

    static async deleteAll() {
        await prismaClient.task.deleteMany({
            where: {
                username: "test",
            },
        });
    }
}
