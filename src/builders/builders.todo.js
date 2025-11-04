export class toDoBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.data = {
      title: "",
      doneStatus: false,
      description: ""
    };
    return this;
  }

  addTitle(title = "Наименование задания") {
    this.data.title = title;
    return this;
  }

  addDoneStatus(doneStatus = false) {
    this.data.doneStatus = doneStatus;
    return this;
  }

  addDescription(description = "Пройти по Абрикосовой, свернуть на Виноградную") {
    this.data.description = description;
    return this;
  }

  generate() {
    const result = { ...this.data };
    this.reset();
    return result;
  }
}