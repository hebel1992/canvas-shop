export class PurchaseHistoryItemModel {
  id: string;
  items: [{ id: string, quantity: number }];
  paymentMethod: string;
  timestamp: Date;

  constructor(id: string, items: [{ id: string, quantity: number }], paymentMethod: string, timestamp: Date) {
    this.id = id;
    this.items = items;
    this.paymentMethod = paymentMethod;
    this.timestamp = timestamp;
  }
}
