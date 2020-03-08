import { Component } from '@angular/core';

export interface IPerson {
  login: string;
  password: string;
}

@Component({
  selector: 'auth-component',
  templateUrl: './auth.component.html',
  styleUrls: [ './auth.component.scss' ]
})
export class AuthComponent  {
  person: IPerson = {
    login: '',
    password: ''
  };

  onSubmit() {
    // some code here
  }
}
