import { useEffect, useState } from 'react';
import './App.css';
import SetDifficultyBlock from './components/SetDifficultyBlock.jsx';
import ShowCards from './components/ShowCards.jsx';
import SetLose from './components/SetLose.jsx';
import SetWin from './components/SetWin.jsx';

function App() {
  const [difficulty, setDifficulty] = useState(0);
  const [allCards, setAllCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [availableCards, setAvailableCards] = useState([]);
  const [fourCards, setFourCards] = useState([]);

  const [turn, setTurn] = useState(0);
  const [showBlocks, setShowBlocks] = useState({ 
    showCardsBlock: 0,
    showDifficultyBlock: 1,
    showRound: 0,
    setLose: 0,
    setWin: 0,
    showLogo: 1,
  })
  
  let savedRecord =  JSON.parse(localStorage.getItem('savedRecord'));
  checkLocalStorage();

  function checkLocalStorage() {
    if (savedRecord === null) {  
      savedRecord = [{lastRecord: "0"}];
      saveInLocalStorage(savedRecord);
    }
  }

  function saveInLocalStorage(savedRecord) {
    localStorage.setItem('savedRecord', JSON.stringify(savedRecord));
  }

  function checkRecord(turn) {
    savedRecord[0].lastRecord = savedRecord[0].lastRecord > turn ? savedRecord[0].lastRecord : turn;
    saveInLocalStorage(savedRecord); 
  }

  useEffect(() => {
    if (difficulty === 0) return;
    const tempArray = [];
    fetch('https://digimon-api.vercel.app/api/digimon')
    .then(response => response.json())
	  .then(data => {
      for (let i = 109; i < 109 + difficulty; i++) {
        const obj = {name: data[i].name, img: data[i].img}
        tempArray.push(obj);
      } 
      setAllCards(tempArray);
      startGame(tempArray);
    });    
  }, [difficulty])

  function startGame(tempArray) {
    setAvailableCards(tempArray);
    setSelectedCards(Array(difficulty).fill(''));
    setShowBlocks({...showBlocks, showDifficultyBlock: 0, setLose:0, setWin:0, showLogo:0, showRound:1, showCardsBlock: 1});
    setTurn(1);
  }
  
  useEffect(() => {
    if (selectedCards.length > 0) {
      const timeout = setTimeout(() => {
        choose4Cards();
      }, 1000);
    return () => clearTimeout(timeout);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (selectedCards.length > 0) {
      const timeout = setTimeout(() => {
        checkEndGame();
      }, 1000);
    return () => clearTimeout(timeout);
    }
  }, [availableCards]);

  function choose4Cards() {
    if (turn <= difficulty) {
      let tempArray = generate4Cards();
      if (turn > 4 ) { 
        let checkAllSelected = 0;
        tempArray.forEach(value => {
          if (selectedCards[value]) { 
            checkAllSelected++
          }
        })
      if (checkAllSelected === 4 ) {
        const notSelectedCard = availableCards.find(card => typeof(card) === 'object')
        const notSelectedCardIndex = availableCards.indexOf(notSelectedCard);
        tempArray.pop();
        tempArray.push(notSelectedCardIndex);
        setFourCards(tempArray);
      } else {
        setFourCards(tempArray)
      }
      }
    if (turn < 5 ) setFourCards(tempArray);
    }
  }

  function generate4Cards() {
    const tempArray = []; 
    for (let i = 0; i < 4; i++) { 
      let cardIndex = Math.floor(Math.random() * allCards.length);
      if (!tempArray.includes(cardIndex)) {
        tempArray.push(cardIndex); 
      } else {
        // console.log('dublicate')
        i--;
      }
    }
    return tempArray
  }

  function addSelectedCard(value) { 
    const isGameOver = checkEndGame(value);
    const updatedAvailable = [...availableCards];
    const updatedSelected = [...selectedCards];
    updatedSelected[value] = updatedAvailable[value];
    updatedAvailable[value] = '';
    setAvailableCards(updatedAvailable);
    setSelectedCards(updatedSelected);
    if (turn < difficulty && !isGameOver)  {
      setTurn(turn+1);
    }
  }

  function resetGame(){
    setDifficulty(0);
    setAvailableCards([]);
    setSelectedCards([]);
    setFourCards([]);
    checkRecord(turn);
  }

  function checkEndGame(value) {
    if (selectedCards[value]) {
      setShowBlocks({...showBlocks, setLose: 1, showCardsBlock: 0, showRound: 0, showDifficultyBlock: 1});
      resetGame();
      return true;
    }
    if (!availableCards.some(value => typeof(value) === 'object')) {
      setShowBlocks({...showBlocks, setWin: 1, showCardsBlock: 0, showRound: 0, showDifficultyBlock: 1});
      resetGame();
      return true;
    }
    return false
  }

  return (
    <div className='wrapper'>
      {showBlocks.showRound === 1 && <h2>Round: {turn} / {difficulty}</h2>}
      {showBlocks.setLose === 1 && <SetLose />}
      {showBlocks.setWin === 1 && <SetWin />}
      {showBlocks.showDifficultyBlock === 1 && ( 
        <SetDifficultyBlock showLogo={showBlocks.showLogo}  setDifficulty={setDifficulty} />)} 
      {showBlocks.showCardsBlock === 1 && ( 
        <ShowCards key={turn} allCards={allCards} fourCards={fourCards} setFourCards = {setFourCards} addSelectedCard={addSelectedCard} />
      )} 

      <details className="gameRules">
        <summary><b>Game Rules: </b></summary> In each round, you must choose a unique card — no repeats allowed.
          If you choose a card that was already selected in previous rounds, you lose.
          If you make it through all the rounds, you win.
        </details>
      <div className='bestScore'>Best Score: {savedRecord[0].lastRecord}</div>

      {/* <div className='debug'>
        <p> record: {savedRecord[0].lastRecord} </p>
        <p>Difficulty: {difficulty}  All cards size: {allCards.length} </p>
        <p>Set4Cards: {fourCards.length}, {fourCards} </p>
        {selectedCards.map((value, index) => {
          return `value ${index} : ${value.name} `
        })}
        <p>Available:</p>
          {availableCards.map((value, index) => {
          return `value ${index} : ${value.name} `
        })}
      </div> */}
    </div>
  )
}

export default App