import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProveedorService } from "../proveedor.service";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { MessageService, ConfirmationService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { KeyFilterModule } from "primeng/keyfilter";
import { MessageModule } from "primeng/message";
import { StepperModule } from "primeng/stepper";
import { ToastModule } from "primeng/toast";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { TYPE_PARTNER } from "@/layout/Utils/constants/aba.constants";
import { CommonService } from "@/pages/service/commonService";

import { TabsModule } from 'primeng/tabs';
@Component({
    selector: 'app-edit-proveedor',
    templateUrl: './edit-proveedor.component.html',
    styleUrls: ['./edit-proveedor.component.scss'],
    //animations: fuseAnimations,
    imports: [TabsModule, KeyFilterModule, ToggleSwitchModule, StepperModule, InputGroupAddonModule, InputGroupModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService, DialogService, ConfirmationService],
    encapsulation: ViewEncapsulation.None
})
export class EditProveedorComponent implements OnInit {

    data: any;
    filteredElement: any[] = [];
    proveedor: any = null;
    proveedores: any[] = [];
    proveedoresListado: any[] = [];
    //formTipoProveedor: FormGroup;
    formInfoBasicaProveedor!: FormGroup;
    formInfoContactoProveedor!: FormGroup;
    formDatosDireccion!: FormGroup;
    formCuentas!: FormGroup;
    departamento: any[] = [];
    departamentoSelected: any;
    provincia: any[] = [];
    provinciaSelected: any;
    distrito: any[] = [];
    distritoSelected: any;
    // tiposDocumentos: any[] = LEGAL_TYPE_PERSON;
    tipoDocumentoProveedor: any[] = [];
    tipoDocumentoProveedorSelected: any;
    banco: any[] = [{ id: '01', descripcion: 'INTERBANK' }, { id: '02', descripcion: 'BCP', }];
    tipoCuenta: any[] = [{ id: 1, descripcion: 'SOLES' }, { id: 2, descripcion: 'DOLARES' }]
    tipoMoneda: any[] = [{ id: 1, descripcion: 'USD' }, { id: 2, descripcion: 'PEN' }];
    tipoDocumentoOriginal: any[] = [];
    nroCaracterProveedor: number = 0;
    datosCuentas: any[] = [];
    tipoProveedor: any[] = TYPE_PARTNER;
    partnertRelacionado: any;

    constructor(
         public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private router: Router,
        public activatedRoute: ActivatedRoute,
        private commonService: CommonService,
        private proveedorService: ProveedorService,
        private toastr: MessageService,
    ) {
        // this.createFormInfoBasicaProveedor();
        // this.createFormInfoContactoProveedor();
        // this.createFormDatosDireccion();
        // this.createFormCuentas();
        // this.setCuentas();
    }

    ngOnInit(): void {
        var resptipoDocumentoProveedor = [{
            "codigo": 0,
            "mensaje": "OK",
            "data": {
                "content": [
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
                ]
            }
        }];
        this.tipoDocumentoProveedor = resptipoDocumentoProveedor[0]['data']['content'].map((item: any) => {
            return {
                id: item['codigo'],
                descripcion: item['nombre']
            }
        });
        this.getProveedor();
        // this.activatedRoute.params.subscribe(params => {
        //     this.data = params;
        //     this.commonService.getMultipleCombosPromiseCliente(['documentos/tipos']).then(resp => {
        //         this.tipoDocumentoProveedor = resp[0]['data']['content'].map((item: any) => {
        //             return {
        //                 id: item['codigo'],
        //                 descripcion: item['nombre']
        //             }
        //         });
        //     }).then(_resp => {
        //         this.getProveedor();
        //     })
        // })
    }

    getProveedor() {
        var respProveedor = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idPartner": 6,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "01",
                    "numeroDocIdentidad": "70499320",
                    "primerNombre": "Eduardo",
                    "segundoNombre": "Enrique",
                    "apellidoPaterno": "Gonzales",
                    "apellidoMaterno": "Velasquez",
                    "razonSocial": null,
                    "celular": "977115938",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "Av. Brasil 1233",
                    "dptUbigeo": null,
                    "prvUbigeo": null,
                    "dstUbigeo": null,
                    "nombreContacto": "Eduardo",
                    "correoContacto": "eduasd@erq.com",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-04-01T13:26:04.551",
                    "usuarioActualizacion": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaActualizacion": "2024-04-01T14:29:53.361",
                    "idc": null
                },
                {
                    "idPartner": 7,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "01",
                    "numeroDocIdentidad": "49006528",
                    "primerNombre": "WILMER",
                    "segundoNombre": "ANTONIO",
                    "apellidoPaterno": "BELLO",
                    "apellidoMaterno": "GOZAR",
                    "razonSocial": null,
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "AV. AVIACIÓN 2405",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "WILME ANTONIO BELLO GOZAR",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:13:17.56",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": null,
                    "idc": null
                },
                {
                    "idPartner": 9,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "02",
                    "numeroDocIdentidad": "490065280",
                    "primerNombre": "WILMER",
                    "segundoNombre": "ANTONIO",
                    "apellidoPaterno": "BELLO",
                    "apellidoMaterno": "GOZAR",
                    "razonSocial": null,
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "AV. AVIACIÓN 2405",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "WILMER ANTONIO BELLO GOZAR",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:55:15.608",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": null,
                    "idc": null
                },
                {
                    "idPartner": 4,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20490065281",
                    "primerNombre": "WILMER",
                    "segundoNombre": "ANTONIO",
                    "apellidoPaterno": "BELLO",
                    "apellidoMaterno": "GOZAR",
                    "razonSocial": "OPERACIONES PASIVAS",
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "A.H. LIBERACIÓN MZ A LOTE 7",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "32",
                    "nombreContacto": "WILMER ANTONIO BELLO GOZAR",
                    "correoContacto": "SOLOPARATRABAJOS97@GMAIL.COM",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-03-26T16:12:50.806",
                    "usuarioActualizacion": "Wilmer.Bello@somosoh.pe",
                    "fechaActualizacion": "2024-04-04T17:55:59.24",
                    "idc": null
                },
                {
                    "idPartner": 1,
                    "tipoPartner": 2,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20605636935",
                    "primerNombre": null,
                    "segundoNombre": null,
                    "apellidoPaterno": null,
                    "apellidoMaterno": null,
                    "razonSocial": "FIRBID FINANZAS DIGITALES SAC",
                    "celular": "937086007",
                    "telefono": "0",
                    "anexo": "0",
                    "direccion": "Av. Canada 123",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "Jose Antonio Duarte",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-22T10:35:19.716",
                    "usuarioActualizacion": "Wilmer.Bello@somosoh.pe",
                    "fechaActualizacion": "2024-04-09T19:47:17.36",
                    "idc": null
                },
                {
                    "idPartner": 8,
                    "tipoPartner": 2,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20490065281",
                    "primerNombre": null,
                    "segundoNombre": null,
                    "apellidoPaterno": null,
                    "apellidoMaterno": null,
                    "razonSocial": "PRUEBA",
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "AV. AVIACIÓN 2405 ",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "WILMER ANTONIO BELLO GOZAR",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": 6,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:22:42.053",
                    "usuarioActualizacion": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaActualizacion": "2024-05-02T16:34:32.424",
                    "idc": "777777"
                },
                {
                    "idPartner": 2,
                    "tipoPartner": 2,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20556216089",
                    "primerNombre": null,
                    "segundoNombre": null,
                    "apellidoPaterno": null,
                    "apellidoMaterno": null,
                    "razonSocial": "FIDEICOMISO FIRBID",
                    "celular": "937086007",
                    "telefono": "0343",
                    "anexo": "0",
                    "direccion": "Av. Lima 444",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "01",
                    "nombreContacto": "Jose Antonio Duarte",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": 1,
                    "estado": 1,
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-22T10:37:31.263",
                    "usuarioActualizacion": "Esteban.Castillo@somosoh.pe",
                    "fechaActualizacion": "2024-05-02T16:49:04.552",
                    "idc": "09490270"
                }
            ]
        };

        if (respProveedor['codigo'] == 0) {
            this.proveedores = respProveedor.data;
            this.proveedor = this.proveedores.find(e => e.numeroDocIdentidad == this.config.data['doc'] && e.tipoDocIdentidad == this.config.data['tipo'])
            //this.proveedor = resp.data[0];
            this.proveedoresListado = this.proveedores.filter(item => item.numeroDocIdentidad !== this.config.data['doc'])
            this.proveedoresListado = this.proveedoresListado.filter(item => !item.idPartnerRelacionado || (item.idPartnerRelacionado && item.idPartnerRelacionado == this.proveedor.idPartner))
            this.proveedoresListado = this.proveedoresListado.map((item: any) => {
                let nombreGenerico = item.razonSocial;
                if (!nombreGenerico) {
                    nombreGenerico = item.primerNombre + ' ' + (item.segundoNombre ? item.segundoNombre : '') + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno;
                }
                return {
                    ...item,
                    nombreGenerico: nombreGenerico
                };
            });
            this.proveedor['cuentas'] = this.datosCuentas;
            this.createFormInfoBasicaProveedor();
            this.createFormInfoContactoProveedor();
            this.createFormDatosDireccion();
            this.getCombosUbigeo();
            this.getBancoCuentaProveedor();
        }

        // this.proveedorService.getObtenerProveedor().subscribe((resp: any) => {
        //     if (resp['codigo'] == 0) {
        //         this.proveedores = resp.data;
        //         this.proveedor = this.proveedores.find(e => e.numeroDocIdentidad == this.data['doc'] && e.tipoDocIdentidad == this.data['tipo'])
        //         //this.proveedor = resp.data[0];
        //         this.proveedoresListado = this.proveedores.filter(item => item.numeroDocIdentidad !== this.data['doc'])
        //         this.proveedoresListado = this.proveedoresListado.filter(item => !item.idPartnerRelacionado || (item.idPartnerRelacionado && item.idPartnerRelacionado == this.proveedor.idPartner))
        //         this.proveedoresListado = this.proveedoresListado.map((item: any) => {
        //             let nombreGenerico = item.razonSocial;
        //             if (!nombreGenerico) {
        //                 nombreGenerico = item.primerNombre + ' ' + (item.segundoNombre ? item.segundoNombre : '') + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno;
        //             }
        //             return {
        //                 ...item,
        //                 nombreGenerico: nombreGenerico
        //             };
        //         });
        //         this.proveedor['cuentas'] = this.datosCuentas;
        //         this.createFormInfoBasicaProveedor();
        //         this.createFormInfoContactoProveedor();
        //         this.createFormDatosDireccion();
        //         this.getCombosUbigeo();
        //         this.getBancoCuentaProveedor();
        //     } else {
        //         this.toastr.add({ severity: 'error', summary: 'Error getObtenerProveedor', detail: resp['mensaje'] });
        //     }
        // }, (_error) => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getApoderado', detail: 'Error en el servicio de obtener datos del apoderado' });
        // })
    }

    getCombosUbigeo() {
        var respUbigeo: any = [
            {
                "codigo": 0,
                "mensaje": "OK",
                "data": [
                    {
                        "id": {
                            "dptUbigeo": "01",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "AMAZONAS ",
                        "fecActualizacion": "2010-02-18T20:45:13.912+00:00",
                        "fecRegistro": "2010-02-18T20:45:13.912+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "02",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "ANCASH ",
                        "fecActualizacion": "2010-02-18T20:45:25.603+00:00",
                        "fecRegistro": "2010-02-18T20:45:25.603+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "03",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "APURIMAC ",
                        "fecActualizacion": "2010-02-18T20:45:30.302+00:00",
                        "fecRegistro": "2010-02-18T20:45:30.302+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "04",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "AREQUIPA ",
                        "fecActualizacion": "2010-02-18T20:45:32.617+00:00",
                        "fecRegistro": "2010-02-18T20:45:32.617+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "05",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "AYACUCHO ",
                        "fecActualizacion": "2010-02-18T20:45:36.010+00:00",
                        "fecRegistro": "2010-02-18T20:45:36.010+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "06",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "CAJAMARCA",
                        "fecActualizacion": "2010-02-18T20:45:39.589+00:00",
                        "fecRegistro": "2010-02-18T20:45:39.589+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "07",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "CALLAO ",
                        "fecActualizacion": "2010-02-18T20:45:43.996+00:00",
                        "fecRegistro": "2010-02-18T20:45:43.996+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "08",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "CUSCO ",
                        "fecActualizacion": "2010-02-18T20:45:44.246+00:00",
                        "fecRegistro": "2010-02-18T20:45:44.246+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "09",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "HUANCAVELICA ",
                        "fecActualizacion": "2010-02-18T20:45:48.088+00:00",
                        "fecRegistro": "2010-02-18T20:45:48.088+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "10",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "HUANUCO",
                        "fecActualizacion": "2010-02-18T20:45:51.280+00:00",
                        "fecRegistro": "2010-02-18T20:45:51.280+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "11",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "ICA",
                        "fecActualizacion": "2010-02-18T20:45:54.027+00:00",
                        "fecRegistro": "2010-02-18T20:45:54.027+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "12",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "JUNIN ",
                        "fecActualizacion": "2010-02-18T20:45:55.508+00:00",
                        "fecRegistro": "2010-02-18T20:45:55.508+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "13",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "LA LIBERTAD ",
                        "fecActualizacion": "2010-02-18T20:45:59.260+00:00",
                        "fecRegistro": "2010-02-18T20:45:59.260+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "14",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "LAMBAYEQUE  ",
                        "fecActualizacion": "2010-02-18T20:46:03.252+00:00",
                        "fecRegistro": "2010-02-18T20:46:03.252+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "15",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "LIMA  ",
                        "fecActualizacion": "2010-02-18T20:46:04.326+00:00",
                        "fecRegistro": "2010-02-18T20:46:04.326+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "16",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "LORETO ",
                        "fecActualizacion": "2010-02-18T20:46:09.482+00:00",
                        "fecRegistro": "2010-02-18T20:46:09.482+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "17",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "MADRE DE DIOS",
                        "fecActualizacion": "2010-02-18T20:46:11.012+00:00",
                        "fecRegistro": "2010-02-18T20:46:11.012+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "18",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "MOQUEGUA ",
                        "fecActualizacion": "2010-02-18T20:46:11.401+00:00",
                        "fecRegistro": "2010-02-18T20:46:11.401+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "19",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "PASCO ",
                        "fecActualizacion": "2010-02-18T20:46:12.019+00:00",
                        "fecRegistro": "2010-02-18T20:46:12.019+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "20",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "PIURA ",
                        "fecActualizacion": "2010-02-18T20:46:12.846+00:00",
                        "fecRegistro": "2010-02-18T20:46:12.846+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "21",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "PUNO  ",
                        "fecActualizacion": "2010-02-18T20:46:14.778+00:00",
                        "fecRegistro": "2010-02-18T20:46:14.778+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "22",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "SAN MARTIN  ",
                        "fecActualizacion": "2010-02-18T20:46:18.125+00:00",
                        "fecRegistro": "2010-02-18T20:46:18.125+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "23",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "TACNA ",
                        "fecActualizacion": "2010-02-18T20:46:20.429+00:00",
                        "fecRegistro": "2010-02-18T20:46:20.429+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "24",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "TUMBES ",
                        "fecActualizacion": "2010-02-18T20:46:21.336+00:00",
                        "fecRegistro": "2010-02-18T20:46:21.336+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    },
                    {
                        "id": {
                            "dptUbigeo": "25",
                            "prvUbigeo": "00",
                            "dstUbigeo": "00"
                        },
                        "desUbigeo": "UCAYALI",
                        "fecActualizacion": "2010-02-18T20:46:21.829+00:00",
                        "fecRegistro": "2010-02-18T20:46:21.829+00:00",
                        "usuActBd": "EPUC",
                        "usuActualizacion": "CARGA INICIAL",
                        "usuRegBd": "EPUC",
                        "usuRegistro": "CARGA INICIAL"
                    }
                ]
            }, { "codigo": 1, "mensaje": "NO HAY DATA PARA ESTA CONSULTA", "data": {} },
            { "codigo": 1, "mensaje": "NO HAY DATA PARA ESTA CONSULTA", "data": {} }
        ]

        respUbigeo[0]['data'].forEach((item: any) => {
            this.departamento.push({
                id: item['id'].dptUbigeo,
                descripcion: item['desUbigeo']
            });
        })
        this.departamentoSelected = this.departamento.find(departamento => departamento.id == this.proveedor.dptUbigeo)
        this.formDatosDireccion.get('departamento')!.patchValue(this.departamentoSelected);

        if (respUbigeo[1]['codigo'] == 0) {
            respUbigeo[1]['data'].forEach((item: any) => {
                this.provincia.push({
                    id: item['id'].prvUbigeo,
                    descripcion: item['desUbigeo']
                });
            })
            this.provinciaSelected = this.provincia.find(provincia => provincia.id == this.proveedor.prvUbigeo)
            this.formDatosDireccion.get('provincia')!.patchValue(this.provinciaSelected);
        }

        if (respUbigeo[2]['codigo'] == 0) {
            respUbigeo[2]['data'].forEach((item: any) => {
                this.distrito.push({
                    id: item['id'].dstUbigeo,
                    descripcion: item['desUbigeo']
                });
            })
            this.distritoSelected = this.distrito.find(distrito => distrito.id == this.proveedor.dstUbigeo)
            this.formDatosDireccion.get('distrito')!.patchValue(this.distritoSelected);
        }
        this.formDatosDireccion.get('direccion')!.setValue(this.proveedor.direccion);

        // this.commonService.getUbigeo(this.proveedor.dptUbigeo, this.proveedor.prvUbigeo)
        //     .subscribe((resp: any) => {
        //         resp[0]['data'].forEach((item: any) => {
        //             this.departamento.push({
        //                 id: item['id'].dptUbigeo,
        //                 descripcion: item['desUbigeo']
        //             });
        //         })
        //         this.departamentoSelected = this.departamento.find(departamento => departamento.id == this.proveedor.dptUbigeo)
        //         this.formDatosDireccion.get('departamento')!.patchValue(this.departamentoSelected);

        //         if (resp[1]['codigo'] == 0) {
        //             resp[1]['data'].forEach((item: any) => {
        //                 this.provincia.push({
        //                     id: item['id'].prvUbigeo,
        //                     descripcion: item['desUbigeo']
        //                 });
        //             })
        //             this.provinciaSelected = this.provincia.find(provincia => provincia.id == this.proveedor.prvUbigeo)
        //             this.formDatosDireccion.get('provincia')!.patchValue(this.provinciaSelected);
        //         }

        //         if (resp[2]['codigo'] == 0) {
        //             resp[2]['data'].forEach((item: any) => {
        //                 this.distrito.push({
        //                     id: item['id'].dstUbigeo,
        //                     descripcion: item['desUbigeo']
        //                 });
        //             })
        //             this.distritoSelected = this.distrito.find(distrito => distrito.id == this.proveedor.dstUbigeo)
        //             this.formDatosDireccion.get('distrito')!.patchValue(this.distritoSelected);
        //         }
        //         this.formDatosDireccion.get('direccion')!.setValue(this.proveedor.direccion);
        //     });
    }

    getBancoCuentaProveedor() {
        var respBanco = { "codigo": 0, "mensaje": "OK", "data": [] };
        if (respBanco['codigo'] == 0) {
            this.proveedor.cuentas = respBanco.data;
            this.createFormCuentas();
            this.proveedor.cuentas.forEach((cuenta: any) => {
                this.setCuentas(cuenta);
            });
        }
        // this.proveedorService.getBancoCuentaProveedor(this.proveedor.idPartner).subscribe((resp: any) => {
        //     if (resp['codigo'] == 0) {
        //         this.proveedor.cuentas = resp.data;
        //         this.createFormCuentas();
        //         this.proveedor.cuentas.forEach((cuenta: any) => {
        //             this.setCuentas(cuenta);
        //         });
        //     } else {
        //         this.toastr.add({ severity: 'error', summary: 'Error getBancoCuentaProveedor', detail: resp['mensaje'] });
        //     }
        // }, (_error) => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getBancoCuentaProveedor', detail: 'Error en el servicio de obtener datos de las cuentas del proveedor' });
        // })
    }

    createFormInfoBasicaProveedor() {
        const tipoProveedor = this.tipoProveedor.find(item => item.id === this.proveedor.tipoPartner)
        const isPartnerRelacionado = (this.proveedor?.idPartnerRelacionado) ? true : false;
        if (isPartnerRelacionado) {
            this.partnertRelacionado = this.proveedoresListado.find(item => item.idPartner === this.proveedor?.idPartnerRelacionado);
        }
        //proveedoresListado
        // const tipoDocumento = this.tipoDocumentoOriginal.find(item => item.codigo == this.proveedor.tipoDocIdentidad)
        this.tipoDocumentoProveedorSelected = this.tipoDocumentoProveedor.find(e => e.id == this.proveedor.tipoDocIdentidad)
        this.formInfoBasicaProveedor = new FormGroup({
            tipoProveedor: new FormControl(),
            tipoDocumento: new FormControl(null, [Validators.required]),
            nroDocumento: new FormControl(null, [Validators.required]),
            idc: new FormControl(this.proveedor.idc),
            primerNombre: new FormControl(this.proveedor.primerNombre),
            segundoNombre: new FormControl(this.proveedor.segundoNombre),
            primerApellido: new FormControl(this.proveedor.apellidoPaterno),
            segundoApellido: new FormControl(this.proveedor.apellidoMaterno),
            razonSocial: new FormControl(this.proveedor.razonSocial),
            isPartner: new FormControl(isPartnerRelacionado),
            proveedor: new FormControl(this.partnertRelacionado),
        })
        this.formInfoBasicaProveedor.get('tipoProveedor')!.setValue(tipoProveedor);
        this.formInfoBasicaProveedor.get('tipoDocumento')!.setValue(this.tipoDocumentoProveedorSelected);
        if (this.tipoDocumentoProveedorSelected.id == '01') {
            this.nroCaracterProveedor = 8;
            this.formInfoBasicaProveedor.get('nroDocumento')!.setValue(this.proveedor.numeroDocIdentidad);
            this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            this.formInfoBasicaProveedor.get('nroDocumento')!.updateValueAndValidity()
            // this.formInfoBasicaProveedor.get('tipoDocumento').disable();
        } else if (this.tipoDocumentoProveedorSelected.id == '02') {
            this.nroCaracterProveedor = 9;
            this.formInfoBasicaProveedor.get('nroDocumento')!.setValue(this.proveedor.numeroDocIdentidad);
            this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            this.formInfoBasicaProveedor.get('nroDocumento')!.updateValueAndValidity()
            // this.formInfoBasicaProveedor.get('tipoDocumento').disable()
        } else if (this.tipoDocumentoProveedorSelected.id == '03') {
            this.nroCaracterProveedor = 11;
            this.formInfoBasicaProveedor.get('nroDocumento')!.setValue(this.proveedor.numeroDocIdentidad);
            this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            this.formInfoBasicaProveedor.get('nroDocumento')!.updateValueAndValidity()
            // this.formInfoBasicaProveedor.get('tipoDocumento').disable();
        }


    }
    createFormInfoContactoProveedor() {
        this.formInfoContactoProveedor = new FormGroup({
            telefono: new FormControl(this.proveedor.telefono),
            celular: new FormControl(this.proveedor.celular),
            anexo: new FormControl(this.proveedor.anexo),
            nombre: new FormControl(this.proveedor.nombreContacto),
            correo: new FormControl(this.proveedor.correoContacto),
        })
    }
    createFormDatosDireccion() {
        this.formDatosDireccion = new FormGroup({
            direccion: new FormControl(null, [Validators.required]),
            departamento: new FormControl(null, [Validators.required]),
            provincia: new FormControl(null, [Validators.required]),
            distrito: new FormControl(null, [Validators.required])
        })
    }
    createFormCuentas() {
        this.formCuentas = new FormGroup({
            cuentas: new FormArray([])
        })
    }

    cuentaFormGroup(data: any = null): FormGroup {
        if (data) {
            return new FormGroup({
                idCuenta: new FormControl(data.idCuenta, [Validators.required]),
                banco: new FormControl(data.banco, [Validators.required]),
                tipoCuenta: new FormControl(data.tipoCuenta, [Validators.required]),
                numCuenta: new FormControl(data.numCuenta, [Validators.required]),
                tipoMoneda: new FormControl(data.tipoMoneda, [Validators.required]),
            })
        }
        return new FormGroup({
            idCuenta: new FormControl(null, [Validators.required]),
            banco: new FormControl(null, [Validators.required]),
            tipoCuenta: new FormControl(null, [Validators.required]),
            numCuenta: new FormControl(null, [Validators.required]),
            tipoMoneda: new FormControl(null, [Validators.required]),
        })
    }

    get cuentas(): FormArray {
        return this.formCuentas.get('cuentas') as FormArray;
    }

    setCuentas(cuentaPartner: any) {
        this.cuentas.push(
            this.cuentaFormGroup({
                idCuenta: cuentaPartner.idBancoCuentaPartner, banco: { idBanco: cuentaPartner.idBanco, descripcion: cuentaPartner.idBanco }, tipoCuenta: { id: cuentaPartner.tipoCuenta, descripcion: cuentaPartner.tipoCuenta }
                , numCuenta: cuentaPartner.nroCuenta, tipoMoneda: { id: cuentaPartner.moneda, descripcion: cuentaPartner.moneda }
            })
        )
    }

    agregarCuenta() {
        this.cuentas.push(
            this.cuentaFormGroup()
        )
    }

    changeModelTipoProveedor(event: any, type: any) {
        console.log(event, type);
        if (event) {
            if (event.id == 2) {//PersJuridica
                this.formInfoBasicaProveedor.get('tipoDocumento')!.enable();
                const tipoDocu = this.tipoDocumentoProveedor.find(e => e.id == '03')
                this.formInfoBasicaProveedor.get('tipoDocumento')!.setValue(tipoDocu);
            } else {//PersNatu
                this.formInfoBasicaProveedor.get('tipoDocumento')!.enable();
            }
        }
    }

    changeModelDepartamento() {
        this.provincia = [];
        this.distrito = [];

        this.formDatosDireccion.get('provincia')!.setValue(null);
        this.formDatosDireccion.get('distrito')!.setValue(null);

        this.commonService.getProvincia(this.formDatosDireccion.get('departamento')!.value['id'])
            .subscribe((resp: any) => {
                resp['data'].map((item: any) => {
                    this.provincia.push({
                        id: item['id'].prvUbigeo,
                        descripcion: item['desUbigeo']
                    });
                })
            });
    }

    changeModelProvincia() {
        this.distrito = [];

        this.formDatosDireccion.get('distrito')!.setValue(null);

        this.commonService.getDistrito(this.formDatosDireccion.get('departamento')!.value['id'], this.formDatosDireccion.get('provincia')!.value['id'])
            .subscribe((resp: any) => {
                resp['data'].map((item: any) => {
                    this.distrito.push({
                        id: item['id'].dstUbigeo,
                        descripcion: item['desUbigeo']
                    });
                })
            });
    }

    changeModelTipoDocumento(event: any, type: any) {
        console.log(event);
        console.log(type);
        if (event !== null) {
            this.formInfoBasicaProveedor.get('nroDocumento')!.reset();
            if (event.id == '01') {
                this.nroCaracterProveedor = 8;
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValue(this.proveedor.numeroDocIdentidad);
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
                this.formInfoBasicaProveedor.get('nroDocumento')!.updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').disable();
            } else if (event.id == '02') {
                this.nroCaracterProveedor = 9;
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValue(this.proveedor.numeroDocIdentidad);
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
                this.formInfoBasicaProveedor.get('nroDocumento')!.updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').disable()
            } else if (event.id == '03') {
                this.nroCaracterProveedor = 11;
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValue(this.proveedor.numeroDocIdentidad);
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
                this.formInfoBasicaProveedor.get('nroDocumento')!.updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').disable();
            } else {
                this.nroCaracterProveedor = 1;
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            }

        }
        this.formInfoBasicaProveedor
    }

    changeModelBanco(event: any, index: number) {
        const cuenta = (this.cuentas.controls[index]) as FormGroup;
        cuenta.get('tipoCuenta')?.setValue(null);
        cuenta.get('tipoMoneda')?.setValue(null);
        cuenta.get('numCuenta')?.setValue(null);

        // this.cuentas.get[index].get('tipoCuenta').setValue(null)
        // this.cuentas.get[index].get('tipoMoneda').setValue(null)
        // this.cuentas.get[index].get('numCuenta').setValue(null)
    }
    changeModelTipoCuenta(event: any, index: any) {
        if (event) {
            const cuenta = this.cuentas.at(index); // o this.cuentas.controls[index]
            const tipoMoneda = cuenta.get('tipoMoneda')?.value;

            cuenta.get('tipoMoneda')?.setValue(tipoMoneda);
            cuenta.get('numCuenta')?.setValue(null);

            // const tipoMoneda = this.cuentas.get[index].get('tipoMoneda').value
            // this.cuentas.get[index].get('tipoMoneda').setValue(tipoMoneda)
            // this.cuentas.get[index].get('numCuenta').setValue(null)
        }
    }
    changeModelTipoMoneda(event: any, index: any) {
    }
    onChangeSwitch(event: any) {
        if (event?.checked) {
            this.formInfoBasicaProveedor.get('proveedor')!.setValidators(Validators.required)
        } else {
            this.formInfoBasicaProveedor.get('proveedor')!.clearValidators()
        }
    }

    filterElementProveedor(event: any, data: any) {
        this.filteredElement = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.nombreGenerico.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(element);
            }
        }
    }

    changeModelProveedor(event: any, type: any) {
        console.log(event, type);
    }

    quitarCuenta(index: any) {
        this.cuentas.removeAt(index);
    }


    putProveedor() {
        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        let idPartnerRelacionado;
        if (this.formInfoBasicaProveedor.get('isPartner')!.value) {
            idPartnerRelacionado = this.formInfoBasicaProveedor.get('proveedor')!.value?.idPartner || 0;
        }


        const proveedorUpdated = {
            anexo: this.formInfoContactoProveedor.get('anexo')!.value,
            apellidoMaterno: this.formInfoBasicaProveedor.get('segundoApellido')!.value,
            apellidoPaterno: this.formInfoBasicaProveedor.get('primerApellido')!.value,
            celular: this.formInfoContactoProveedor.get('celular')!.value,
            correoContacto: this.formInfoContactoProveedor.get('correo')!.value,
            direccion: this.formDatosDireccion.get('direccion')!.value,
            dptUbigeo: (this.formDatosDireccion.get('departamento')!.value?.id == undefined || null) ? null : this.formDatosDireccion.get('departamento')!.value?.id,
            dstUbigeo: (this.formDatosDireccion.get('distrito')!.value?.id == undefined || null) ? null : this.formDatosDireccion.get('distrito')!.value?.id,
            estado: 1,
            idPartnerRelacionado: idPartnerRelacionado,
            idPartner: this.proveedor.idPartner,
            numeroDocIdentidad: this.formInfoBasicaProveedor.get('nroDocumento')!.value,
            idc: this.formInfoBasicaProveedor.get('idc')!.value,
            primerNombre: this.formInfoBasicaProveedor.get('primerNombre')!.value,
            prvUbigeo: (this.formDatosDireccion.get('provincia')!.value?.id == undefined || null) ? null : this.formDatosDireccion.get('provincia')!.value?.id,
            razonSocial: this.formInfoBasicaProveedor.get('razonSocial')!.value,
            segundoNombre: this.formInfoBasicaProveedor.get('segundoNombre')!.value,
            telefono: this.formInfoContactoProveedor.get('telefono')!.value,
            tipoDocIdentidad: this.formInfoBasicaProveedor.get('tipoDocumento')!.value.id,
            tipoPartner: +this.formInfoBasicaProveedor.get('tipoProveedor')!.value.id,
            usuarioActualizacion: usuario.email,
        }
        this.proveedorService.putActualizarPartner(proveedorUpdated).subscribe((resp: any) => {
            if (resp) {
                if (resp['codigo'] == 0) {
                    this.toastr.add({ severity: 'success', summary: 'Actualizacion exitosa', detail: 'Proveedor actualizado correctamente' });
                    //this.toastr.success('Proveedor actualizado correctamente', 'Actualizacion exitosa');
                    this.router.navigate(['/apps/mantenimiento/proveedor']);
                } else {
                    this.toastr.add({ severity: 'error', summary: 'Error crearProveedor', detail: 'Error en el servicio de registro de proveedor' });
                    //this.toastr.error('Error en el servicio de registro de proveedor', 'Error crearProveedor');
                }
            }
        }, (_error) => {
            this.toastr.add({ severity: 'error', summary: 'Error crearProveedor', detail: 'Error en el servicio de registro de proveedor - no controlado' });
        })
    }
    postBancoCuentaProveedor() {
        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        const cuentas = this.cuentas.value
        const cuentasArray = cuentas.map((cuenta: any) => {

            return {
                idBanco: cuenta.banco.id,
                idPartner: this.proveedor.idPartner,
                indActivo: "1",
                moneda: cuenta.tipoMoneda.id,
                nroCuenta: cuenta.numCuenta,
                tipoCuenta: cuenta.tipoCuenta,
                usuarioRegistro: usuario.email

            }
        });
        console.log(cuentasArray);
        const nroCalls = cuentasArray.length;
        forkJoin(
            cuentasArray.forEach((request: any) => {
                this.proveedorService.postRegistrarBancoCuentaPartner(request)
            })
        ).subscribe((resp: any) => {
            resp.forEach((response: any) => {
                console.log(response);
            });
        })
    }

    filterElement(event: any, data: any) {
        this.filteredElement = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.descripcion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(element);
            }
        }
    }

    regresar() {
        this.router.navigate(['/apps/mantenimiento/proveedor']);
    }

    requireMatch(control: FormControl): ValidationErrors | null {
        const selection: any = control.value;
        if (typeof selection === 'string') {
            return { requireMatch: true };
        }
        return null;
    }
}