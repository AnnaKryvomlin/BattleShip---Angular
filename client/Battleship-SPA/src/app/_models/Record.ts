import { WinnerShip } from './WinnerShip'

export interface Record {
    winner: string;
    moveCount: number;
    winnerShipsCount: number;
    winnerShips: WinnerShip [];
}
