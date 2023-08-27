import React, { useState, useEffect, useRef } from 'react';
import chroma from 'chroma-js';
import './App.css';

const initialGridSize = 3;
const defaultGridSize = initialGridSize + (Number(localStorage.getItem('level')) || 1);
console.log('Start default grid size from root: ', defaultGridSize);


// Generate a random color palette with chroma.js
const startColor = chroma.random().hex(); // Start with a random color
console.log('Start color generated from root: ', startColor);
const endColor = chroma(startColor).set('hsl.h', '+180').hex(); // End with a color 180 degrees opposite on the color wheel
console.log('End color generated from root: ', endColor);
const colorScale = chroma.scale([startColor, endColor]).mode('lch'); // Generate a color scale with 'defaultGridSize' number of colors
console.log('Color scale generated from root: ', colorScale);
const generatedColors = colorScale.colors(defaultGridSize);
console.log('Generated colors from root: ', generatedColors);

const stringWin = '(=^-ω-^=)';
const stringOver = '(▰˘︹˘▰)';



function App() {
  
  const [gridUpdates, setGridUpdates] = useState(0);
  const getScore = Number(localStorage.getItem('score')) || 0;
  const [score, setScore] = useState(getScore >= 0 ? getScore : 0 );
  // console.log('Initial score: ', score);
  const [level, setLevel] = useState(Number(localStorage.getItem('level')) || 1);
  const [nextLevel, setNextLevel] = useState(false);
  // console.log('Initial level: ', level);  
  // console.log('Next level: ', nextLevel);

  
  useEffect(() => {
    // Store score and level in localStorage whenever they change
    localStorage.setItem('score', score);
    console.log('Score saved to localStorage: ', score);
    localStorage.setItem('level', level);
    console.log('Level saved to localStorage: ', level);
  }, [score, level]);
  
  const colorDivisor = generatedColors.length - 1;
  const [countdown, setCountdown] = useState(null);
  const intervalId = useRef(null);
  const [grid, setGrid] = useState(Array(defaultGridSize).fill().map(() => Array(defaultGridSize).fill(0)));
  // console.log('Initial grid state: ', grid);
  const [mouseDown, setMouseDown] = useState(false);
  //const [score, setScore] = useState(0);
  // console.log('Initial score: ', score);
  const [desiredColor, setDesiredColor] = useState(getRandomColor(generatedColors.length, 0));
  // console.log('Desired color: ', desiredColor);
  const [avoidColor, setAvoidColor] = useState(getRandomColor(generatedColors.length, desiredColor));
  // console.log('Avoid color: ', avoidColor);
  const [gameStatus, setGameStatus] = useState(null);
  // console.log('Game status: ', gameStatus);

    useEffect(() => {
      const handleMouseUp = () => {
        // console.log('Mouse up event');
        setMouseDown(false);
      };
      const handleMouseDown = () => {
        // console.log('Mouse down event');
        setMouseDown(true);
      };
      
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchstart', handleMouseDown);
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('touchend', handleMouseUp);
        window.removeEventListener('touchstart', handleMouseDown);
      };
    }, []);
    //console.log('Mouse event listeners added');


  useEffect(() => {
    handleCountdown(score, countdown, gameStatus);
  }, [score, countdown, gameStatus]);
  //console.log('Countdown handler added');

  const checkWinCondition = (newGrid) => {
    let desiredColorCount = 0;
    for (let i = 0; i < defaultGridSize; i++) {
      for (let j = 0; j < defaultGridSize; j++) {
        if (newGrid[i][j] === desiredColor) {
          desiredColorCount++;
        }
      }
    }
    // console.log('Desired color count: ', desiredColorCount);
    if (desiredColorCount > ((defaultGridSize * defaultGridSize) / 2)) {
      setNextLevel(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (checkWinCondition(grid) && score >= 0) {
      console.log('Win condition met');
      setGameStatus(stringWin);
    }
  }, [grid, score,checkWinCondition]);
  //console.log('Win condition check added');


  const handleClick = (i, j) => {
    console.log('Cell clicked at: ', i, j);
    if (gameStatus === stringWin || gameStatus === stringOver) return;
    handleGridUpdate(i, j);
  };

  const handleMouseMove = (i, j) => {
    // console.log('Mouse moved over cell: ', i, j);
    if (countdown === stringOver || countdown === stringWin) return;
    if (mouseDown) {
      handleClick(i, j);
    }
  };

  // Function to reset the game
  const resetGame = () => {
    // Log the game reset event
    console.log('Game reset');

    if (gameStatus === stringOver) {
      // Decrease the level by 1, but ensure it does not go below 1
      setLevel(prevLevel => prevLevel > 1 ? prevLevel - 1 : 1);
      // Store the new level in localStorage
      localStorage.setItem('level', level > 1 ? level - 1 : 1);
    }
    
    // If the next level is set
    else if (nextLevel) {
      console.log("Next level: ", nextLevel)

      // Increase the level by 1
      setLevel(prevLevel => prevLevel + 1);
      // Store the new level in localStorage
      localStorage.setItem('level', level + 1);
      // Reset the next level state
      setNextLevel(false);
      console.log(level);
      
      // level = level + 1;
    } 
    // Reset the game status
    setGameStatus(null);
    console.log('Game status reset');
    setGridUpdates(0);
    const newLevel = Number(localStorage.getItem('level')) || 1;
    // Set the grid to its current state
    const newSize = defaultGridSize < initialGridSize + newLevel ? initialGridSize + newLevel : defaultGridSize;
    setGrid(Array(newSize).fill().map(() => Array(newSize).fill(0)));
    console.log("Level: ", newLevel);
    console.log("Default size grid: ", defaultGridSize)
    console.log('Grid size: ', newSize);
    // Reset the score
    if (getScore < 0) {  
      setScore(0);
    }
    console.log('Score reset');
    // Generate a new desired color
    const newDesiredColor = getRandomColor(generatedColors.length, 0);
    // Set the new desired color
    setDesiredColor(newDesiredColor);
    console.log('New desired color set: ', newDesiredColor);
    // Generate a new avoid color, different from the desired color
    const newAvoidColor = getRandomColor(generatedColors.length, newDesiredColor);
    // Set the new avoid color
    setAvoidColor(newAvoidColor);
    console.log('New avoid color set: ', newAvoidColor);
  };

  function getRandomColor(max, exclude) {
    let color;
    do {
      color = Math.floor(Math.random() * max);
    } while (color === exclude);
    // console.log('Random color generated: ', color, "of max ", max);
    return color;
  }

  function getCountDownByLevel(level)
  {
      const defaultCountDownn = 20;
      const calcCD =  Math.floor(defaultCountDownn - level );
      return calcCD <=3 ? 3 : calcCD;
  }

  function handleCountdown(score, countdown, gameStatus) {
    console.log('Handling countdown: ', score, countdown, gameStatus);
    const cd = getCountDownByLevel(level);
    if (score < 0 && countdown === null && gameStatus !== stringOver) {
      setCountdown(cd);
      console.log("Countdown is set to ", cd, " on the level ", level)
      setGameStatus(null);
    } else if (countdown === cd && intervalId.current === null) {
      intervalId.current = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown === 1) {
            clearInterval(intervalId.current);
            intervalId.current = null;
            setGameStatus(stringOver);
            return null;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    } else if (score >= 0) {
      clearInterval(intervalId.current);
      intervalId.current = null;
      setCountdown(null);
    }
  }

  function handleGridUpdate(i, j) {
    console.log('Grid update at: ', i, j);
    let newColor;
    setGrid(prevGrid => {
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      newColor = (newGrid[i][j] + 1) % generatedColors.length;
      newGrid[i][j] = newColor;
      updateScore(newColor);
      if (checkWinCondition(newGrid)) {
        setCountdown(stringWin);
      }
      return newGrid;
    });
    setGridUpdates(prevGridUpdates => prevGridUpdates + 1);
    updateSurroundingCells(i, j);
  }

  function updateScore(newColor) {
    //console.log('Score update with color: ', newColor);
    if (newColor === desiredColor) {
      setScore(prevScore => prevScore + 1);
    } else if (newColor === avoidColor) {
      setScore(prevScore => prevScore - 1);
    }
  }

  /**
   * This function updates the colors of the cells surrounding the cell at position (i, j) in the grid.
   * It iterates over the cells in the grid that are within a distance of 'defaultGridSize' from the cell at (i, j).
   * For each of these cells, it increments their color by 1 (modulo the number of generated colors) 
   * and updates the score based on the new color.
   * The updates are performed sequentially with a delay of 10ms between each update.
   *
   * @param {number} i - The row index of the cell to update.
   * @param {number} j - The column index of the cell to update.
   */
  function updateSurroundingCells(i, j) {
    console.log('Updating surrounding cells of: ', i, j);
    const updates = [];
    // Generate a list of cells to update
    for (let k = 1; k < grid.length; k++) {
      if (i - k >= 0) updates.push({ i: i - k, j });
      if (i + k < grid.length) updates.push({ i: i + k, j });
      if (j - k >= 0) updates.push({ i, j: j - k });
      if (j + k < grid.length) updates.push({ i, j: j + k });
    }
    console.log(updates)
    // Perform the updates sequentially with a delay of 10ms between each update
    updates.reduce((promise, { i, j }, index) => {
      return promise.then(() => new Promise(resolve => {
        setTimeout(() => {
          setGrid(prevGrid => {
            const newGrid = JSON.parse(JSON.stringify(prevGrid));
            newGrid[i][j] = (newGrid[i][j] + 1) % generatedColors.length;
            updateScore(newGrid[i][j]);
            return newGrid;
          });
          resolve();
        }, index * 10);
      }));
    }, Promise.resolve());
  }

  return (
    <div className="App">
      <div className="score" style={{ color: score < 0 ? countdown > 6 ? 'darkorange' : 'red' : 'white' }}>{score}</div>
      <div className="meta">
        
        <div className="countdown">{countdown} </div>
        <div className="gamestatus">{gameStatus} </div>
      </div>
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <div
              key={j}
              className="cell"
              style={{
                backgroundColor: gameStatus === stringWin && cell !== desiredColor ? '#0000' : colorScale(cell / colorDivisor).hex()
              }}
              onMouseDown={() => handleClick(i, j)}
              onMouseMove={() => handleMouseMove(i, j)}
              onTouchStart={() => handleClick(i, j)}
              onTouchMove={() => handleMouseMove(i, j)}
            ></div>
          ))}
        </div>
      ))}
      <div className="palette">
        <div className="score"></div>
        <div className="row">
          {generatedColors.map((color, index) => (
            <div 
              key={index} 
              className="color" 
              style={{ 
                backgroundColor: color,
                border: (index !== desiredColor && index !== avoidColor) ? '3px solid black' : '1px solid black'
              }} 
            >{index === desiredColor ? '▲' : index === avoidColor ? '▼' : ''}
            </div>
          ))}
        </div>
        <div className="button-container">
          <button 
          onClick={resetGame} 
          disabled={!(gameStatus === stringWin || gameStatus === stringOver || gridUpdates >= level)}>
            {nextLevel ? ' ☛ ' + (Number(level) + 1) : gameStatus === stringOver ? ( Number(level) - 1 > 1 ? Number(level) - 1 : 1 ) + ' ☚  ' : '⟳'}
          </button>
        </div>
    </div>
    </div>
  );
}

export default App;
