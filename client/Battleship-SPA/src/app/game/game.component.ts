import { Component, OnInit } from '@angular/core';
import { Coordinate } from '../_models/coordinate-model';
import { GameService } from '../_services/game.service';
import { ActivatedRoute } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from '../_services/auth.service';
import { Record } from '../_models/record.model';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

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

  private hubConnection: HubConnection;
  isShip: boolean;
  x: number;
  y: number;
  gameId: number;
  myId: number;
  currentPlayerId: number;
  records: Record[] = [];
   // for building boards
  private readonly boardSize = 10;
  myCoords: Coordinate[] = [];
  enemyCoords: Coordinate[] = [];
  public board: Array<Array<IBox>> = [];
  public enemyBoard: Array<Array<IBox>> = [];

  constructor(private authService: AuthService, private gameService: GameService, private route: ActivatedRoute,
              private router: Router, private alertify: AlertifyService) {
   }

  ngOnInit() 
  {
    this.gameId = +this.route.snapshot.paramMap.get('id');
    this.myId = +this.authService.decodedToken.nameid[0];
    this.hubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:44336/gamehub', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

    this.hubConnection
    .start()
    .then(() => this.hubConnection
    .invoke('JoinGame', this.gameId))
    .catch(err => { err => console.log(err)});

    this.hubConnection.on('TakeAShot', (result: boolean, x: number, y: number, currentPlayerId: number) => {
      this.takeAShot(x, y);
      this.currentPlayerId = currentPlayerId;
    });

    this.hubConnection.on('ShowAShot', (x: number, y: number, currentPlayerId: number) => {
      this.showAShot(x, y);
      this.currentPlayerId = currentPlayerId;
    });

    this.hubConnection.on('NewRecord', (record: string) => {
      let rec: Record = { playerMove: record };
      this.records.push(rec);
    });

    this.hubConnection.on('Finished', (message: string) => {
      this.alertify.success('Игра завершена! ' + message);
      this.router.navigate(['/account']);
    });

    this.hubConnection.on('StopGame', (message: string) => {
      this.alertify.success('Игра завершена! ' + message);
      this.router.navigate(['/account']);
    });

    // set user's and enemy's boards
    this.gameService.getUserCoords(this.gameId)
    .subscribe(coorddata => {
     this.myCoords = coorddata;
     this.gameService.getEnemyCoords(this.gameId)
     .subscribe(coordendata => {
      this.enemyCoords = coordendata;
      this.gameService.getCurrentplayerId(this.gameId)
     .subscribe(iddata => {
      this.currentPlayerId = iddata;
      this.setBoard(this.myCoords);
      this.setEnemyBoard(this.enemyCoords);
    });
  });
    });

    this.gameService.getRecords(this.gameId)
    .subscribe(data => {
     this.records = data; 
    });
  }

  showAShot(x: number, y: number) {
    const coord = this.myCoords.find(c => c.x == x && c.y == y).mark = true;
    this.setBoard(this.myCoords);
  }

  takeAShot(x: number, y: number) {
    const coord = this.enemyCoords.find(c => c.x == x && c.y == y).mark = true;
    this.setEnemyBoard(this.enemyCoords);
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

  public TrowUpTheTowel() {
    this.hubConnection
    .invoke('TrowUpTheTowel', this.myId, this.gameId)
    .catch(err => console.error(err));
  }

}
