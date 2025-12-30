# 🚀 Команды для обновления Docker образа

## На вашем ПК (Windows PowerShell)

### 1. Сборка и публикация образа

```powershell
# Перейти в папку проекта
cd E:\projects\portfolio\active\food.does.cool

# Логин в Docker Hub
docker login -u gygabyyyte

# Сборка образа
docker build -t gygabyyyte/food-does-cool:latest -f Dockerfile .

# Публикация
docker push gygabyyyte/food-does-cool:latest
```

---

## На сервере (SSH: misha@173.212.252.150)

### 2. Обновление контейнера

```bash
# Подключиться к серверу
ssh misha@173.212.252.150

# Перейти в папку проекта
cd ~/fdc

# Скачать новый образ
docker compose -f docker-compose.app.yml pull

# Перезапустить контейнер (миграции запустятся автоматически)
docker compose -f docker-compose.app.yml up -d

# Проверить логи (должны быть миграции)
docker logs --tail=50 fdc-app
```

### 3. Создать администратора

```bash
# Создать админа (замените email на свой Google email)
docker exec fdc-app node scripts/make-admin.js your-email@example.com

# Проверить что админ создан
docker exec fdc-app sqlite3 /data/meals.db "SELECT email, is_admin FROM users WHERE is_admin = 1;"
```

---

## 🎯 Полезные команды для работы с админами

```bash
# Посмотреть всех администраторов
docker exec fdc-app sqlite3 /data/meals.db "SELECT email, name, is_admin FROM users WHERE is_admin = 1;"

# Посмотреть всех пользователей
docker exec fdc-app sqlite3 /data/meals.db "SELECT email, name, is_admin FROM users;"

# Отозвать права администратора
docker exec fdc-app node scripts/revoke-admin.js user@example.com

# Запустить миграции вручную (если нужно)
docker exec fdc-app node scripts/migrate.js

# Посмотреть выполненные миграции
docker exec fdc-app sqlite3 /data/meals.db "SELECT * FROM migrations;"

# Посмотреть таблицы в базе
docker exec fdc-app sqlite3 /data/meals.db ".tables"

# Логи контейнера
docker logs -f fdc-app

# Остановить контейнер
docker compose -f docker-compose.app.yml down

# Запустить контейнер
docker compose -f docker-compose.app.yml up -d
```

---

## 🔄 Бэкап базы данных

```bash
# Создать бэкап (на сервере)
docker run --rm -v fdc-sqlite-data:/data -v "$PWD":/backup bash:5 \
  bash -lc 'cp /data/meals.db /backup/meals.db.$(date +%F).bak'

# Восстановить из бэкапа
docker run --rm -v fdc-sqlite-data:/data -v "$PWD":/backup bash:5 \
  bash -lc 'cp /backup/meals.db.2024-12-30.bak /data/meals.db'

# Скачать бэкап на локальный ПК
scp misha@173.212.252.150:~/fdc/meals.db.2024-12-30.bak .
```

---

## ⚠️ Важно помнить

1. **Миграции запускаются автоматически** при каждом старте контейнера
2. **После создания админа** пользователь должен выйти и войти заново в браузере
3. **База данных** хранится в volume `fdc-sqlite-data` и сохраняется при обновлениях
4. **Скрипты** находятся в папке `/app/scripts/` внутри контейнера
5. **Миграции** находятся в папке `/app/migrations/` внутри контейнера

---

## ✅ Проверка после обновления

```bash
# 1. Проверить что контейнер запущен
docker ps | grep fdc-app

# 2. Проверить логи (должны быть миграции)
docker logs fdc-app | grep migration

# 3. Проверить таблицы
docker exec fdc-app sqlite3 /data/meals.db ".tables"

# 4. Проверить что таблица users создана
docker exec fdc-app sqlite3 /data/meals.db ".schema users"

# 5. Создать админа
docker exec fdc-app node scripts/make-admin.js your-email@example.com

# 6. Проверить что админ создан
docker exec fdc-app sqlite3 /data/meals.db "SELECT email, is_admin FROM users WHERE is_admin = 1;"
```

---

**Готово!** Скопируйте нужные команды и выполните их по порядку.

