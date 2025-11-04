import { test, expect } from "@playwright/test";
import { Api } from "../src/api.service";
import { TodosService } from "../src/todos.service.js";
import { toDoBuilder } from "../src/builders/builders.todo.js";
import { faker } from "@faker-js/faker";

let token;

// 01 POST /challenger (201) получить токен
test.describe("Challenge API", () => {
  test.beforeAll(async ({ request }, testInfo) => {
    let response = await request.post(`${testInfo.project.use.baseURL}/challenger`);
    expect(response.status()).toBe(201);
    const headers = response.headers();
    console.log(`${testInfo.project.use.baseURL}${headers.location}`);
    token = headers["X-CHALLENGER"];
  });

  test("02 GET /challenges (200) - получить список challenge задач", { tag: '@API' }, async ({ request }, testInfo) => {
    let getResponse = await request.get(`${testInfo.project.use.baseURL}/challenges`, {
      headers: { "X-CHALLENGER": token },
    });
    const responseBody = await getResponse.json();
    expect(getResponse.status()).toBe(200);
    expect(responseBody.challenges.length).toBe(59);
  });

  test("03 GET /todos (200) - получить список todos задач", { tag: '@API' }, async ({ request }, testInfo) => {
    const api = new Api(request);
    const response = await api.todos.getAll(token, testInfo);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    console.log(`Количество задач в списке: ${responseBody.todos.length}`);
  });

  test("04 GET /todo (404) not plural - получить 404 при вызове /todo", { tag: '@API' }, async ({ request }, testInfo) => {
    const response = await request.get(`${testInfo.project.use.baseURL}/todo`, {
      headers: { "X-CHALLENGER": token },
    });
    expect(response.status()).toBe(404);
  });

  test("05 GET /todos/{id} (200) - получить todo по id", { tag: '@API' }, async ({ request }, testInfo) => {
    const randomId = faker.number.int({ min: 1, max: 10 });
    const response = await request.get(`${testInfo.project.use.baseURL}/todos/${randomId}`, {
      headers: { "X-CHALLENGER": token },
    });
    expect(response.status()).toBe(200);
  });

  test("06 GET /todos/{id} (404) - получить 404 для несуществующей задачи", { tag: '@API' }, async ({ request }, testInfo) => {
    const nonExistentId = faker.number.int({ min: 11, max: 999999 });
    const response = await request.get(`${testInfo.project.use.baseURL}/todos/${nonExistentId}`, {
      headers: { "X-CHALLENGER": token },
    });
    expect(response.status()).toBe(404);
  });

  test("07 GET /todos (200) ?filter - получить список выполненных задач", { tag: '@API' }, async ({ request }, testInfo) => {
    let response = await request.get(`${testInfo.project.use.baseURL}/todos?doneStatus=true`, {
      headers: {
        "X-CHALLENGER": token,
      },
    });
    let body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.todos.doneStatus).toBeUndefined();
  });

  test("09 POST /todos (201) - создать новую задачу", { tag: '@API' }, async ({ request }, testInfo) => {
    // Получаем СВЕЖИЙ токен перед POST-запросом
    const responseToken = await request.post(`${testInfo.project.use.baseURL}/challenger`);
    expect(responseToken.status()).toBe(201);
    const token = responseToken.headers()['x-challenger'];

    const createTodo = new toDoBuilder()
      .addTitle()
      .addDoneStatus(false)
      .addDescription()
      .generate();

    const response = await request.post(`${testInfo.project.use.baseURL}/todos`, {
      headers: {
        "X-CHALLENGER": token,
        "Content-Type": "application/json",
      },
      data: createTodo,
    });

    const body = await response.json();
    const headers = response.headers();

    expect(response.status()).toBe(201);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    expect(body.doneStatus).toBe(false);
    expect(body.title).toBe("Наименование задания");
    expect(body.description).toBe("Пройти по Абрикосовой, свернуть на Виноградную");
  });

  test("25 GET /todos (200) XML - получить список todos задач в формате XML", { tag: '@API' }, async ({ request }, testInfo) => {
    const todosService = new TodosService(request);
    const response = await todosService.getAll(token, testInfo, "application/xml");
    expect(response.status()).toBe(200);

    // Проверяем заголовок Content-Type
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/xml");

    // Проверяем, что тело ответа содержит XML данные
    const responseBody = await response.text();
    expect(responseBody).toContain("<todos>");
    expect(responseBody).toContain("<todo>");

    console.log("Ответ в XML формате:");
    console.log(responseBody);
  });
});
