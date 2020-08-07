import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHeaders, HttpHandler, HttpRequest, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthIntercepter implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let token = this.authService.getToken();

        if (token) {
            headers = headers.append('Authorization', `Bearer ${token}`);
        }

        let cloneReq = req.clone({
            headers: headers
        })

        return next.handle(cloneReq);
    }
}

export const AuthIntercepterProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthIntercepter,
    multi: true
  };
  