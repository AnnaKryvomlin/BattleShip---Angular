import { Component, OnInit } from '@angular/core';
import { Coordinate } from '../_models/Coordinate';
import { GameService } from '../_services/game.service';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from '../_services/auth.service';
 import * as signalR from '@microsoft/signalr';

interface IBox {
  mark: boolean;
  includeShip: boolean;
  markShip: boolean;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // hub
  private hubConnection: HubConnection;
  isShip: boolean;
  x: number;
  y: number;
  // for building boards
  gameId: number;
  myId: number;
  currentPlayerId: number;
  private readonly boardSize = 10;
  myCoords: Coordinate[] = [];
  enemyCoords: Coordinate[] = [];
  public board: Array<Array<IBox>> = [];
  public enemyBoard: Array<Array<IBox>> = [];

  constructor(private authService: AuthService, private gameService: GameService, private route: ActivatedRoute) {
   }

  ngOnInit() 
  {
    this.gameId = +this.route.snapshot.paramMap.get('id');
    this.myId = +this.authService.decodedToken.nameid[0];
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:44336/gamehub')
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

    this.hubConnection
    .start()
    .then(() => console.log('Connection started!!!'))
    .catch(err => console.log('Error while establishing connection :(' + err));

    this.hubConnection.on('TakeAShot', (result: boolean, x: number, y: number, currentPlayerId: number) => {
      console.log(x);
    });

    // set user's and enemy's boards
    this.gameService.getUserCoords(this.gameId)
    .subscribe(coorddata => {
     this.myCoords = coorddata;
     this.gameService.getEnemyCoords(this.gameId)
     .subscribe(coordendata => {
      this.enemyCoords = coordendata;
      this.gameService.getCuurentplayerId(this.gameId)
     .subscribe(iddata => {
      this.currentPlayerId = iddata;
      this.setBoard(this.myCoords);
      this.setEnemyBoard(this.enemyCoords);
    });
  });
    });
  }

  setEnemyBoard(coords: Coordinate[]) {
    this.enemyBoard = this.getYLine(coords);
  }

  setBoard(coords: Coordinate[]) {
    this.board = this.getYLine(coords);
  }

  getYLine(coords: Coordinate[]){
    const yLine: IBox[][] = [];
    for (let y = 1; y <= this.boardSize; y++) {
      const xLine: IBox[] = [];
      for (let x = 1; x <= this.boardSize; x++) {
        let cell: IBox;
        const hasShip = coords.find(c => c.x == x && c.y == y).haveShip;
        const mark = coords.find(c => c.x == x && c.y == y).mark;
        if (hasShip && mark)
        {
        cell = { markShip: true, includeShip: false, mark: false}; 
        }
        if (!hasShip && mark)
        {
        cell = { markShip: false, includeShip: false, mark: true};
        }
        if (hasShip && !mark)
        {
        cell = { markShip: false, includeShip: true, mark: false};
        }
        if (!hasShip && !mark)
        {
        cell = { markShip: false, includeShip: false, mark: false};
        }
        xLine.push(cell);
      }
      yLine.push(xLine);
    }
    return yLine;
  }

  public TakeAShot(x: number, y: number) {
    this.hubConnection
    .invoke('TakeAShot', this.myId, this.gameId, x, y)
    .catch(err => console.error(err));
  }

}
