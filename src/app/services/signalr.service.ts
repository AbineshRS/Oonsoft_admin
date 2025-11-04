import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environtments/environment';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    private hubConnection!: signalR.HubConnection;
    signialr: string = environment.siginalR;

    public startConnection(): Promise<void> {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.signialr + 'producthub')
            .build();

        return this.hubConnection
            .start()
            .then()
            .catch(err => {
                throw err;
            });
    }


    public onProductListUpdate(callback: () => void): void {
        this.hubConnection.on('ReceiveProductListUpdate', () => {
            callback();
        });
    }

    public onSingleProductUpdate(callback: (productId: string) => void): void {
        this.hubConnection.on('UpdatedProduct', (productId: string) => {
            callback(productId);
        });
    }
    public onSingleChekout(callback: (checkout_id: string) => void): void {
        this.hubConnection.on('UpdatedChekoutProduct', (chekout_id: string) => {
            callback(chekout_id);
        });
    }
    public onCustomer(callback: (userId: string) => void): void {
        this.hubConnection.on('UpdatedUsers', (userId: string) => {
            callback(userId);
        })
    }
    public onOonsoftproducts(callback: (Oonsoft_product_id: string) => void): void {
        this.hubConnection.on('UpdatedOonsoftproducts', (Oonsoft_product_id: string) => {
            callback(Oonsoft_product_id);
        })
    }
}
