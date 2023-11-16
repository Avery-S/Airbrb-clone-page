import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RangeSlider from '../RangeSlider'; // Adjust the import path as necessary

describe('RangeSlider', () => {
  test('it renders and can change values', () => {
    const setValueMock = jest.fn();
    const rangeValue = [10, 20];
    const min = 0;
    const max = 100;

    render(
      <RangeSlider
        value={rangeValue}
        setValue={setValueMock}
        min={min}
        max={max}
      />
    );

    // Check if the sliders are rendered
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(2);

    fireEvent.change(sliders[0], { target: { value: '5' } });
    expect(setValueMock).toHaveBeenCalledWith([5, 20]);
    fireEvent.change(sliders[1], { target: { value: '25' } });
    expect(setValueMock).toHaveBeenCalledWith([10, 25]);
  });
});
