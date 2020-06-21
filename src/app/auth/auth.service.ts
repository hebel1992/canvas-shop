import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {UserService} from '../user/user-service';
import {BasketService} from '../basket/basket-service';
import * as firebase from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserDbService} from '../user/user-db-service';
import {BasketItemModel} from '../basket/basket-item.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth,
              private router: Router,
              private userService: UserService,
              private basketService: BasketService,
              private db: AngularFirestore,
              private userDbService: UserDbService) {
  }

  async login(email: string, password: string) {
    const session = firebase.auth.Auth.Persistence.SESSION;

    await this.auth.setPersistence(session);
    await this.auth.signInWithEmailAndPassword(email, password);
    this.basketService.destroyLocalStorageBasket();
  }

  async register(email: string, password: string) {
    const session = firebase.auth.Auth.Persistence.SESSION;

    await this.auth.setPersistence(session);
    const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
    await this.createUserProfile(userCredential);
  }

  async loginWithFacebook() {
    const session = firebase.auth.Auth.Persistence.SESSION;

    await this.auth.setPersistence(session);

    await new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();

      return this.auth.signInWithPopup(provider).then(cred => {
        resolve(cred);
        this.createUserProfile(cred);
        this.router.navigate(['/']);
      }, err => {
        reject(err);
      });
    });

    // return this.auth.setPersistence(session).then(() => {
    //   return new Promise<any>(((resolve, reject) => {
    //     const provider = new firebase.auth.FacebookAuthProvider();
    //     this.auth.signInWithPopup(provider).then(cred => {
    //       resolve(cred);
    //       this.createUserProfile(cred);
    //       this.router.navigate(['']);
    //     }, err => {
    //       reject(err);
    //     });
    //   }));
    // });
  }

  async loginWithGoogle() {
    const session = firebase.auth.Auth.Persistence.SESSION;
    await this.auth.setPersistence(session);

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const cred = await this.auth.signInWithPopup(provider);

    await this.createUserProfile(cred);
    await this.router.navigate(['']);
  }

  async logout() {
    await this.auth.signOut();
    this.userService.setUserData(null);
    await this.router.navigate(['/']);
  }

  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  private async createUserProfile(cred: firebase.auth.UserCredential) {
    const userRef = await this.db.collection('users').doc(cred.user.uid).ref.get();
    if (!userRef.exists) {
      let localBasket: BasketItemModel[] = [];
      if (localStorage.getItem('basket')) {
        localBasket = JSON.parse(localStorage.getItem('basket'));
        localStorage.removeItem('basket');
      }
      await this.db.collection('users').doc(cred.user.uid).set({
        id: cred.user.uid,
        firstName: '',
        lastName: '',
        email: cred.user.email,
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postCode: '',
        county: '',
        basket: localBasket,
        shoppingHistory: []
      });
    } else {
      this.basketService.destroyLocalStorageBasket();
    }
    await this.userDbService.fetchUserData(cred.user.uid);
  }
}
