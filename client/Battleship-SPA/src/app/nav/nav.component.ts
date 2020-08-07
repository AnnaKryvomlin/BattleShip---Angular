import { AuthService } from '../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() { }

  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Welcome ' + this.authService.decodedToken.nameid[1]);
    },
      error => {
        this.alertify.error(error);
        console.log(error);
      }, () => {
        this.router.navigate(['/home']);
      });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertify.message('Goodbye ' + this.authService.decodedToken.nameid[1]);
    this.router.navigate(['/home']);
  }

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

}
