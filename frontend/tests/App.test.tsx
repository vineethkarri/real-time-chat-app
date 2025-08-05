import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

test('renders sign-in button initially', () => {
  render(<App />);
  expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
});