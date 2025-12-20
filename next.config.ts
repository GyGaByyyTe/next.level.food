import type { NextConfig } from 'next';

// Безопасные значения по умолчанию на случай отсутствия переменных окружения на этапе сборки
const PROTOCOL = process.env.MINIO_ENDPOINT_PROTOCOL || 'http';
const HOSTNAME = process.env.MINIO_ENDPOINT_HOST || '173.212.252.150';
// Порт 9000 — стандартный для MinIO API; явно укажем его, чтобы Next разрешал URL вида :9000
const PORT = process.env.MINIO_ENDPOINT_PORT || '9000';
const BUCKET = process.env.MINIO_BUCKET_NAME || 'meals';

const pattern: any = {
  protocol: PROTOCOL,
  hostname: HOSTNAME,
  port: String(PORT),
  pathname: `/${BUCKET}/**`,
};

const nextConfig: NextConfig = {
  images: {
    // Отключаем оптимизацию картинок через /_next/image — используем прямые URL из MinIO
    // Это полностью уберёт ошибку "url parameter is not allowed"
    unoptimized: true,
    // Разрешаем оптимизацию картинок с MinIO по IP и нестандартному порту 9000
    remotePatterns: [pattern],
    // На случай, если remotePatterns по какой-то причине не сработает — продублируем домен
    domains: [HOSTNAME],
  },
};

export default nextConfig;
