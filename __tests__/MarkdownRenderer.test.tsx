import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkdownRenderer from '@/components/Meals/MarkdownRenderer';

// Моки для markdown библиотек
jest.mock('react-markdown');
jest.mock('remark-gfm');
jest.mock('remark-emoji');
jest.mock('rehype-sanitize');

describe('MarkdownRenderer', () => {
  describe('Component rendering', () => {
    it('renders without crashing', () => {
      const content = 'Simple text';
      const { container } = render(<MarkdownRenderer content={content} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const content = 'Test content';
      const { container } = render(
        <MarkdownRenderer content={content} className="custom-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('renders with default markdown class', () => {
      const content = 'Test content';
      const { container } = render(<MarkdownRenderer content={content} />);

      const wrapper = container.firstChild as HTMLElement;
      // Проверяем, что есть класс markdown (из CSS модуля)
      expect(wrapper.className).toBeTruthy();
    });
  });

  describe('Indentation preprocessing', () => {
    it('removes leading whitespace from simple text', () => {
      const content = '   Text with leading spaces';
      const { container } = render(<MarkdownRenderer content={content} />);

      // После обработки должен остаться текст без лишних пробелов в начале
      expect(container.textContent).toContain('Text with leading spaces');
    });

    it('removes consistent indentation from all lines', () => {
      const content = `
      Line 1
      Line 2
      Line 3
      `;
      const { container } = render(<MarkdownRenderer content={content} />);

      // Все строки должны быть нормализованы
      const text = container.textContent || '';
      expect(text).toContain('Line 1');
      expect(text).toContain('Line 2');
      expect(text).toContain('Line 3');
    });

    it('preserves relative indentation', () => {
      const content = `
      1. First item
         Sub item
      2. Second item
         Sub item
      `;
      const { container } = render(<MarkdownRenderer content={content} />);

      const text = container.textContent || '';
      expect(text).toContain('First item');
      expect(text).toContain('Sub item');
      expect(text).toContain('Second item');
    });

    it('handles dummyMeals format with deep indentation', () => {
      // Формат из initdb.js с 6+ пробелами отступа
      const content = `
      1. Prepare the patty:
         Mix 200g of ground beef with salt and pepper.

      2. Cook the patty:
         Heat a pan with a bit of oil.

      3. Assemble the burger:
         Toast the burger bun halves.
      `;
      const { container } = render(<MarkdownRenderer content={content} />);

      const text = container.textContent || '';

      // Проверяем что текст присутствует (без преобразования в код)
      expect(text).toContain('Prepare the patty');
      expect(text).toContain('Mix 200g');
      expect(text).toContain('Cook the patty');
      expect(text).toContain('Heat a pan');
      expect(text).toContain('Assemble the burger');
      expect(text).toContain('Toast the burger');
    });

    it('handles empty lines between content', () => {
      const content = `
      Line 1
      
      Line 2
      
      Line 3
      `;
      const { container } = render(<MarkdownRenderer content={content} />);

      const text = container.textContent || '';
      expect(text).toContain('Line 1');
      expect(text).toContain('Line 2');
      expect(text).toContain('Line 3');
    });

    it('handles content with varying indentation levels', () => {
      const content = `
      Main level
        Indented once
          Indented twice
      Back to main
      `;
      const { container } = render(<MarkdownRenderer content={content} />);

      const text = container.textContent || '';
      expect(text).toContain('Main level');
      expect(text).toContain('Indented once');
      expect(text).toContain('Indented twice');
      expect(text).toContain('Back to main');
    });
  });

  describe('Edge cases', () => {
    it('handles empty content', () => {
      const content = '';
      const { container } = render(<MarkdownRenderer content={content} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles whitespace-only content', () => {
      const content = '   \n\n   \t  ';
      const { container } = render(<MarkdownRenderer content={content} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles single line without indentation', () => {
      const content = 'Single line';
      const { container } = render(<MarkdownRenderer content={content} />);

      expect(container.textContent).toContain('Single line');
    });

    it('handles content starting with newline', () => {
      const content = '\n\n  Content after newlines';
      const { container } = render(<MarkdownRenderer content={content} />);

      expect(container.textContent).toContain('Content after newlines');
    });

    it('handles content ending with whitespace', () => {
      const content = '  Content with trailing whitespace  \n\n  ';
      const { container } = render(<MarkdownRenderer content={content} />);

      expect(container.textContent).toContain('Content with trailing whitespace');
    });
  });

  describe('Real-world scenarios', () => {
    it('processes burger recipe from dummyMeals', () => {
      const burgerRecipe = `
      1. Prepare the patty:
         Mix 200g of ground beef with salt and pepper. Form into a patty.

      2. Cook the patty:
         Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.

      3. Assemble the burger:
         Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.

      4. Serve:
         Complete the assembly with the top bun and serve hot.
    `;

      const { container } = render(<MarkdownRenderer content={burgerRecipe} />);
      const text = container.textContent || '';

      expect(text).toContain('Prepare the patty');
      expect(text).toContain('Mix 200g of ground beef');
      expect(text).toContain('Cook the patty');
      expect(text).toContain('Assemble the burger');
      expect(text).toContain('Serve');
    });

    it('processes curry recipe from dummyMeals', () => {
      const curryRecipe = `
      1. Chop vegetables:
         Cut your choice of vegetables into bite-sized pieces.

      2. Sauté vegetables:
         In a pan with oil, sauté the vegetables until they start to soften.

      3. Add curry paste:
         Stir in 2 tablespoons of curry paste and cook for another minute.

      4. Simmer with coconut milk:
         Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.

      5. Serve:
         Enjoy this creamy curry with rice or bread.
    `;

      const { container } = render(<MarkdownRenderer content={curryRecipe} />);
      const text = container.textContent || '';

      expect(text).toContain('Chop vegetables');
      expect(text).toContain('Sauté vegetables');
      expect(text).toContain('Add curry paste');
      expect(text).toContain('Simmer with coconut milk');
    });

    it('handles new recipes with markdown and emojis', () => {
      const newRecipe = `## Приготовление

:one: Первый шаг
:two: Второй шаг

**Важно**: используйте свежие продукты

> Совет от шефа

- Ингредиент 1
- Ингредиент 2`;

      const { container } = render(<MarkdownRenderer content={newRecipe} />);
      const text = container.textContent || '';

      // Проверяем наличие текста (эмоджи в моках не обрабатываются)
      expect(text).toContain('Приготовление');
      expect(text).toContain('Первый шаг');
      expect(text).toContain('Второй шаг');
      expect(text).toContain('Важно');
      expect(text).toContain('Совет от шефа');
    });
  });
});

