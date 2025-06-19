import { useEffect, useState } from 'react'
import { useRef } from 'react';
import './App.css'
import SetDificulty from './components/SetDificulty.jsx';
import ShowCards from './components/ShowCards.jsx';
import SetLose from './components/SetLose.jsx'
import SetWin from './components/SetWin.jsx'

function App() {
  const [dificulty, setDificulty] = useState(0) // тут просто сложность 
  const [allCards, setallCards] = useState([]); // тут ВСЕ карты . используем при генерации массива 4х
  const [selectedCards, setSelectedCards] = useState([]); // тут УЖЕ выбранные карты 
  const [availableCards, setAvailableCards] = useState([]); // тут ЕЩЕ не выбранные карты
  const [fourCards, setFourCards] = useState([]); // ЭТО ТЕКУЩИЕ ЧЕТЫРЕ КАРТЫ

  const [turn, setTurn] = useState(0); // тут раунд отмечается.
  const [gameEnded, setGameEnded] = useState(false);
  const [showBlocks, setShowBlocks] = useState({ // показывает скрывает блоки
    showCardsBlock: 0, // по сути показать игру
    showDificultyBlock: 1, 
    SetLose: 0,
    SetWin :0,
  })
  
  const firstRender = useRef(true);

  
  let savedRecord =  JSON.parse(localStorage.getItem('savedRecord'));
  checkLocalStorage();
  function checkLocalStorage() {
    // console.log('saverREcord', savedRecord)
    // console.log('saverREcord2', savedRecord[0].lastRecord)
    if (savedRecord === null)  {  
      savedRecord = [{lastRecord : "0"}];
      saveInLocalStorage(savedRecord);
    }
  } 

  function saveInLocalStorage(savedRecord) {
    // console.log(savedRecord)
    localStorage.setItem('savedRecord', JSON.stringify(savedRecord));
  }

  function checkRecord(turn) {
    // console.log('saverREcord2', savedRecord[0].lastRecord)
    // console.log('turn', turn)
    savedRecord[0].lastRecord = savedRecord[0].lastRecord > turn ? savedRecord[0].lastRecord : turn;
    saveInLocalStorage(savedRecord); 
  }

  useEffect(() => { // начальная генерация массива всех карт. это работает только вначале игры. потом до конца не трогаем. одноразовыйблок
    if (firstRender.current) {
      firstRender.current = false;
      return; // ⛔ ничего не делаем на первом рендере
    }
    const tempArray = [];
    fetch('https://digimon-api.vercel.app/api/digimon')
    .then(response => response.json())
	  .then(data => {
      for (let i=109; i<109+dificulty; i++) {
        const obj = {name: data[i].name, img: data[i].img}
        tempArray.push(obj)
      } 
      setallCards(tempArray.slice())
    });  
  }, [dificulty])

  useEffect(() =>  { // если сработал блок наполнения основного массива начинаем игру.
    if (allCards.length > 0) {
      startGame()
    }  
  }, [allCards]);  // потому что эта переменная изменилась запустится состояние.

  function startGame() {
    setAvailableCards(allCards.slice()); // делаем копию карт
    setSelectedCards(Array(dificulty).fill('')) // а будущие выбранные карты заполняем пустотой. размер одинаквый везде
    setShowBlocks({...showBlocks, showDificultyBlock: 0, SetLose:0, SetWin:0, showCardsBlock: 1}); //прячем выбор сложности
    setTurn(1);
    // choose4Cards(); // запускаем генерацию карточек
    // choose4Cards(); // запускаем генерацию карточек
  }

  useEffect(() => {
   if (selectedCards.length > 0) {
    console.log('проверка победы')
    const timeout = setTimeout(() => {
      checkEndGame();
    }, 1000);
    return () => clearTimeout(timeout);
  }
}, [availableCards]);

  function generate4Cards() {
      const tempArray = []; // временный массив
      for (let i = 0; i < 4; i++) { 
        let cardIndex = Math.floor(Math.random() * allCards.length); // сгенерируем индекс случайный для отбора одной из 4х
        if (!tempArray.includes(cardIndex)) { // тут пробуем проверить на дубликат
          tempArray.push(cardIndex) // воткнем этот индекс во временный массив 
        }
        else {
          console.log('Дубликат. перегенерация')
          i--;
        }
      }
      return tempArray
  }

  useEffect(() => {
    
  if (selectedCards.length > 0) {
    const timeout = setTimeout(() => {
      choose4Cards();
    }, 1000);
    return () => clearTimeout(timeout);
    }
  }, [selectedCards]);

  function choose4Cards() {
    if (turn <= dificulty) {
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
          // console.log('pizda') // ВОТ ТУТ МЕНЯТЬ ЛОГИКУ
          let test = availableCards.find(card => typeof(card) === 'object')
          console.log('test', test)
          let test2 = availableCards.indexOf(test);
          console.log('test index', test2)
          tempArray.pop();
          tempArray.push(test2)
          console.log(tempArray[3])
          setFourCards(tempArray.slice())
        }
        else {
          setFourCards(tempArray.slice())
        }
        console.log('result', check)
      }
      if (turn < 5 ) {
        setFourCards(tempArray.slice()) // создали массив четырех карт
      }
      }
  }

  function addSelectedCard(value) { // тут удаляем из массива элемент и добавляем в другой
    checkEndGame(value);
    const copy1 = [...availableCards];
    const copy2 = [...selectedCards];
    copy2[value] = copy1[value];
    copy1[value] = '';
    setTurn(turn+1)
    setAvailableCards(copy1);
    setSelectedCards(copy2);
  }

  function checkEndGame(value) {
    if (selectedCards[value]) {
      alert(value, selectedCards[value]);
      setDificulty(0)
      setShowBlocks({...showBlocks, SetLose: 1, showCardsBlock : 0, showDificultyBlock : 1})
        checkRecord(turn)
      return true;
    }
      if (!availableCards.some(value => typeof(value) === 'object')) {
        setDificulty(0)
      setShowBlocks({...showBlocks, SetWin: 1, showCardsBlock : 0, showDificultyBlock : 1})
      checkRecord(turn)
      return true;
    }
    return false
  }


    return (
    <>
      <h4>Round: {turn}</h4>
      {showBlocks.SetLose === 1 && <SetLose />}
      {showBlocks.SetWin === 1 && <SetWin />}
      {showBlocks.showDificultyBlock === 1 && ( // покажем только вначале игры кнопки выбора сложности компонент
      <SetDificulty dificulty={dificulty} setDificulty={setDificulty} />)} 
      {showBlocks.showCardsBlock === 1 && ( // компонент вывода карт
        <ShowCards key={turn} allCards={allCards} fourCards={fourCards} addSelectedCard={addSelectedCard} />
      )} 
      
      <h4> record: {savedRecord[0].lastRecord} </h4>
      <h4>Dificulty: {dificulty}  All cards size: {allCards.length} </h4>
      {/* <h4>Not selected cards size: {availableCards.length} </h4> */}
      <h4>Set4Cards: {fourCards.length}, {fourCards} </h4>
      {selectedCards.map((value, index) => {
        return `value ${index} : ${value.name} `
      })}
      <p>Available:</p>
        {availableCards.map((value, index) => {
        return `value ${index} : ${value.name} `
      })}
    </>
  )
}

export default App