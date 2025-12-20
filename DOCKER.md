# food.does.cool — Docker‑сборка и запуск

Итог: один образ приложения `gygabyyyte/food-does-cool:latest` (Next.js + SQLite). База — SQLite в отдельном томе контейнера; MinIO остаётся системным сервисом (вне Docker). Прокси — nginx как в `deployment/files/nginx/food.does.cool.conf`.

---

## 1) Сборка и публикация образа (локально, Windows PowerShell)

```powershell
cd E:\projects\portfolio\active\food.does.cool

# 1. Логин в Docker Hub
docker login -u gygabyyyte

# 2. Сборка образа
docker build -t gygabyyyte/food-does-cool:latest -f Dockerfile .

# 3. Публикация в Docker Hub
docker push gygabyyyte/food-does-cool:latest
```

---

## 2) Быстрый запуск локально (опционально)

```powershell
cd E:\projects\portfolio\active\food.does.cool
copy .env.example .env
# Укажите значения для MINIO_ACCESS_KEY/MINIO_SECRET_KEY и др. при необходимости

docker compose -f docker-compose.app.yml up -d
docker logs -f fdc-app
```

Приложение будет слушать `http://127.0.0.1:3010/` (см. `APP_BIND_IP` и `PORT`).

---

## 3) Деплой на сервер (misha@173.212.252.150)

1) Подключитесь:

```powershell
ssh misha@173.212.252.150
```

2) Установите Docker и nginx/certbot (если ещё не установлены):

```bash
sudo apt update && sudo apt install -y ca-certificates curl gnupg
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker -v
docker compose version

sudo apt install -y nginx certbot python3-certbot-nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

3) Подготовьте папку и файлы compose:

```bash
mkdir -p ~/fdc && cd ~/fdc
```

С вашего ПК (PowerShell) скопируйте файлы:

```powershell
scp "E:\\projects\\portfolio\\active\\food.does.cool\\docker-compose.app.yml" misha@173.212.252.150:~/fdc/docker-compose.app.yml
```

Создайте `.env` на сервере на основе параметров системного MinIO:

```bash
set -a
. /etc/default/minio
set +a
cat > .env <<'ENV'
# Привязка приложения (nginx будет проксировать на этот порт)
APP_BIND_IP=127.0.0.1
PORT=3010

# MinIO — значения берите из /etc/default/minio
MINIO_ACCESS_KEY='${MINIO_ROOT_USER}'
MINIO_SECRET_KEY='${MINIO_ROOT_PASSWORD}'
MINIO_ENDPOINT_PROTOCOL=http
MINIO_ENDPOINT_HOST=173.212.252.150
MINIO_ENDPOINT_PORT=9000
MINIO_BUCKET_NAME=meals
ENV
```

4) Запустите приложение (скачает образ из Docker Hub):

```bash
cd ~/fdc
docker compose -f docker-compose.app.yml pull
docker compose -f docker-compose.app.yml up -d
docker logs --tail=200 -f fdc-app
```

Том `fdc-sqlite-data` хранит `meals.db`. При первом старте entrypoint создаст БД (выполнит `node initdb.js`, если в образе присутствует скрипт).

---

## 4) Nginx и сертификат для https://food.does.cool/

Готовый конфиг есть в `deployment/files/nginx/food.does.cool.conf`. Для выпуска сертификата используйте webroot‑подход.

1) Временный HTTP‑конфиг для ACME‑проверки:

```bash
cat | sudo tee /etc/nginx/sites-available/food.does.cool.http >/dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name food.does.cool;
    root /var/www/food.does.cool;
    location ^~ /.well-known/acme-challenge/ {
        root /var/www/food.does.cool;
        allow all;
    }
}
EOF
sudo mkdir -p /var/www/food.does.cool
sudo ln -s /etc/nginx/sites-available/food.does.cool.http /etc/nginx/sites-enabled/food.does.cool.http 2>/dev/null || true
sudo nginx -t && sudo systemctl reload nginx
```

2) Выпустите сертификат:

```bash
sudo certbot certonly --webroot -w /var/www/food.does.cool -d food.does.cool --non-interactive --agree-tos
```

3) Подключите финальный конфиг:

```powershell
scp "E:\\projects\\portfolio\\active\\deployment\\files\\nginx\\food.does.cool.conf" `
    misha@173.212.252.150:~/food.does.cool.conf
```

```bash
sudo rm -f /etc/nginx/sites-enabled/food.does.cool.http
sudo cp ~/food.does.cool.conf /etc/nginx/sites-available/food.does.cool
sudo ln -s /etc/nginx/sites-available/food.does.cool /etc/nginx/sites-enabled/food.does.cool 2>/dev/null || true
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5) Обновление версии приложения

```bash
cd ~/fdc
docker compose -f docker-compose.app.yml pull
docker compose -f docker-compose.app.yml up -d
```

---

## 6) Полезные команды и бэкап

```bash
# Список контейнеров
docker ps --filter name=fdc-

# Логи
docker logs -f fdc-app

# Рестарт приложения
docker compose -f docker-compose.app.yml up -d

# Бэкап SQLite БД (в текущую папку)
docker run --rm -v fdc-sqlite-data:/data -v "$PWD":/backup bash:5 bash -lc 'cp /data/meals.db /backup/meals.db.$(date +%F).bak'
```

Готово: после выполнения шагов приложение доступно по адресу https://food.does.cool/.
