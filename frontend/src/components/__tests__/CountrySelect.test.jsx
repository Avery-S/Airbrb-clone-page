import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountrySelect, { countries } from '../CountrySelect';

describe('CountrySelect', () => {
  test('it renders with null as value', () => {
    const onChangeMock = jest.fn();

    render(
      <CountrySelect onChange={onChangeMock} />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  })

  test('it renders and can change the selection', async () => {
    const onChangeMock = jest.fn();
    const value = countries.find(country => country.code === 'AD');

    render(
      <CountrySelect
        value={value}
        onChange={onChangeMock}
      />
    );

    // Focus on the input field input value for testing
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'United Arab Emirates' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Check if the onChange function was called with the new value
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ code: 'AE' }),
        expect.any(String),
        expect.anything()
      );
    });
  });

  test('dropdown opens and displays options on input', async () => {
    const onChangeMock = jest.fn();
    const value = countries.find(country => country.code === 'AD'); // Set initial value to Andorra for example

    render(
      <CountrySelect
        value={value}
        onChange={onChangeMock}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'United' } });

    await waitFor(() => {
      const options = screen.queryAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });
  });
});
