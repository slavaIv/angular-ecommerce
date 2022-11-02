import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
    
    private baseUrl = 'http://localhost:8080/api/products';
    private categoryUrl = "http://localhost:8080/api/product-category";
    
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

    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.HttpClient.get<GetResponseProduct>(searchUrl).pipe(
            map(response => response._embedded.products)
        );
    }

    getProduct(theProductId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/${theProductId}`;
        return this.HttpClient.get<Product>(productUrl);
    }
}
        

interface GetResponseProduct {
    _embedded: {
        products: Product[];
    }
}

interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}
