import { test as base } from '@playwright/test';
import { Api } from '../api.service.js';
import { TodosService } from '../todos.service.js';
import { HeartbeatService } from '../heartbeat.service.js';

export const test = base.extend({
  api: async ({ request }, use) => {
    const api = new Api(request);
    api.todos = new TodosService(request);
    api.heartbeat = new HeartbeatService(request);
    await use(api);
  },
});

// Экспортируем expect для тестов
export { expect } from '@playwright/test';
