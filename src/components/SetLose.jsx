import lose from '../assets/gameOver.webp';
export default function SetLose () {
    return (
        <div className="game-lose">
            <img src={lose} />
        </div>
    )
}