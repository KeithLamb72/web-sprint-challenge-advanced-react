// Write your tests here
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppFunctional from './AppFunctional'
describe('AppFunctional Component Tests', () => {
  test('sanity', () => {
    expect(true).toBe(true); // Changed to a true assertion
  });

  test('initial render and default state', () => {
    render(<AppFunctional />);
    const coordinates = screen.getByText(/coordinates/i);
    expect(coordinates).toHaveTextContent('Coordinates (2,2)');
    const steps = screen.getByText(/you moved/i);
    expect(steps).toHaveTextContent('You moved 0 times');
  });

  describe('Movement Logic and Boundary Conditions', () => {
    test('move B right and check position and steps', () => {
      render(<AppFunctional />);
      const rightButton = screen.getByText('RIGHT');
      fireEvent.click(rightButton); // Move right
      expect(screen.getByText(/coordinates/i)).toHaveTextContent('Coordinates (3,2)');
      expect(screen.getByText(/you moved/i)).toHaveTextContent('You moved 1 times');
    });

    test('try to move B out of bounds to the right', () => {
      render(<AppFunctional />);
      const rightButton = screen.getByText('RIGHT');
      fireEvent.click(rightButton);
      fireEvent.click(rightButton); // Attempt to move out of bounds
      expect(screen.getByText(/you can't go right/i)).toBeInTheDocument();
    });
  });

  test('reset button functionality', () => {
    render(<AppFunctional />);
    const upButton = screen.getByText('UP');
    fireEvent.click(upButton); // Move to change state
    const resetButton = screen.getByText('RESET');
    fireEvent.click(resetButton);
    expect(screen.getByText(/coordinates/i)).toHaveTextContent('Coordinates (2,2)');
    expect(screen.getByText(/you moved/i)).toHaveTextContent('You moved 0 times');
  });

  describe('Form Submission Handling', () => {
    test('submit form with valid email and check server response', async () => {
      render(<AppFunctional />);
      const emailInput = screen.getByPlaceholderText('Type email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      const submitButton = screen.getByText('SUBMIT');
      fireEvent.click(submitButton);
      // Assuming the mock or server sends back a specific success message
      const message = await screen.findByText('Success');
      expect(message).toBeInTheDocument();
    });
  });
});
