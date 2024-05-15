// App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';  // Ensures jest-dom matchers are imported
import AppFunctional from './AppFunctional'; // Correct import path

describe('AppFunctional Component Tests', () => {
  beforeEach(() => {
    // Utilizing beforeEach to render the component for every test to ensure test isolation
    render(<AppFunctional />);
  });

  test('sanity', () => {
    expect(true).toBe(true); // Basic truth test to ensure testing is working
  });

  test('initial render and default state', () => {
    // Directly checking texts on render
    expect(screen.getByText(/coordinates/i)).toHaveTextContent('Coordinates (2,2)');
    expect(screen.getByText(/you moved/i)).toHaveTextContent('You moved 0 times');
  });

  describe('Movement Logic and Boundary Conditions', () => {
    test('move B right and check position and steps', () => {
      fireEvent.click(screen.getByText('RIGHT'));
      expect(screen.getByText(/coordinates/i)).toHaveTextContent('Coordinates (3,2)');
      expect(screen.getByText(/you moved/i)).toHaveTextContent('You moved 1 time');
    });

    test('try to move B out of bounds to the right', () => {
      const rightButton = screen.getByText('RIGHT');
      fireEvent.click(rightButton); // Move right once
      fireEvent.click(rightButton); // Attempt to move out of bounds
      expect(screen.getByText(/you can't go right/i)).toBeInTheDocument();
    });
  });

  test('reset button functionality', () => {
    fireEvent.click(screen.getByText('UP')); // Move up to change state
    fireEvent.click(screen.getByText('RESET'));
    expect(screen.getByText(/coordinates/i)).toHaveTextContent('Coordinates (2,2)');
    expect(screen.getByText(/you moved/i)).toHaveTextContent('You moved 0 times');
  });

  describe('Form Submission Handling', () => {
    test('submit form with valid email and check server response', async () => {
      fireEvent.change(screen.getByPlaceholderText('Type email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByText('SUBMIT'));
      expect(await screen.findByText('Success')).toBeInTheDocument();
    });
  });
});