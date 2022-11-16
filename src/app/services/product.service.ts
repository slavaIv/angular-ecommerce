import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
    
    private baseUrl = environment.eShopApiUrl + '/products';
    private categoryUrl = environment.eShopApiUrl + '/product-category';
    
    constructor(private HttpClient: HttpClient ) { }

    getProductList(categoryId: number): Observable<Product[]> {
        const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
        return this.getProducts(searchUrl);    
    }
        
    getProductCategories(): Observable<ProductCategory[]> {
        return this.HttpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }

    searchProduct(theKeyword: string): Observable<Product[]> {
        const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
        return this.getProducts(searchUrl);
    }

    getProductListPaginate(thePage: number, thePageSize: number, categoryId: number): Observable<GetResponseProduct> {
        const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                            + `&page=${thePage}&size=${thePageSize}`;
        return this.HttpClient.get<GetResponseProduct>(searchUrl);
    }

    searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProduct> {
        const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                            + `&page=${thePage}&size=${thePageSize}`;
        return this.HttpClient.get<GetResponseProduct>(searchUrl);
    }

    getProduct(theProductId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/${theProductId}`;
        return this.HttpClient.get<Product>(productUrl);
    }
    
    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.HttpClient.get<GetResponseProduct>(searchUrl).pipe(
            map(response => response._embedded.products)
        );
    }

    
}
        

interface GetResponseProduct {
    _embedded: {
        products: Product[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }

}

interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}
