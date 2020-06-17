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
      htmlElement.style.opacity = '0';
      this.loadingBasket = true;
    }

    this.basketSubscription = this.basketService.basketChanged.subscribe(basket => {
      this.basket = basket;
      this.summary = this.basketService.setAndGetSummary(this.basket);
      this.loadingBasket = false;
      htmlElement.style.opacity = '1';
    });
  }

  updateQuantity(quantity: number, imageId: string) {
    this.basketService.updateQuantity(quantity, imageId);
  }

  deleteElement(imageId: string) {
    this.basketService.deleteItem(imageId);
  }

  ngOnDestroy(): void {
    this.basketSubscription.unsubscribe();
  }
}
