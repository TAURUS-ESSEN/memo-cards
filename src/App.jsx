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
  // const [gameEnded, setGameEnded] = useState(false);
  const [showBlocks, setShowBlocks] = useState({ 
    showCardsBlock: 0,
    showDifficultyBlock: 1,
    showRound:0,
    SetLose: 0,
    SetWin :0,
    showLogo:1,
  })
  
  let savedRecord =  JSON.parse(localStorage.getItem('savedRecord'));
  checkLocalStorage();

  function checkLocalStorage() {
    if (savedRecord === null) {  
      savedRecord = [{lastRecord : "0"}];
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
      for (let i=109; i<109+difficulty; i++) {
        const obj = {name: data[i].name, img: data[i].img}
        tempArray.push(obj)
      } 
      setAllCards(tempArray);
      startGame(tempArray)
    });    
  }, [difficulty])


  function startGame(tempArray) {
    setAvailableCards(tempArray);
    setSelectedCards(Array(difficulty).fill(''))
    setShowBlocks({...showBlocks, showDifficultyBlock: 0, SetLose:0, SetWin:0, showLogo:0,  showRound:1, showCardsBlock: 1});
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
      console.log('проверка победы')
      const timeout = setTimeout(() => {
        checkEndGame();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [availableCards]);

  function choose4Cards() {
    if (turn <= difficulty) {
      console.log('turn',turn)
      let tempArray = generate4Cards();
      if (turn > 4 ) { // если массив отобранных карт больше 4
        console.log("-----------------------")
        let check = 0;
        tempArray.forEach((value, index )=> {
          console.log(`value: ${value} with index: ${index}`)
          console.log(`Selectedvalue: ${selectedCards[value]} with index: ${value}`)
          console.log(`temp ${value} VS selected ${selectedCards[value]} `)
          if (selectedCards[value]) { 
            check++
          }
        })
      if (check === 4 ) {
        let test = availableCards.find(card => typeof(card) === 'object')
        console.log('test', test)
        let test2 = availableCards.indexOf(test);
        console.log('test index', test2)
        tempArray.pop();
        tempArray.push(test2)
        console.log(tempArray[3])
        setFourCards(tempArray)
      } else {
        setFourCards(tempArray)
      }
      console.log('result', check)
    }
    if (turn < 5 ) {
      setFourCards(tempArray) // создали массив четырех карт
    }
    }
  }

  function generate4Cards() {
    const tempArray = []; 
    for (let i = 0; i < 4; i++) { 
      let cardIndex = Math.floor(Math.random() * allCards.length);
      if (!tempArray.includes(cardIndex)) {
        tempArray.push(cardIndex); 
      }
      else {
        console.log('Дубликат. перегенерация')
        i--;
      }
    }
    return tempArray
  }

  function addSelectedCard(value) { 
    const isGameOver = checkEndGame(value)
    const copy1 = [...availableCards];
    const copy2 = [...selectedCards];
    copy2[value] = copy1[value];
    copy1[value] = '';
    setAvailableCards(copy1);
    setSelectedCards(copy2);
    if (turn < difficulty && !isGameOver)  {
      setTurn(turn+1)
    }
  }

  function checkEndGame(value) {
    if (selectedCards[value]) {
      setDifficulty(0);
      setShowBlocks({...showBlocks, SetLose: 1, showCardsBlock : 0, showDifficultyBlock : 1});
      checkRecord(turn);
      return true;
    }
    if (!availableCards.some(value => typeof(value) === 'object')) {
      setDifficulty(0);
      setAvailableCards([]);
      setSelectedCards([]);
      setFourCards([]);
      setShowBlocks({...showBlocks, SetWin: 1, showCardsBlock : 0, showDifficultyBlock : 1});
      checkRecord(turn);
      return true;
    }
    return false
  }

  return (
    <div className='wrapper'>
      {showBlocks.showRound === 1 && <h2>Round: {turn} / {difficulty}</h2>}
      {showBlocks.SetLose === 1 && <SetLose />}
      {showBlocks.SetWin === 1 && <SetWin />}
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