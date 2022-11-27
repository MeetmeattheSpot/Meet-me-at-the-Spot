import React from 'React';
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react';

import App from '../client/src/components/App.jsx';

describe('App', () => {
  test('renders App component', () => {
    render(<App />);
    screen.debug();
  });
});