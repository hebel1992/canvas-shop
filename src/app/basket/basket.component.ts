import {Component, OnInit} from '@angular/core';
import {BasketService} from './basket-service';
import {BasketItemModel} from './basket-item.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-baskets',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  basket: BasketItemModel[];
  basketSubscription: Subscription;

  constructor(private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.basket = this.basketService.getBasket();
    this.basketService.basketChanged.subscribe(basket => {
      this.basket = basket;
    });
  }

}
