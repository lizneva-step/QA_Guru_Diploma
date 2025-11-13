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
  }async getById(id, token, testinfo) {
    return test.step(`GET /todos/${id} - получить задачу по id`, async () => {
      const response = await this.request.get(`${testinfo.project.use.baseURL}/todos/${id}`, {
        headers: { 
          "X-CHALLENGER": token
        }
      });
      return response;
    });
  }

  async create(token, testinfo, data) {
    return test.step("POST /todos - создать новую задачу", async () => {
      const response = await this.request.post(`${testinfo.project.use.baseURL}/todos`, {
        headers: { 
          "X-CHALLENGER": token,
          "Content-Type": "application/json"
        },
        data: data
      });
      return response;
    });
  }

  async update(id, token, testinfo, data) {
    return test.step(`PUT /todos/${id} - обновить задачу`, async () => {
      const response = await this.request.put(`${testinfo.project.use.baseURL}/todos/${id}`, {
        headers: { 
          "X-CHALLENGER": token,
          "Content-Type": "application/json"
        },
        data: data
      });
      return response;
    });
  }

  async patch(id, token, testinfo, data) {
    return test.step(`PATCH /todos/${id} - частичное обновление задачи`, async () => {
      const response = await this.request.patch(`${testinfo.project.use.baseURL}/todos/${id}`, {
        headers: { 
          "X-CHALLENGER": token,
          "Content-Type": "application/json"
        },
        data: data
      });
      return response;
    });
  }

  async delete(id, token, testinfo) {
    return test.step(`DELETE /todos/${id} - удалить задачу`, async () => {
      const response = await this.request.delete(`${testinfo.project.use.baseURL}/todos/${id}`, {
        headers: { 
          "X-CHALLENGER": token
        }
      });
      return response;
    });
  }

  async getByFilter(token, testinfo, doneStatus, acceptHeader = "application/json") {
  return test.step(`GET /todos?doneStatus=${doneStatus} - получить задачи с фильтром doneStatus`, async () => {
    const url = new URL(`${testinfo.project.use.baseURL}/todos`);
    url.searchParams.set('doneStatus', doneStatus.toString());

    const response = await this.request.get(url.toString(), {
      headers: {
        "X-CHALLENGER": token,
        "Accept": acceptHeader
      }
    });
    return response;
  });
}

  async updatePartialPost(id, token, testinfo, data) {
  return test.step(`POST /todos/${id} - частичное обновление задачи`, async () => {
    const response = await this.request.post(`${testinfo.project.use.baseURL}/todos/${id}`, {
      headers: { 
        "X-CHALLENGER": token,
        "Content-Type": "application/json"
      },
      data: data
    });
    return response;
  });
}

async updatePartialPut(id, token, testinfo, data) {
  return test.step(`PUT /todos/${id} - частичное обновление задачи через PUT`, async () => {
    const response = await this.request.put(`${testinfo.project.use.baseURL}/todos/${id}`, {
      headers: {
        "X-CHALLENGER": token,
        "Content-Type": "application/json"
      },
      data: data
    });
    return response;
  });
}

async getAllXml(token, testinfo) {
  return test.step("GET /todos - получить все задачи в XML формате", async () => {
    const response = await this.request.get(`${testinfo.project.use.baseURL}/todos`, {
      headers: {
        "X-CHALLENGER": token,
        "Accept": "application/xml"
      }
    });
    return response;
  });
}

async getAllJson(token, testinfo) {
  return test.step("GET /todos - получить все задачи в JSON формате", async () => {
    const response = await this.request.get(`${testinfo.project.use.baseURL}/todos`, {
      headers: {
        "X-CHALLENGER": token,
        "Accept": "application/json"
      }
    });
    return response;
  });
}

async getAllWithPreference(token, testinfo) {
  return test.step("GET /todos с предпочтением Accept XML/JSON", async () => {
    const response = await this.request.get(`${testinfo.project.use.baseURL}/todos`, {
      headers: {
        "X-CHALLENGER": token,
        "Accept": "application/xml,application/json"
      }
    });
    return response;
  });
}

async createXml(token, xmlPayload, testinfo) {
  return test.step("POST /todos - создать XML задачу", async () => {
    const response = await this.request.post(`${testinfo.project.use.baseURL}/todos`, {
      headers: {
        "X-CHALLENGER": token,
        "Content-Type": "application/xml",
        "Accept": "application/xml"         
      },
      data: xmlPayload
    });
    return response;
  });
}

async createUnsupportedMediaType(token, payload, testinfo) {
  return test.step("POST /todos - отправка с неподдерживаемым Content-Type", async () => {
    const response = await this.request.post(`${testinfo.project.use.baseURL}/todos`, {
      headers: {
        "X-CHALLENGER": token,
        "Content-Type": "application/unsupported-media-type"
      },
      data: payload
    });
    return response;
  });
}



}