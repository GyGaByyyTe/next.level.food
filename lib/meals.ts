import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { CreateMealDto, Meal } from '@/types/meals';

const db = sql('meals.db');

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return db.prepare('SELECT * FROM meals').all() as Meal[];
}

export async function getMeal(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
  const fileName = `${slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await (meal.image as File).arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Error writing image to file');
    }
  });

  sanitizedMeal.image = `/images/${fileName}`;

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
