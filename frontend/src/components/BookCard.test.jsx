import { render, screen } from '@testing-library/react';
import BookCard from './BookCard';

test('рендерит заголовок книги', () => {
  render(<BookCard title="Мастер и Маргарита" />);
  expect(screen.getByText(/Мастер и Маргарита/)).toBeInTheDocument();
});
