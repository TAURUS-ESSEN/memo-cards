export default function ShowCards({allCards, fourCards, addSelectedCard}) {
    return (
        <div className="all-cards">
            {fourCards.map((value, index) => {
            return (
                
                    <button className='card' key={index} onClick={() => addSelectedCard(value)}>
                        <img src={allCards[value].img} alt={allCards[value].name}/> 
                        <span className="card-name">{allCards[value].name}</span>  
                    </button>
            )
        })}
        </div>
    )
}