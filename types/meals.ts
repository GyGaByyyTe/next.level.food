/**
 * Type definitions for meal-related components
 */

/**
 * Represents a meal item with its properties
 */
export interface Meal {
  id: string;
  title: string;
  slug: string;
  image: string;
  summary: string;
  creator: string;
}

/**
 * Props for the MealItem component
 */
export type MealItemProps = Omit<Meal, 'id'>;

/**
 * Props for the MealsGrid component
 */
export interface MealsGridProps {
  meals: Meal[];
}