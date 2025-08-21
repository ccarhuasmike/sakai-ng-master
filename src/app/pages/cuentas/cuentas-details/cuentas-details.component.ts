import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Customer, CustomerService, Representative } from '../../service/customer.service';
import { Product, ProductService } from '../../service/product.service';
import { ObjectUtils } from "primeng/utils";
import { CommonService } from '../../service/commonService';
import { DatetzPipe } from '@/layout/Utils/pipes/datetz.pipe';
import { Cliente } from '@/layout/models/cliente';
//import { MessageModule } from 'primeng/message';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { CALENDAR_DETAIL, DOCUMENT, FILE_TYPE, ROLES } from '@/layout/Utils/constants/aba.constants';
import { SecurityEncryptedService } from '@/layout/service/SecurityEncryptedService';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuenta } from '@/layout/models/cuenta';
import { FieldsetModule } from 'primeng/fieldset';
import { CuentasDetailsService } from './cuentas-details.service';
//import { DropdownModule } from 'primeng/dropdown';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-cuentas-details',
    standalone: true,
    templateUrl: './cuentas-details.component.html',
    styleUrls: ['./cuentas-details.component.scss'],
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        MessageModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        FieldsetModule
    ],
    providers: [ConfirmationService, MessageService, CustomerService, ProductService, DatetzPipe]
})
export class CuentasDetailsComponent implements OnInit {
    bin: string = '';
    listaRed: any[] = [];
    listProductos: any[] = [];
    listaTipoRentecion: any[] = [];

    uidCliente: any = '';
    uidCuenta: any = '';
    tipoDoc: any = '';
    numDoc: any = '';

    disableActions = true;
    showCancelButton = false;
    showCardContainer = false;
    showCceButton = false;

    rows = 10;

    //fechaRangoMovimientos: [Date, Date] = [null, null];
    finiMovimientos: any = null;
    ffinMovimientos: any = null;

    //fechaSaldoMes: Date = null;
    finiSaldoMes: any = null;
    ffinSaldoMes: any = null;

    es = CALENDAR_DETAIL

    // Client
    datosCliente: Cliente = new Cliente();

    // Account
    datosCuenta: Cuenta = new Cuenta();

    // Balance
    saldoAutorizado: any = [];
    datosSaldoPorPlan: any = null;
    loadingSaldos!: boolean;

    // Consulta
    datosTarjetas: any[] = [];
    loadingTarjetas!: boolean;

    // Movements
    datosMovimientos: any[] = [];
    loadingMovimientos!: boolean;

    datosSaldosMes: any[] = [];
    loadingSaldosMes!: boolean;

    // Blocks
    datosCuentaBloqueos = [];
    loadingCuentaBloqueos!: boolean;

    datosTarjetaBloqueos = [];
    loadingTarjetaBloqueos!: boolean;

    datosPagosPorBloqueo = [];
    loadingPagosPorBloqueo!: boolean;

    // Holdbacks
    datosPagoRetencion = [];
    loadingPagoRetencion!: boolean;

    datosRetenciones = [];
    loadingRetenciones!: boolean;

    // Intereses
    datosInteresTarifario: any;

    roles: any = ROLES;

    constructor(
        private cuentasDetailsService: CuentasDetailsService,
        private router: Router,
        private toastr: MessageService,
        private customerService: CustomerService,
        private productService: ProductService,
        private commonService: CommonService,
        private securityEncryptedService: SecurityEncryptedService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.params.subscribe((params: any) => {
            this.uidCuenta = params.cuenta ? this.securityEncryptedService.decrypt(params.cuenta) : this.uidCuenta;
            this.uidCliente = params.cliente ? this.securityEncryptedService.decrypt(params.cliente) : this.uidCliente;
            this.tipoDoc = params.tipoDoc ? params.tipoDoc : this.tipoDoc;
            this.numDoc = params.numDoc ? params.numDoc : this.numDoc;
            this.loadPage();
        });
    }

