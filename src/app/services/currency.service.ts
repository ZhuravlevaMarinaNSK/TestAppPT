import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from './http-error-handler.service';

@Injectable({
    providedIn: 'root',
  })
export class CurrencyService {
    private handleError: HandleError;
    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler) {
            this.handleError = httpErrorHandler.createHandleError('HeroesService');
         }

        getCurrencyRate() {
            // const url = 'https://www.cbr-xml-daily.ru/daily_json.js';
            const url = 'https://api.exchangeratesapi.io/latest?base=USD';
            return this.http.get(url)
              .pipe(
                catchError(this.handleError('currencyService', []))
              );
          }
}
