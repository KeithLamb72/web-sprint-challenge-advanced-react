import React, { useState } from 'react'

// Suggested initial states
// the index the "B" is at

export default function AppFunctional(props) {
  const [index, setIndex] = useState(4)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [steps, setSteps] = useState(0)
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return { x: (index % 3) + 1, y: Math.floor(index / 3) + 1}
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY()
    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(4)
    setEmail('')
    setMessage('')
    setSteps(0)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const row = Math.floor(index / 3)
    const col = index % 3
    switch (direction) {
      case 'left': return col > 0 ? index - 1 :index
      case 'right': return col < 2 ? index + 1 :index
      case 'up': return row > 0 ? index - 3 :index
      case 'down': return row < 2 ? index + 3 :index
      default: return index
    }
    }
  

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id
    const newIndex = getNextIndex(direction)
    if (newIndex !== index) {
      setIndex(newIndex)
      setSteps(prevSteps => prevSteps + 1)
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }
// Use a POST request to send a payload to the server.
  function onSubmit(evt) {
    evt.preventDefault();
    const payload = { x: getXY().x, y: getXY().y, steps, email };
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => setMessage('Error: Failed to Submit Data'));
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {[...Array(9)].map((_, idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
          {idx === index ? 'B' : null}</div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={move}>RESET</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" value={email} onChange={onChange} placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
