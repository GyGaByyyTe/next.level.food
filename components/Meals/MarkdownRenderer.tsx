'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeSanitize from 'rehype-sanitize';
import cl from './MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Предобработка текста для корректного отображения Markdown
 * Убирает лишние отступы, которые могут интерпретироваться как блоки кода
 */
function preprocessMarkdown(text: string): string {
  // Удаляем начальные и конечные пробелы
  let processed = text.trim();

  // Находим минимальный отступ (количество пробелов в начале непустых строк)
  const lines = processed.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);

  if (nonEmptyLines.length === 0) return processed;

  const minIndent = Math.min(
    ...nonEmptyLines.map(line => {
      const match = line.match(/^(\s*)/);
      return match ? match[1].length : 0;
    })
  );

  // Убираем минимальный отступ из всех строк
  if (minIndent > 0) {
    processed = lines
      .map(line => {
        // Для пустых строк оставляем как есть
        if (line.trim().length === 0) return '';
        // Для непустых - убираем минимальный отступ
        return line.slice(minIndent);
      })
      .join('\n');
  }

  return processed;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processedContent = preprocessMarkdown(content);

  return (
    <div className={`${cl.markdown} ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkEmoji]}
        rehypePlugins={[rehypeSanitize]}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

