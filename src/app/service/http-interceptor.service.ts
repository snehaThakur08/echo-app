import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // this.errors = new Error();

    // request = request.clone({ headers: this.getDefaultHttpHeaders(request.headers) });

    return next.handle(request);
    // .pipe(
    //   catchError((response: HttpErrorResponse) => {
    //     // this.handleErrorResponse(response);
    //     return throwError(this.errors);
    //   })
    // );
  }

  // private getDefaultHttpHeaders(headers?: HttpHeaders): HttpHeaders {
    // headers = headers
    //   .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    //   .set('Pragma', 'no-cache')
    //   .set('Expires', '0');

    // if (HttpHelper.getSecurityContext()) {
    //   headers = headers.append('Authorization', 'Bearer ' + HttpHelper.getSecurityContext());
    // }
    // return headers;
  // }

  // private handleErrorResponse(response: HttpErrorResponse) {
  //   const ewnErrors: Errors = response.error ? response.error.ewnErrors : null;
  //   let errorExtraProp = null;
  //   switch (response.status) {
  //     case 0: // when there is timeout or no response from the server
  //       this.errors.addNew('http_error', response.statusText);
  //       break;
  //     case 401:
  //       if (ewnErrors) {
  //         // Considering in error response we are getting single error hence we are checking 'extraProperties' at 0th index.
  //         const field = ewnErrors[0].field;
  //         const prop = ewnErrors[0].properties;
  //         errorExtraProp = new ErrorExtraProperties(field, prop);
  //       }
  //       this.errors.addNew('invalid_credentials', 'Unauthorized', '', errorExtraProp);
  //       break;
  //     case 501:
  //     case 502:
  //     case 503:
  //     case 504:
  //       this.errors.addNew('http_error', 'Server Unreachable');
  //       break;
  //     default:
  //       this.handleEwnErrors(response);
  //       break;
  //   }
  // }

  // private handleEwnErrors(response: HttpErrorResponse) {
  //   const contentType = response.headers.get('Content-Type');
  //   const ewnErrors = response.error ? response.error.ewnErrors : null;
  //   if (contentType?.toLowerCase() === 'application/json' && response.error && ewnErrors) {
  //     for (let i = 0; i < ewnErrors.length; i++) {
  //       const name = ewnErrors[i].field;
  //       const errorMsg = ewnErrors[i].errorMessage;
  //       const msg = errorMsg ? errorMsg : ewnErrors[i].errorMessages.join('#');
  //       if (response.status === 500) {
  //         this.errors.addNew('http_error', msg);
  //       } else {
  //         this.errors.addNew(name, msg);
  //       }
  //     }
  //   } else {
  //     this.errors.addNew('http_error', response.statusText);
  //   }
  // }
}
