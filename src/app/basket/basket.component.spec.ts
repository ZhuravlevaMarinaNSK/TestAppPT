import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CurrencyService } from '../services/currency.service';
import { BasketComponent } from './basket.component';
import { HttpErrorHandler } from '../services/http-error-handler.service';
import { MessageService } from '../services/message.service';

describe('BasketComponent', () => {
  let component: BasketComponent;
  let fixture: ComponentFixture<BasketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketComponent
      ],
      providers: [
        HttpClient,
        HttpHandler,
        HttpErrorHandler,
        MessageService,
        { CurrencyService, useValue: { getCurrencyRate: () => of({}) }}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('onSuccess', () => {
    spyOn(component, 'getTotalCartPrice');
    spyOn(component, 'getTotalCost');
    const result = {
      base: 'USD',
      date: 'date',
      rates: {
        JPY: 1,
        RUB: 2,
        GBP: 3,
        EUR: 4,
        USD: 5
      }
    };
    component.onSuccess(result);
    expect(component.currencyList).toEqual(result);
    expect(component.getTotalCost).toHaveBeenCalled();
    expect(component.getTotalCartPrice).toHaveBeenCalled();
  });

  it('onError', () => {
    component.onError('response');
    expect(component.errorMessage).toBe(BasketComponent.ERROR_MESSSAGE);
  });

  it('recalcItemPrice', () => {
    spyOn(component, 'countPrice').and.returnValue(10);
    component.selectedItems = [
      { name: 'Name1', price: 1 },
      { name: 'Name2', price: 2 }
    ];
    const expectedResult = [
      { name: 'Name1', price: 10 },
      { name: 'Name2', price: 10 }
    ];
    expect(component.recalcItemPrice()).toEqual(expectedResult);
  });

  it('getTotalCartPrice', () => {
    spyOn(component, 'countPriceWithRate').and.returnValue(10);
    const total = 1;
    const expectedResult = { RUB: 10, JPY: 10, GBP: 10, USD: 10, EUR: 10 };

    expect(component.getTotalCartPrice(total)).toEqual(expectedResult);
  });

  it('countPriceWithRate', () => {
    component.currencyList = {
      base: 'USD',
      date: 'date',
      rates: {
        EUR: 5,
        RUB: 2,
        GBP: 3,
        JPY: 4,
        USD: 5
      }
    };
    const price = 1;
    const currency = 'EUR';
    const expectedResult = 5;

    expect(component.countPriceWithRate(price, currency)).toEqual(expectedResult);
  });

  it('countPrice USD', () => {
    spyOn(component, 'countPriceWithRate').and.returnValue(10);
    component.selectedCurrency = 'USD';
    const price = 1;
    const expectedResult = 1;

    expect(component.countPrice(price)).toBe(expectedResult);
    expect(component.countPriceWithRate).toHaveBeenCalledTimes(0);
  });

  it('countPrice EUR', () => {
    spyOn(component, 'countPriceWithRate').and.returnValue(10);
    component.selectedCurrency = 'EUR';
    const price = 1;
    const expectedResult = 10;

    expect(component.countPrice(price)).toEqual(expectedResult);
  });

  it('getTotalCost', () => {
    spyOn(component, 'countPrice').and.returnValue(10);
    component.selectedItems = [
      { name: 'Name1', price: 1 },
      { name: 'Name2', price: 2 }
    ];
    const expectedResult = 20;

    expect(component.getTotalCost()).toEqual(expectedResult);
    expect(component.countPrice).toHaveBeenCalled();
  });

  it('onCurrencyChange', () => {
    const event = { value: 'GBP' };

    component.onCurrencyChange(event);

    expect(component.selectedCurrency).toBe('GBP');
  });
});
