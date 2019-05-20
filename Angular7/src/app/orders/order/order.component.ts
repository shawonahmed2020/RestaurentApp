import { CustomerService } from './../../shared/customer.service';
import { OrderItemsComponent } from './../order-items/order-items.component';
import { OrderService } from './../../shared/order.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Customer } from 'src/app/shared/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {
  customerList: Customer[];
  isValid = true;
  constructor(private service: OrderService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRouter: ActivatedRoute) { }

  ngOnInit() {
    let ordreID = this.currentRouter.snapshot.paramMap.get('id');
    if (ordreID === null) {
      this.resetForm();
    } else {
      // tslint:disable-next-line:radix
      this.service.getOrderByID(parseInt(ordreID)).then(res => {
        this.service.formData = res.order;
        this.service.orderItems = res.orderDetails;
      });
    }

    this.customerService.getCustomerList().then(res => this.customerList = res as Customer[]);

  }
  resetForm(form?: NgForm) {
    // tslint:disable-next-line: no-conditional-assignment
    if (form = null) {
      form.resetForm();
    }
    this.service.formData = {
      OrderID: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerID: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIDs: ''
    };
    this.service.orderItems = [];
  }
  AddOrEditItem(orderItemIndex, OrderId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex, OrderId };
    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });

  }
  onDeleteOrderItem(orderItemID: number, i: number) {
    if (orderItemID != null) {
      this.service.formData.DeletedOrderItemIDs += orderItemID + '';
    }
    this.service.orderItems.splice(i, 1);
    this.updateGrandTotal();
  }
  updateGrandTotal() {
    this.service.formData.GTotal = this.service.orderItems.reduce((pre, curr) => {
      return pre + curr.Total;
    }, 0);
    this.service.formData.GTotal = parseFloat((this.service.formData.GTotal).toFixed(2));

  }
  validateForm() {
    this.isValid = true;
    if (this.service.formData.CustomerID === 0) {
      this.isValid = false;
    } else if (this.service.orderItems.length === 0) {
      this.isValid = false;
    }
    return this.isValid;

  }
  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.service.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success('Submitted Successfully', 'Restaurent App');
        this.router.navigate(['/orders']);
      });
    }
  }

}
