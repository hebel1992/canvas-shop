import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasketService} from './basket-service';
import {BasketItemModel} from './basket-item.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-baskets',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, OnDestroy {

  basket: BasketItemModel[];
  basketSubscription: Subscription;
  loadingBasket = false;
  summary = 0;
  error: string;

  @ViewChild('basketContainer', {static: true}) basketContainer: ElementRef;

  constructor(private basketService: BasketService) {
  }

  ngOnInit(): void {
    const htmlElement = this.basketContainer.nativeElement as HTMLElement;
    this.basket = this.basketService.getBasket();
    if (this.basket) {
      this.summary = this.basketService.setAndGetSummary(this.basket);
    }

    if (!this.basket) {
      this.loadingBasket = true;
      htmlElement.style.opacity = '0';
    }

    this.basketSubscription = this.basketService.basketChanged.subscribe(basket => {
      this.basket = basket;
      this.summary = this.basketService.setAndGetSummary(this.basket);
      htmlElement.style.opacity = '1';
      this.loadingBasket = false;
    });
  }

  updateQuantity(quantity: number, imageId: string) {
    this.basketService.updateQuantity(quantity, imageId).catch(err => {
      this.error = err;
    });
  }

  deleteElement(imageId: string) {
    this.basketService.deleteItem(imageId).catch(err => {
      this.error = err;
    });
  }

  ngOnDestroy(): void {
    this.basketSubscription.unsubscribe();
  }
}
