import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProveedorService } from "../proveedor.service";
import { BancoService } from "../../banco/banco.service";
import { forkJoin } from "rxjs";
import { CommonModule } from "@angular/common";
import { MessageService, ConfirmationService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { TYPE_PARTNER } from "@/layout/Utils/constants/aba.constants";
import { CommonService } from "@/pages/service/commonService";
import { StepperModule } from 'primeng/stepper';
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { KeyFilterModule } from 'primeng/keyfilter';
@Component({
    selector: 'app-add-proveedor',
    templateUrl: './add-proveedor.component.html',
    styleUrls: ['./add-proveedor.component.scss'],
    imports: [KeyFilterModule, ToggleSwitchModule, StepperModule, InputGroupAddonModule, InputGroupModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService, DialogService, ConfirmationService],
    encapsulation: ViewEncapsulation.None
})
export class AddProveedorComponent implements OnInit {

    formTipoProveedor!: FormGroup;
    filteredElement: any[] = [];
    tipoProveedor: any[] = TYPE_PARTNER;
    //Seccion 2 Informacion basica de proveedor
    formInfoBasicaProveedor!: FormGroup;
    tipoDocumentoProveedor: any[] = [];
    nroCaracterProveedor: number = 0;
    //Seccion 3 Informacion de Contacto
    formInfoContactoProveedor!: FormGroup;
    //Seccion 4 Direccion de Proveedor
    formDatosDireccion!: FormGroup;
    departamento: any[] = [];
    provincia: any[] = [];
    distrito: any[] = [];
    //Seccion 5 Cuentas Bancarios
    formAddCuentas!: FormGroup;
    // banco: any[] = [{ id: '01', descripcion: 'INTERBANK' }, { id: '02', descripcion: 'BCP', }];
    banco: any[] = [];
    tipoCuenta: any[] = [{ id: '1', descripcion: 'CUENTA DE AHORROS' }, { id: '2', descripcion: 'CUENTA CORRIENTE' }]
    // tipoMoneda: any[] = [{ id: '1', descripcion: 'PEN' }, { id: '2', descripcion: 'USD' }]
    tipoMoneda: any[] = [];
    proveedores: any[] = []
    //Cuando se registre el proveedor
    idProveedor: any;

    constructor(
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private router: Router,
        private commonService: CommonService,
        private proveedorService: ProveedorService,
        private bancoService: BancoService,
        private toastr: MessageService,
    ) {
        this.createFormTipoProveedor();
        this.createFormInfoBasicaProveedor();
        this.createFormInfoContactoProveedor();
        this.createFormDatosDireccion();
        this.createFormAddCuentas();
    }
    ngOnInit(): void {
        this.getCombos();
        this.getBancos();
        this.getTipoMonedas();
        this.getProveedores();
    }
    activeStep = 1;

    nextStep(formstep: FormGroup, step: number) {
        debugger;
        // const forms = [
        //     this.formTipoProveedor,
        //     this.formInfoBasicaProveedor,
        //     this.formInfoContactoProveedor,
        //     this.formDatosDireccion,
        //     this.formAddCuentas
        // ];
        if (formstep?.valid) {
            this.activeStep = step;
        } else {
            formstep?.markAllAsTouched();
        }
    }

    prevStep(step: number) {
        this.activeStep = step;
    }
    createFormTipoProveedor() {
        this.formTipoProveedor = new FormGroup({
            tipoProveedor: new FormControl(null, [Validators.required])
        })
    }

    createFormInfoBasicaProveedor() {
        this.formInfoBasicaProveedor = new FormGroup({
            isPartner: new FormControl(),
            proveedor: new FormControl(),
            tipoDocumento: new FormControl(null, [this.requireMatch, Validators.required]),
            nroDocumento: new FormControl(),
            //Tipo proveedor == 1 PERSONA NATURAL
            primerNombre: new FormControl(),
            segundoNombre: new FormControl(),
            primerApellido: new FormControl(),
            segundoApellido: new FormControl(),

            //Tipo proveedor == 2 PERSONA JURIDICA
            razonSocial: new FormControl(),

            idc: new FormControl()

            // razonSocialFideicomiso: new FormControl(null, [Validators.required]),
            // rucFideicomiso: new FormControl(null, [Validators.required])
        })
    }
    createFormInfoContactoProveedor() {
        this.formInfoContactoProveedor = new FormGroup({
            telefono: new FormControl(null),
            celular: new FormControl(null, [Validators.required]),
            anexo: new FormControl(null),
            nombre: new FormControl(null, [Validators.required]),
            correo: new FormControl(null, [Validators.required, Validators.email]),

        })
    }

    createFormDatosDireccion() {
        this.formDatosDireccion = new FormGroup({
            direccion: new FormControl(null, [Validators.required]),
            departamento: new FormControl(null),
            provincia: new FormControl(null),
            distrito: new FormControl(null)
        })
    }

    createFormAddCuentas() {
        this.formAddCuentas = new FormGroup({
            cuentas: new FormArray([], [Validators.required])
        })
    }

    get cuentas(): FormArray {
        return this.formAddCuentas.get('cuentas') as FormArray;
    }

    cuentaFormGroup(): FormGroup {
        return new FormGroup({
            // idCuenta: new FormControl(null, [Validators.required]),
            banco: new FormControl(null, [Validators.required]),
            tipoCuenta: new FormControl(null, [Validators.required]),
            numCuenta: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
            tipoMoneda: new FormControl(null, [Validators.required]),
        })
    }

    getCombos() {
        var respTipo = [{
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
        this.tipoDocumentoProveedor = respTipo[0]['data']['content'].map((item: any) => {
            return {
                id: item['codigo'],
                descripcion: item['nombre']
            }
        });

        var respDepartamento = {
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
        }
        respDepartamento['data'].map((item: any) => {
            this.departamento.push({
                id: item['id'].dptUbigeo,
                descripcion: item['desUbigeo']
            });
        })
        // this.commonService.getMultipleCombosPromiseCliente(['documentos/tipos'])
        //     .then(resp => {
        //         this.tipoDocumentoProveedor = resp[0]['data']['content'].map((item: any) => {
        //             return {
        //                 id: item['codigo'],
        //                 descripcion: item['nombre']
        //             }
        //         });
        //     })

        // this.commonService.getDepartamento()
        //     .subscribe((resp: any) => {
        //         resp['data'].map((item: any) => {
        //             this.departamento.push({
        //                 id: item['id'].dptUbigeo,
        //                 descripcion: item['desUbigeo']
        //             });
        //         })
        //     });
    }

    getBancos() {
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idBanco": 2,
                    "codigo": "01",
                    "nombre": "Bank DevU",
                    "usuarioRegistro": "hrcp.eduardo.gonzales@somosoh.pe",
                    "fechaRegistro": "2024-02-27T17:30:46.754",
                    "fechaActualizacion": "2024-03-05T09:37:51.133"
                },
                {
                    "idBanco": 1,
                    "codigo": "222",
                    "nombre": "bank updated2",
                    "usuarioRegistro": "hrcp.eduardo.gonzales@somosoh.pe",
                    "fechaRegistro": "2024-02-27T16:11:49.084",
                    "fechaActualizacion": "2024-03-06T11:42:16.948"
                },
                {
                    "idBanco": 4,
                    "codigo": "44",
                    "nombre": "JCP",
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-06T11:42:35.506",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 5,
                    "codigo": "02",
                    "nombre": "BCP",
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-19T20:11:15.038",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 6,
                    "codigo": "33",
                    "nombre": "Banco prueba",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2024-03-25T16:44:46.069",
                    "fechaActualizacion": "2024-03-25T16:44:57.505"
                },
                {
                    "idBanco": 7,
                    "codigo": "100",
                    "nombre": "BANCO PRUEBA 2",
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:31:56.905",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 8,
                    "codigo": "035",
                    "nombre": "BANCO PICHINCHA",
                    "usuarioRegistro": "HRCP.Yudith.Hinostroza@somosoh.pe",
                    "fechaRegistro": "2025-04-24T16:41:44.563703",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 3,
                    "codigo": "03",
                    "nombre": "INTERBANK-2",
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-02-27T18:26:53.962",
                    "fechaActualizacion": "2025-09-10T21:37:00.89217"
                }
            ]
        };
        if (resp) {
            if (resp['codigo'] == 0) {
                this.banco = resp.data;
                // this.getCuentasProveedor();
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error getBancos()', detail: `No se pudo obtener los bancos` });
            }
        }
        // this.bancoService.getObtenerBancos().subscribe((resp: any) => {
        //     if (resp) {
        //         if (resp['codigo'] == 0) {
        //             this.banco = resp.data;
        //             // this.getCuentasProveedor();
        //         } else {
        //             this.toastr.add({ severity: 'error', summary: 'Error getBancos()', detail: `No se pudo obtener los bancos` });
        //         }
        //     }
        // }, (_error) => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getBancos()', detail: `No se pudo obtener los bancos` });

        // })
    }

    getTipoMonedas() {
        var respMoneda = [{
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "codParametro": 51,
                    "codTabla": 3,
                    "nomTabla": "TIPO_MONEDA_TRAMA",
                    "codTablaElemento": 2,
                    "desElemento": "TIPO MONEDA TRAMA",
                    "valCadCorto": "USD",
                    "valCadLargo": "DOLARES",
                    "valNumEntero": 840,
                    "valNumDecimal": 0,
                    "estParametro": 1,
                    "usuarioCreacion": "BLUP.Esteban.Castillo@somosoh.pe",
                    "fechaCreacion": "2022-09-22T19:07:18.188",
                    "usuarioModificacion": null,
                    "fechaModificacion": null
                },
                {
                    "codParametro": 50,
                    "codTabla": 3,
                    "nomTabla": "TIPO_MONEDA_TRAMA",
                    "codTablaElemento": 1,
                    "desElemento": "TIPO MONEDA TRAMA",
                    "valCadCorto": "PEN",
                    "valCadLargo": "SOLES",
                    "valNumEntero": 604,
                    "valNumDecimal": 0,
                    "estParametro": 1,
                    "usuarioCreacion": "BLUP.Esteban.Castillo@somosoh.pe",
                    "fechaCreacion": "2022-09-22T19:01:14.974",
                    "usuarioModificacion": "BLUP.Esteban.Castillo@somosoh.pe",
                    "fechaModificacion": null
                }
            ]
        }];
        if (respMoneda[0]['data']) {
            const tiposMonedas: any[] = respMoneda[0]['data'];
            this.tipoMoneda = tiposMonedas.map(moneda => {
                return {
                    id: moneda.valNumEntero,
                    descripcion: moneda.valCadCorto
                }
            })
        }
        // this.commonService.getMultipleCombosPromise([
        //     'TIPO_MONEDA_TRAMA'
        // ]).then(respMoneda => {
        //     if (respMoneda[0]['data']) {
        //         const tiposMonedas: any[] = respMoneda[0]['data'];
        //         this.tipoMoneda = tiposMonedas.map(moneda => {
        //             return {
        //                 id: moneda.valNumEntero,
        //                 descripcion: moneda.valCadCorto
        //             }
        //         })
        //     }
        // })
    }

    getProveedores() {
        var respProveedores = {
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
        this.proveedores = respProveedores.data;

        this.proveedores = this.proveedores
            .filter((item: any) => !item.idPartnerRelacionado)
            .map((item: any) => {
                let nombreGenerico = item.razonSocial;

                if (!nombreGenerico) {
                    nombreGenerico = item.primerNombre + ' ' + (item.segundoNombre ? item.segundoNombre : '') + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno;
                }

                return {
                    ...item,
                    nombreGenerico: nombreGenerico
                };
            });
        // this.proveedorService.getObtenerProveedor().subscribe((resp: any) => {
        //     if (resp && resp['codigo'] == 0) {

        //         this.proveedores = resp.data;

        //         this.proveedores = this.proveedores
        //             .filter((item: any) => !item.idPartnerRelacionado)
        //             .map((item: any) => {
        //                 let nombreGenerico = item.razonSocial;

        //                 if (!nombreGenerico) {
        //                     nombreGenerico = item.primerNombre + ' ' + (item.segundoNombre ? item.segundoNombre : '') + ' ' + item.apellidoPaterno + ' ' + item.apellidoMaterno;
        //                 }

        //                 return {
        //                     ...item,
        //                     nombreGenerico: nombreGenerico
        //                 };
        //             });
        //     } else {
        //         this.toastr.add({ severity: 'error', summary: 'Error getProveedores()', detail: `No se pudo obtener los proveedores` });
        //     }
        // }, (_error) => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getProveedores()', detail: `No se pudo obtener los proveedores` });
        // });
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

    filterElementBanco(event: any, data: any) {
        this.filteredElement = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(element);
            }
        }
    }

    onChangeSwitch(event: any) {
        console.log(event);
        if (event?.checked) {
            this.formInfoBasicaProveedor.get('proveedor')!.setValidators(Validators.required)
            this.formInfoBasicaProveedor.get('proveedor')!.updateValueAndValidity()
        } else {
            this.formInfoBasicaProveedor.get('proveedor')!.clearValidators()
            this.formInfoBasicaProveedor.get('proveedor')!.updateValueAndValidity()
        }

    }

    changeModelProveedor(event: any, type: any) {
        console.log(event, type);

    }

    changeModelTipoProveedor(event: any, type: any) {
        console.log(event, type);
        if (event) {
            if (event.id == 2) {//PersJuridica
                // this.formInfoBasicaProveedor.get('primerNombre').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('segundoNombre').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('primerApellido').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('segundoApellido').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('razonSocial').clearValidators();
                this.formInfoBasicaProveedor.get('tipoDocumento')!.disable();
                const tipoDocu = this.tipoDocumentoProveedor.find(e => e.id == '03')
                this.formInfoBasicaProveedor.get('tipoDocumento')!.setValue(tipoDocu);
            } else {//PersNatu
                // this.formInfoBasicaProveedor.get('primerNombre').clearValidators()
                // this.formInfoBasicaProveedor.get('segundoNombre').clearValidators()
                // this.formInfoBasicaProveedor.get('primerApellido').clearValidators()
                // this.formInfoBasicaProveedor.get('segundoApellido').clearValidators()
                // this.formInfoBasicaProveedor.get('razonSocial').setValidators(Validators.required)
                this.formInfoBasicaProveedor.get('tipoDocumento')!.enable();
            }
        }
    }

    changeModelTipoDocumento(event: any, type: any) {
        console.log(event);
        console.log(type);
        if (event !== null) {
            this.formInfoBasicaProveedor.get('nroDocumento')!.reset();
            if (event.id == '01') {
                this.nroCaracterProveedor = 8;
                this.formInfoBasicaProveedor.get('primerNombre')!.setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerNombre')!.updateValueAndValidity();
                this.formInfoBasicaProveedor.get('segundoNombre')!.clearValidators()
                this.formInfoBasicaProveedor.get('segundoNombre')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('primerApellido')!.setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerApellido')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoApellido')!.setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('segundoApellido')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('razonSocial')!.clearValidators();
                this.formInfoBasicaProveedor.get('razonSocial')!.updateValueAndValidity();
                // this.formInfoBasicaProveedor.get('tipoDocumento').enable();
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            } else if (event.id == '02') {
                this.nroCaracterProveedor = 9;
                this.formInfoBasicaProveedor.get('primerNombre')!.setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerNombre')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoNombre')!.clearValidators()
                this.formInfoBasicaProveedor.get('segundoNombre')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('primerApellido')!.setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerApellido')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoApellido')!.setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('segundoApellido')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('razonSocial')!.clearValidators();
                this.formInfoBasicaProveedor.get('razonSocial')!.updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').enable();
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            } else if (event.id == '03') {
                this.nroCaracterProveedor = 11;
                this.formInfoBasicaProveedor.get('primerNombre')!.clearValidators()
                this.formInfoBasicaProveedor.get('primerNombre')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoNombre')!.clearValidators()
                this.formInfoBasicaProveedor.get('segundoNombre')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('primerApellido')!.clearValidators()
                this.formInfoBasicaProveedor.get('primerApellido')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoApellido')!.clearValidators()
                this.formInfoBasicaProveedor.get('segundoApellido')!.updateValueAndValidity()
                this.formInfoBasicaProveedor.get('razonSocial')!.setValidators(Validators.required)
                this.formInfoBasicaProveedor.get('razonSocial')!.updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').enable();
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            } else {
                this.nroCaracterProveedor = 1;
                this.formInfoBasicaProveedor.get('nroDocumento')!.setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
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
                    const descripcion: String = item['desUbigeo']
                    this.distrito.push({
                        id: item['id'].dstUbigeo,
                        descripcion: descripcion.replace('¿', 'Ñ')
                    });
                })
            });
    }

    agregarCuenta() {
        //let cuentaIndex = this.cuentas.value.findIndex((cuenta => cuenta.id == ))
        this.cuentas.push(
            this.cuentaFormGroup()
        )
    }
    quitarCuenta(index: any) {
        this.cuentas.removeAt(index);
    }

    changeModelBanco(event: any, type: any, index: any) {
        console.log(this.cuentas.at(index));
        if (event) {
            this.cuentas.at(index).get('tipoCuenta')!.setValue(null)
        }
    }
    changeModelTipoMoneda(event: any, type: any, index: any) {
        this.cuentas.at(index).get('numCuenta')!.setValue(null);
    }

    changeModelTipoCuenta(event: any, type: any, index: any) {
        console.log(type, ' ', event, ' ', index, ' ', 'type,event,index');

        this.cuentas.at(index).get('numCuenta')!.setValue(null);
        this.cuentas.at(index).get('tipoMoneda')!.setValue(null);
        // if (event) {
        //     const idTipoMoneda = event.id == '1' ? 604 : 840;
        //     const tipoMoneda = this.tipoMoneda.find((e: any) => e.id === idTipoMoneda)
        //     this.cuentas.at(index).get('tipoMoneda').setValue(tipoMoneda);
        // } else {
        //     this.cuentas.at(index).get('tipoMoneda').setValue(null);
        // }
    }

    crearProveedor() {
        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        console.log(this.formTipoProveedor);
        console.log(this.formInfoBasicaProveedor);
        console.log(this.formInfoContactoProveedor);
        console.log(this.formDatosDireccion);
        let idPartnerRelacionado;
        if (this.formInfoBasicaProveedor.get('isPartner')!.value) {
            idPartnerRelacionado = this.formInfoBasicaProveedor.get('proveedor')!.value?.idPartner || 0;
        }
        const proveedor = {
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
            nombreContacto: this.formInfoContactoProveedor.get('nombre')!.value,
            numeroDocIdentidad: this.formInfoBasicaProveedor.get('nroDocumento')!.value,
            idc: this.formInfoBasicaProveedor.get('idc')!.value,
            primerNombre: this.formInfoBasicaProveedor.get('primerNombre')!.value,
            prvUbigeo: (this.formDatosDireccion.get('provincia')!.value?.id == undefined || null) ? null : this.formDatosDireccion.get('provincia')!.value?.id,
            razonSocial: this.formInfoBasicaProveedor.get('razonSocial')!.value,
            segundoNombre: this.formInfoBasicaProveedor.get('segundoNombre')!.value,
            telefono: this.formInfoContactoProveedor.get('anexo')!.value,
            tipoDocIdentidad: this.formInfoBasicaProveedor.get('tipoDocumento')!.value.id,
            tipoPartner: +this.formTipoProveedor.get('tipoProveedor')!.value.id,
            usuarioRegistro: usuario.email,
        }
        console.log(proveedor);

        this.proveedorService.postRegistrarProveedor(proveedor).subscribe((resp: any) => {
            if (resp) {
                if (resp['codigo'] == 0) {
                    this.toastr.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Proveedor creado correctamente' });
                    this.idProveedor = resp.data.idPartner;
                    if (this.cuentas.length > 0) {
                        this.postAddCuentas(proveedor.tipoDocIdentidad, proveedor.numeroDocIdentidad);
                    } else {
                        this.router.navigate(['/apps/mantenimiento/proveedor/edit/' + proveedor.tipoDocIdentidad + '/' + proveedor.numeroDocIdentidad]);
                    }
                } else {
                    this.toastr.add({ severity: 'error', summary: 'Error crearProveedor', detail: `Error en el servicio de registro de proveedor` });
                }
            }
        }, (_error) => {
            this.toastr.add({ severity: 'error', summary: 'Error crearProveedor', detail: `Error en el servicio de registro de proveedor - no controlado` });

        })
        //   this.postAddCuentas(proveedor.tipoDocIdentidad,proveedor.numeroDocIdentidad);
    }

    postAddCuentas(tipoDocIdentidad: any, numeroDocIdentidad: any) {
        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        const observables = [];
        let indExito = true;
        for (let index = 0; index < this.cuentas.length; index++) {
            const numCuenta: String = this.cuentas.at(index).get('numCuenta')!.value;
            let cuenta = {
                idBanco: this.cuentas.at(index).get('banco')!.value.idBanco,
                idPartner: this.idProveedor,
                indActivo: "1",
                moneda: this.cuentas.at(index).get('tipoMoneda')!.value.id,
                // nroCuenta: numCuenta.split('-').join(''),
                nroCuenta: numCuenta,
                tipoCuenta: this.cuentas.at(index).get('tipoCuenta')!.value.id,
                usuarioRegistro: usuario.email
            }
            observables.push(this.proveedorService.postRegistrarBancoCuentaPartner(cuenta))
            // this.proveedorService.postRegistrarBancoCuentaPartner(cuenta).subscribe((resp:any)=>{
            //     console.log(resp);
            //     if (resp) {
            //         if (resp['codigo']==0) {
            //             this.toastr.success(`Se registro la cuenta al proveedor`, 'Registro exitoso');
            //         } else {
            //             this.toastr.error(`No se pudo registrar la cuenta`, 'Error postAddCuentas()');
            //         }
            //     }
            // },(_error)=>{
            //     this.toastr.error(`No se pudo registrar la cuenta`, 'Error postAddCuentas()');
            // })
        }
        forkJoin(observables).subscribe((respuestas: any) => {
            respuestas.forEach((resp: any) => {
                if (resp) {
                    if (resp['codigo'] == 0) {
                        this.toastr.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Se registro la cuenta al proveedor' });
                    } else {
                        indExito = false;
                        this.toastr.add({ severity: 'error', summary: 'Error postAddCuentas()', detail: `No se pudo registrar la cuenta` });
                    }
                }
            }, (_error: any) => {
                this.toastr.add({ severity: 'error', summary: 'Error postAddCuentas()', detail: `No se pudo registrar la cuenta` });
            });
            if (indExito) {
                this.router.navigate(['/apps/mantenimiento/proveedor/edit/' + tipoDocIdentidad + '/' + numeroDocIdentidad]);
            }
        });

    }

    verForm() {
        console.log(this.formTipoProveedor);
        console.log(this.formInfoBasicaProveedor);


    }

    requireMatch(control: FormControl): ValidationErrors | null {
        const selection: any = control.value;
        if (typeof selection === 'string') {
            return { requireMatch: true };
        }
        return null;
    }

    regresar() {
        this.router.navigate(['/apps/mantenimiento/proveedor']);
    }


}