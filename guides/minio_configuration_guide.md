### Часть 1: Запуск MinIO на VPS

MinIO — это высокопроизводительное объектное хранилище, совместимое с Amazon S3 API. Вот общая инструкция по его установке и запуску на VPS с операционной системой Linux:

1. **Подключитесь к вашему VPS по SSH.**

2. **Скачайте MinIO Server:** Вы можете найти последнюю версию для Linux на официальном сайте MinIO. Обычно это делается с помощью `wget` или `curl`.

```bash
    wget https://dl.min.io/server/minio/release/linux-amd64/minio
    chmod +x minio
    sudo mv minio /usr/local/bin/
```

3. **Создайте каталог для данных MinIO:** MinIO будет хранить все загруженные файлы в этом каталоге.

```bash
    sudo mkdir /mnt/data # Или любой другой путь на ваш выбор
```

4. **Запустите MinIO Server:** Для первого запуска и настройки удобно запустить его в консоли. Позже вы захотите настроить его как системный сервис (например, через systemd).
   Задайте свои `MINIO_ROOT_USER` (логин администратора) и `MINIO_ROOT_PASSWORD` (пароль администратора). **Обязательно используйте надежные и уникальные значения!**

```bash
    export MINIO_ROOT_USER=YOUR_MINIO_ACCESS_KEY
    export MINIO_ROOT_PASSWORD=YOUR_MINIO_SECRET_KEY
    minio server /mnt/data --console-address ":9001"
```

- `YOUR_MINIO_ACCESS_KEY`: Замените на ваш желаемый ключ доступа.
- `YOUR_MINIO_SECRET_KEY`: Замените на ваш желаемый секретный ключ.
- `/mnt/data`: Путь к каталогу, где MinIO будет хранить данные.
- `--console-address ":9001"`: Запускает веб-консоль MinIO на порту 9001. Сам сервер S3 API будет доступен на порту 9000 по умолчанию.

5. **Проверьте доступ к MinIO:**

   - **S3 API:** Должен быть доступен по адресу `http://YOUR_VPS_IP:9000`.
   - **Веб-консоль:** Должна быть доступна по адресу `http://YOUR_VPS_IP:9001`. Откройте этот адрес в браузере и войдите, используя `MINIO_ROOT_USER` и `MINIO_ROOT_PASSWORD`, которые вы задали.

6. **Настройте Firewall:** Убедитесь, что порты 9000 и 9001 (или те, которые вы настроили) открыты в вашем firewall (например, `ufw` или `iptables`).
   Для `ufw`:

```shell
    sudo ufw allow 9000/tcp
    sudo ufw allow 9001/tcp
    sudo ufw reload
```

