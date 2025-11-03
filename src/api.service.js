import { ChallengerService, ChallengesService, TodosService } from "./index.js";

//основной класс API сервиса
export class Api {
  constructor(request) {
    this.request = request;
    this.challenger = new ChallengerService(request);
    this.challenges = new ChallengesService(request);
    this.todos = new TodosService(request);
  }
}
