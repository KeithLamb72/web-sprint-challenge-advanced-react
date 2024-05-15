import React, { useState } from 'react';

export default function AppFunctional(props) {
  const [index, setIndex] = useState(4);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [steps, setSteps] = useState(0);

  const stepsText = steps === 1 ? "You moved 1 time" : `You moved ${steps} times`

  const limitMessages = {
    up: "You can't go up",
    down: "You can't go down",
    left: "You can't go left",
    right: "You can't go right"
  };

  const getXY = () => {
    return { x: (index % 3) + 1, y: Math.floor(index / 3) + 1 };
  };

  const getXYMessage = () => {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  };

  const reset = () => {
    setIndex(4);
    setEmail('');
    setMessage('');
    setSteps(0);
  };

  const getNextIndex = (direction) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    switch (direction) {
      case 'left': return col > 0 ? index - 1 : -1;
      case 'right': return col < 2 ? index + 1 : -1;
      case 'up': return row > 0 ? index - 3 : -1;
      case 'down': return row < 2 ? index + 3 : -1;
      default: return index;
    }
  };

  const move = (evt) => {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);
    if (newIndex === -1) {
      setMessage(limitMessages[direction]);
    } else {
      setIndex(newIndex);
      setSteps(prevSteps => prevSteps + 1);
      setMessage('');
    }
  };

  const onChange = (evt) => {
    setEmail(evt.target.value);
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (!email) {
      setMessage("Please enter an email.");
      return;
    }
    const payload = { x: getXY().x, y: getXY().y, steps, email };
    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Ouch: email is required');
    }
  };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{stepsText}</h3>
        <h3 id="message">{message}</h3>
      </div>
      <div id="grid">
        {[...Array(9)].map((_, idx) => (
          <div key={idx} className={`square ${idx === index ? 'active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>RESET</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" value={email} onChange={onChange} placeholder="Type email" />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
