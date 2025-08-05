import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateRoom from '../src/components/CreateRoom';

describe('CreateRoom Component', () => {
  const mockOnCreate = jest.fn();

  test('renders CreateRoom component', () => {
    render(<CreateRoom onCreate={mockOnCreate} />);
    expect(screen.getByTestId('create-room-input')).toBeInTheDocument();
    expect(screen.getByTestId('create-room-button')).toBeInTheDocument();
  });

  test('calls onCreate with valid room ID when button is clicked', () => {
    render(<CreateRoom onCreate={mockOnCreate} />);
    const input = screen.getByTestId('create-room-input');
    const button = screen.getByTestId('create-room-button');

    fireEvent.change(input, { target: { value: 'Room1' } });
    fireEvent.click(button);

    expect(mockOnCreate).toHaveBeenCalledWith('Room1');
    expect(input).toHaveValue('');
  });

  test('does not call onCreate with empty or whitespace input', () => {
    render(<CreateRoom onCreate={mockOnCreate} />);
    const button = screen.getByTestId('create-room-button');

    fireEvent.click(button);
    expect(mockOnCreate).not.toHaveBeenCalled();

    const input = screen.getByTestId('create-room-input');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  test('button is disabled when input is empty or whitespace', () => {
    render(<CreateRoom onCreate={mockOnCreate} />);
    const button = screen.getByTestId('create-room-button');
    expect(button).toBeDisabled();

    const input = screen.getByTestId('create-room-input');
    fireEvent.change(input, { target: { value: '   ' } });
    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Room1' } });
    expect(button).not.toBeDisabled();
  });
});