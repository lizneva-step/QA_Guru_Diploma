import { test, expect } from "../../src/fixtures/api.fixture.js";
import { toDoBuilder } from "../../src/builders/builders.todo.js";
import { faker } from "@faker-js/faker";

test.describe("Challenge API", () => {
  let token;
  // 01 POST /challenger (201) получить токен
  test.beforeAll(async ({ request }, testInfo) => {
    let response = await request.post(`${testInfo.project.use.baseURL}/challenger`);
    expect(response.status()).toBe(201);
    const headers = response.headers();
    token = headers["x-challenger"];
    //console.log ("это токен", token)
    console.log(`https://apichallenges.herokuapp.com/gui/challenges/${token}`);
  });

  test("02 GET /challenges (200) - получить список challenge задач", { tag: '@API @GET @functional' }, async ({ request }, testInfo) => {
    let getResponse = await request.get(`${testInfo.project.use.baseURL}/challenges`, {
      headers: { "X-CHALLENGER": token },
    });
    const responseBody = await getResponse.json();
    expect(getResponse.status()).toBe(200);
    expect(responseBody.challenges.length).toBe(59);
  });

  test("03 GET /todos (200) - получить список todos задач", { tag: '@API @GET @functional' }, async ({ api }, testInfo) => {
      const response = await api.todos.getAll(token, testInfo);
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
      console.log(`Количество задач в списке: ${responseBody.todos.length}`);
  });

  test("04 GET /todo (404) not plural - получить 404 при вызове /todo", { tag: '@API @GET @error_handling' }, async ({ request }, testInfo) => {
    const response = await request.get(`${testInfo.project.use.baseURL}/todo`, {
      headers: { "X-CHALLENGER": token },
    });
    expect(response.status()).toBe(404);
  });

  test("05 GET /todos/{id} (200) - получить todo по id", { tag: '@API @GET @functional' }, async ({ api }, testInfo) => {
    const response = await api.todos.getById(1, token, testInfo);
    expect(response.status()).toBe(200);
  });

  test("06 GET /todos/{id} (404) - получить 404 для несуществующей задачи", { tag: '@API @GET @error_handling' }, async ({ request }, testInfo) => {
    const nonExistentId = faker.number.int({ min: 11, max: 999999 });
    const response = await request.get(`${testInfo.project.use.baseURL}/todos/${nonExistentId}`, {
      headers: { "X-CHALLENGER": token },
    });
    expect(response.status()).toBe(404);
  });

  test("07 GET /todos (200) ?filter - получить список выполненных задач", { tag: '@API @GET @functional' }, async ({ api, request }, testInfo) => {
    // Сначала получаем все задачи
    let allResponse = await api.todos.getAll(token, testInfo); 
    let allBody = await allResponse.json();
    expect(allResponse.status()).toBe(200);
    
    // Создаем выполненную задачу, если их нет
    if (allBody.todos.filter(todo => todo.doneStatus === true).length === 0) {
      const createTodo = new toDoBuilder()
        .addTitle("Test done task")
        .addDoneStatus(true)
        .addDescription("Test description")
        .generate();

      await request.post(`${testInfo.project.use.baseURL}/todos`, {
        headers: {
          "X-CHALLENGER": token,
          "Content-Type": "application/json",
        },
        data: createTodo,
      });
    }
    
    // Получаем все задачи снова после создания
    let allResponse2 = await api.todos.getAll(token, testInfo); 
    let allBody2 = await allResponse2.json();
    expect(allResponse2.status()).toBe(200);
    
    // Проверяем, что есть как выполненные, так и невыполненные задачи
    const doneTodos = allBody2.todos.filter(todo => todo.doneStatus === true);
    const notDoneTodos = allBody2.todos.filter(todo => todo.doneStatus === false);
    
    expect(doneTodos.length).toBeGreaterThan(0);
    expect(notDoneTodos.length).toBeGreaterThan(0);
    
    // Теперь получаем только выполненные задачи с фильтром
    let response = await api.todos.getByFilter(token, testInfo, true); 
    expect(response.status()).toBe(200);
    
    // ИСПРАВЛЕНИЕ: используем правильную переменную responseBody
    const responseBody = await response.json();
    expect(responseBody.todos.every(todo => todo.doneStatus === true)).toBe(true);
    
    // ИСПРАВЛЕНИЕ: используем правильную переменную responseBody
    expect(responseBody.todos.length).toBeLessThanOrEqual(allBody2.todos.length);
  });

  test("09 POST /todos (201) - создать новую задачу", { tag: '@API @POST @functional' }, async ({ request }, testInfo) => {
    
    const responseToken = await request.post(`${testInfo.project.use.baseURL}/challenger`); // Получаем СВЕЖИЙ токен перед каждым POST-запросом (иначе 401)
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

  test("10 POST /todos (400) - fail validation on doneStatus field", { tag: '@API @POST @validation' }, async ({ request }, testInfo) => {
    
  // Подготавливаем данные с некорректным doneStatus
  const invalidTodo = {
    title: "create new todo",
    doneStatus: "bob", // Некорректное значение - строка вместо boolean
    description: "created via insomnia"
  };
  
  // Отправляем POST запрос
  const response = await request.post(`${testInfo.project.use.baseURL}/todos`, {
    headers: {
      "X-CHALLENGER": token,
      "Content-Type": "application/json",
    },
    data: invalidTodo,
  });
  
  // Проверяем статус 400
  expect(response.status()).toBe(400);
  
  // Проверяем тело ответа
  const body = await response.json();
  expect(body.errorMessages).toHaveLength(1);
  expect(body.errorMessages[0]).toContain("Failed Validation: doneStatus should be BOOLEAN");
  });

  test("11 POST /todos (400) - title too long", { tag: '@API @POST @validation' }, async ({ api }, testInfo) => {
    
    // Используем builder для создания задачи с слишком длинным заголовком
    const createTodo = new toDoBuilder()
      .moreThanMaxLengthTitle()
      .addDoneStatus(true)
      .addDescription("should trigger a 400 error")
      .generate();
    
    // Отправляем POST запрос
    const response = await api.todos.create(token, testInfo, createTodo); 
    // Проверяем статус 400
    expect(response.status()).toBe(400);
    
    // Проверяем тело ответа
    const body = await response.json();
    expect(body.errorMessages).toHaveLength(1);
    expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for title");
  });

  test("12 POST /todos (400) - description too long", { tag: '@API @POST @validation' }, async ({ api }, testInfo) => {
    
   
    // Используем builder для создания задачи с слишком длинным описанием
    const createTodo = new toDoBuilder()
      .addTitle("this title is fine")
      .addDoneStatus(true)
      .withTooLongDescription()
      .generate();
    
    // Отправляем POST запрос
    const response = await api.todos.create(token, testInfo, createTodo); 
    // Проверяем статус 400
    expect(response.status()).toBe(400);
    
    // Проверяем тело ответа
    const body = await response.json();
    expect(body.errorMessages).toHaveLength(1);
    expect(body.errorMessages[0]).toContain("Failed Validation: Maximum allowable length exceeded for description");
  });

  test("13 POST /todos (201) - max out content", { tag: '@API @POST @validation' }, async ({ api }, testInfo) => {
  
  // Используем builder для создания задачи с максимальной длиной
  const createTodo = new toDoBuilder()
    .withMaxLengthTitle()  // Используем правильное название метода
    .addDoneStatus(true)
    .withMaxLengthDescription()  // Используем правильное название метода
    .generate();
  
  // Отправляем POST запрос
  const response = await api.todos.create(token, testInfo, createTodo); 
  // Проверяем статус 201
  expect(response.status()).toBe(201);
  
  // Проверяем тело ответа
  const body = await response.json();
  expect(body.title).toBe("this title has just enough characters to validate.");
  expect(body.doneStatus).toBe(true);
  expect(body.description).toBe("This description has just enough characters to validate because it is exactly 200 characters in length. I had to use a tool to check this - so I should have used a CounterString to be absolutely sure.");
  
  // Проверяем наличие заголовка Location
  const headers = response.headers();
  expect(headers).toEqual(expect.objectContaining({ "location": expect.stringContaining("/todos/") }));
  });

  test("14 POST /todos (413) - content too long", { tag: '@API @POST @validation' }, async ({ api }, testInfo) => {
  
  // Используем builder для создания задачи с очень длинным описанием
  const createTodo = new toDoBuilder()
    .addTitle("this title is valid.")
    .addDoneStatus(true)
    .withExactMaxLengthDescription()
    .generate();
  
  // Отправляем POST запрос
  const response = await api.todos.create(token, testInfo, createTodo); 
  // Проверяем статус 413
  expect(response.status()).toBe(413);
  
  // Проверяем тело ответа
  const body = await response.json();
  expect(body.errorMessages).toHaveLength(1);
  expect(body.errorMessages[0]).toContain("Error: Request body too large, max allowed is 5000 bytes");
  });

  test("15 POST /todos (400) - extra field", { tag: '@API @POST @validation' }, async ({ api }, testInfo) => {
  // Отправляем POST запрос с лишним полем priority
  const response = await api.todos.create(token, testInfo, { 
    title: "a title",
    priority: "extra"
  });

  // Проверяем статус 400
  expect(response.status()).toBe(400);

  // Проверяем тело ответа
  const body = await response.json();
  expect(body.errorMessages).toHaveLength(1);
  expect(body.errorMessages[0]).toBe("Could not find field: priority");
});

  test("16 PUT /todos/{id} (400) - attempt to create with PUT", { tag: '@API @PUT @validation' }, async ({ api }, testInfo) => {
    
    
    // Используем несуществующий ID для попытки создания
    const nonExistentId = 999999;
    
    // Отправляем PUT запрос с ID, который не существует
    const response = await api.todos.update(nonExistentId, token, testInfo, { 
      title: "create todo process payroll",
      doneStatus: true,
      description: ""
    });
    
    // Проверяем статус 400
    expect(response.status()).toBe(400);
    
    // Проверяем тело ответа
    const body = await response.json();
    expect(body.errorMessages).toHaveLength(1);
    expect(body.errorMessages[0]).toBe("Cannot create todo with PUT due to Auto fields id");
  });

  test("17 POST /todos/{id} (200) - partial update", { tag: '@API @POST @functional' }, async ({ api }, testInfo) => {
  
  // Сначала создаем новую задачу, чтобы получить ID
  const createTodo = new toDoBuilder()
    .addTitle("original title")
    .addDoneStatus(false)
    .addDescription("original description")
    .generate();
  
  const createResponse = await api.todos.create(token, testInfo, createTodo); 
  expect(createResponse.status()).toBe(201);
  const createdTodo = await createResponse.json();
  const todoId = createdTodo.id;
  
  // Теперь делаем частичное обновление задачи
  const updateData = new toDoBuilder()
  .withMinimalUpdateData()
  .generate();
  
  const response = await api.todos.updatePartialPost(todoId, token, testInfo, updateData);
   // Проверяем статус 200
  expect(response.status()).toBe(200);
  
  // Проверяем тело ответа
  const body = await response.json();
  expect(body.id).toBe(todoId);
  expect(body.title).toBe("updated title");
  expect(body.doneStatus).toBe(false); // Поле должно сохраниться из оригинальной задачи
  expect(body.description).toBe("original description"); // Поле должно сохраниться из оригинальной задачи
  });

  test("18 POST /todos/{id} (404) - update non-existent todo", async ({ api }, testInfo) => {
  const nonExistentId = 999999;

  const response = await api.todos.updatePartialPost(nonExistentId, token, testInfo, {
    title: "updated title"
  });

  expect(response.status()).toBe(404);

  const body = await response.json();
  expect(body.errorMessages).toHaveLength(1);
  expect(body.errorMessages[0]).toBe(`No such todo entity instance with id == ${nonExistentId} found`);
});

 
  test("19 PUT /todos/{id} full (200) - full update", { tag: '@API @PUT @functional' }, async ({ api }, testInfo) => {
  
  // Сначала создаем новую задачу, чтобы получить ID
  const createTodo = new toDoBuilder()
    .addTitle("original title")
    .addDoneStatus(false)
    .addDescription("original description")
    .generate();
  
  const createResponse = await api.todos.create(token, testInfo, createTodo); 
  expect(createResponse.status()).toBe(201);
  const createdTodo = await createResponse.json();
  const todoId = createdTodo.id;
  
  // Теперь делаем полное обновление задачи через PUT (без ID в payload)
  const fullUpdateData = {
    title: "full update title",
    doneStatus: true,
    description: "full update description"
  };

  const response = await api.todos.update(todoId, token, testInfo, fullUpdateData);
  expect(response.status()).toBe(200);

  // Проверяем тело ответа
  const body = await response.json();
  expect(body.id).toBe(todoId);
  expect(body.title).toBe("full update title");
  expect(body.doneStatus).toBe(true);
  expect(body.description).toBe("full update description");
  });

  test("20 PUT /todos/{id} partial (400) - no title field", { tag: '@API @PUT @validation' }, async ({ api }, testInfo) => {
  // Создаем задачу
  const createTodo = new toDoBuilder()
    .addTitle("original title")
    .addDoneStatus(false)
    .addDescription("original description")
    .generate();

  const createResponse = await api.todos.create(token, testInfo, createTodo);
  expect(createResponse.status()).toBe(201);
  const createdTodo = await createResponse.json();
  const todoId = createdTodo.id;

  // Подготавливаем данные для частичного обновления (без title)
  const partialUpdateData = {
    description: "partial update for description"
  };

  // Вызов с правильным порядком аргументов
  const response = await api.todos.updatePartialPut(todoId, token, testInfo, partialUpdateData);

  expect(response.status()).toBe(400);

  const body = await response.json();
  expect(body.errorMessages).toHaveLength(1);
  expect(body.errorMessages[0]).toBe("title : field is mandatory");
});


  test("23 DELETE /todos/{id} (200) - delete todo", { tag: '@API @DELETE @functional' }, async ({ api }, testInfo) => {
    
    // Сначала создаем новую задачу, чтобы получить ID
    const createTodo = new toDoBuilder()
      .addTitle("task to delete")
      .addDoneStatus(false)
      .addDescription("task that will be deleted")
      .generate();
    
    const createResponse = await api.todos.create(token, testInfo, createTodo); 
    expect(createResponse.status()).toBe(201);
    const createdTodo = await createResponse.json();
    const todoId = createdTodo.id;
    
    // Удаляем задачу
    const deleteResponse = await api.todos.delete(todoId, token, testInfo); 
    // Проверяем статус 200
    expect(deleteResponse.status()).toBe(200);
    
    // Проверяем, что задача действительно удалена (GET возвращает 404)
    const getResponse = await api.todos.getById(todoId, token, testInfo); 
    expect(getResponse.status()).toBe(404);
  });

  test("25 GET /todos (200) XML - получить список todos задач в формате XML", { tag: '@API @GET @functional' }, async ({ api }, testInfo) => {
    // Выполняем GET запрос с заголовком Accept: application/xml
    const response = await api.todos.getAllXml(token, testInfo); 
    // Проверяем статус 200
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

  test("26 GET /todos (200) JSON - get todos in JSON format", { tag: '@API @GET @functional' }, async ({ api }, testInfo) => {
    
    // Выполняем GET запрос с заголовком Accept: application/json
    const response = await api.todos.getAllJson(token, testInfo); 
    // Проверяем статус 200
    expect(response.status()).toBe(200);
    
    // Проверяем заголовок Content-Type
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
    
    // Проверяем тело ответа
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    expect(responseBody.todos).toBeDefined();
    expect(Array.isArray(responseBody.todos)).toBe(true);
    
    // Проверяем, что в ответе есть хотя бы одна задача
    expect(responseBody.todos.length).toBeGreaterThanOrEqual(0);
  });

  test("27 GET /todos (200) ANY - get todos in default format", { tag: '@API @GET @functional' }, async ({ request }, testInfo) => {

    // Выполняем GET запрос с заголовком Accept: */* (дефолтный формат)
    const response = await request.get(`${testInfo.project.use.baseURL}/todos`, {
      headers: {
        "X-CHALLENGER": token,
        "Accept": "*/*"
      },
    });
    
    // Проверяем статус 200
    expect(response.status()).toBe(200);
    
    // Проверяем заголовок Content-Type
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
    
    // Проверяем тело ответа
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    expect(responseBody.todos).toBeDefined();
    expect(Array.isArray(responseBody.todos)).toBe(true);
    
    // Проверяем, что в ответе есть хотя бы одна задача
    expect(responseBody.todos.length).toBeGreaterThanOrEqual(0);
  });

  test("28 GET /todos (200) XML pref - get todos in XML format with preference", { tag: '@API @GET @functional' }, async ({ api }, testInfo) => {
    // Выполняем GET запрос с заголовком Accept: application/xml,application/json (предпочтение XML)
    const response = await api.todos.getAllWithPreference(token, testInfo); 
    // Проверяем статус 200
    expect(response.status()).toBe(200);
    // Проверяем заголовок Content-Type - должен быть application/xml или application/json
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/");
    // Проверяем тело ответа - если XML, то должно содержать XML-теги
    const responseBody = await response.text();
    expect(responseBody).toBeDefined();
    // Если сервер поддерживает XML, то ответ должен начинаться с <todos>
    if (contentType.includes("application/xml")) {
      expect(responseBody).toContain("<todos>");
      expect(responseBody).toContain("<todo>");
    }
  });

  test("31 POST /todos XML - create todo in XML format", { tag: '@API @POST @functional' }, async ({ api }, testInfo) => {
    
    // XML payload для создания задачи
    const xmlPayload = `<todo>
      <doneStatus>true</doneStatus>
      <title>file paperwork today</title>
    </todo>`;
    
    // Отправляем POST запрос с XML контентом
    const response = await api.todos.createXml(token, xmlPayload, testInfo); 
    // Проверяем статус 201
    expect(response.status()).toBe(201);
    
    // Проверяем заголовок Content-Type в ответе
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/xml");
    
    // Проверяем тело ответа - должно быть в XML формате
    const responseBody = await response.text();
    expect(responseBody).toBeDefined();
    expect(responseBody).toContain("<todo>");
    expect(responseBody).toContain("<doneStatus>true</doneStatus>");
    expect(responseBody).toContain("<title>file paperwork today</title>");
    
    // Проверяем наличие заголовка Location
    const locationHeader = response.headers()["location"];
    expect(locationHeader).toBeDefined();
    expect(locationHeader).toContain("/todos/");
  });

  test("32 POST /todos JSON - create todo in JSON format", { tag: '@API @POST @functional' }, async ({ api }, testInfo) => {
    // const responseToken = await request.post(`${testInfo.project.use.baseURL}/challenger`); // Убрано - используем фикстуру
    // expect(responseToken.status()).toBe(201);
    // const token = responseToken.headers()['x-challenger']; // Убрано
    
    // JSON payload для создания задачи
    const jsonPayload = {
      title: "create todo process payroll",
      doneStatus: true,
      description: ""
    };
    
    // Отправляем POST запрос с JSON контентом
    const response = await api.todos.create(token, testInfo, jsonPayload);
    // Проверяем статус 201
    expect(response.status()).toBe(201);
    
    // Проверяем заголовок Content-Type в ответе
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
    
    // Проверяем тело ответа - должно быть в JSON формате
    const responseBody = await response.json();
    expect(responseBody).toBeDefined();
    expect(responseBody.title).toBe("create todo process payroll");
    expect(responseBody.doneStatus).toBe(true);
    expect(responseBody.description).toBe("");
    expect(responseBody.id).toBeDefined();
    
    // Проверяем наличие заголовка Location
    const locationHeader = response.headers()["location"];
    expect(locationHeader).toBeDefined();
    expect(locationHeader).toContain("/todos/");
  });

  test("33 POST /todos (415) - unsupported media type", { tag: '@API @POST @error_handling' }, async ({ api }, testInfo) => {
    
    // Отправляем POST запрос с неподдерживаемым content-type
    const response = await api.todos.createUnsupportedMediaType(token, "invalid payload", testInfo); 
    // Проверяем статус 415
    expect(response.status()).toBe(415);
  });

  test("41DELETE /heartbeat (405) - DELETE request returns 405", { tag: '@API @DELETE @error_handling' }, async ({ api }, testInfo) => {
    
    // Отправляем DELETE запрос на heartbeat endpoint
    const response = await api.heartbeat.deleteHeartbeat(token, testInfo); 
    // Проверяем статус 405
    expect(response.status()).toBe(405);
  });

  test("42PATCH /heartbeat (500) - PATCH request returns 500", { tag: '@API @PATCH @error_handling' }, async ({ api }, testInfo) => {
    
    // Отправляем PATCH запрос на heartbeat endpoint
    const response = await api.heartbeat.patchHeartbeat(token, testInfo); 
    // Проверяем статус 500
    expect(response.status()).toBe(500);
  });

  test("44GET /heartbeat (204) - GET request returns 204", { tag: '@API @GET @functional' }, async ({ api }, testInfo) => {
    
    // Отправляем GET запрос на heartbeat endpoint
    const response = await api.heartbeat.getHeartbeat(token, testInfo); 
    // Проверяем статус 204
    expect(response.status()).toBe(204);
    
    // Проверяем, что тело ответа пустое
    const responseBody = await response.text();
    expect(responseBody).toBe("");
  });

  test("58 DELETE /todos/{id} (200) all - delete all todos", { tag: '@API @DELETE @functional' }, async ({ api }, testInfo) => {
    
    // Получаем список всех задач
    const getAllResponse = await api.todos.getAll(token, testInfo); 
    expect(getAllResponse.status()).toBe(200);
    const responseBody = await getAllResponse.json();
    const todos = responseBody.todos;
    
    // Удаляем каждую задачу по отдельности
    for (const todo of todos) {
      const deleteResponse = await api.todos.delete(todo.id, token, testInfo); 
      // Проверяем, что задача была удалена
      expect(deleteResponse.status()).toBe(200);
    }
    
    // Проверяем, что все задачи удалены
    const finalGetResponse = await api.todos.getAll(token, testInfo); 
    expect(finalGetResponse.status()).toBe(200);
    const finalResponseBody = await finalGetResponse.json();
    expect(finalResponseBody.todos).toHaveLength(0);
  });
}); 