import {Injectable} from '@angular/core';
import {BasketItemModel} from './basket-item.model';
import {Subject} from 'rxjs';
import {ImageModel} from '../image-details/image.model';
import {UserService} from '../user/user-service';
import {UserDbService} from '../user/user-db-service';

@Injectable({providedIn: 'root'})
export class BasketService {
  basket: BasketItemModel[];
  basketChanged = new Subject<BasketItemModel[]>();
  basketAnimation = new Subject<any>();
  getSummary = new Subject<number>();

  constructor(private userDbService: UserDbService,
              private userService: UserService) {
  }

  getBasket() {
    if (this.basket) {
      return this.basket.slice();
    }
  }

  setBasket(basket: BasketItemModel[]) {
    this.basket = basket;
    this.basketChanged.next(this.basket);
  }

  createIfNotExistLocalStorageBasket() {
    const localBasket = localStorage.getItem('basket');
    if (!localBasket) {
      localStorage.setItem('basket', JSON.stringify(new Array<BasketItemModel>()));
      this.basket = new Array<BasketItemModel>();
    } else {
      this.basket = JSON.parse(localBasket);
    }
    this.basketChanged.next(this.basket);
  }

  destroyLocalStorageBasket() {
    if (localStorage.getItem('basket')) {
      localStorage.removeItem('basket');
    }
  }

  setAndGetSummary(basket: BasketItemModel[]) {
    let summary = 0;
    basket.forEach(item => {
      summary = summary + (item.price * item.quantity);
    });
    this.getSummary.next(summary);
    return summary;
  }

  updateBasket(image: ImageModel, qty) {
    const img = this.basket.find(item => item.imageId === image.id);
    if (img) {
      const newQuantity = +img.quantity + +qty;
      const foundByIndex = this.basket.findIndex(item => item.imageId === image.id);
      const basketItem: BasketItemModel = {
        imageId: image.id, quantity: newQuantity,
        price: image.price, imageUrl: image.imageUrl
      };
      this.basket[foundByIndex] = basketItem;
    } else {
      this.basket.push({
        imageId: image.id, price: image.price,
        imageUrl: image.imageUrl, quantity: qty
      });
    }
    this.basketChanged.next(this.basket);
    this.basketAnimation.next();

    return this.updateGlobalBasket();
  }

  deleteItem(itemId: string) {
    const foundByIndex = this.basket.findIndex(item => item.imageId === itemId);
    this.basket.splice(foundByIndex, 1);

    this.basketChanged.next(this.basket);

    return this.updateGlobalBasket();
  }

  updateQuantity(value: number, id: string) {
    const image = this.basket.find(item => item.imageId === id);
    image.quantity = +image.quantity + value;
    const foundByIndex = this.basket.findIndex(item => item.imageId === id);
    this.basket[foundByIndex] = image;

    this.basketChanged.next(this.basket);

    return this.updateGlobalBasket();
  }

  private setLocalStorageBasket(basket: BasketItemModel[]) {
    this.basket = basket;
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketChanged.next(this.basket);
  }

  private async updateGlobalBasket() {
    if (this.userService.getCurrentUser()) {
      const userId = this.userService.getCurrentUser().id;
      await this.userDbService.updateBasket(this.basket, userId);
    } else {
      this.setLocalStorageBasket(this.basket);
    }
  }
}
