import { test } from '@playwright/test';

export class HeartbeatService {
  constructor(request) {
    this.request = request;
  }

  async deleteHeartbeat(token, testinfo) {
    return test.step("DELETE /heartbeat - намеренный вызов для проверки 405", async () => {
      const response = await this.request.delete(`${testinfo.project.use.baseURL}/heartbeat`, {
        headers: {
          "X-CHALLENGER": token
        }
      });
      return response;
    });
  }

  async patchHeartbeat(token, testinfo) {
    return test.step("PATCH /heartbeat - тест на возврат 500", async () => {
      const response = await this.request.patch(`${testinfo.project.use.baseURL}/heartbeat`, {
        headers: {
          "X-CHALLENGER": token
        }
      });
      return response;
    });
  }

  async getHeartbeat(token, testinfo) {
    return test.step("GET /heartbeat - проверить статус 204", async () => {
      const response = await this.request.get(`${testinfo.project.use.baseURL}/heartbeat`, {
        headers: {
          "X-CHALLENGER": token
        }
      });
      return response;
    });
  }

}
