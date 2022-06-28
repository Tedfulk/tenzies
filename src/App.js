import React from "react";
import './App.css';
import Dice from "./Dice";
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)
  const [timerOn, setTimerOn] = React.useState(false)


  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => firstValue === die.value)
    if (allHeld && allSameValue) {
    setTenzies(true)
    setTimerOn(false)
    }
  }, [dice])

  React.useEffect(() => {
    let interval = null;
    if(timerOn) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 10)
      }, 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)

  }, [timerOn])

  

  function generateNewDice() {
    return {
        value: Math.ceil(Math.random() * 6 ),
        isHeld: false,
        id: nanoid(),
      }
    }


  function allNewDice() {
    let newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(
        generateNewDice())
    } 
    
    return(newDice)
  }

  
  function rollDice() {
    if (!tenzies) {
      setCount(oldCount => oldCount + 1)
      setDice(oldDice => oldDice.map(die => {
      return die.isHeld ? die : generateNewDice()
    }))} else {
      setTenzies(false)
      setDice(allNewDice())
      setCount(0)
      setSeconds(0)
    }
  }


  function holdDice(id) {
    if (!tenzies) {
      setTimerOn(true)
      setDice(oldDice => oldDice.map(
        die => {
          return die.id === id ? {...die, isHeld: !die.isHeld} : die 
        }
      ))
    }
  }

  const diceElements = dice.map(die => <Dice 
    key={die.id} 
    holdDice={() => holdDice(die.id)} 
    value={die.value} 
    isHeld={die.isHeld}
    />)

  return (
      <main>
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Click each die to freeze it at its current value between rolls. Roll until all dice are the same.</p>
        <div className="dice-container"> 
          {diceElements}
        </div>
        <div className="playbar">
          <div className="count">{count}</div>
          <button onClick={rollDice} className="button">
            {tenzies ? "New Game" : "Roll"}
          </button>
          <div className="timer">
            <span>{("0" + Math.floor((seconds / 1000) % 60)).slice(-2)}:</span>
            <span>{("0" + ((seconds / 10) % 100)).slice(-2)}</span>
            </div>
        </div>
      </main>
  );
}


