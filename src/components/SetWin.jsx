import win from '../assets/win.webp';

export default function SetWin () {
    return (
        <div className="game-win">
            {/* Ты выиграл */}
            <img src={win} />
        </div>
    )
}