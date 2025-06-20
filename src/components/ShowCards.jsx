import { useEffect, useState } from 'react';

export default function ShowCards({ allCards, fourCards, setFourCards, addSelectedCard }) {
    const [animationKey, setAnimationKey] = useState(0);
    const [disappearing, setDisappearing] = useState(false);

    useEffect(() => {
        setAnimationKey(prev => prev + 1);
        setDisappearing(false);  
    }, [fourCards]);

    function handleClick(value) {
        setDisappearing(true); 
        setTimeout(() => {
            addSelectedCard(value);
            setFourCards([]);
        }, 400);  
    }

    return (
        <div className="all-cards">
            {fourCards.map((value, index) => (
            <button className={`card animate ${disappearing ? 'disappear' : ''}`} key={`${animationKey}-${index}`} onClick={() => handleClick(value)}>
                <img src={allCards[value].img} alt={allCards[value].name} />
                <span className="card-name">{allCards[value].name}</span>
            </button>
            ))}
        </div>
    );
}