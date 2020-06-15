import {Component, OnInit} from '@angular/core';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  faUser = faEnvelope;
  faPassword = faLock;

  constructor() {
  }

  ngOnInit(): void {
  }

}
