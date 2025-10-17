import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core/service/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private modalService: NgbModal,
  ) {}

  intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          this.modalService.dismissAll();
          this.authenticationService.logout();
        } else if (err.status !== 404) {
          const codeString: string = err.status ? err.status.toString() : '';
          const errorMessage = err.error || err.message || err.statusText || 'An error occurred';
        }
        return throwError(err);
      }),
    );
  }
}
