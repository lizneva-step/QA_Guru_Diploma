import { test, expect } from "@playwright/test";                  
import { ChallengerService } from "../src/index";                
import { Api } from "../src/api.service";                       
import { TodosService } from "../src/todos.service";               
let token;                                                        

test.describe("Challenge API", () => {                            
  // Создание сессии и получение токена: POST запрос к /challenger без тела запроса
  test("01 POST /challenger должен создать новую сессию и вернуть токен", { tag: '@API' }, async ({ request }, testinfo) => {  
    const response = await request.post(`${testinfo.project.use.baseURL}/challenger`);  
    expect(response.status()).toBe(201);  
    const headers = response.headers();  
    expect(headers).toHaveProperty('x-challenger');  
    token = headers["x-challenger"];  
    expect(token).toBeDefined(); 
    expect(token).not.toBe('');  
    console.log(`${testinfo.project.use.baseURL}/gui/challenges/${token}`);  
  });

  // Получение списка задач
  test("02 GET /challenges (200) - получить список challenge задач", { tag: '@API' }, async ({ request }, testinfo) => {  
    let getResponse = await request.get(`${testinfo.project.use.baseURL}/challenges`, {  
      headers: { "x-challenger": token },
    });  
    const responseBody = await getResponse.json();  
    expect(getResponse.status()).toBe(200); 
    expect(responseBody.challenges.length).toBe(59);  
  });

  // Получение списка  todos
  test("03 GET /todos (200) - получить список todos задач", { tag: '@API' }, async ({ request }, testinfo) => { 
    const api = new Api(request);  
    const response = await api.todos.getAll(token, testinfo);  
    expect(response.status()).toBe(200);  
    const responseBody = await response.json(); 
    expect(responseBody).toBeDefined();  
  });
});