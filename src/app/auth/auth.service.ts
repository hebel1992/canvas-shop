import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {UserService} from '../user/user-service';
import {BasketService} from '../basket/basket-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth,
              private router: Router,
              private userService: UserService,
              private basketService: BasketService) {
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.basketService.destroyLocalStorageBasket();
    });
  }

  logout() {
    return this.auth.signOut().then(() => {
      this.router.navigate(['/']);
      this.userService.setUserData(null);
    });
  }

  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }
}
