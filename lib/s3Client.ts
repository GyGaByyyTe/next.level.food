import { S3Client } from '@aws-sdk/client-s3';

// Делает инициализацию "мягкой": не бросает исключение при импорте, чтобы Docker build не падал.
// Реальные значения считываются из переменных окружения в рантайме контейнера.
const ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
const SECRET_KEY = process.env.MINIO_SECRET_KEY;
const PROTOCOL = process.env.MINIO_ENDPOINT_PROTOCOL || 'http';
const HOST = process.env.MINIO_ENDPOINT_HOST; // без дефолта — чтобы не подключаться по ошибочному адресу
const PORT = process.env.MINIO_ENDPOINT_PORT; // без дефолта — чтобы не подключаться по ошибочному адресу
const REGION = process.env.MINIO_REGION || 'us-east-1';

const ENDPOINT = HOST ? `${PROTOCOL}://${HOST}${PORT ? `:${PORT}` : ''}` : undefined;

export const s3Client = new S3Client({
  // Плейсхолдер для этапа сборки; в рантайме переменные будут заданы через docker-compose
  endpoint: ENDPOINT || 'http://127.0.0.1:9000',
  region: REGION,
  // Если ключи не заданы на этапе сборки — оставим провайдер по умолчанию (будет ошибка только при реальном использовании)
  credentials:
    ACCESS_KEY && SECRET_KEY
      ? {
          accessKeyId: ACCESS_KEY,
          secretAccessKey: SECRET_KEY,
        }
      : undefined,
  forcePathStyle: true, // Обязательно для MinIO
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'meals';
