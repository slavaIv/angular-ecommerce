import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCateboryMenuComponent } from './product-category-menu.component';

describe('ProductCateboryMenuComponent', () => {
  let component: ProductCateboryMenuComponent;
  let fixture: ComponentFixture<ProductCateboryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCateboryMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCateboryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
