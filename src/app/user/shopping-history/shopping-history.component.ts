import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../user-service';
import {PurchaseHistoryItemModel} from '../purchase-history-item.model';

@Component({
  selector: 'app-shopping-history',
  templateUrl: './shopping-history.component.html',
  styleUrls: ['./shopping-history.component.css']
})
export class ShoppingHistoryComponent implements OnInit {
  purchaseHistorySubscription: Subscription;
  shoppingHistory: PurchaseHistoryItemModel[];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.shoppingHistory = this.userService.getPurchaseHistory();
    if (this.shoppingHistory) {
      this.shoppingHistory = this.shoppingHistory.sort(this.compare);
    }
    this.purchaseHistorySubscription = this.userService.userPurchaseHistoryChanged.subscribe(purchaseHistory => {
      this.shoppingHistory = purchaseHistory.sort(this.compare);
    });
  }

  compare(a, b) {
    if (a.timestamp < b.timestamp) {
      return 1;
    }
    if (a.timestamp > b.timestamp) {
      return -1;
    }
    return 0;
  }
}
