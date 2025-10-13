import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import jsPDF, { jsPDFOptions } from 'jspdf';
import 'jspdf-autotable';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CuentasDetailsService {

    APICtaAho = environment.APICtaAho;
    APICliAho = environment.APICliAho;
    APITrxAho = environment.APITrxAho;

    constructor(private http: HttpClient) { }

    postCuentaMovimientos(data: any) {
        const url = `${this.APITrxAho}/v1/transaccion/debito/movimientos/ext/Plan`;
        return this.http.post(url, data, {});
    }

    postSaldosMes(data: any) {
        const url = `${this.APITrxAho}/v1/transaccion/debito/movimientos/ext`;
        return this.http.post(url, data, {});
    }

    getCuentaAutorizaciones(uIdCliente: any, uIdCuenta: any, fini: any, ffin: any, pagina: any, tamanio: any) {
        const url = `${this.APITrxAho}/v1/transaccion/debito/cliente/${uIdCliente}/cuenta/${uIdCuenta}?fechaDesde=${fini}&fechaHasta=${ffin}&pagina=${pagina}&tamanioPagina=${tamanio}`;
        return this.http.get(url);
    }

    getCuentaBloqueos(uIdCuenta: any) {
        const url = `${this.APICtaAho}/v1/bloqueo/cuenta/${uIdCuenta}`;
        return this.http.get(url);
    }

    getCuentaRetenciones(uIdCuenta: any) {
        const url = `${this.APICtaAho}/v1/retencion/cuenta/${uIdCuenta}`;
        return this.http.get(url);
    }

    getTarjetaBloqueos(idTarjeta: any, uIdCliente: any, uIdCuenta: any, token: any) {
        const url = `${this.APICtaAho}/v1/bloqueo/tarjeta/${idTarjeta}/cliente/${uIdCliente}/cuenta/${uIdCuenta}/token/${token}`;
        return this.http.get(url);
    }

    getCuentaPagosPorBloqueo(uIdCuenta: any, idBloqueo: any) {
        const url = `${this.APICtaAho}/v1/beneficiario/pagos/uidcuenta/${uIdCuenta}/idbloqueo/${idBloqueo}`;
        return this.http.get(url);
    }

    getTarjetas(clienteUid: any, cuentaUid: any) {
        const url = `${this.APICtaAho}/v1/cuenta/cliente/${clienteUid}/cuenta/${cuentaUid}/tarjetas`;
        return this.http.get(url);
    }

    getPagoRetencion(uIdCuenta: any, idRetencion: any) {
        const url = `${this.APICtaAho}/v1/beneficiario/pagos/uidcuenta/${uIdCuenta}/idretencion/${idRetencion}`;
        return this.http.get(url);
    }

    getDatosAjuste(idTransaccion: any) {
        const url = `${this.APICtaAho}/v1/ajuste/transaccion/${idTransaccion}`;
        return this.http.get(url);
    }

    getObtenerSaldos(cuenta: any, uIdCliente: string, uIdCuenta: string): Observable<any> {
        const response1 = this.http.get(`${this.APICtaAho}/v1/saldo/uidCliente/${uIdCliente}/uidCuenta/${uIdCuenta}`);
        const response2 = this.http.get(`${this.APICtaAho}/v1/cuenta/intereses/${cuenta.idCuenta}/saldoDisponible/0/saldoRetenido/0`);
        const response3 = this.http.get(`${this.APITrxAho}/v1/transaccion/debito/estado-cuenta/cliente/${uIdCliente}/cuenta/${uIdCuenta}`);
        return forkJoin([response1, response2, response3]);
    }

    getInteresTarifario(object: any) {
        const url = `${this.APICtaAho}/v1/interes/tarifario`;
        return this.http.post(url, object);
    }

    getDatosCabeceraMovimiento(idTransaccion: any, numeroCuenta: any) {
        const url = `${this.APICtaAho}/v1/ajuste/customer/cabecera/idtransaccion/${idTransaccion}/numerocuenta/${numeroCuenta}`;
        return this.http.get(url);
    }

    getDatosDetalleMovimiento(idCabecera: any) {
        const url = `${this.APICtaAho}/v1/ajuste/customer/detalle/idCabecera/${idCabecera}`;
        return this.http.get(url);
    }

    async postAjusteAbonoInteres(object: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.APICtaAho}/v1/interes/ajuste/abono`, object).subscribe({
                next: (data: any) => {
                    return resolve(data);
                },
                error: (err) => reject(err),
            });
        });
    }

    async postAjusteRetiroInteres(object: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.APICtaAho}/v1/interes/ajuste/cargo`, object).subscribe({
                next: (data: any) => {
                    return resolve(data);
                },
                error: (err) => reject(err),
            });
        });
    }

    async postAjusteAbonoCapital(object: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.APICtaAho}/v1/saldo/ajuste/abono`, object).subscribe({
                next: (data: any) => {
                    return resolve(data);
                },
                error: (err) => reject(err),
            });
        });
    }

    async postAjusteRetiroCapital(object: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.APICtaAho}/v1/saldo/ajuste/retiro`, object).subscribe({
                next: (data: any) => {
                    return resolve(data);
                },
                error: (err) => reject(err),
            });
        });
    }

    async postDetalleAjusteSaldo(object: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.APICtaAho}/v1/ajuste/customer/detalle/actualizar`, object).subscribe({
                next: (data: any) => {
                    return resolve(data);
                },
                error: (err) => reject(err),
            });
        });
    }

    templateConstanciaBloqueoCuentaPdf(data: any) {
        // const jsPDFConfig = {
        //     orientation: 'portrait',
        //     unit: 'pt',
        //     format: 'a4',
        //     putOnlyUsedFonts: true
        // };

        // const doc = new jsPDF(jsPDFConfig);

        const jsPDFConfig: jsPDFOptions = {
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
        };

        const doc = new jsPDF(jsPDFConfig);

        let img = new Image();
        img.src = 'assets/images/backgrounds/constanciaBloqueoCuenta.jpg';
        doc.addImage(img, 'jpg', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

        doc.setTextColor(2, 50, 95);

        /*********************************/

        doc.setFontSize(18);
        //doc.setFontStyle('bold');
        doc.setFont("helvetica", "bold");
        doc.text(`Nro : ${data.idBloqueo}`, 250, 85);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.tipoDocumento, 140, 140);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.numeroDocumento, 380, 140);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.nombreCliente, 140, 160);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.apellidoCliente, 380, 160);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.producto, 140, 232);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.numeroCuenta, 380, 232);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(`Bloqueo de Cuenta`, 140, 305);

        let motivoBloqueo = '';
        if (data.motivoBloqueo) {
            motivoBloqueo = data.motivoBloqueo.toLowerCase()
                .split(' ')
                .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(motivoBloqueo, 380, 305);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.fechaBloqueo, 140, 325);

        /*********************************/

        const name = `Constancia de bloqueo de cuenta ${data.producto}_${data.idBloqueo}.pdf`;

        doc.save(name);
    }

    templateConstanciaBloqueoTarjetaPdf(data: any) {
        // const jsPDFConfig = {
        //     orientation: 'portrait',     // 'portrait' o 'landscape'
        //     unit: 'pt',                  // unidades: 'pt', 'mm', 'cm', 'in'
        //     format: 'a4',                // tamaño de página: 'a4', 'letter', etc.
        //     putOnlyUsedFonts: true       // optimiza el tamaño del PDF
        // };

        // const doc = new jsPDF(jsPDFConfig);

        const jsPDFConfig: jsPDFOptions = {
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
            putOnlyUsedFonts: true
        };

        const doc = new jsPDF(jsPDFConfig);

        let img = new Image();
        img.src = 'assets/images/backgrounds/constanciaBloqueoTarjeta.jpg';
        doc.addImage(img, 'jpg', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());

        doc.setTextColor(2, 50, 95);

        /*********************************/

        doc.setFontSize(18);
        //doc.setFontStyle('bold');
        doc.setFont("helvetica", "bold");
        doc.text(`Nro : ${data.idExternoBloqueo}`, 250, 85);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.tipoDocumento, 140, 140);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.numeroDocumento, 380, 140);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.nombreCliente, 140, 160);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.apellidoCliente, 380, 160);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.producto, 140, 232);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.numeroTarjeta, 380, 232);

        /*********************************/

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(`Bloqueo de Tarjeta`, 140, 305);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.origen, 380, 305);

        /*********************************/

        let motivoBloqueo = '';
        if (data.motivoBloqueo) {
            motivoBloqueo = data.motivoBloqueo.toLowerCase()
                .split(' ')
                .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(motivoBloqueo, 140, 325);

        doc.setFontSize(7.5);
        //doc.setFontStyle('normal');
        doc.setFont('helvetica', 'normal'); // estilo normal
        doc.text(data.fechaBloqueo, 380, 325);

        /*********************************/

        const name = `Constancia de bloqueo de tarjeta ${data.producto}_${data.idExternoBloqueo}.pdf`;

        doc.save(name);
    }
}
