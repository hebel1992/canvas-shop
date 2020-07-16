import {Component, OnInit} from '@angular/core';
import {UserDbService} from './user/user-db-service';
import {UserService} from './user/user-service';
import {AngularFireAuth} from '@angular/fire/auth';
import {BasketService} from './basket/basket-service';
import {NavigationEnd, Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private userDbService: UserDbService,
              private userService: UserService,
              private basketService: BasketService,
              private auth: AngularFireAuth,
              private router: Router) {
  }

  error: string;

  async ngOnInit() {
    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.auth.authState.subscribe(async user => {
      if (user) {
        try {
          const res = await Promise.all([
            this.userDbService.fetchUserData(user.uid),
            this.userDbService.fetchUserPurchaseHistory(user.uid)
          ]);
          if (res[0]) {
            this.basketService.setBasket(res[0].basket);
          }
        } catch (err) {
          this.error = err.message;
        }
      } else {
        this.userService.setUserData(null);
        this.basketService.createIfNotExistLocalStorageBasket();
      }
    });
  }
}
