import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    cartItems: CartItem[] = [];
    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

    constructor() { }

    addToCart(theCartItem: CartItem) {

        let alreadyExistsInCart: boolean = false;
        let existingCartItem: CartItem = undefined;

        // check if the item is already in shopping cart
        if(this.cartItems.length > 0) {
            // if item in shopping cart, find it by id
            existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
        }
        // check the result
        alreadyExistsInCart = (existingCartItem != undefined);

        if(alreadyExistsInCart) {
            existingCartItem.quantity ++;
        }
        else {
            this.cartItems.push(theCartItem);
        }

        this.computeCartTotals();
    }

    decrementQuantity(tempCartItem: CartItem) {
        tempCartItem.quantity --;
        if(tempCartItem.quantity == 0) {
            this.remove(tempCartItem);
        }
        else {
            this.computeCartTotals();
        }
    }

    remove(tempCartItem: CartItem) {
        let index = this.cartItems.findIndex(param => param.id === tempCartItem.id);

        if(index > -1) {
            this.cartItems.splice(index, 1);
            this.computeCartTotals();
        }
    }

    computeCartTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;

        for(let tempCartItem of this.cartItems) {
            totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
            totalQuantityValue += tempCartItem.quantity;
        }

        // publish new values
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);


        // this.logCartData(totalPriceValue, totalQuantityValue);
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log("Content of the cart");
        for(let tempCartItem of this.cartItems) {
            let subTotal = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log(`name: ${tempCartItem.name}`);
            console.log(`quantity: ${tempCartItem.quantity}`);
            console.log(`price: ${tempCartItem.unitPrice}`);
        }
        console.log(`total Price: ${totalPriceValue.toFixed(2)}`);
        console.log(`total Quantity: ${totalQuantityValue}`);
        console.log("_______");
    }
}
