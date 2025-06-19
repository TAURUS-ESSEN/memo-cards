import { useEffect, useState } from 'react'
import './App.css'
import SetDificult from './components/SetDificult.jsx';
import ShowCards from './components/ShowCards.jsx';
import SetLose from './components/SetLose.jsx'

function App() {
  const [dificult, setDificult] = useState(0) // тут просто сложность 
  const [allCards, setallCards] = useState([]); // тут ВСЕ карты . используем при генерации массива 4х
  const [selectedCards, setSelectedCards] = useState([]); // тут УЖЕ выбранные карты 
  const [availableCards, setAvailableCards] = useState([]); // тут ЕЩЕ не выбранные карты
  const [fourCards, setFourCards] = useState([]); // ЭТО ТЕКУЩИЕ ЧЕТЫРЕ КАРТЫ

  const [turn, setTurn] = useState(0); // тут раунд отмечается.
  const [showBlocks, setShowBlocks] = useState({ // показывает скрывает блоки
    showCardsBlock: 0, // по сути показать игру
    showDificultBlock: 1, 
    SetLose: 0,
  })

  function startGame() {
    setAvailableCards(allCards.slice()); // делаем копию карт
    setSelectedCards(Array(dificult).fill('')) // а будущие выбранные карты заполняем пустотой. размер одинаквый везде
    setShowBlocks({...showBlocks, showDificultBlock: 0, showCardsBlock: 1}); //прячем выбор сложности
    choose4Cards(); // запускаем генерацию карточек
  }

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

  function choose4Cards() {
    const newTurn = turn + 1
    setTurn(newTurn);
    console.log('turn',newTurn)
    // const tempArray = []; // временный массив
    let tempArray = generate4Cards();
      // for (let i = 0; i < 4; i++) { 
      //   let cardIndex = Math.floor(Math.random() * allCards.length); // сгенерируем индекс случайный для отбора одной из 4х
      //   if (!tempArray.includes(cardIndex)) { // тут пробуем проверить на дубликат
      //     tempArray.push(cardIndex) // воткнем этот индекс во временный массив 
      //   }
      //   else {
      //     // console.log('Дубликат. перегенерация')
      //     i--;
      //   }
      // }
      if (newTurn > 3 ) { // если массив отобранных карт больше 4
        console.log("-----------------------")
        
        let check = 0;
        tempArray.forEach((value, index )=> {
          // console.log(`value: ${value} with index: ${index}`)
          // console.log(`Selectedvalue: ${selectedCards[value]} with index: ${value}`)
          // console.log(`temp ${value} VS selected ${selectedCards[value]} `)
          if (selectedCards[value]) { 
            check++
          }
        })
        if (check === 4 ) {
          console.log('pizda') // ВОТ ТУТ МЕНЯТЬ ЛОГИКУ
        }
        else {
            setFourCards(tempArray.slice())
        }
        // console.log('result', check)
      }
      if (newTurn < 4 ) {
        setFourCards(tempArray.slice()) // создали массив четырех карт
      }
  }

  function addSelectedCard(value) { // тут удаляем из массива элемент и добавляем в другой
    checkEndGame(value);
    const copy1 = [...availableCards];
    const copy2 = [...selectedCards];
    copy2[value] = copy1[value];
    copy1[value] = '';
    setAvailableCards(copy1);
    setSelectedCards(copy2);
    setTimeout(() => {
        choose4Cards();
      }, 1000);
    }

  function checkEndGame(value) {
    if (selectedCards[value]) {
      alert(value, selectedCards[value])
      setShowBlocks({...showBlocks, SetLose: 1, showCardsBlock : 0, showDificultBlock : 1})
    }
    return 
  }

  useEffect(() => { // начальная генерация массива всех карт. это работает только вначале игры. потом до конца не трогаем. одноразовыйблок
    const tempArray = [];
    fetch('https://digimon-api.vercel.app/api/digimon')
    .then(response => response.json())
	  .then(data => {
      for (let i=109; i<109+dificult; i++) {
        const obj = {name: data[i].name, img: data[i].img}
        tempArray.push(obj)
      } 
        setallCards(tempArray.slice())
    });  
    }, [dificult])

  useEffect(() =>  { // если сработал блок наполнения основного массива начинаем игру.
      if (allCards.length > 0) {
          startGame()
      }  
  }, [allCards]);  // потому что эта переменная изменилась запустится состояние.

    return (
    <>
      <h4>Round: {turn}</h4>
      {showBlocks.SetLose === 1 && <SetLose />}
      {showBlocks.showDificultBlock === 1 && ( // покажем только вначале игры кнопки выбора сложности компонент
      <SetDificult dificult={dificult} setDificult={setDificult} />)} 
      {showBlocks.showCardsBlock === 1 && ( // компонент вывода карт
        <ShowCards key={turn} allCards={allCards} fourCards={fourCards} addSelectedCard={addSelectedCard} />
      )} 

      <h4>Dificult: {dificult}  All cards size: {allCards.length} </h4>
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