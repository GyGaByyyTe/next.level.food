import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // или 'https' если вы настроили SSL для MinIO
        hostname: `${process.env.MINIO_ENDPOINT_HOST}`, // IP вашего VPS или домен, если настроен
        port: `${process.env.MINIO_ENDPOINT_PORT}`, // Порт, на котором MinIO отдает файлы
        pathname: `/${process.env.MINIO_BUCKET_NAME || 'meals'}/**`, // Путь к вашему бакету
      },
    ],
  },
};

export default nextConfig;
