import { test } from "@playwright/test";

export class TodosService {
  constructor(request) {
    this.request = request;
  }

  async getAll(token, testinfo, acceptHeader = "application/json") {
    return test.step("GET /todos - получить все задачи", async () => {
      const response = await this.request.get(`${testinfo.project.use.baseURL}/todos`, {
        headers: { 
          "X-CHALLENGER": token,
          "Accept": acceptHeader
        }
      });
      return response;
    });
  }
}