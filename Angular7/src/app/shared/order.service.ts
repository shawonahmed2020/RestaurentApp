import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from './order.model';
import { Injectable } from '@angular/core';
import { OrderItem } from './order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData: Order;
  orderItems: OrderItem[];

  constructor(private http: HttpClient) { }

  saveOrUpdateOrder() {
    const body = {
      ...this.formData,
      OrderItems: this.orderItems
    };
    return this.http.post(environment.apiURL + '/Order', body);
  }
  getOrderList() {
    return this.http.get(environment.apiURL + '/Order').toPromise();

  }
  getOrderByID(id: number): any {
    return this.http.get(environment.apiURL + '/Order/' + id).toPromise();

  }
  deleteOrder(id: number) {
    return this.http.delete(environment.apiURL + '/Order/' + id).toPromise();

  }
}
