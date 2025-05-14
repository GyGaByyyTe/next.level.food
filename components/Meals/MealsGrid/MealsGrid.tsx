import MealItem from '@/components/Meals/MealItem';
import { MealsGridProps } from '@/types/meals';
import classes from './MealsGrid.module.css';

export default function MealsGrid({ meals }: MealsGridProps) {
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
