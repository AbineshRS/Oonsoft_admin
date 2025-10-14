import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../environtments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendapiService {
    private _refreshNeeded$ = new Subject<void>();
    apiUrl: string = environment.ApiUrl;

    constructor(private http: HttpClient) {

    }



    Productlist(sellerId: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Product/product_list/${sellerId}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }


    addProduct(data: any): Observable<any> {
        return this.http.post(environment.ApiUrl + 'Product/create_product', data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    uploadProductImage(productId: string, files: File[]) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('formFile', file);
        });
        return this.http.post(environment.ApiUrl + `Product/UploadProductDefaultImage/${productId}`, formData);
    }

    registerSeller(data: any): Observable<any> {
        return this.http.post(environment.ApiUrl + 'Seller/create_seller', data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    sellerlogin(data: any): Observable<any> {
        return this.http.post(environment.ApiUrl + 'Seller/login', data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    checkoutlist(sellerId: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}checkout/chekoutlist/${sellerId}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    customerlist(): Observable<any> {
        return this.http.get(`${environment.ApiUrl}customer/customer_list`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    digitalProductlist(sellerId: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Product/digitalproductlist/${sellerId}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    digitalcheckoutlist(sellerId: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}checkout/digitalchekoutlist/${sellerId}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    uploadproduct_key(checkoutId: string, file: File) {
        const formData = new FormData();
        formData.append('formFile', file);
        return this.http.post(environment.ApiUrl + `checkout/add_digital_key/${checkoutId}`, formData);
    }

    OonsoftProductlist(): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Oonsoft/Oonsoft_products`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    Oonsoft_addProduct(data: any): Observable<any> {
        return this.http.post(environment.ApiUrl + 'Oonsoft/create_product', data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    Oonsoft_uploadProductImage(Oonsoft_product_id: string, file: File) {
        const formData = new FormData();
        formData.append('formFile', file);
        return this.http.post(environment.ApiUrl + `Oonsoft/image_url/${Oonsoft_product_id}`, formData
        );
    }

    Oonsoft_addProduct_keys(data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}checkout/add_digital_keys`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    checkout_details(checkoutlist_id: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}checkout/physicalcheckout_details/${checkoutlist_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    Oonsoft_addProduct_status(Oonsoft_product_id: string, data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}Oonsoft/change_status/${Oonsoft_product_id}`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    oonsoft_details(Oonsoft_product_id: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Oonsoft/Oonsoft_details/${Oonsoft_product_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    Oonsoft_updateprodct(Oonsoft_product_id: string, data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}Oonsoft/update/${Oonsoft_product_id}`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    customer_details(userId: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}customer/customer_list/${userId}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    _digitalprodcut(product_id: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Product/digital_product/${product_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    digital_updateprodct(product_id: string, data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}Product/update_digital/${product_id}`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    Physical_details(product_id: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Product/physical_product/${product_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    Physical_update(product_id: string, data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}Product/update_physical/${product_id}`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    Update_status(checkout_id: string, data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}checkout/update_status/${checkout_id}`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    digital_details(checkoutlist_id: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}checkout/digitalcheckout_details/${checkoutlist_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    customer_status(userId: string, data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}customer/admin_change_status/${userId}`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    getProductById(product_id: string): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Product/product/${product_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    getCekoutphysical_productById(checkoutlist_id: string): Observable<any> {
        return this.http.get(`${environment.ApiUrl}checkout/getchkout_checkout_id/${checkoutlist_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    getCekoutdigital_productById(checkoutlist_id: string): Observable<any> {
        return this.http.get(`${environment.ApiUrl}checkout/getchkout_Digitalcheckout_id/${checkoutlist_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    CustomerDetails(userId: string): Observable<any> {
        return this.http.get(`${environment.ApiUrl}customer/customer_list/${userId}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    OonsoftDetails(Oonsoft_product_id: string): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Oonsoft/Oonsoft_details/${Oonsoft_product_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    countrieslist(): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Seller/_admin_currency_list`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    countries_status(avl_countries_id: string, data: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}Seller/change_status/${avl_countries_id}`, data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    country_addProduct(data: any): Observable<any> {
        return this.http.post(environment.ApiUrl + 'Seller/create_sh_avilable_country', data).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
    countries_delete(avl_countries_id: string): Observable<any> {
        return this.http.delete(`${environment.ApiUrl}Seller/delete_currency/${avl_countries_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    delete_product(product_id: string): Observable<any> {
        return this.http.delete(`${environment.ApiUrl}Product/delete_product/${product_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    delete_oonsoft_product(Oonsoft_product_id: string): Observable<any> {
        return this.http.delete(`${environment.ApiUrl}Oonsoft/delete/${Oonsoft_product_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }

    address_details(AddressId: any): Observable<any> {
        return this.http.get(`${environment.ApiUrl}customer/get_customer_deatils/${AddressId}`).pipe(
            tap(() => {
                this._refreshNeeded$.next(); // optional side effect
            })
        );
    }
    invoiceDetails(checkout_id: string): Observable<any> {
        return this.http.get(`${environment.ApiUrl}Seller/get_invoice/${checkout_id}`).pipe(
            tap(() => {
                this._refreshNeeded$.next();
            })
        );
    }
}