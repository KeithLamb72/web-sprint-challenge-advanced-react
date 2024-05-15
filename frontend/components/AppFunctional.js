import React, { useState } from 'react';

export default function AppFunctional(props) {
    const [index, setIndex] = useState(4);  // Center square on a 3x3 grid
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [steps, setSteps] = useState(0);
    const [showHSInfo, setShowHSInfo] = useState(false); // Initially set to false to avoid unnecessary display

    // Simplified version without separating function for message
    const coordinates = () => {
        const x = (index % 3) + 1;
        const y = Math.floor(index / 3) + 1;
        return `Coordinates (${x},${y})`;
    };

    const reset = () => {
        setIndex(4);
        setEmail('');
        setMessage('');
        setSteps(0);
        setShowHSInfo(false);  // Ensure this resets too
    };

    const getNextIndex = (direction) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      switch (direction) {
          case 'left': return col > 0 ? index - 1 : index;
          case 'right': return col < 2 ? index + 1 : index;
          case 'up': return row > 0 ? index - 3 : index;
          case 'down': return row < 2 ? index + 3 : index;
          default: return index;
      }
  };

    const move = (direction) => {
      const newIndex = getNextIndex(direction);
      if (newIndex !== index) {
          setIndex(newIndex);
          setSteps(prev => prev + 1);
          setMessage('');
      } else {
          setMessage(`You can't go ${direction}`);
      }
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();

    if (!email) {
        setMessage("Ouch: email is required");
        return;
    }

    // Prepare payload with the current state
   
    const payload = { x: (index % 3) + 1, y: Math.floor(index / 3) + 1, steps, email }

    try {
        const response = await fetch('http://localhost:9000/api/result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        setMessage(data.message);
        setEmail('')
    } catch (error) {
        setMessage('Error submitting email');
    }
};

    return (
        <div id="wrapper" className={props.className}>
            <div className="info">
                <h3 id="coordinates">{coordinates()}</h3>
                <h3 id="steps">You moved {steps === 1 ? '1 time' : `${steps} times`}</h3>
                <h3 id="message">{message}</h3>
            </div>
            <div id="grid">
                {[...Array(9)].map((_, idx) => (
                    <div key={idx} className={`square ${idx === index ? 'active' : ''}`}>
                        {idx === index ? 'B' : null}
                    </div>
                ))}
            </div>
            <div className="info"></div>
            <div id="keypad">
                <button id="left" onClick={() => move('left')}>LEFT</button>
                <button id="up" onClick={() => move('up')}>UP</button>
                <button id="right" onClick={() => move('right')}>RIGHT</button>
                <button id="down" onClick={() => move('down')}>DOWN</button>
                <button id="reset" onClick={reset}>reset</button>
            </div>
            <form onSubmit={onSubmit}>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="type email" />
                <input id="submit" type="submit" />
            </form>
        </div>
    );
  }