import {BasketItemModel} from '../basket/basket-item.model';

export interface UserDataModel {
  id?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  postCode: string;
  basket?: BasketItemModel[];
  stripeCustomerId?: string;
}
