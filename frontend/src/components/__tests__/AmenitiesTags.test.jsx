import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AmenitiesTags from '../AmenitiesTags';

describe('AmenitiesTags Component', () => {
  it('allows the user to select amenities', () => {
    const onChangeMock = jest.fn();
    const { getByRole } = render(
        <AmenitiesTags selectedAmenities={[]} onChange={onChangeMock} />
    );

    const autocomplete = getByRole('combobox');
    fireEvent.mouseDown(autocomplete);

    const listbox = within(getByRole('listbox'));
    fireEvent.click(listbox.getByText('Free WI-FI'));

    expect(onChangeMock).toHaveBeenCalledWith(['Free WI-FI']);
  });

  it('displays selected amenities', () => {
    const selectedAmenities = ['Car Parking', 'Fitness center'];
    const { getByText } = render(
        <AmenitiesTags selectedAmenities={selectedAmenities} onChange={() => {}} />
    );

    selectedAmenities.forEach(amenity => {
      expect(getByText(amenity)).toBeInTheDocument();
    });
  });
});
