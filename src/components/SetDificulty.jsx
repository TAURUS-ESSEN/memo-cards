import logo from '../assets/logo.png';
export default function SetDificulty({dificulty, setDificulty, showLogo}) {
        function handleChange(value) {
            return setDificulty(value)
        }
        return (
            <div className="setDificultyBlock">
                {showLogo === 1 && <img src={logo} /> }
                <h4>Choose game dificulty:</h4>
                <div className="flex abs">
                    <button className="button-dificulty" onClick={()=>handleChange(6)}>Easy (6)</button>
                    <button className="button-dificulty" onClick={()=>handleChange(8)}>Medium (8)</button>
                    <button className="button-dificulty" onClick={()=>handleChange(10)}>Hard (10)</button>
                </div>
                <details className="gameRules">
                    <summary><b>Game Rules: </b></summary> In each round, you must choose a unique card — no repeats allowed.
                    If you choose a card that was already selected in previous rounds, you lose.
                    If you make it through all the rounds, you win.
                </details>
            </div>
        )
    }