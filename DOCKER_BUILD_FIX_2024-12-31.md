# Решение проблемы сборки Docker-образа (31.12.2024)

## Проблема
При сборке Docker-образа возникала ошибка:
```
Error: Could not locate the bindings file. Tried:
 → /app/node_modules/.pnpm/better-sqlite3@12.5.0/node_modules/better-sqlite3/build/better_sqlite3.node
```

## Причина
1. Проект был переведен с `npm` на `pnpm`
2. `pnpm install --frozen-lockfile` не запускал build scripts для нативного модуля `better-sqlite3`
3. Файл `.npmrc` содержал Windows-специфичную настройку `msvs_version=2019`, которая не работает в Linux-контейнере

## Решение

### 1. Создан `.npmrc.docker` без Windows-специфичных настроек
```
enable-pre-post-scripts=true
shamefully-hoist=true
```

### 2. Dockerfile обновлен для использования pnpm
- Установка pnpm через `npm install -g pnpm@latest`
- Копирование `.npmrc.docker` как `.npmrc` в контейнере
- Использование `pnpm install --frozen-lockfile` вместо `npm ci`

### 3. Добавлена явная пересборка better-sqlite3
После установки зависимостей добавлен шаг:
```dockerfile
RUN cd node_modules/.pnpm/better-sqlite3@12.5.0/node_modules/better-sqlite3 && \
    npm run build-release
```

### 4. Runtime stage также использует pnpm
- Установка pnpm в runtime-образе
- Использование `pnpm run start` вместо `npm run start`

## Результат
✅ Образ успешно собирается
✅ Размер образа: 749MB
✅ Все нативные модули корректно скомпилированы для Linux

## Команды для сборки
```bash
cd E:\projects\portfolio\active\food.does.cool
docker build -t gygabyyyte/food-does-cool:latest -f Dockerfile .
docker push gygabyyyte/food-does-cool:latest
```

