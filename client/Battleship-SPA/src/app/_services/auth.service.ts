import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService {

  jwtHelper = new JwtHelperService();
  decodedToken: any;
  baseUrl = 'https://localhost:44336/api/Account/';

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
          }
        })
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn(){
    const token =  localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout(){
    this.http.get(this.baseUrl + 'logout');
  }

  getToken(): string {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        if (this.jwtHelper.isTokenExpired(token))
         {      
            this.logout();
            throw new Error('Token is expired');
         }
  
        return token;  
        } 

        catch 
        {
        return null;
        }
}

}
