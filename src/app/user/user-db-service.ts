import {Injectable} from '@angular/core';
import {UserService} from './user-service';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserDataModel} from './user-data.model';
import {map, tap} from 'rxjs/operators';
import {BasketItemModel} from '../basket/basket-item.model';
import {PurchaseHistoryItemModel} from './purchase-history-item.model';

@Injectable({
  providedIn: 'root'
})
export class UserDbService {
  constructor(private db: AngularFirestore,
              private userService: UserService) {
  }

  fetchUserData(userId: string): Promise<UserDataModel> {
    return this.db.collection('users').doc(userId).get().pipe(map(data => {
      let userData: UserDataModel;
      const loggedUserData = data.data() as UserDataModel;
      if (loggedUserData) {
        userData = loggedUserData;
      }
      return userData;
    }), tap(userData => {
      this.userService.setUserData(userData);
    })).toPromise<UserDataModel>();
  }

  fetchUserPurchaseHistory(userId: string) {
    return this.db.collection('users').doc(userId).collection('shoppingHistory').get().pipe(map(data => {
      const purchaseHistory: PurchaseHistoryItemModel[] = [];
      data.forEach(elem => {
        const date = new Date(elem.data().timestamp.seconds * 1000);
        purchaseHistory.push({
            id: elem.id,
            items: elem.data().items,
            paymentMethod: elem.data().paymentMethod,
            timestamp: date
          }
        );
      });
      return purchaseHistory;
    }), tap(purchaseHistory => {
      this.userService.setPurchaseHistory(purchaseHistory);
    })).toPromise();
  }

  updateData(userData: UserDataModel, userId: string) {
    return this.db.collection('users').doc(userId).update(
      userData
    );
  }

  updateBasket(updatedBasket: BasketItemModel[], userId) {
    return this.db.collection('users').doc(userId).update({
      basket: updatedBasket
    });
  }
}
