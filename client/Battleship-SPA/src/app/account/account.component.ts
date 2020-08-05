import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Game } from '../_models/Game';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  games: Game[] = [];
  playerid: number;

  constructor(private authService: AuthService, private accountService: AccountService) { }

  ngOnInit() {
     this.accountService.getAllUserGames()
     .subscribe(gamesdata => {
      this.games = gamesdata});
      this.playerid = this.authService.decodedToken.nameid[0];
  }


}
