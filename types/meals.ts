/**
 * Type definitions for meal-related components
 */

/**
 * Represents a meal item with its properties
 */
export interface Meal {
  id: string;
  slug: string;
  title: string;
  image: string;
  summary: string;
  instructions: string;
  creator: string;
  creator_email: string;
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
