# Деплой на Vercel в боевом режиме (Google Таблицы + Drive)

Пошаговая инструкция: развернуть приложение на Vercel и подключить Google Таблицу и папку Drive для тестирования в live-режиме.

---

## Часть 1. Google Cloud: таблица и папка

### 1.1. Создать проект и включить API

1. Открой [Google Cloud Console](https://console.cloud.google.com/).
2. Создай проект (или выбери существующий): **APIs & Services** → **Select a project** → **New Project** → имя, например `zima-vector-profile`.
3. Включи API:
   - **APIs & Services** → **Library**
   - Найди и включи **Google Sheets API**
   - Найди и включи **Google Drive API**

### 1.2. Сервисный аккаунт (доступ к Таблице и Drive)

1. **APIs & Services** → **Credentials** → **Create Credentials** → **Service account**.
2. Имя, например `zima-app` → **Create and Continue** → роль можно не менять → **Done**.
3. Открой созданный сервисный аккаунт → вкладка **Keys** → **Add Key** → **Create new key** → **JSON** → скачай файл.
4. В JSON найди:
   - `client_email` — это **GOOGLE_SERVICE_ACCOUNT_EMAIL**
   - `private_key` — это **GOOGLE_PRIVATE_KEY** (в одну строку, символы `\n` оставить как есть или заменить на реальные переносы при вставке в Vercel)

### 1.3. Google Таблица

1. Открой [Google Таблицы](https://sheets.google.com) → **Пустой файл** (или **Создать** → **Таблица**).
2. Дай имя, например `ZIMA Vector Profile — Live`.
3. **Поделиться** (Share) → в поле «Добавить пользователей» вставь **client_email** из JSON (например `zima-app@project-id.iam.gserviceaccount.com`) → выбери роль **Редактор** → **Готово**.
4. ID таблицы возьми из URL:
   - URL вида: `https://docs.google.com/spreadsheets/d/ **ЭТОТ_ID** /edit`
   - Это значение **GOOGLE_SPREADSHEET_ID**.

### 1.4. Папка Google Drive (для PDF-отчётов)

1. Открой [Google Диск](https://drive.google.com).
2. **Создать** → **Папку** → имя, например `ZIMA Reports`.
3. ПКМ по папке → **Поделиться** → добавь тот же **client_email** сервисного аккаунта с правом **Редактор**.
4. Открой папку; ID — в URL:
   - URL вида: `https://drive.google.com/drive/folders/ **ЭТОТ_ID**`
   - Это значение **GOOGLE_DRIVE_FOLDER_ID**.

---

## Часть 2. Деплой на Vercel

### 2.1. Репозиторий

1. Инициализируй Git в проекте (если ещё не сделано):
   ```bash
   cd C:\Users\ZNN\Desktop\ZD-vector-profile
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Создай репозиторий на GitHub (или GitLab) и запушь:
   ```bash
   git remote add origin https://github.com/ТВОЙ_ЛОГИН/zima-vector-profile.git
   git branch -M main
   git push -u origin main
   ```

### 2.2. Подключение к Vercel

1. Зайди на [vercel.com](https://vercel.com), войди через GitHub.
2. **Add New** → **Project** → выбери репозиторий `zima-vector-profile` (или как назвал).
3. **Framework Preset**: Next.js (подставится сам).
4. **Root Directory** — оставь пустым.
5. **Environment Variables** — добавь переменные (см. ниже) перед деплоем.

### 2.3. Переменные окружения в Vercel

В настройках проекта Vercel: **Settings** → **Environment Variables**. Добавь для **Production** (и при желании Preview):

| Имя | Значение | Комментарий |
|-----|----------|-------------|
| `NEXT_PUBLIC_APP_MODE` | `live` | Обязательно для боевого режима |
| `NEXT_PUBLIC_BASE_URL` | `https://твой-проект.vercel.app` | Подставь свой домен после первого деплоя |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `...@....iam.gserviceaccount.com` | Из JSON ключа |
| `GOOGLE_PRIVATE_KEY` | ключ в кавычках | См. ниже |
| `GOOGLE_SPREADSHEET_ID` | ID из URL таблицы | Длинная строка букв/цифр |
| `GOOGLE_DRIVE_FOLDER_ID` | ID из URL папки Drive | Длинная строка букв/цифр |

**Как вставить GOOGLE_PRIVATE_KEY в Vercel**

- Вариант A: одна строка, кавычки внутри значения не ставить, переносы заменить на `\n`:
  ```
  -----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n
  ```
- Вариант B: в Vercel при создании переменной выбери тип **Secret** и вставь ключ как есть (с реальными переносами строк) — так тоже должно работать.

После добавления переменных нажми **Deploy** (или сделай новый деплой из вкладки Deployments).

---

## Часть 3. Создание листов в таблице (bootstrap)

В Vercel bootstrap не запускается. Его нужно выполнить **один раз с твоего компьютера**, чтобы в таблице появились листы с заголовками.

1. В корне проекта создай/отредактируй `.env` (или `.env.local`):
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL=...@....iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SPREADSHEET_ID=твой_id_таблицы
   ```
   Для `GOOGLE_PRIVATE_KEY` в `.env` можно вставить ключ в кавычках с `\n` или в несколько строк (в кавычках).

2. В терминале из корня проекта:
   ```bash
   npm run bootstrap-sheets
   ```
   Должно появиться сообщение о создании листов: Candidates, Sessions, Results, Notifications, HR_Users.

3. (По желанию) Заполни таблицу демо-данными:
   ```bash
   npm run seed
   ```

---

## Часть 4. Проверка боевого режима

1. Открой свой домен Vercel: `https://твой-проект.vercel.app`.
2. Проверь здоровье API: `https://твой-проект.vercel.app/api/health`  
   Ожидаемый ответ: `{"status":"ok","mode":"live"}` (или с полем `mode: "live"`).
3. Войди в дашборд (логин по текущей реализации — без реальной авторизации, только переход в интерфейс).
4. Если делал seed — в списке кандидатов должны быть демо-кандидаты.
5. Создай тестового кандидата, открой ссылку-приглашение и пройди блоки оценки — затем сгенерируй отчёт. Если задан `GOOGLE_DRIVE_FOLDER_ID`, PDF автоматически загружается в эту папку, а в карточке кандидата сохраняется ссылка на файл в Drive.

---

## Часть 5. Если что-то не работает

- **Ошибка «GOOGLE_SPREADSHEET_ID is not set»** — в Vercel не задан `GOOGLE_SPREADSHEET_ID` или деплой был до добавления переменных. Добавь переменные и сделай **Redeploy**.
- **Таблица пустая / нет листов** — выполни локально `npm run bootstrap-sheets` с тем же `GOOGLE_SPREADSHEET_ID` и тем же сервисным аккаунтом.
- **403 / нет доступа к таблице или Drive** — проверь, что в «Поделиться» добавлен именно **client_email** сервисного аккаунта с правом **Редактор**.
- **PDF не появляется в Drive** — проверь `GOOGLE_DRIVE_FOLDER_ID` в Vercel и что папка расшарена на сервисный аккаунт (Редактор). После генерации отчёта файл создаётся в этой папке, а ссылка «Отчёт» в карточке кандидата ведёт на просмотр в Drive.

После выполнения этих шагов у тебя будет рабочий деплой на Vercel с подключённой Google Таблицей и папкой Drive для теста в боевом режиме.
