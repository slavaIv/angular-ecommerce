import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

    private countriesUrl = 'http://localhost:8080/api/countries';
    private statesUrl = 'http://localhost:8080/api/states';

   
    constructor(private httpClient: HttpClient) { }

    getCountries(): Observable<Country[]> {
        return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
            map(response => response._embedded.countries)
        );
    }

    getStates(theCountryCode: string): Observable<State[]> {
        const theSearchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
        return this.httpClient.get<GetResponseStates>(theSearchStatesUrl).pipe(
            map(response => response._embedded.states)
        );
    }

    getCreditCardMonth(startMonth: number): Observable<number[]> {
        let monthArr: number[] = [];
        
        for(let i = startMonth; i <= 12; i++) {
            monthArr.push(i);
        }
        return of(monthArr);
    }

    getCreditCardYear(): Observable<number[]> {
        let yearForm: number[] = [];
        const tempYear: number = new Date().getFullYear();
        for(let i = tempYear; i <= tempYear + 10; i++) {
            yearForm.push(i);
        }
        return of(yearForm);
    }
}

interface GetResponseCountries {
    _embedded: {
        countries: Country[];
    }
}

interface GetResponseStates {
    _embedded: {
        states: State[];
    }
}