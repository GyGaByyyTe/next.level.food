import MealItem from '@/components/Meals/MealItem';
import classes from './MealsGrid.module.css';

export default function MealsGrid({
  meals,
}: {
  meals: Array<{
    id: string;
    title: string;
    slug: string;
    image: string;
    summary: string;
    creator: string;
  }>;
}) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
