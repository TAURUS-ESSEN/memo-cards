import logo from '../assets/logo.png';

export default function SetDifficultyBlock({setDifficulty, showLogo}) {
    function handleChange(value) {
        return setDifficulty(value)
    }
    return (
        <div className="setDifficultyBlock">
            {showLogo === 1 && <img src={logo} /> }
            <h4>Choose game difficulty:</h4>
            <div className="flex abs">
                <button className="button-difficulty" onClick={()=>handleChange(6)}>Easy (6)</button>
                <button className="button-difficulty" onClick={()=>handleChange(8)}>Medium (8)</button>
                <button className="button-difficulty" onClick={()=>handleChange(10)}>Hard (10)</button>
            </div>
        </div>
    )
}