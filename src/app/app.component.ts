import {Component, OnInit} from '@angular/core';
import {UserDbService} from './user/user-db-service';
import {UserService} from './user/user-service';
import {AngularFireAuth} from '@angular/fire/auth';
import {BasketService} from './basket/basket-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private userDbService: UserDbService,
              private userService: UserService,
              private basketService: BasketService,
              private auth: AngularFireAuth) {
  }

  error: string;

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userDbService.fetchUserData(user.uid).then(userData => {
          this.basketService.setBasket(userData.basket);
        }).catch(err => {
          this.error = err.message;
        });
      } else {
        this.userService.setUserData(null);
        this.basketService.createIfNotExistLocalStorageBasket();
      }
    });
  }
}
