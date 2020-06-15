import { Component, OnInit } from '@angular/core';
import {faFacebookSquare, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {faEnvelope, faUnlock} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  faFacebook = faFacebookSquare;
  faGoogle = faGoogle;
  faUser = faEnvelope;
  faPassword = faUnlock;

  constructor() { }

  ngOnInit(): void {
  }

}
