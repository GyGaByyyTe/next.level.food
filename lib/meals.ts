import fs from 'node:fs';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '@/lib/s3Client';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { CreateMealDto, Meal } from '@/types/meals';

const db = sql('meals.db');

export async function getMeals() {
  return db.prepare('SELECT * FROM meals').all() as Meal[];
}

export async function getMeal(slug: string) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug) as Meal;
}

export async function saveMeal(meal: CreateMealDto) {
  const slug = slugify(meal.title, { lower: true });
  const sanitizedMeal = {
    ...meal,
    title: xss(meal.title),
    summary: xss(meal.summary),
    instructions: xss(meal.instructions),
    image: meal.image,
    slug,
  };

  const extension = (meal.image as File).name.split('.').pop();
  const fileName = `${slug}-${Date.now()}.${extension}`;

  const bufferedImage = await (meal.image as File).arrayBuffer();

  if (process.env.NODE_ENV !== 'production') {
    const stream = fs.createWriteStream(`public/images/${fileName}`);
    stream.write(Buffer.from(bufferedImage), (error) => {
      if (error) {
        throw new Error('Error writing image to file');
      }
    });

    sanitizedMeal.image = `/images/${fileName}`;
  } else {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: (meal.image as File).type,
        ACL: 'public-read',
      });
      await s3Client.send(command);
    } catch (error) {
      console.error('Error uploading to MinIO:', error);
      throw new Error('Failed to save image to MinIO.');
    }

    // Формируем публичный HTTPS-URL через nginx-прокси, чтобы избежать mixed content
    // Можно переопределить через переменную окружения MINIO_PUBLIC_BASE_URL
    const publicBase =
      process.env.MINIO_PUBLIC_BASE_URL || 'https://food.does.cool/minio';
    sanitizedMeal.image = `${publicBase}/${BUCKET_NAME}/${fileName}`;
  }

  db.prepare(
    `
    INSERT INTO meals 
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES 
      (
       @title, 
       @summary, 
       @instructions, 
       @creator, 
       @creator_email,
       @image, 
       @slug
      )
  `,
  ).run(sanitizedMeal);
}
