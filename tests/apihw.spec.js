import { test, expect } from "@playwright/test";                  
import { Api } from "../src/api.service";                       
import { faker } from "@faker-js/faker";
let token;     

//01 POST /challenger (201) получить токен"                                                   
test.describe("Challenge API", () => {        
    test.beforeAll(async ({ request }, testinfo) => {  
    let response = await request.post(`${testinfo.project.use.baseURL}/challenger`);
    expect(response.status()).toBe(201);
    const headers = response.headers();
    console.log(`${testinfo.project.use.baseURL}${headers.location}`);
    token = headers["X-CHALLENGER"];
  });

  test("02 GET /challenges (200) - получить список challenge задач", { tag: '@API' }, async ({ request }, testinfo) => {  
    let getResponse = await request.get(`${testinfo.project.use.baseURL}/challenges`, {  
      headers: { "X-CHALLENGER": token },
    });  
    const responseBody = await getResponse.json();  
    expect(getResponse.status()).toBe(200); 
    expect(responseBody.challenges.length).toBe(59);  
  });

  test("03 GET /todos (200) - получить список todos задач", { tag: '@API' }, async ({ request }, testinfo) => { 
    const api = new Api(request);  
    const response = await api.todos.getAll(token, testinfo);  
    expect(response.status()).toBe(200);  
    const responseBody = await response.json(); 
    expect(responseBody).toBeDefined();  
    console.log(`Количество задач в списке: ${responseBody.todos.length}`);
  });

  test("04 GET /todo (404) not plural - получить 404 при вызове /todo", { tag: '@API' }, async ({ request }, testinfo) => { 
    const response = await request.get(`${testinfo.project.use.baseURL}/todo`, {
    headers: { "X-CHALLENGER": token },
  });  
    expect(response.status()).toBe(404);
  });

  test("05 GET /todos/{id} (200) - получить todo по id", { tag: '@API' }, async ({ request }, testinfo) => { 
    const randomId = faker.number.int({ min: 1, max: 10 });
    const response = await request.get(`${testinfo.project.use.baseURL}/todos/${randomId}`, {
      headers: { "X-CHALLENGER": token },
    });  
    expect(response.status()).toBe(200);
  });

  test("06 GET /todos/{id} (404) - получить 404 для несуществующей задачи", { tag: '@API' }, async ({ request }, testinfo) => { 
    const nonExistentId = faker.number.int({ min: 11, max: 999999 });
    const response = await request.get(`${testinfo.project.use.baseURL}/todos/${nonExistentId}`, {
      headers: { "X-CHALLENGER": token },
    });  
    expect(response.status()).toBe(404);
  });

  test("07 GET /todos (200) ?filter - получить список выполненных задач", { tag: '@API' },async ({ request }, testinfo) => {
      let response = await request.get(`${testinfo.project.use.baseURL}/todos?doneStatus=true`, {
          headers: {
              "X-CHALLENGER": token,
          },
      });
      let body = await response.json();
      expect(response.status()).toBe(200);
      expect(body.todos.doneStatus).toBeUndefined();
  });

  });