    limpiar() {

    }
    buscar() {

    }
    ngOnInit() {
        this.loadPage();
    }
    listAccounts() {
        // this.dialog.open(VerCuentaRelacionadaComponent, {
        //   width: '1000px',
        //   data: this.listProductos
        // });
    }
    loadPage() {
        this.getCuenta();
        // this.getCliente();
        // this.getClientePuc();
        // this.getCuentaTarjetas();
        // this.getCuentaRetenciones();
        // this.getCuentaBloqueos();
    }
    getCuenta() {
        debugger;
        this.loadingSaldos = true;
        this.disableActions = false;
        const clienteUid = this.uidCliente;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": {
                "content": [
                    {
                        "idCuenta": 371532,
                        "uIdCuenta": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "codTipoCuenta": "02",
                        "idCliente": 348836,
                        "numeroCuenta": "510000601860",
                        "saldoDisponible": 11941.34,
                        "saldoContable": 13691.07,
                        "saldoRetenido": 1749.73,
                        "saldoPendiente": 0.0,
                        "codEstadoCuenta": "01",
                        "codigoMotivo": "00",
                        "fechaRegistro": "2025-04-08T15:33:38",
                        "fechaModificacion": "2025-04-08T15:33:38",
                        "anteriorCodEstadoCuenta": null,
                        "anteriorCodigoMotivo": null,
                        "fechaApertura": "2025-04-08T15:33:38",
                        "fechaBaja": null,
                        "producto": "AhorrOh!",
                        "estadoCuenta": "ACTIVA",
                        "anteriorEstadoCuenta": "",
                        "motivoBloqueo": "ACTIVA",
                        "anteriorMotivoBloqueo": "",
                        "numeroCuentaCci": "09400151000060186053"
                    },
                    {
                        "idCuenta": 375471,
                        "uIdCuenta": "f55e22ad-e639-403c-8a1c-ae4e6025c5f1",
                        "codTipoCuenta": "01",
                        "idCliente": 348836,
                        "numeroCuenta": "410000809478",
                        "saldoDisponible": 0.0,
                        "saldoContable": 0.0,
                        "saldoRetenido": 0.0,
                        "saldoPendiente": 0.0,
                        "codEstadoCuenta": "01",
                        "codigoMotivo": "00",
                        "fechaRegistro": "2025-08-08T23:18:32",
                        "fechaModificacion": "2025-08-08T23:18:32",
                        "anteriorCodEstadoCuenta": null,
                        "anteriorCodigoMotivo": null,
                        "fechaApertura": "2025-08-08T23:18:32",
                        "fechaBaja": null,
                        "producto": "Oh!Pay",
                        "estadoCuenta": "ACTIVA",
                        "anteriorEstadoCuenta": "",
                        "motivoBloqueo": "ACTIVA",
                        "anteriorMotivoBloqueo": "",
                        "numeroCuentaCci": "09400141000080947855"
                    },
                    {
                        "idCuenta": 371533,
                        "uIdCuenta": "9da34da6-074f-4548-8f71-b81bd2a10f9a",
                        "codTipoCuenta": "04",
                        "idCliente": 348836,
                        "numeroCuenta": "320000600415",
                        "saldoDisponible": 23770.95,
                        "saldoContable": 23770.95,
                        "saldoRetenido": 0.0,
                        "saldoPendiente": 0.0,
                        "codEstadoCuenta": "01",
                        "codigoMotivo": "00",
                        "fechaRegistro": "2025-04-08T15:36:36",
                        "fechaModificacion": "2025-04-08T15:36:36",
                        "anteriorCodEstadoCuenta": null,
                        "anteriorCodigoMotivo": null,
                        "fechaApertura": "2025-04-08T15:36:36",
                        "fechaBaja": null,
                        "producto": "AhorraMás Dólares",
                        "estadoCuenta": "ACTIVA",
                        "anteriorEstadoCuenta": "",
                        "motivoBloqueo": "ACTIVA",
                        "anteriorMotivoBloqueo": "",
                        "numeroCuentaCci": "09400132000060041557"
                    },
                    {
                        "idCuenta": 371657,
                        "uIdCuenta": "0c2e2635-23db-4811-9fb0-78659f3274ad",
                        "codTipoCuenta": "03",
                        "idCliente": 348836,
                        "numeroCuenta": "310008003288",
                        "saldoDisponible": 13408.72,
                        "saldoContable": 13408.72,
                        "saldoRetenido": 0.0,
                        "saldoPendiente": 0.0,
                        "codEstadoCuenta": "01",
                        "codigoMotivo": "00",
                        "fechaRegistro": "2025-04-15T21:50:05",
                        "fechaModificacion": "2025-04-15T21:50:05",
                        "anteriorCodEstadoCuenta": null,
                        "anteriorCodigoMotivo": null,
                        "fechaApertura": "2025-04-15T21:50:05",
                        "fechaBaja": null,
                        "producto": "AhorraMás Soles",
                        "estadoCuenta": "ACTIVA",
                        "anteriorEstadoCuenta": "",
                        "motivoBloqueo": "ACTIVA",
                        "anteriorMotivoBloqueo": "",
                        "numeroCuentaCci": "09400131000800328856"
                    }
                ]
            }
        }

        this.loadingSaldos = false;

        console.log('getCuenta()...', resp);
        if (resp['codigo'] == 0) {
            const datosCuenta: any = resp['data'].content.find((e: any) => e.uIdCuenta === this.uidCuenta);
            this.bin = datosCuenta.numeroCuenta.slice(0, 2);
            this.showCardContainer = false;

            if (this.bin == '41') {
                this.showCardContainer = true;
            }

            let excluirUidCuenta = [this.uidCuenta];

            this.listProductos = resp['data'].content.filter(product => !excluirUidCuenta.includes(product.uIdCuenta)).map((x: any) => {
                var object = {
                    uidCuenta: x.uIdCuenta,
                    uidCliente: this.uidCliente,
                    tipoDoc: this.tipoDoc,
                    numDoc: this.numDoc,
                    producto: x.producto,
                    numCuenta: x.numeroCuenta,
                    codEstadoCuenta: x.codEstadoCuenta,
                    motivoBloqueo: x.motivoBloqueo,
                    fechaApertura: x.fechaApertura,
                    fechaBaja: x.fechaBaja
                }

                return object;
            });

            this.datosCuenta.numeroCuenta = datosCuenta.numeroCuenta;
            this.datosCuenta.numeroCuentaCci = datosCuenta.numeroCuentaCci;
            this.datosCuenta.estadoCuenta = datosCuenta.estadoCuenta;
            this.datosCuenta.codigoEstadoCuenta = datosCuenta.codEstadoCuenta;
            this.datosCuenta.motivoBloqueo = datosCuenta.motivoBloqueo;
            this.datosCuenta.codigoMotivoBloqueo = datosCuenta.codigoMotivo;
            this.datosCuenta.producto = datosCuenta.producto;
            this.datosCuenta.fechaApertura = datosCuenta.fechaApertura;
            this.datosCuenta.fechaBaja = datosCuenta.fechaBaja;
            this.datosCuenta.saldoDisponible = datosCuenta.saldoDisponible;
            this.datosCuenta.saldoRetenido = datosCuenta.saldoRetenido;
            if (this.datosCuenta.codigoEstadoCuenta == '03') {
                this.disableActions = true;
            }
            // this.getSaldosMes();
            // this.getCuentaMovimientos();
            // this.getInteresTarifarios();
            this.getDatosSaldos(datosCuenta);
        } else if (resp['codigo'] == -1) {
            this.saldoAutorizado = [];
            this.datosMovimientos = [];
            this.datosSaldoPorPlan = null;
            this.loadingSaldos = false;
            this.disableActions = true;
            this.toastr.add({ severity: 'error', summary: 'Error getCuenta', detail: resp['mensaje'] });
        }

        // this.commonService.getCuenta(clienteUid)
        //     .subscribe((resp) => {
        //         this.loadingSaldos = false;

        //         console.log('getCuenta()...', resp);

        //         if (resp['codigo'] == 0) {

        //             const datosCuenta = resp['data'].content.find((e: any) => e.uIdCuenta === this.uidCuenta);

        //             this.bin = datosCuenta.numeroCuenta.slice(0, 2);

        //             this.showCardContainer = false;

        //             if (this.bin == '41') {
        //                 this.showCardContainer = true;
        //             }

        //             let excluirUidCuenta = [this.uidCuenta];

        //             this.listProductos = resp['data'].content.filter(product => !excluirUidCuenta.includes(product.uIdCuenta)).map((x: any) => {
        //                 var object = {
        //                     uidCuenta: x.uIdCuenta,
        //                     uidCliente: this.uidCliente,
        //                     tipoDoc: this.tipoDoc,
        //                     numDoc: this.numDoc,
        //                     producto: x.producto,
        //                     numCuenta: x.numeroCuenta,
        //                     codEstadoCuenta: x.codEstadoCuenta,
        //                     motivoBloqueo: x.motivoBloqueo,
        //                     fechaApertura: x.fechaApertura,
        //                     fechaBaja: x.fechaBaja
        //                 }

        //                 return object;
        //             });

        //             this.datosCuenta.numeroCuenta = datosCuenta.numeroCuenta;
        //             this.datosCuenta.numeroCuentaCci = datosCuenta.numeroCuentaCci;
        //             this.datosCuenta.estadoCuenta = datosCuenta.estadoCuenta;
        //             this.datosCuenta.codigoEstadoCuenta = datosCuenta.codEstadoCuenta;
        //             this.datosCuenta.motivoBloqueo = datosCuenta.motivoBloqueo;
        //             this.datosCuenta.codigoMotivoBloqueo = datosCuenta.codigoMotivo;
        //             this.datosCuenta.producto = datosCuenta.producto;
        //             this.datosCuenta.fechaApertura = datosCuenta.fechaApertura;
        //             this.datosCuenta.fechaBaja = datosCuenta.fechaBaja;
        //             this.datosCuenta.saldoDisponible = datosCuenta.saldoDisponible;
        //             this.datosCuenta.saldoRetenido = datosCuenta.saldoRetenido;
        //             if (this.datosCuenta.codigoEstadoCuenta == '03') {
        //                 this.disableActions = true;
        //             }
        //             this.getSaldosMes();
        //             this.getCuentaMovimientos();
        //             this.getInteresTarifarios();
        //             this.getDatosSaldos(datosCuenta);
        //         } else if (resp['codigo'] == -1) {
        //             this.saldoAutorizado = [];
        //             this.datosMovimientos = [];
        //             this.datosSaldoPorPlan = null;
        //             this.loadingSaldos = false;
        //             this.disableActions = true;
        //             this.toastr.add({ severity: 'error', summary: 'Error getCuenta', detail: resp['mensaje'] });
        //         }
        //     }, (_error) => {
        //         this.saldoAutorizado = [];
        //         this.datosMovimientos = [];
        //         this.datosSaldoPorPlan = null;
        //         this.loadingSaldos = false;
        //         this.disableActions = true;
        //         this.toastr.add({ severity: 'error', summary: 'Error getCuenta', detail: 'Error en el servicio de obtener datos de la cuenta' });

        //     });
    }
    getDatosSaldos(datosCuenta: any) {

        let resp: any = [
            {
                "codigo": 0,
                "mensaje": "OK",
                "data": {
                    "content": [
                        {
                            "codigoPlan": "01",
                            "idCuenta": 371532,
                            "saldoDisponible": 11941.34,
                            "saldoContable": 11941.34,
                            "ulitmoSaldoDisponible": 0.0
                        },
                        {
                            "codigoPlan": "02",
                            "idCuenta": 371532,
                            "saldoDisponible": 1749.73,
                            "saldoContable": 1749.73,
                            "ulitmoSaldoDisponible": 0.0
                        }
                    ]
                }
            },
            {
                "codigo": 0,
                "mensaje": "OK",
                "data": {
                    "saldoTotalCapital": 2.66,
                    "saldoTotalInteres": 2.66,
                    "planes": [
                        {
                            "tipo": "PLAN 1",
                            "codigoPlan": "01",
                            "capital": 2.52,
                            "interes": 2.52
                        },
                        {
                            "tipo": "PLAN 2",
                            "codigoPlan": "02",
                            "capital": 0.14,
                            "interes": 0.14
                        }
                    ]
                }
            },
            {
                "codigo": 0,
                "mensaje": "OK",
                "data": {
                    "clienteUid": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                    "cuentaUid": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                    "saldoAbono": 0,
                    "saldoCargo": 0,
                    "saldoTotal": 0
                }
            }
        ]

        let planes = [];
        if (resp[0].codigo == 0) {
            for (const element of resp[0].data.content) {
                let plan = '';
                switch (element.codigoPlan) {
                    case '01':
                        plan = 'Disponible  (Plan 1)';
                        break;
                    case '02':
                        plan = 'Retenido (Plan 2)';
                        break;
                    case '03':
                        plan = 'Garantizado (Plan 3)';
                        break;
                    default:
                        break;
                }
                planes.push({
                    plan: plan,
                    codigoPlan: element.codigoPlan,
                    capital: element.saldoDisponible,
                    interes: 0,
                    total: 0
                });
            }
        }
        planes = planes.sort((a, b) => a.codigoPlan.localeCompare(b.codigoPlan));
        if (resp[1].codigo == 0) {
            for (const element of resp[1].data.planes) {
                let index = planes.findIndex(plan => plan.codigoPlan == element.codigoPlan);
                if (index > -1) {
                    planes[index].interes = element.interes;
                }
            }
        }
        planes = planes.map((plan: any) => {
            const total = plan.capital + plan.interes;
            return { ...plan, total }
        })
        if (resp[2].codigo == 0) {
            this.saldoAutorizado.push({
                saldoPendiente: datosCuenta.saldoPendiente,
                saldoAbono: resp[2].data.saldoAbono,
                saldoCargo: resp[2].data.saldoCargo,
                saldoTotal: resp[2].data.saldoTotal
            });
        }
        this.datosSaldoPorPlan = {
            saldoCapital: planes.reduce((sum, item) => sum + item.capital, 0),
            saldoInteres: planes.reduce((sum, item) => sum + item.interes, 0),
            saldoTotal: planes.reduce((sum, item) => sum + item.total, 0),
            planes: planes
        }
        const hasNotZeroValues = planes.some(plan =>
            plan.capital !== 0 || plan.interes !== 0 || plan.total !== 0
        );
        if (
            !hasNotZeroValues &&
            datosCuenta.saldoPendiente == 0 &&
            (this.saldoAutorizado.length > 0 && this.saldoAutorizado[0].saldoAbono == 0) &&
            (this.saldoAutorizado.length > 0 && this.saldoAutorizado[0].saldoCargo == 0) &&
            (this.saldoAutorizado.length > 0 && this.saldoAutorizado[0].saldoTotal == 0)
        ) {
            this.showCancelButton = true;
        }
        console.log(this.datosSaldoPorPlan);
        // this.cuentasDetailsService.getObtenerSaldos(datosCuenta, this.uidCliente, this.uidCuenta).subscribe((resp: any) => {
        //     let planes = [];
        //     if (resp[0].codigo == 0) {
        //         for (const element of resp[0].data.content) {
        //             let plan = '';
        //             switch (element.codigoPlan) {
        //                 case '01':
        //                     plan = 'Disponible  (Plan 1)';
        //                     break;
        //                 case '02':
        //                     plan = 'Retenido (Plan 2)';
        //                     break;
        //                 case '03':
        //                     plan = 'Garantizado (Plan 3)';
        //                     break;
        //                 default:
        //                     return '';
        //             }
        //             planes.push({
        //                 plan: plan,
        //                 codigoPlan: element.codigoPlan,
        //                 capital: element.saldoDisponible,
        //                 interes: 0,
        //                 total: 0
        //             });
        //         }
        //     }
        //     planes = planes.sort((a, b) => a.codigoPlan.localeCompare(b.codigoPlan));
        //     if (resp[1].codigo == 0) {
        //         for (const element of resp[1].data.planes) {
        //             let index = planes.findIndex(plan => plan.codigoPlan == element.codigoPlan);
        //             if (index > -1) {
        //                 planes[index].interes = element.interes;
        //             }
        //         }
        //     }
        //     planes = planes.map((plan: any) => {
        //         const total = plan.capital + plan.interes;
        //         return { ...plan, total }
        //     })
        //     if (resp[2].codigo == 0) {
        //         this.saldoAutorizado.push({
        //             saldoPendiente: datosCuenta.saldoPendiente,
        //             saldoAbono: resp[2].data.saldoAbono,
        //             saldoCargo: resp[2].data.saldoCargo,
        //             saldoTotal: resp[2].data.saldoTotal
        //         });
        //     }
        //     this.datosSaldoPorPlan = {
        //         saldoCapital: planes.reduce((sum, item) => sum + item.capital, 0),
        //         saldoInteres: planes.reduce((sum, item) => sum + item.interes, 0),
        //         saldoTotal: planes.reduce((sum, item) => sum + item.total, 0),
        //         planes: planes
        //     }
        //     const hasNotZeroValues = planes.some(plan =>
        //         plan.capital !== 0 || plan.interes !== 0 || plan.total !== 0
        //     );
        //     if (
        //         !hasNotZeroValues &&
        //         datosCuenta.saldoPendiente == 0 &&
        //         (this.saldoAutorizado.length > 0 && this.saldoAutorizado[0].saldoAbono == 0) &&
        //         (this.saldoAutorizado.length > 0 && this.saldoAutorizado[0].saldoCargo == 0) &&
        //         (this.saldoAutorizado.length > 0 && this.saldoAutorizado[0].saldoTotal == 0)
        //     ) {
        //         this.showCancelButton = true;
        //     }
        // }, (_error) => {
        //     this.showCancelButton = false;
        //     this.toastr.add({ severity: 'error', summary: 'Error getCuenta', detail: "Error en el servicio de obtener saldos de la cuenta" });
        // });
    }

    descargarTemplateConstanciaBloqueoCuentaPdf(rowData: any) {

        const date = new Date(rowData.fechaBloqueo);
        date.setHours(date.getHours() - 5);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const ampm = Number(hours) >= 12 ? 'PM' : 'AM';
        const formattedHours = Number(hours) % 12 || 12;

        const fechaBloqueo = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;

        const data = {
            fechaBloqueo: fechaBloqueo,
            idBloqueo: rowData.idBloqueo,
            motivoBloqueo: rowData.descripcionMotivoBloqueo,
            tipoDocumento: this.datosCliente.desCodTipoDoc,
            numeroDocumento: this.datosCliente.numDocIdentidad,
            nombreCliente: this.datosCliente.nombres,
            apellidoCliente: this.datosCliente.apellidos,
            producto: this.datosCuenta.producto,
            numeroCuenta: this.datosCuenta.numeroCuenta
        }

        this.cuentasDetailsService.templateConstanciaBloqueoCuentaPdf(this.replaceNullUndefinedWithEmpty(data));
    }
    getCuentaBloqueos() {
        this.datosCuentaBloqueos = [];
        this.loadingCuentaBloqueos = true;
        const cuentaUid = this.uidCuenta;
        // this.cuentasDetailsService.getCuentaBloqueos(cuentaUid)
        //     .subscribe((resp) => {
        //         this.loadingCuentaBloqueos = false;

        //         console.log('getCuentaBloqueos()...', resp);

        //         if (resp['codigo'] == 0) {
        //             this.datosCuentaBloqueos = resp['data'].sort((a, b) => new Date(b.fechaBloqueo).getTime() - new Date(a.fechaBloqueo).getTime());
        //         } else if (resp['codigo'] == -1) {
        //             this.toastr.error(resp['mensaje'], 'Error getCuentaBloqueos');
        //         }
        //     }, (_error) => {
        //         this.loadingCuentaBloqueos = false;
        //         this.toastr.error('Error en el servicio de obtener bloqueos cuenta', 'Error getCuentaBloqueos');
        //     });
    }
    replaceNullUndefinedWithEmpty(obj: any) {
        for (let key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                obj[key] = '';
            }
        }
        return obj;
    }

    openDialogVerArchivo(base64File: any, fileName: any): void {
        const type = base64File.substring(base64File.indexOf('/') + 1, base64File.indexOf(';base64'));
        let displayFile = true;

        if (type !== FILE_TYPE.PDF && type !== FILE_TYPE.JPEG && type !== FILE_TYPE.PNG) {
            this.commonService.downloadFile(base64File, fileName);
            return;
        }

        // this.dialog.open(VerArchivoComponent, {
        //     width: '1000px',
        //     height: displayFile ? '90vh' : '150px',
        //     data: {
        //         base64File: base64File,
        //         fileName: fileName,
        //         displayFile: displayFile
        //     }
        // });
    }
}