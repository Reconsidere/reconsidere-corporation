import { AuthService } from '../../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentToken = this.authenticationService.currenTokenValue;
    if (currentToken && currentToken.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentToken.token}`
        }
      });
    }

    return next.handle(request);
  }
}
