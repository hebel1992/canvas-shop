export interface PurchaseHistoryItemModel {
  id: string;
  items: [{ id: string, quantity: number }];
  paymentMethod: string;
  timestamp: Date;
}
