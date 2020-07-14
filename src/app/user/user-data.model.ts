import {BasketItemModel} from '../basket/basket-item.model';

export class UserDataModel {
  id: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  postCode: string;
  basket: BasketItemModel[];
  shoppingHistory: [];

  constructor(id: string, email: string, firstName: string, lastName: string, phone: string, addressLine1: string, addressLine2: string, city: string,
              postCode: string, county: string, basket: BasketItemModel[], shoppingHistory) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.city = city;
    this.postCode = postCode;
    this.county = county;
    this.basket = basket;
    this.shoppingHistory = shoppingHistory;
  }
}
