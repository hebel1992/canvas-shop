import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserDataModel} from './user-data.model';
import {BasketItemModel} from '../basket/basket-item.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDataChanged = new Subject<UserDataModel>();
  private userData: UserDataModel;

  setUserData(data: UserDataModel) {
    this.userData = data;
    this.userDataChanged.next(this.userData);
  }

  getCurrentUser() {
    return this.userData;
  }

  updateBasket(newBasket: BasketItemModel[]) {
    this.userData.basket = newBasket;
    this.userDataChanged.next(this.userData);
  }
}
