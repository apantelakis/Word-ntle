import { useState } from 'react'
import { useEffect } from 'react';
import './App.css';

function App() {

  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [userGuess, setUserGuess] = useState('');
  const [randomLetters] = useState(() => getRandomLetters());
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [lockedRows, setLockedRows] = useState(Array(6).fill(false));
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [showRules, setShowRules] = useState(false);

  function Title({ text }) {
    return (
      <div>
        <span style={{ color: 'green' }}>{text.slice(0, 2)}</span>
        <span style={{ color: 'white' }}>{text.slice(2, 4)}</span>
        <span style={{ color: 'red' }}>{text.slice(4, 7)}</span>
        <span style={{ color: 'yellow' }}>{text.slice(7, 10)}</span>
      </div>
    );
  }

  function getRandomLetters(length = 5) {
    let letters = 'abcdefghijklmnopqrstuvwxyz'; // use let, not const
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      result += letters[randomIndex];
      // Remove the chosen letter to avoid duplicates
      letters = letters.slice(0, randomIndex) + letters.slice(randomIndex + 1);
    }
    return result;
  }

  function BoxGrid() {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const boxes = [];
      const guess = i === currentAttempt ? userGuess : guesses[i];
      const isLocked = lockedRows[i];
      for (let j = 0; j < 5; j++) {
        const char = guess[j] || '';
        let boxClass = '';
        if (char == randomLetters[j]) {
          boxClass = ' correct';
        } else if (randomLetters.includes(char)) {
          boxClass = ' wrongPlace';
        } else if (char != randomLetters[j]) {
          boxClass = ' incorrect';
        }
        boxes.push(
          <div
            className={`box${isLocked ? boxClass : ''}`}
            key={j}
          >
            {char}
          </div>
        );
      }
      rows.push(
        <div className="row" key={i}>
          {boxes}
        </div>
      );
    }
    return <div>{rows}</div>;
  }

  useEffect(() => {
    function handleTyping(event) {
      // Only allow letters, ignore other keys
      if ((/^[a-zA-Z]$/.test(event.key)) && (lockedRows[currentAttempt] !== true) && !isGameOver) {
        setUserGuess(prev => prev.length < 5 ? prev + event.key.toLowerCase() : prev);
      }

      if (event.key === 'Backspace') {
        setUserGuess(prev => prev.slice(0, -1));
      }

      if (event.key === 'Enter') {
        if (userGuess == randomLetters) {
          setMessage('Good boy.');
          setLastMessage('won');
          setIsGameOver(true);
        }
        if (userGuess.length === 5 && currentAttempt < 6) {
          setGuesses(prev => {
            const newGuesses = [...prev];
            newGuesses[currentAttempt] = userGuess;
            return newGuesses;
          });
          setLockedRows(prev => {
            const newLocked = [...prev];
            newLocked[currentAttempt] = true;
            return newLocked;
          })
          setCurrentAttempt(prev => prev + 1);
          setUserGuess('');
        }
      }
    }

    window.addEventListener('keydown', handleTyping);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleTyping);
    };
  }, [userGuess, currentAttempt]);

  useEffect(() => {
    if (currentAttempt == 6 && !guesses.includes(randomLetters)) {
      setMessage('You suck balls.');
      setLastMessage('lost');
      setIsGameOver(true);
    }
  }, [isGameOver, guesses, randomLetters]);

  console.log(randomLetters);
  return (
    <div>
      <div className='title'>
        <Title text="Word'ntle" />
      </div>
      <button className='rulesButton' onClick={() => setShowRules(prev => !prev)}>
        {showRules ? 'Hide Rules' : 'Show Rules'}
      </button>
      {showRules && (
        <div className="rules">
          <h2>Game Rules</h2>
          <ul>
            <li>So it's like wordle</li>
            <li>But instead of words it's just random letters</li>
            <li>Also no duplicates</li>
            <li>Get it in less than 5 guesses & u get head</li>
          </ul>
        </div>
      )}
      <BoxGrid />
      {message && <div className={lastMessage}>{message}</div>}
    </div>
  );
}

export default App