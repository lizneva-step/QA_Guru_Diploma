import { test } from "@playwright/test";

export class ChallengesService {
  constructor(request) {
    this.request = request;
  }

  async get(token, testinfo) {
    return test.step("GET /challenges", async () => {
      const r = await this.request.get(
        `${testinfo.project.use.apiURL}/challenges`,
        {
          headers: { "X-CHALLENGER": token },
        },
      );
      const body = await r.json();
      return body;
    });
  }
}