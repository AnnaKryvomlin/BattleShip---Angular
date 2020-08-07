import { Component, OnInit } from '@angular/core';
import {GameService} from '../_services/game.service';
import { AlertifyService } from '../_services/alertify.service';

interface IBox {
  ship?: Ship;
  includeShip: boolean;
}

interface Ship {
  x: number,
  y: number,
  size: number
}

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})

export class FieldComponent implements OnInit {

  private readonly boardSize = 10;

  constructor(private gameService: GameService, private alertify: AlertifyService) { }

  ngOnInit(): void {
    this.setBoard();
  }

  private ships: Ship[] = [{ x: 1, y: 1, size: 1 }, { x: 3, y: 1, size: 1 },
    { x: 5, y: 1, size: 1 }, { x: 7, y: 1, size: 1 },
    { x: 1, y: 3, size: 2 }, { x: 5, y: 3, size: 2 },
    { x: 8, y: 3, size: 2 }, { x: 1, y: 5, size: 3 },
    { x: 5, y: 5, size: 3 }, { x: 1, y: 7, size: 4 }]

  public board: Array<Array<IBox>> = [];

  public draggableShip: Ship = null; 

  setBoard() {
    const yLine: IBox[][] = [];
    for (let y = 1; y <= this.boardSize; y++) {
      const xLine: IBox[] = [];
      for (let x = 1; x <= this.boardSize; x++) {
        const shipForPosition = this.ships.find(s => s.x == x && s.y == y);
        const hasAnotherShip = !!this.ships.find(s => s.x <= x && s.x + s.size > x && s.y == y );
        const cell: IBox = { ship: shipForPosition, includeShip: hasAnotherShip }; 
        xLine.push(cell);
      }
      yLine.push(xLine);
    }
    this.board = yLine;
  }

  disabledDrop(cell: IBox, x: number, y: number){
    if(!this.draggableShip){
      return false;
    }
    const prevCells = this.board[y].slice(x, x + this.draggableShip.size);
    if(this.board[y].slice(x, x + this.draggableShip.size + 1).find(c => c.includeShip)
    || this.board[y].slice(x - 1, x + this.draggableShip.size).find(c => c.includeShip))
    {
      return true;
    }

    return prevCells.find(c => c.includeShip) || this.draggableShip.size + x > this.boardSize;
  }

  start(data: any){
    console.log(data);
  }

  drop(data: any, x: number, y: number) {
    const ship: Ship = data.item.data;
    ship.x = x;
    ship.y = y;
    console.log(x +", " + y);

    const neighborTopShips = this.ships.filter(s => s.y === (y - 1));
    const neighborBottomShips = this.ships.filter(s => s.y === (y + 1));
    if(this.checkIfCanDrob(neighborTopShips, ship) || this.checkIfCanDrob(neighborBottomShips, ship)){
      return;
    }

    this.setBoard();
  }

  checkIfCanDrob(neighborShips: Ship[], ship: Ship) : boolean{
    for(let s of neighborShips)
    {
      for (let i = s.x; i <= s.x + s.size - 1; i++) {
      for (let j = ship.x; j <= ship.x + ship.size - 1; j++) {
        if(i == j) {
        return true;
        }
      }
      }
    }
    return false;
  }

  createGame(){
    this.gameService.createGame(this.ships).subscribe(next => {
      this.alertify.success('Game created successfuly');
    },
      error => {
        this.alertify.error(error);
      });
  }

  findGame(){
    this.gameService.findGame(this.ships).subscribe(next => {
      this.alertify.success('Finding game for you...');
    },
      error => {
        this.alertify.error(error);
      });
  }

}
