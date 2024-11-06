import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { UserTest, TaskTest } from "./test-utils";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

describe("POST /api/tasks", () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await TaskTest.deleteAll();
        await UserTest.delete();
    });

    it("should create new task", async () => {
        const response = await supertest(web).post("/api/tasks").set("X-API-TOKEN", "test").send({
            title: "test",
            description: "test",
        });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBe("test");
        expect(response.body.data.description).toBe("test");
        expect(response.body.data.status).toBe("Incomplete");
    });

    it("should not create new task if data is invalid", async () => {
        const response = await supertest(web).post("/api/tasks").set("X-API-TOKEN", "test").send({
            title: "",
            content: "",
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/tasks/:taskId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await TaskTest.create();
    });

    afterEach(async () => {
        await TaskTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to get task", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web).get(`/api/tasks/${task.id}`).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBe(task.title);
        expect(response.body.data.description).toBe(task.description);
        expect(response.body.data.status).toBe(task.description);
        expect(response.body.data.created_at).toBeDefined();
        expect(response.body.data.updated_at).toBeDefined();
    });

    it("should not be able to get task", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web)
            .get(`/api/tasks/${task.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PUT /api/tasks/:taskId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await TaskTest.create();
    });

    afterEach(async () => {
        await TaskTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to update task", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web).put(`/api/tasks/${task.id}`).set("X-API-TOKEN", "test").send({
            title: "newTitle",
            description: "newDescription",
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(task.id);
        expect(response.body.data.title).toBe("newTitle");
        expect(response.body.data.description).toBe("newDescription");
        expect(response.body.data.created_at).toBeDefined();
        expect(response.body.data.updated_at).toBeDefined();
    });

    it("should not be able to update task if request is invalid", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web).put(`/api/tasks/${task.id}`).set("X-API-TOKEN", "test").send({
            title: "",
            description: "",
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PUT /api/tasks-status/:taskId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await TaskTest.create();
    });

    afterEach(async () => {
        await TaskTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to update task status", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web).put(`/api/tasks-status/${task.id}`).set("X-API-TOKEN", "test").send({
            status: "newStatus",
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(task.id);
        expect(response.body.data.status).toBe("newStatus");
        expect(response.body.data.created_at).toBeDefined();
        expect(response.body.data.updated_at).toBeDefined();
    });

    it("should not be able to update task status if request is invalid", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web).put(`/api/tasks-status/${task.id}`).set("X-API-TOKEN", "test").send({
            status: "",
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe("DELETE /api/tasks/:taskId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await TaskTest.create();
    });

    afterEach(async () => {
        await TaskTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to delete task", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web).delete(`/api/tasks/${task.id}`).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    it("should not be able to delete task", async () => {
        const task = await TaskTest.get();
        const response = await supertest(web)
            .delete(`/api/tasks/${task.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/tasks", () => {
    beforeEach(async () => {
        await UserTest.create();
        await TaskTest.create();
    });

    afterEach(async () => {
        await TaskTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to search tasks", async () => {
        const response = await supertest(web).get("/api/tasks").set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search tasks using title", async () => {
        const response = await supertest(web).get("/api/tasks").query({ title: "es" }).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search tasks using description", async () => {
        const response = await supertest(web).get("/api/tasks").query({ description: "est" }).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search tasks using status", async () => {
        const response = await supertest(web).get("/api/tasks").query({ status: "test" }).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search tasks no result", async () => {
        const response = await supertest(web).get("/api/tasks").query({ title: "wrong" }).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(0);
        expect(response.body.paging.size).toBe(10);
    });

    it("should be able to search tasks with paging", async () => {
        const response = await supertest(web).get("/api/tasks").query({ page: 2, size: 1 }).set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(2);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });
});
