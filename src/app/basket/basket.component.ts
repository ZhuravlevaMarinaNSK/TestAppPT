import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

export interface IBasketItem {
  name: string;
  price: number;
}

export interface ICurrencyRate {
  base: string;
  date: string;
  rates: {
    'JPY': number;
    'RUB': number;
    'GBP': number;
    'EUR': number;
    'USD': number;
  };
}

@Component({
  selector: 'basket-component',
  templateUrl: './basket.component.html',
  styleUrls: [ './basket.component.scss' ]
})
export class BasketComponent implements OnInit {
  static ERROR_MESSSAGE = 'Нет информации о курсе валют';

  displayedColumns = ['name', 'price'];
  selectedCurrency = 'USD';
  currencyList: ICurrencyRate;
  totalCartPrice;
  errorMessage: string;

  @Input() selectedItems: IBasketItem[] = [
    { name: 'Item 1', price: 20 },
    { name: 'Item 2', price: 45 },
    { name: 'Item 22', price: 67 },
    { name: 'Item 100', price: 1305 }
  ];
  currencyCodeList: string[] = ['RUB', 'JPY', 'GBP', 'USD', 'EUR'];

  constructor(public service: CurrencyService) {  }

  ngOnInit() {
    this.service.getCurrencyRate().subscribe(
      result => this.onSuccess(result as ICurrencyRate),
      response => this.onError(response)
    );
  }

  onSuccess(result: ICurrencyRate) {
    this.currencyList = result;
    this.totalCartPrice = this.getTotalCartPrice(this.getTotalCost());
  }

  onError(response) { this.errorMessage = BasketComponent.ERROR_MESSSAGE; }

  recalcItemPrice() { return this.selectedItems.map(item => ({ price: this.countPrice(item.price), name: item.name })); }

  getTotalCartPrice(total) {
    const obj = {};
    this.currencyCodeList.forEach(item => {
      obj[item] = this.countPriceWithRate(total, item);
    });
    return obj;
  }

  countPriceWithRate(price, currency) { return (price * this.currencyList.rates[currency]); }

  countPrice(price) { return this.selectedCurrency === 'USD' ? price : this.countPriceWithRate(price, this.selectedCurrency); }

  getTotalCost() { return this.selectedItems.map(item => this.countPrice(item.price)).reduce((acc, value) => acc + value, 0); }

  onCurrencyChange(currency) { this.selectedCurrency = currency.value; }
}
