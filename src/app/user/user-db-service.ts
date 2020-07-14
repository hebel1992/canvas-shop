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

  fetchUserData(userId: string) {
    return this.db.collection('users').doc(userId).get().pipe(map(data => {
      let userData;
      const loggedUserData = data.data();
      if (loggedUserData) {
        userData = new UserDataModel(
          loggedUserData.id,
          loggedUserData.email,
          loggedUserData.firstName,
          loggedUserData.lastName,
          loggedUserData.phone,
          loggedUserData.addressLine1,
          loggedUserData.addressLine2,
          loggedUserData.city,
          loggedUserData.postCode,
          loggedUserData.county,
          loggedUserData.basket,
          []
        );
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

        purchaseHistory.push(new PurchaseHistoryItemModel(
          elem.id,
          elem.data().items,
          elem.data().paymentMethod,
          date
        ));
      });
      return purchaseHistory;
    }), tap(purchaseHistory => {
      this.userService.setPurchaseHistory(purchaseHistory);
    })).toPromise();
  }

  updateData(userData, userId: string) {
    return this.db.collection('users').doc(userId).update({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      addressLine1: userData.addressLine1,
      addressLine2: userData.addressLine2,
      city: userData.city,
      postCode: userData.postCode,
      county: userData.county
    });
  }

  updateBasket(newBasket: BasketItemModel[], userId) {
    // this.userService.updateBasket(newBasket);
    return this.db.collection('users').doc(userId).update({
      basket: newBasket
    });
  }
}
