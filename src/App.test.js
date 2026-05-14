import { render, screen } from '@testing-library/react';
import App from './App';

test('renders public form heading', () => {
  render(<App />);
  expect(screen.getByText(/submit feedback \/ complaint/i)).toBeInTheDocument();
});


