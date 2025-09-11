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
import { Customer, CustomerService, Representative } from '../service/customer.service';
import { Product, ProductService } from '../service/product.service';
import { ObjectUtils } from "primeng/utils";
import { CommonService } from '../service/commonService';
import { DatetzPipe } from '@/layout/Utils/pipes/datetz.pipe';
import { Cliente } from '@/layout/models/cliente';
//import { MessageModule } from 'primeng/message';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DOCUMENT } from '@/layout/Utils/constants/aba.constants';
import { SecurityEncryptedService } from '@/layout/service/SecurityEncryptedService';
import { Router } from '@angular/router';

//import { DropdownModule } from 'primeng/dropdown';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-cuentas',
    standalone: true,
    templateUrl: './cuentas.component.html',
    styleUrls: ['./cuentas.component.css'],
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
        IconFieldModule
    ],
    providers: [ConfirmationService, MessageService, CustomerService, ProductService, DatetzPipe]
})
export class CuentasComponent implements OnInit {
    mostrarFiltro = false;
    datosCliente: Cliente = new Cliente();
    datosCuentas: any[] = [];
    documentos: any[] = [];
    tipoBusqueda: any[] = [
        { id: 0, field: 'Documento Identidad' },
        //{ id: 1, field: 'Número de Cuenta' },
        // { id: 2, field: 'Nombres y Apellidos' },
        { id: 3, field: 'Número Tarjeta' }
    ];
    resp: any = {
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
                }
            ]
        }
    }
    respCliente: any = {
        "codigo": 0,
        "mensaje": "OK",
        "data": {
            "idCliente": 348836,
            "uIdCliente": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
            "numDocIdentidad": "01248626",
            "codTipoDocIdentidad": "01",
            "desCodTipoDoc": "DNI",
            "nombresApellidos": "Luis Gerardo Martinez  ",
            "estado": "ACTIVO",
            "fechaIngreso": "2025-04-08T15:33:35",
            "fechaActualizacion": "2025-08-08T23:18:32"
        }
    }
    customers1: Customer[] = [];

    // customers2: Customer[] = [];

    // customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    balanceFrozen: boolean = false;

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    formBusqueda!: FormGroup;
    nroCaracter: number = 0;

    tipoFiltro: any = null;
    tipoDocumento: any = '';
    nroDocumento: any = '';
    nombreApellido: any = '';
    nroTarjeta: any = '';
    nroCuenta: any = '';
    uidCliente: any = '';


    cols: any[] = [
        { field: 'producto', header: 'Producto', align: 'left' },
        { field: 'nombresApellidos', header: 'Nombre titular', align: 'left' },
        { field: 'numeroCuenta', header: 'Nro de cuenta', align: 'center' },
        { field: 'motivoBloqueo', header: 'Estado', align: 'center' },
        { field: 'fechaApertura', header: 'Fecha apertura', align: 'center' },
        { field: 'fechaBaja', header: 'Fecha Baja', align: 'center' },
        { field: 'desCodTipoDoc', header: 'Tipo documento', align: 'center' },
        { field: 'numDocIdentidad', header: 'Documento identidad', align: 'center' }
    ];


    constructor(
        private router: Router,
        private toastr: MessageService,
        private customerService: CustomerService,
        private productService: ProductService,
        private commonService: CommonService,
        private securityEncryptedService: SecurityEncryptedService,
        private fb: FormBuilder
    ) {

    }

    createForm() {
        this.formBusqueda = this.fb.group({
            tipoFiltro: new FormControl(this.tipoFiltro, [Validators.required]),
            tipoDocumento: new FormControl(this.tipoDocumento),
            nroDocumento: new FormControl(this.nroDocumento),
            nroCuenta: new FormControl(this.nroCuenta),
            nombreApellido: new FormControl(this.nombreApellido),
            nroTarjeta: new FormControl(this.nroTarjeta)
            // tipoFiltro: [this.tipoFiltro, [Validators.required]],
            // tipoDocumento: [this.tipoDocumento],
            // nroDocumento: [this.nroDocumento],
            // nroCuenta: [this.nroCuenta],
            // nombreApellido: [this.nombreApellido],
            // nroTarjeta: [this.nroTarjeta]
        });
    }
    changeModelTipoDocumento(event: any) {
        

        if (event.value == 1) {
            this.nroCaracter = 8;
            this.formBusqueda.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracter), Validators.maxLength(this.nroCaracter), Validators.required])
        } else if (event.value == 2) {
            this.nroCaracter = 9;
            this.formBusqueda.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracter), Validators.maxLength(this.nroCaracter), Validators.required])
        } else if (event.value == 3) {
            this.nroCaracter = 11;
            this.formBusqueda.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracter), Validators.maxLength(this.nroCaracter), Validators.required])
        } else {
            this.nroCaracter = 0;
            this.formBusqueda.get('nroDocumento')!.clearValidators();
        }
        this.formBusqueda.get('nroDocumento')!.updateValueAndValidity();
    }
    limpiar() {
        this.filtro = { tipoDoc: null, numDoc: '' };
        //this.buscar(); // recarga todo sin filtros
    }
    buscar() {

    }
    ngOnInit() {
        this.getCombos();
        this.createForm();
        
        //this.toastr.add({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
        this.search();
        //this.service.add({ severity: 'info', summary: 'Info Message', detail: 'PrimeNG rocks' });
        //this.toastr.add({ severity: 'success', summary: 'Success Message', detail: 'Message sent' });
        // this.customerService.getCustomersLarge().then((customers) => {
        //     this.customers1 = customers;
        //     this.loading = false;

        //     // @ts-ignore
        //     this.customers1.forEach((customer) => (customer.date = new Date(customer.date)));
        // });
        // this.customerService.getCustomersMedium().then((customers) => (this.customers2 = customers));
        // this.customerService.getCustomersLarge().then((customers) => (this.customers3 = customers));
        //this.productService.getProductsWithOrdersSmall().then((data) => (this.products = data));

        // this.representatives = [
        //     { name: 'Amy Elsner', image: 'amyelsner.png' },
        //     { name: 'Anna Fali', image: 'annafali.png' },
        //     { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        //     { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        //     { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        //     { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        //     { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        //     { name: 'Onyama Limba', image: 'onyamalimba.png' },
        //     { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        //     { name: 'XuXue Feng', image: 'xuxuefeng.png' }
        // ];

        // this.statuses = [
        //     { label: 'Unqualified', value: 'unqualified' },
        //     { label: 'Qualified', value: 'qualified' },
        //     { label: 'New', value: 'new' },
        //     { label: 'Negotiation', value: 'negotiation' },
        //     { label: 'Renewal', value: 'renewal' },
        //     { label: 'Proposal', value: 'proposal' }
        // ];
    }
    filtro = {
        tipoDoc: null,
        numDoc: ''
    };
    aplicarFiltro(dt: any, op: any) {
        dt.filter(this.filtro.tipoDoc, 'desCodTipoDoc', 'equals');
        dt.filter(this.filtro.numDoc, 'numDocIdentidad', 'contains');
        op.hide(); // cerrar el overlay
    }

    limpiarFiltro(dt: any) {
        this.filtro = { tipoDoc: null, numDoc: '' };
        dt.clear();
    }
   goToAccount(data: any) {
        
        const uidCuenta = this.securityEncryptedService.encrypt(data.uIdCuenta);
        const uidCliente = this.securityEncryptedService.encrypt(this.uidCliente);

        this.router.navigate(['/cuenta/detalle', {
            cuenta: uidCuenta,
            cliente: uidCliente,
            tipoDoc: this.tipoDocumento,
            numDoc: this.nroDocumento,
            numCuenta: this.nroCuenta,
        }]);
    }
    search() {
        this.datosCliente = new Cliente();
        this.datosCuentas = [];
        this.getCliente();
        this.getCuenta();
    }
    getCombos() {
        var resp = [
            {
                "codigo": "01",
                "nombre": "DNI"
            },
            {
                "codigo": "02",
                "nombre": "Carnet Extranjeria"
            },
            {
                "codigo": "03",
                "nombre": "RUC"
            }
        ];
        this.documentos = resp.filter(item => item['nombre'] !== DOCUMENT.RUC)
            .map((item) => {
                return {
                    id: item['codigo'],
                    descripcion: item['nombre']
                }
            });

        // this.commonService.getMultipleCombosPromiseCliente(['documentos/tipos'])
        //     .then(resp => {
        //         this.documentos = resp[0]['data']['content'].filter(item => item['nombre'] !== DOCUMENT.RUC)
        //             .map((item) => {
        //                 return {
        //                     id: item['codigo'],
        //                     descripcion: item['nombre']
        //                 }
        //             });
        //     })
    }
    getCliente() {
        if (this.respCliente['codigo'] == 0) {
            this.datosCliente = this.respCliente['data'];
            this.uidCliente = this.respCliente['data'].uIdCliente;
        } else if (this.respCliente['codigo'] == -1) {
            this.toastr.add({ severity: 'error', summary: 'Mensaje de error', detail: this.respCliente['mensaje'] });
        } else if (this.respCliente['codigo'] == 1) {
            this.toastr.add({ severity: 'error', summary: 'Mensaje de error', detail: "El cliente que se intenta buscar no existe" });
        }
    }
    getCuenta() {
        if (this.resp['codigo'] == 0) {
            
            this.datosCuentas = this.resp['data'].content;
            let desCodTipoDoc = this.datosCliente.desCodTipoDoc;
            let numDocIdentidad = this.datosCliente.numDocIdentidad;
            if (desCodTipoDoc == 'DNI' && numDocIdentidad.length < 8) {
                const limit = 8 - numDocIdentidad.length;
                for (let index = 0; index < limit; index++) {
                    numDocIdentidad = '0' + numDocIdentidad;
                }
            }

            this.datosCuentas = this.datosCuentas.map((row: any) => {
                return {
                    ...row,
                    nombresApellidos: this.datosCliente.nombresApellidos,
                    desCodTipoDoc: desCodTipoDoc,
                    numDocIdentidad: numDocIdentidad
                }
            });


            this.loading = false;
        }
    }


    // getCliente(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         const tipoDocumento = this.formBusqueda.get('tipoDocumento').value;
    //         const numeroDocumento = this.formBusqueda.get('nroDocumento').value;
    //         this.commonService.getCliente(tipoDocumento, numeroDocumento)
    //             .subscribe(
    //                 (resp: any) => {
    //                     console.log('getCliente()...', resp);

    //                     if (resp['codigo'] == 0) {
    //                         this.datosCliente = resp['data'];
    //                         this.uidCliente = resp['data'].uIdCliente;
    //                     } else if (resp['codigo'] == -1) {
    //                         this.toastr.add(resp['mensaje'], 'Error getCliente');
    //                     } else if (resp['codigo'] == 1) {
    //                         this.toastr.add('El cliente que se intenta buscar no existe', 'Error getCliente');
    //                     }
    //                     resolve(true);
    //                 },
    //                 (_error) => {
    //                     this.toastr.error('Error en el servicio de obtener datos del cliente', 'Error getCliente');
    //                     reject();
    //                 }
    //             );
    //     });
    // }
    //getCuenta(): Promise<any> {

    // return new Promise((resolve, reject) => {
    //     const clienteUid = this.uidCliente;
    //     this.commonService.getCuenta(clienteUid)
    //         .subscribe((resp: any) => {
    //             console.log('getCuenta()...', resp);
    //             if (resp['codigo'] == 0) {
    //                 this.datosCuentas = resp['data'].content;

    //                 let desCodTipoDoc = this.datosCliente.desCodTipoDoc;
    //                 let numDocIdentidad = this.datosCliente.numDocIdentidad;
    //                 if (desCodTipoDoc == 'DNI' && numDocIdentidad.length < 8) {
    //                     const limit = 8 - numDocIdentidad.length;
    //                     for (let index = 0; index < limit; index++) {
    //                         numDocIdentidad = '0' + numDocIdentidad;
    //                     }
    //                 }

    //                 this.datosCuentas = this.datosCuentas.map((row: any) => {
    //                     return {
    //                         ...row,
    //                         nombresApellidos: this.datosCliente.nombresApellidos,
    //                         desCodTipoDoc: desCodTipoDoc,
    //                         numDocIdentidad: numDocIdentidad
    //                     }
    //                 });

    //                 if (this.nroCuenta) {
    //                     this.datosCuentas = this.datosCuentas.filter((row: any) => row.numeroCuenta == this.nroCuenta);
    //                 }
    //             } else if (resp['codigo'] == -1) {
    //                 this.toastr.error(resp['mensaje'], 'Error getCuenta');
    //             }
    //             resolve(true);
    //         }, (_error) => {
    //             this.toastr.error('Error en el servicio de obtener datos de la cuenta', 'Error getCuenta');
    //             reject();
    //         });
    // });
    // }

    onSort() {
        //this.updateRowGroupMetaData();
    }

    // updateRowGroupMetaData() {
    //     this.rowGroupMetadata = {};

    //     if (this.customers3) {
    //         for (let i = 0; i < this.customers3.length; i++) {
    //             const rowData = this.customers3[i];
    //             const representativeName = rowData?.representative?.name || '';

    //             if (i === 0) {
    //                 this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
    //             } else {
    //                 const previousRowData = this.customers3[i - 1];
    //                 const previousRowGroup = previousRowData?.representative?.name;
    //                 if (representativeName === previousRowGroup) {
    //                     this.rowGroupMetadata[representativeName].size++;
    //                 } else {
    //                     this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
    //                 }
    //             }
    //         }
    //     }
    // }

    expandAll() {
        if (ObjectUtils.isEmpty(this.expandedRows)) {
            this.expandedRows = this.products.reduce(
                (acc, p) => {
                    if (p.id) {
                        acc[p.id] = true;
                    }
                    return acc;
                },
                {} as { [key: string]: boolean }
            );
            this.isExpanded = true;
        } else {
            this.collapseAll()
        }

    }

    collapseAll() {
        this.expandedRows = {};
        this.isExpanded = false;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }

    // calculateCustomerTotal(name: string) {
    //     let total = 0;

    //     if (this.customers2) {
    //         for (let customer of this.customers2) {
    //             if (customer.representative?.name === name) {
    //                 total++;
    //             }
    //         }
    //     }

    //     return total;
    // }
}
