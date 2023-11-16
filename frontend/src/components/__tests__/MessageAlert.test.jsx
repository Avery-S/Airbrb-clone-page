import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageAlert from '../MessageAlert';

describe('MessageAlert Component', () => {
  it('renders an alert with the correct content and variant', () => {
    const message = 'Test Message';
    const variant = 'success';
    render(<MessageAlert msgContent={message} msgType={variant} />);

    // check if the alert is rendered with expected values
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(message);
    expect(alert).toHaveClass(`alert-${variant}`);
  });

  it('dismisses the alert when the close button is clicked', () => {
    const message = 'Test Message';
    const variant = 'success';
    render(<MessageAlert msgContent={message} msgType={variant} />);

    // Check if the close button works
    fireEvent.click(screen.getByRole('button'));

    const alert = screen.queryByRole('alert');
    expect(alert).not.toBeInTheDocument();
  });
});
