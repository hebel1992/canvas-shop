import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth) {
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(() => {
      if (localStorage.getItem('basket')) {
        localStorage.removeItem('basket');
      }
    });
  }
}
