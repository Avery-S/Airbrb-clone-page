import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewSortToggle from '../ReviewSortToggle';

describe('ReviewSortToggle', () => {
  test('it renders and can change the sort order', () => {
    const setReviewSortMock = jest.fn();
    const reviewSortValue = 'Alphabetical';

    render(
      <ReviewSortToggle
        reviewSort={reviewSortValue}
        setReviewSort={setReviewSortMock}
      />
    );

    // Check if the toggle buttons are rendered
    const alphabeticalButton = screen.getByRole('button', { name: 'Alphabetical' });
    const ascendingButton = screen.getByRole('button', { name: 'Ascending' });
    const descendingButton = screen.getByRole('button', { name: 'Descending' });

    expect(alphabeticalButton).toBeInTheDocument();
    expect(ascendingButton).toBeInTheDocument();
    expect(descendingButton).toBeInTheDocument();

    // Check if the setReviewSort function was called with the new value
    fireEvent.click(ascendingButton);
    expect(setReviewSortMock).toHaveBeenCalledWith('Ascending');

    fireEvent.click(descendingButton);
    expect(setReviewSortMock).toHaveBeenCalledWith('Descending');
  });
});
