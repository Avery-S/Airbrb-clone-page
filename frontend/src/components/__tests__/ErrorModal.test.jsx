import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorModal from '../ErrorModal';

describe('ErrorModal Component', () => {
  it('renders the modal with the correct error message', () => {
    const errorMessage = 'Something went wrong!';
    render(<ErrorModal msg={errorMessage} show={true} onHide={() => {}} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onHide when the close button is clicked', () => {
    const onHideMock = jest.fn();
    render(<ErrorModal msg="Error message" show={true} onHide={onHideMock} />);

    // Simulate clicking the close button
    fireEvent.click(screen.getByText('Close'));

    expect(onHideMock).toHaveBeenCalledTimes(1);
  });
});
