import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormServiceService } from 'src/app/services/form-service.service';
import { CustomValidator } from 'src/app/validators/custom-validator';
import { CartService } from 'src/app/services/cart.service'
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    totalPrice: number = 0;
    totalQuantity: number = 0;

    checkoutFormGroup: FormGroup;

    monthSelect: number[] = [];
    yearSelect: number[] =[];
    
    countries: Country[] = [];
    states: State[] = [];
    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];

    constructor(private formBuilder: FormBuilder, 
                private formService: FormServiceService, 
                private cartService: CartService,
                private checkoutService: CheckoutService,
                private router: Router) { }



    ngOnInit(): void {
        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
            }),
            shippingAddress: this.formBuilder.group({
                country: new FormControl('', [Validators.required]),
                street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                state: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{2,5}'), CustomValidator.notOnlyWhitespace])
            }),
            billingAddress: this.formBuilder.group({
                country: new FormControl('', [Validators.required]),
                street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                state: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{2,5}'), CustomValidator.notOnlyWhitespace])
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('', [Validators.required]),
                cardName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhitespace]),
                cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), CustomValidator.notOnlyWhitespace]),
                securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'), CustomValidator.notOnlyWhitespace]),
                expMonth: [''],
                expYear: ['']
            })
       });

       const startMonth: number = new Date().getMonth() + 1;

       this.formService.getCreditCardYear().subscribe(
            data => {
                this.yearSelect = data;
            }
       );

       this.formService.getCreditCardMonth(startMonth).subscribe(
            data => {
                this.monthSelect = data;         
            }
        );

        this.formService.getCountries().subscribe(
            data => {
                this.countries = data;
            }
        );

        this.reviewCartDetail();        
    }
    
    get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
    get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
    get email() {return this.checkoutFormGroup.get('customer.email');}

    get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country')};
    get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street')};
    get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city')};
    get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state')};
    get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode')};

    get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country')};
    get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street')};
    get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city')};
    get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state')};
    get billingAddressZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode')};

    get cardType() {return this.checkoutFormGroup.get('creditCard.cardType')};
    get cardName() {return this.checkoutFormGroup.get('creditCard.cardName')};
    get cardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber')};
    get securityCode() {return this.checkoutFormGroup.get('creditCard.securityCode')};
    get expMonth() {return this.checkoutFormGroup.get('creditCard.expMonth')};
    get expYear() {return this.checkoutFormGroup.get('creditCard.expYear')};


    reviewCartDetail() {
        this.cartService.totalPrice.subscribe(
            data => this.totalPrice = data
        );
    
        this.cartService.totalQuantity.subscribe(
            data => this.totalQuantity = data
        );
    }

    onSubmit() {
        
        if(this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }

        // set up order
        let order = new Order();
        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;

        // get cart items
        const cartItems = this.cartService.cartItems;
        
        // create orderItems from cartItems
        // let orderItems: OrderItem[] = [];
        // for(let i = 0; i < cartItems.length; i++) {
        //     orderItems[i] = new OrderItem(cartItems[i]);
        // }
        let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

        // set up purchase
        let purchase = new Purchase();

        // populate purchase - customer
        purchase.customer = this.checkoutFormGroup.controls['customer'].value;

        // populate purchase - shipping address
        purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
        const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
        const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
        purchase.shippingAddress.state = shippingState.name;
        purchase.shippingAddress.country = shippingCountry.name;

        // populate purchase - billing address
        purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
        const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
        const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
        purchase.billingAddress.state = billingState.name;
        purchase.billingAddress.country = billingCountry.name;

        // populate purchase - order and orderItems
        purchase.order = order;
        purchase.orderItems = orderItems;

        // call REST API via the CheckoutService
        this.checkoutService.placeOrder(purchase).subscribe({
                next: response => {
                    alert(`Your order has been received.\nOrder Tracking number is: ${response.orderTrackingNumber}`);
                    this.resetCart();
                },
                error: err => {
                    alert(`There was an error: ${err.message}`);
                }
            }
        );

    }
    resetCart() {
        // reset cart data
        this.cartService.cartItems = [];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);

        // reset the form
        this.checkoutFormGroup.reset();

        // navigate back to the product page
        this.router.navigateByUrl("/products");
    }

    copyShippingAddressToBillingAddress(event) {
        if(event.target.checked) {
            this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
            this.billingAddressStates = this.shippingAddressStates;
        }
        else {
            this.checkoutFormGroup.controls['billingAddress'].reset();
            this.billingAddressStates = [];
        }
    }


    handleMonthAndYear() {

        // const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
        const currentYear: number = new Date().getFullYear();
        const selectedYear: number = Number(this.checkoutFormGroup.get('creditCard').value.expYear);

        let startMonth: number;
        
        if(currentYear === selectedYear) {
            startMonth = new Date().getMonth() + 1;
        }
        else {
            startMonth = 1;
        }
        
        this.formService.getCreditCardMonth(startMonth).subscribe(
            data => {
                // console.log(JSON.stringify(data));
                this.monthSelect = data;
            }
        )

    }    

    getStates(address: string) {
        const formGroup = this.checkoutFormGroup.get(address);
        const countryCode = formGroup.value.country.code;
        const countryName = formGroup.value.country.name;

        this.formService.getStates(countryCode).subscribe(
            data => {

                if(address === 'shippingAddress') {
                    this.shippingAddressStates = data;
                }
                else {
                    this.billingAddressStates = data;
                }

                formGroup.get('state').setValue(data[0]);
            }
        )
    }
}
