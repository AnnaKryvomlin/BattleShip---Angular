import { WinnerShip } from './winner-ship.model'

export interface Record {
    winner: string;
    moveCount: number;
    winnerShipsCount: number;
    winnerShips: WinnerShip [];
}
