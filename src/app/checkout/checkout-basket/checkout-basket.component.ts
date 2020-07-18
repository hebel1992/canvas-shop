import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BasketItemModel} from '../../basket/basket-item.model';
import {Subscription} from 'rxjs';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {BasketService} from '../../basket/basket-service';
import {ImagesService} from '../../gallery/images-service';

@Component({
  selector: 'app-checkout-basket',
  templateUrl: './checkout-basket.component.html',
  styleUrls: ['./checkout-basket.component.css']
})
export class CheckoutBasketComponent implements OnInit, OnDestroy {
  @Input() purchaseType;
  @Input() imageId;
  @Input() quantity;

  basket: BasketItemModel[];
  basketSubscription: Subscription;
  error: string;
  summary: number;
  faBin = faTrash;

  constructor(private basketService: BasketService,
              private imageService: ImagesService) {
  }

  ngOnInit(): void {
    this.basket = this.basketService.getBasket();
    if (this.basket) {
      this.summary = this.basketService.setAndGetSummary(this.basket);
    }

    if (this.purchaseType === 'multiple') {
      this.basketSubscription = this.basketService.basketChanged.subscribe(basket => {
        this.basket = basket;
        this.summary = this.basketService.setAndGetSummary(this.basket);
      });
    }

    if (this.purchaseType === 'single') {
      const item = this.imageService.getImage(this.imageId);
      this.basket = [{imageId: item.id, imageUrl: item.imageUrl, price: item.price, quantity: this.quantity}];
      this.summary = item.price * this.quantity;
    }
  }

  onDelete(imageId: string) {
    this.basketService.deleteItem(imageId).catch(err => {
      this.error = err.message;
    });
  }

  ngOnDestroy(): void {
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
    }
  }
}
