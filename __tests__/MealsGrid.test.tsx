import { render, screen } from '@testing-library/react';
import MealsGrid from '../components/Meals/MealsGrid';
import { Meal } from '@/types/meals';
import '@testing-library/jest-dom';

// Mock the MealItem component
jest.mock('../components/Meals/MealItem/MealItem', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid={`meal-item-${props.id}`} {...props} />,
}));

describe('MealsGrid', () => {
  const mockMeals: Meal[] = [
    {
      id: '1',
      title: 'Meal 1',
      slug: 'meal-1',
      image: '/meal-1.jpg',
      summary: 'Summary for meal 1',
      creator: 'Creator 1',
    },
    {
      id: '2',
      title: 'Meal 2',
      slug: 'meal-2',
      image: '/meal-2.jpg',
      summary: 'Summary for meal 2',
      creator: 'Creator 2',
    },
    {
      id: '3',
      title: 'Meal 3',
      slug: 'meal-3',
      image: '/meal-3.jpg',
      summary: 'Summary for meal 3',
      creator: 'Creator 3',
    },
  ];

  it('renders a list of meal items', () => {
    render(<MealsGrid meals={mockMeals} />);
    
    // Check if the correct number of meal items are rendered
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockMeals.length);
    
    // Check if each meal item is rendered with the correct props
    mockMeals.forEach((meal) => {
      const mealItem = screen.getByTestId(`meal-item-${meal.id}`);
      expect(mealItem).toBeInTheDocument();
    });
  });

  it('renders an empty list when no meals are provided', () => {
    render(<MealsGrid meals={[]} />);
    
    // Check if no list items are rendered
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });
});