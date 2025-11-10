# Дипломный проект по автоматизации тестирования на Playwright

Цель проекта — продемонстрировать навыки автоматизации, полученные в рамках курса QA.GURU.  
Включены **UI и API тесты**, настроен **CI/CD**, **отчёты**, **интеграция с TestOps** и **уведомления в Telegram**.

---

## 📚 Содержание
- [Описание](#-описание)
- [Технологии](#-технологии)
- [Allure-отчёт](#-allure-отчёт)
- [TestOps](#-testops)
- [Telegram](#-уведомления-в-telegram)
- [Запуск](#-запуск-локально)

---

## 📝 Описание

Репозиторий содержит:
- **API-тесты** для `https://apichallenges.herokuapp.com`
- **UI-тесты** для `https://realworld.qa.guru`
- Написаны на **JavaScript** + **Playwright**
- Настроен **GitHub Actions**:
  - Запуск тестов
  - Allure-отчёты
  - Публикация на GitHub Pages
  - Интеграция с Allure TestOps
  - Уведомления в Telegram

Запуск — при пуше в `main` или `master`.

---

## 🛠 Технологии

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg" alt="Playwright" width="50" height="50"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" alt="GitHub" width="50" height="50"/>
  <img src="https://fakerjs.dev/logo.svg" alt="Faker.js" width="50" height="50"/>
  <img src="https://squidex.jugru.team/api/assets/sites/7de013f4-fb66-49d9-b625-2e3f8c10a043/testops.svg" alt="Allure TestOps" width="50" height="50"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg" alt="Telegram" width="50" height="50"/>
</div>

---

## 📊 Allure-отчёт

[👉 Посмотреть отчёт](https://lizneva-step.github.io/QA_Guru_Diploma)

![Allure Report](images_report/allure-report.png)

> Генерируется после каждого запуска и публикуется на GitHub Pages.

---

## 🔗 TestOps

[👉 Перейти в Allure TestOps](https://allure.autotests.cloud/launch/49425/?treeId=0)

![TestOps Dashboard](images_report/testops-dashboard.png)

> Результаты тестов автоматически загружаются для анализа и трендов.

---

## 📢 Уведомления в Telegram

После каждого запуска приходит уведомление:

![Telegram Notification](images_report/telegram-notification.png)

> Содержит:
> - Статус: ✅ ТЕСТЫ ПРОЙДЕНЫ / ❌ ОШИБКИ В ТЕСТАХ
> - Количество тестов
> - Ссылки на отчёты и артефакты

---

## 🏁 Запуск локально

1. Клонируй репозиторий: git clone https://github.com/lizneva-step/QA_Guru_Diploma.git
2. Установи зависимости: npm install
3. Запусти тесты npx playwright test

