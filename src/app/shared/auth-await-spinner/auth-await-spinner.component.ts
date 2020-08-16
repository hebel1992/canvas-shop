import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-await-spinner',
  template: '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./auth-await-spinner.component.css']
})
export class AuthAwaitSpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
