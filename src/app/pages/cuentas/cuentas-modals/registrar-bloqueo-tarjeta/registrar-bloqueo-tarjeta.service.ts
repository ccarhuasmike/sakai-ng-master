import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
environment
@Injectable({
    providedIn: 'root'
})
export class RegistrarBloqueoTarjetaService {

    APICtaAho = environment.APICtaAho;

    constructor(private http: HttpClient) {
        
    }

    postBloqueoTarjeta(object:any) {
        const url = `${this.APICtaAho}/v1/bloqueo/tarjeta`;
        return this.http.post(url, object);
    }
}