7. Создайте Bucket: Через веб-консоль MinIO ( http://YOUR_VPS_IP:9001 ) создайте новый "bucket" (корзину). Это контейнер, в котором будут храниться ваши файлы. Например, назовите его `meals`. 
    Вы также можете установить политику доступа для бакета (например, сделать его публичным для чтения, если это необходимо для ваших изображений).

8. **(Рекомендуется) Настройте MinIO как системный сервис:** Чтобы MinIO запускался автоматически при старте сервера и работал в фоновом режиме, создайте для него systemd-юнит.
   Создайте файл `/etc/systemd/system/minio.service`:

```shell
    [Unit]
    Description=MinIO
    Documentation=https://docs.min.io
    Wants=network-online.target
    After=network-online.target
    AssertFileIsExecutable=/usr/local/bin/minio

    [Service]
    Type=notify
    WorkingDirectory=/usr/local/
    User=minio-user # Рекомендуется создать отдельного пользователя
    Group=minio-user # Рекомендуется создать отдельную группу
    EnvironmentFile=-/etc/default/minio
    ExecStartPre=/bin/bash -c "if [ -z \"${MINIO_VOLUMES}\" ]; then echo \"Variable MINIO_VOLUMES not set in /etc/default/minio\"; exit 1; fi"
    ExecStart=/usr/local/bin/minio server $MINIO_OPTS $MINIO_VOLUMES
    Restart=always
    LimitNOFILE=65536
    TimeoutStopSec=infinity
    SendSIGKILL=no

    [Install]
    WantedBy=multi-user.target
```

9. Создайте пользователя и группу `minio-user` (если их нет):

```shell
   sudo groupadd -r minio-user
   sudo useradd -r -g minio-user -s /sbin/nologin \
   -d /usr/local/share/minio minio-user
```

10. Создайте файл конфигурации `/etc/default/minio`:

```shell
    MINIO_VOLUMES="/mnt/data/" # Путь к вашим данным
    MINIO_OPTS="--console-address :9001"
    MINIO_ROOT_USER=YOUR_MINIO_ACCESS_KEY
    MINIO_ROOT_PASSWORD=YOUR_MINIO_SECRET_KEY
```

**Не забудьте заменить `YOUR_MINIO_ACCESS_KEY` и `YOUR_MINIO_SECRET_KEY`!**

11. Установите права на каталоги:

```shell
    sudo chown minio-user:minio-user /mnt/data # Или ваш каталог данных
    sudo chown minio-user:minio-user /usr/local/bin/minio # Если нужно
```

12. Перезагрузите демоны systemd, включите и запустите сервис:

```shell
    sudo systemctl daemon-reload
    sudo systemctl enable minio
    sudo systemctl start minio
    sudo systemctl status minio # Проверить статус
```

13. **(Опционально, но рекомендуется) Настройте HTTPS:** Для безопасности настоятельно рекомендуется настроить HTTPS для MinIO, особенно если он доступен из интернета. Вы можете использовать обратный прокси (например, Nginx или Caddy) с Let's Encrypt для получения бесплатного SSL-сертификата.




### Часть 2: Интеграция MinIO с Next.js
Теперь, когда у вас есть работающий экземпляр MinIO, давайте интегрируем его в ваш проект Next.js. Вы будете использовать AWS SDK для JavaScript, так как MinIO совместим с S3 API.
1. **Установите AWS SDK:** В вашем проекте Next.js выполните:
``` bash
    npm install @aws-sdk/client-s3
```
или
``` bash
    yarn add @aws-sdk/client-s3
```
2. **Настройте клиент S3:** Создайте файл (например, `lib/minio.ts` или `lib/s3Client.ts`) для инициализации клиента S3.
```typescript
    import { S3Client } from '@aws-sdk/client-s3';

    const acessoMinioChave = process.env.MINIO_ACCESS_KEY;
    const segredoMinioChave = process.env.MINIO_SECRET_KEY;
    const minioPontoFinal = process.env.MINIO_ENDPOINT; // Например, 'http://YOUR_VPS_IP:9000'
    const minioRegiao = process.env.MINIO_REGION || 'us-east-1'; // MinIO обычно не требует конкретного региона, но SDK может его ожидать

    if (!acessoMinioChave || !segredoMinioChave || !minioPontoFinal) {
      throw new Error('As credenciais do MinIO ou o endpoint não estão configurados nas variáveis de ambiente.');
    }

    export const s3Client = new S3Client({
      endpoint: minioPontoFinal,
      region: minioRegiao,
      credentials: {
        accessKeyId: acessoMinioChave,
        secretAccessKey: segredoMinioChave,
      },
      forcePathStyle: true, // Обязательно для MinIO
    });

    export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'nextjs-uploads'; // Имя вашего бакета
```

3.  **Добавьте переменные окружения:**
    Создайте файл `.env.local` в корне вашего проекта Next.js и добавьте в него учетные данные MinIO:
```plaintext
    MINIO_ACCESS_KEY=YOUR_MINIO_ACCESS_KEY
    MINIO_SECRET_KEY=YOUR_MINIO_SECRET_KEY
    MINIO_ENDPOINT=http://YOUR_VPS_IP:9000
    MINIO_BUCKET_NAME=nextjs-uploads # Имя вашего бакета
    # MINIO_REGION=us-east-1 # Если нужно
   ```
*   Замените `YOUR_MINIO_ACCESS_KEY`, `YOUR_MINIO_SECRET_KEY`, `http://YOUR_VPS_IP:9000` и `nextjs-uploads` на ваши актуальные значения.
*   **ВАЖНО:** Добавьте `.env.local` в ваш `.gitignore`, чтобы не коммитить секретные ключи в репозиторий.

4.  **Обновите вашу функцию `saveMeal` для загрузки изображений в MinIO:**
    Вам нужно будет изменить `actions.ts` (или где у вас находится `saveMeal`), чтобы загружать файл изображения в MinIO, а затем сохранять URL изображения или ключ объекта в вашей базе данных.
```typescript
    import { PutObjectCommand } from '@aws-sdk/client-s3';
    import { s3Client, BUCKET_NAME } from './minio'; // Предполагается, что minio.ts в той же директории
    import sql from 'better-sqlite3';
    import slugify from 'slugify';
    import xss from 'xss';
    import { CreateMealDto, Meal } from '@/types/meals'; // Убедитесь, что типы корректны

    const db = sql('meals.db');

    // ... (другие функции, если есть, например getMeal, getMeals)

    export async function saveMeal(meal: CreateMealDto) {
      if (!meal.image || meal.image.size === 0) {
        throw new Error('Image is required');
      }

      const extension = meal.image.name.split('.').pop();
      const fileName = `${slugify(meal.title, { lower: true })}-${Date.now()}.${extension}`;

      // Загрузка в MinIO
      const bufferedImage = await meal.image.arrayBuffer();

      try {
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName, // Имя файла в бакете
          Body: Buffer.from(bufferedImage),
          ContentType: meal.image.type,
          ACL: 'public-read', // Если хотите, чтобы файлы были доступны публично по URL
        });
        await s3Client.send(command);
      } catch (error) {
        console.error('Error uploading to MinIO:', error);
        throw new Error('Failed to save image to MinIO.');
      }

      // URL для доступа к файлу. Зависит от вашей конфигурации MinIO и домена.
      // Если MinIO за прокси и настроен домен, URL будет другим.
      // Для прямого доступа: process.env.MINIO_ENDPOINT/BUCKET_NAME/fileName
      // Убедитесь, что MINIO_ENDPOINT в .env.local не содержит / в конце
      const imageUrl = `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${fileName}`;

      meal.slug = slugify(meal.title, { lower: true });
      meal.instructions = xss(meal.instructions);

      // Сохраняем imageUrl вместо объекта File в базу данных
      // Вам нужно будет адаптировать вашу схему БД, чтобы поле image хранило строку (URL)
      db.prepare(
        `
        INSERT INTO meals
          (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
          @title,
          @summary,
          @instructions,
          @creator,
          @creator_email,
          @image,
          @slug
        )
      `,
      ).run({
        ...meal,
        image: imageUrl, // Сохраняем URL
      });
    }

    // Функция getMeal должна теперь ожидать, что meal.image это строка (URL)
    export async function getMeal(slug: string): Promise<Meal | null> {
      const meal = db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug) as Meal;
      // Если meal.image это ключ объекта, а не полный URL, вам нужно будет его здесь сконструировать
      // Например: if (meal) meal.image = `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${meal.imageKey}`;
      return meal;
    }

    // ... (другие функции)
```
 **Важные изменения в `saveMeal`:**
 *   Изображение загружается в MinIO с помощью `PutObjectCommand`.
 *   `ACL: 'public-read'` делает загруженный файл публично доступным по URL. Если вам не нужна публичная доступность, вы можете опустить это или настроить по-другому, но тогда вам понадобятся подписанные URL (presigned URLs) для доступа к изображениям.
 *   В базу данных теперь сохраняется `imageUrl` (полный URL до файла в MinIO), а не сам объект файла. **Вам нужно будет изменить схему вашей базы данных, чтобы поле `image` в таблице `meals` было текстовым и хранило этот URL.**
 *   Имя файла (`fileName`) генерируется уникальным образом, чтобы избежать коллизий.

5.  **Обновление `actions.ts`:**
    Функция `shareMealHandler` в `actions.ts` уже принимает `FormData`, что хорошо. Основные изменения будут в `saveMeal`, как показано выше. Убедитесь, что `saveMeal` вызывается корректно.
```typescript
    'use server';
    import { revalidatePath } from 'next/cache';
    import { redirect } from 'next/navigation';
    import { CreateMealDto, FormState } from '@/types/meals';
    import { saveMeal } from '@/lib/meals'; // Убедитесь, что путь к saveMeal верный

    const isInvalidText = (text: string) => {
      return !text || text.trim() === ''; // Добавил проверку на null/undefined
    };

    export const shareMealHandler = async (
      // prevState: FormState, // prevState может понадобиться для более сложных форм с useFormState
      _prevState: unknown, // Если не используется, можно так
      formData: FormData,
    ): Promise<FormState> => { // Убедитесь, что возвращаемый тип соответствует ожиданиям useFormState
      const meal: CreateMealDto = {
        title: (formData.get('title') as string) || '',
        summary: (formData.get('summary') as string) || '',
        instructions: (formData.get('instructions') as string) || '',
        image: formData.get('image') as File, // Оставляем как File, saveMeal обработает
        creator: (formData.get('name') as string) || '',
        creator_email: (formData.get('email') as string) || '',
        // slug не нужен здесь, он генерируется в saveMeal
      };

      if (
        isInvalidText(meal.title) ||
        isInvalidText(meal.summary) ||
        isInvalidText(meal.instructions) ||
        isInvalidText(meal.creator) ||
        isInvalidText(meal.creator_email) ||
        !meal.creator_email.includes('@') ||
        !meal.image || meal.image.size === 0
      ) {
        return {
          // meal, // Возвращать объект meal может быть небезопасно, если там есть File
          error: 'Invalid meal information',
          message: 'Please check your input and try again.',
        };
      }

      try {
        await saveMeal(meal); // saveMeal теперь асинхронная и может выбросить исключение
      } catch (error) {
        console.error("Error in shareMealHandler calling saveMeal:", error);
        let errorMessage = 'Failed to save meal.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        return {
          error: 'Save Operation Failed',
          message: errorMessage,
        };
      }

      revalidatePath('/meals'); // Перепроверка путей, где отображаются блюда
      revalidatePath('/meals/[slug]', 'page'); // Если у вас есть детальные страницы
      redirect('/meals');

      // Если redirect срабатывает, этот return не будет достигнут,
      // но для согласованности типов можно вернуть успешное состояние
      // return { message: 'Meal shared successfully!' };
    };
```

6.  **Отображение изображений в компоненте `MealDetailsPage` (`page.tsx`):**
    Ваш компонент `MealDetailsPage` уже использует `next/image` и ожидает `meal.image` как строку URL. Если `saveMeal` и `getMeal` правильно сохраняют и извлекают URL из MinIO, здесь больших изменений не потребуется.
```typescript jsx
    import * as React from 'react';
    import Image from 'next/image';
    import cl from './page.module.css';
    import { getMeal } from '@/lib/meals'; // Убедитесь, что путь верный
    import { notFound } from 'next/navigation';
    import { Metadata } from 'next'; // Для динамических метаданных

    // Тип для параметров страницы, если используете TypeScript
    interface MealDetailsPageProps {
      params: { slug: string };
    }

    // Для генерации динамических метаданных (например, заголовка страницы)
    export async function generateMetadata({ params }: MealDetailsPageProps): Promise<Metadata> {
      const meal = await getMeal(params.slug);
      if (!meal) {
        notFound();
      }
      return {
        title: meal.title,
        description: meal.summary,
      };
    }

    export default async function MealDetailsPage({ params }: MealDetailsPageProps) {
      const meal = await getMeal(params.slug);

      if (!meal) {
        notFound(); // Эта функция должна вызываться, если блюдо не найдено
      }

      // Предполагается, что meal.instructions это строка с HTML-тегами <br />
      // Если нет, то замена \n на <br /> должна быть здесь или в getMeal
      // const formattedInstructions = meal.instructions.replace(/\n/g, '<br />');

      return (
        <>
          <header className={cl.header}>
            <div className={cl.image}>
              {/* meal.image теперь должен быть URL из MinIO */}
              <Image fill src={meal.image as string} alt={meal.title} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
            <div className={cl.headerText}>
              <h1>{meal.title}</h1>
              <p className={cl.creator}>
                by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
              </p>
              <p className={cl.summary}>{meal.summary}</p>
            </div>
          </header>
          <main>
            <p
              className={cl.instructions}
              dangerouslySetInnerHTML={{ __html: meal.instructions /* или formattedInstructions */ }}
            />
          </main>
        </>
      );
    }
```

7.  **Настройка `next.config.js` для `next/image`:**
    Чтобы `next/image` мог оптимизировать изображения с вашего MinIO сервера, вам нужно добавить его домен (или IP-адрес) в конфигурацию Next.js.

```javascript
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      images: {
        remotePatterns: [
          {
            protocol: 'http', // или 'https' если вы настроили SSL для MinIO
            hostname: 'YOUR_VPS_IP', // IP вашего VPS или домен, если настроен
            port: '9000', // Порт, на котором MinIO отдает файлы
            pathname: `/${process.env.MINIO_BUCKET_NAME || 'nextjs-uploads'}/**`, // Путь к вашему бакету
          },
        ],
      },
    };

    export default nextConfig;
```
 *   Замените `YOUR_VPS_IP` на IP-адрес вашего VPS.
 *   Если вы настроили MinIO за обратным прокси с SSL на стандартном порту 443, то `protocol` будет `https`, а `port` можно будет опустить. `hostname` будет вашим доменом. `pathname` должен соответствовать структуре URL ваших файлов в MinIO.

### Важные соображения:

*   **Безопасность:** Убедитесь, что ваши ключи MinIO (`MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`) надежны и хранятся в секрете. Не коммитьте их в Git. Используйте переменные окружения. Настройте HTTPS для MinIO.
*   **Политики доступа к бакетам:** В MinIO вы можете детально настраивать политики доступа к бакетам и объектам. Если изображения должны быть публично доступны, установите соответствующую политику (например, `public-read` для объектов или политику на уровне бакета). Если нет, вам понадобятся "presigned URLs" для временного доступа.
*   **Резервное копирование:** Не забывайте регулярно делать резервные копии данных вашего MinIO сервера (`/mnt/data` или указанный вами каталог).
*   **База данных:** Убедитесь, что ваша таблица `meals` в базе данных (например, `meals.db` для `better-sqlite3`) имеет поле `image` типа `TEXT` или `VARCHAR` для хранения URL изображения.
*   **Ошибки и логирование:** Добавьте более детальное логирование ошибок при загрузке в MinIO и при работе с базой данных для облегчения отладки.


### Trouble: Разрешение загрузки изображений из бакета MinIO с помощью `mc`:
**1. Проверка установки и установка `mc` (если необходимо):**
Вы можете скачать `mc` с официального сайта MinIO.
- **Для Linux (на вашем VPS):** Подключитесь к вашему VPS по SSH и выполните следующие команды:
``` bash
    wget https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc
    sudo mv mc /usr/local/bin/mc
```
Эти команды:
1.  Скачивают исполняемый файл `mc` для 64-битных систем Linux.
2.  Делают его исполняемым (`chmod +x mc`).
3.  Перемещают его в `/usr/local/bin/`, который обычно находится в системном `PATH`.
- **После установки, проверьте, работает ли команда:** Откройте новую сессию SSH (или выполните `source ~/.bashrc` или `exec bash` чтобы обновить в текущей сессии, хотя после перемещения в `/usr/local/bin/` это обычно не требуется) и попробуйте: `PATH`
``` bash
    mc --help
```
Если вы видите справку по `mc`, значит, он установлен и доступен.


**2. Настройка `mc` для работы с вашим MinIO сервером (если еще не сделали):**
После того как `mc` установлен, вам нужно настроить "псевдоним" (alias) для вашего MinIO сервера. Это позволит вам легко обращаться к нему.
``` bash
mc alias set myminio http://YOUR_VPS_IP:9000 YOUR_MINIO_ACCESS_KEY YOUR_MINIO_SECRET_KEY
```
Замените:
- `myminio` на любое имя, которое вам удобно (это просто псевдоним).
- `http://YOUR_VPS_IP:9000` на URL вашего MinIO сервера (IP-адрес или домен и порт API, обычно 9000).
- `YOUR_MINIO_ACCESS_KEY` на ваш MinIO Root User.
- `YOUR_MINIO_SECRET_KEY` на ваш MinIO Root Password.

**Пример:** Если ваш VPS IP `12.34.56.78`, ключ доступа `minioadmin` и секретный ключ `minioadminpassword`, команда будет:
``` bash
mc alias set myminio http://12.34.56.78:9000 minioadmin minioadminpassword
```
`mc` сообщит об успешном добавлении псевдонима.


**3. Установка политики доступа для бакета с помощью `mc`:**
Теперь, когда `mc` установлен и настроен, вы можете установить политику публичного чтения для вашего бакета.
``` bash
mc policy set download myminio/YOUR_BUCKET_NAME
```
Замените `myminio` на имя псевдонима, которое вы задали, и `YOUR_BUCKET_NAME` на имя вашего бакета (например, `nextjs-uploads`).
Эта команда устанавливает политику "download", которая позволяет всем пользователям скачивать (читать) объекты из указанного бакета.
**Пример:**
``` bash
mc policy set download myminio/nextjs-uploads
```
Вы должны увидеть сообщение типа: `Access permission for 'myminio/nextjs-uploads' is set to 'download'`
**После этого:**
- Попробуйте снова открыть изображение по прямой ссылке в браузере. URL должен быть вида: `http://YOUR_VPS_IP:9000/YOUR_BUCKET_NAME/имя_файла.расширение`

