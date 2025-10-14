import { Routes } from '@angular/router';
import { AddOnsoftProduct } from '../app/pages/add-onsoft-product/add-onsoft-product';
import { OonsoftProductList } from '../app/pages/oonsoft-product-list/oonsoft-product-list';
import { DigitalProductList } from '../app/pages/digital-product-list/digital-product-list';
import { DigialProductChekoutView } from '../app/pages/digial-product-chekout-view/digial-product-chekout-view';
import { OonsoftViewProduct } from '../app/pages/oonsoft-product-list/oonsoft-view-product/oonsoft-view-product';
import { OonsoftUpdateProduct } from '../app/pages/oonsoft-product-list/oonsoft-update-product/oonsoft-update-product';
import { CustomerDetails } from '../app/pages/customer-list/customer-details/customer-details';
import { CountriesList } from '../app/pages/countries/countries-list/countries-list';

export const routes: Routes = [
    {path:'',loadComponent:()=>import('../app/pages/login/login').then(a=>a.Login)},
    {path:'product_list',loadComponent:()=>import('../app/pages/product-list/product-list').then(a=>a.ProductList)},
    {path:'add-product',loadComponent:()=>import('../app/pages/add-product/add-product').then(a=>a.AddProduct)},
    {path:'seller',loadComponent:()=>import('../app/pages/seller/seller').then(a=>a.Seller)},
    {path:'checkout_list',loadComponent:()=>import('../app/pages/checkout-list/checkout-list').then(a=>a.CheckoutList)},
    {path:'customer_list',loadComponent:()=>import('../app/pages/customer-list/customer-list').then(a=>a.CustomerList)},
    {path:'view_chekout_list/:id',loadComponent:()=>import('../app/pages/checkout-list/view-chekout-list/view-chekout-list').then(a=>a.ViewChekoutList)},
    {path:'digital_product_list',loadComponent:()=>import('../app/pages/digital-product-list/digital-product-list').then(a=>a.DigitalProductList)},
    {path:'digital_product_listchekout',loadComponent:()=>import('../app/pages/digital-product-listchekout/digital-product-listchekout').then(a=>a.DigitalProductListchekout)},
    {path:'add_product_key',loadComponent:()=>import('../app/pages/add-product-key/add-product-key').then(a=>a.AddProductKey)},
    {path:'Oonsoft_product_list',loadComponent:()=>import('../app/pages/oonsoft-product-list/oonsoft-product-list').then(a=>OonsoftProductList)},
    {path:'Oonsoft_product',loadComponent:()=>import('../app/pages/add-onsoft-product/add-onsoft-product').then(a=>AddOnsoftProduct)},
    {path:'digial_product_chekout_view/:id',loadComponent:()=>import('../app/pages/digial-product-chekout-view/digial-product-chekout-view').then(a=>DigialProductChekoutView)},
    {path:'oonsoft_view_product/:id',loadComponent:()=>import('../app/pages/oonsoft-product-list/oonsoft-view-product/oonsoft-view-product').then(a=>OonsoftViewProduct)},
    {path:'oonsoft_update_product/:id',loadComponent:()=>import('../app/pages/oonsoft-product-list/oonsoft-update-product/oonsoft-update-product').then(a=>OonsoftUpdateProduct)},
    {path:'customer_details/:id',loadComponent:()=>import('../app/pages/customer-list/customer-details/customer-details').then(a=>CustomerDetails)},
    {path:'countries_list',loadComponent:()=>import('../app/pages/countries/countries-list/countries-list').then(a=>CountriesList)},
];
