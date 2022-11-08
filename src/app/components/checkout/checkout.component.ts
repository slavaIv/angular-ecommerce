import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormServiceService } from 'src/app/services/form-service.service';

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

    constructor(private formBuilder: FormBuilder, private formService: FormServiceService) { }



    ngOnInit(): void {
        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                firstName: [''],
                lastName: [''],
                email: ['']
            }),
            shippingAddress: this.formBuilder.group({
                country: [''],
                street: [''],
                city: [''],
                state: [''],
                zipCode: ['']
            }),
            billingAddress: this.formBuilder.group({
                country: [''],
                street: [''],
                city: [''],
                state: [''],
                zipCode: ['']
            }),
            creditCard: this.formBuilder.group({
                cardType: [''],
                cardName: [''],
                cardNumber: [''],
                securityCode: [''],
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
    }

    onSubmit() {
        console.log("Handle submit button");
        console.log(this.checkoutFormGroup.get('customer').value);

        console.log(this.checkoutFormGroup.get('shippingAddress').value.country.name);
        console.log(this.checkoutFormGroup.get('billingAddress').value.state.name);
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
