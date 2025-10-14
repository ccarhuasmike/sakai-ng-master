import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { ProveedorService } from "../../proveedor.service";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { BancoService } from "../../../banco/banco.service";
import { TYPE_CUENTA } from "@/layout/Utils/constants/aba.constants";
import { CommonService } from "@/pages/service/commonService";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageService } from "primeng/api";
import { CommonModule } from "@angular/common";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { FileUploadModule } from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { SelectModule } from "primeng/select";
import { ToastModule } from "primeng/toast";
import { ToggleSwitchModule } from "primeng/toggleswitch";
@Component({
    selector: 'app-edit-cuentas-proveedor',
    templateUrl: './edit-cuentas-proveedor.component.html',
    styleUrls: ['./edit-cuentas-proveedor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [ToggleSwitchModule, DatePickerModule, SelectModule, InputGroupAddonModule, InputGroupModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService, DialogService]
})
export class EditCuentasProveedorComponent implements OnInit {

    idProveedor: any;
    datosCuentaProveedor: any[] = [];
    filteredElement: any[] = [];

    //form
    formAddCuentas!: FormGroup;

    //
    // banco: any[] = [{ idBanco: 1, nombre: 'INTERBANK' }, { idBanco: 2, nombre: 'BCP', }];
    banco: any[] = [];
    tipoCuenta: any[] = TYPE_CUENTA;
    tipoMoneda: any[] = [{ id: '1', descripcion: 'PEN' }, { id: '2', descripcion: 'USD' }]



    constructor(
        private proveedorService: ProveedorService,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        // public dialogRef: MatDialogRef<EditCuentasProveedorComponent>,
        // private toastr: ToastrService,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private toastr: MessageService,

        private bancoService: BancoService,
        private commonService: CommonService,
    ) {
        console.log(config.data);
        this.idProveedor = config.data.idPartner;
        this.createFormAddCuentas();
    }
    ngOnInit() {
        this.getBancos();
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
            banco: new FormControl(null, [Validators.required, this.requireMatch]),
            tipoCuenta: new FormControl(null, [Validators.required, this.requireMatch]),
            numCuenta: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
            tipoMoneda: new FormControl(null, [Validators.required, this.requireMatch]),
            create: new FormControl(true),
            idBancoCuentaPartner: new FormControl(null),
        })
    }

    cuentaExistFormGroup(banco: any, tipoCuenta: any, numCuenta: any, tipoMoneda: any, idBancoCuentaPartner: any): FormGroup {
        return new FormGroup({
            // idCuenta: new FormControl(null, [Validators.required]),
            banco: new FormControl(banco, [Validators.required, this.requireMatch]),
            tipoCuenta: new FormControl(tipoCuenta, [Validators.required, this.requireMatch]),
            numCuenta: new FormControl(numCuenta, [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
            tipoMoneda: new FormControl(tipoMoneda, [Validators.required, this.requireMatch]),
            create: new FormControl(false),
            idBancoCuentaPartner: new FormControl(idBancoCuentaPartner),
        })
    }

    agregarCuenta() {
        this.cuentas.push(
            this.cuentaFormGroup()
        )
    }

    cerrarCuenta() {
        this.dialogRef.close({
            event: 'cerrar'
        });
        // this.cuentas.push(
        //     this.cuentaFormGroup()
        // )
    }


    quitarCuenta(index: any) {
        // this.cuentas.at(index).get('tipoCuenta').setValue(null)
        const create = this.cuentas.at(index).get('create')!.value
        console.log(this.cuentas.at(index).get('create')!.value);

        if (create) {
            this.cuentas.removeAt(index);
        } else {
            //llamada al api de delete
            const id = this.cuentas.at(index).get('idBancoCuentaPartner')!.value
            this.proveedorService.deleteBancoCuentaPartner(id).subscribe((resp: any) => {
                if (resp) {
                    if (resp['codigo'] == 0) {
                        this.cuentas.removeAt(index);
                        this.toastr.add({ severity: 'success', summary: 'Eliminacion exitosa', detail: 'Se elimino la cuenta del proveedor' });
                    } else {
                        this.toastr.add({ severity: 'error', summary: 'Error quitarCuenta()', detail: `No se elimino la cuenta del proveedor` });
                    }
                }
            }, (_error) => {
                this.toastr.add({ severity: 'error', summary: 'Error quitarCuenta()', detail: `Error no controlado` });
            })

        }

        // this.cuentas.removeAt(index);
    }

    saveCuenta(index: any) {
        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        const create = this.cuentas.at(index).get('create')!.value
        console.log(this.cuentas.at(index).get('create')!.value);
        if (create) {
            //create save
            let cuenta = {
                idBanco: this.cuentas.at(index).get('banco')!.value.idBanco,
                idPartner: this.idProveedor,
                indActivo: "1",
                moneda: +this.cuentas.at(index).get('tipoMoneda')!.value.id,
                nroCuenta: this.cuentas.at(index).get('numCuenta')!.value,
                tipoCuenta: this.cuentas.at(index).get('tipoCuenta')!.value.id,
                usuarioRegistro: usuario.email
            };
            this.proveedorService.postRegistrarBancoCuentaPartner(cuenta).subscribe((resp: any) => {
                console.log(resp);
                if (resp) {
                    if (resp['codigo'] == 0) {
                        this.toastr.add({ severity: 'success', summary: 'Registro exitosa', detail: 'Se registro la cuenta al proveedor' });
                        //this.toastr.success(`Se registro la cuenta al proveedor`, 'Registro exitoso');
                        this.cuentas.at(index).get('create')!.setValue(false);
                        this.cuentas.at(index).get('idBancoCuentaPartner')!.setValue(resp.data.idBancoCuentaPartner);
                    } else {
                        this.toastr.add({ severity: 'error', summary: 'Error saveCuenta()', detail: `No se pudo registrar la cuenta` });
                    }
                }
            }, (_error) => {
                this.toastr.add({ severity: 'error', summary: 'Error saveCuenta()', detail: `No se pudo registrar la cuenta` });
            })

        } else {
            //update
            let cuenta = {
                idBanco: this.cuentas.at(index).get('banco')!.value.idBanco,
                idBancoCuentaPartner: this.cuentas.at(index).get('idBancoCuentaPartner')!.value,
                idPartner: this.idProveedor,
                indActivo: "1",
                moneda: +this.cuentas.at(index).get('tipoMoneda')!.value.id,
                nroCuenta: this.cuentas.at(index).get('numCuenta')!.value,
                tipoCuenta: this.cuentas.at(index).get('tipoCuenta')!.value.id,
                usuarioActualizacion: usuario.email
            };
            this.proveedorService.putActualizarBancoCuentaPartner(cuenta).subscribe((resp: any) => {
                if (resp) {
                    if (resp['codigo'] == 0) {
                        this.toastr.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Se actualizo la cuenta al proveedor' });
                    } else {
                        this.toastr.add({ severity: 'error', summary: 'Error saveCuenta()', detail: `No se pudo registrar la cuenta` });
                    }
                }
            }, (_error) => {
                this.toastr.add({ severity: 'error', summary: 'Error saveCuenta()', detail: `No se pudo registrar la cuenta` });
            })
        }
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
        }
        this.banco = resp.data;
        var respMoneda: any = {
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
        }
        const tiposMonedas: any[] = respMoneda['data'];
        this.tipoMoneda = tiposMonedas.map(moneda => {
            return {
                id: moneda.valNumEntero,
                descripcion: moneda.valCadCorto
            }
        })

        var CuentasProveedor = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idBanco": 5,
                    "codigoBanco": "02",
                    "nombreBanco": "BCP",
                    "idBancoCuentaPartner": 26,
                    "idPartner": 7,
                    "tipoCuenta": "1",
                    "nroCuenta": "1912669578032",
                    "moneda": "604",
                    "indActivo": "1"
                },
                {
                    "idBanco": 5,
                    "codigoBanco": "02",
                    "nombreBanco": "BCP",
                    "idBancoCuentaPartner": 27,
                    "idPartner": 7,
                    "tipoCuenta": "2",
                    "nroCuenta": "1912671329129",
                    "moneda": "840",
                    "indActivo": "1"
                },
                {
                    "idBanco": 5,
                    "codigoBanco": "02",
                    "nombreBanco": "BCP",
                    "idBancoCuentaPartner": 36,
                    "idPartner": 7,
                    "tipoCuenta": "1",
                    "nroCuenta": "1919541349706",
                    "moneda": "604",
                    "indActivo": "1"
                }
            ]
        }
        if (CuentasProveedor['codigo'] == 0) {
            this.datosCuentaProveedor = CuentasProveedor.data;
            this.datosCuentaProveedor.map(item => {
                const banco = this.banco.find((e: any) => e.idBanco == item.idBanco)
                const tipoCuenta = this.tipoCuenta.find((e: any) => e.id == item.tipoCuenta)
                const tipoMoneda = this.tipoMoneda.find((e: any) => e.id == +item.moneda)
                this.cuentas.push(this.cuentaExistFormGroup(banco, tipoCuenta, item.nroCuenta, tipoMoneda, item.idBancoCuentaPartner))

            })
        }

        // this.bancoService.getObtenerBancos().subscribe((resp: any) => {
        //     if (resp) {
        //         if (resp['codigo'] == 0) {
        //             this.banco = resp.data;
        //             this.commonService.getMultipleCombosPromise([
        //                 'TIPO_MONEDA_TRAMA'
        //             ]).then((respMoneda: any) => {
        //                 if (respMoneda[0]['data']) {
        //                     const tiposMonedas: any[] = respMoneda[0]['data'];
        //                     this.tipoMoneda = tiposMonedas.map(moneda => {
        //                         return {
        //                             id: moneda.valNumEntero,
        //                             descripcion: moneda.valCadCorto
        //                         }
        //                     })
        //                     this.getCuentasProveedor();
        //                 }
        //             })
        //         } else {
        //             this.toastr.add({ severity: 'error', summary: 'Error getBancos()', detail: `No se pudo obtener los bancos` });
        //         }
        //     }
        // }, (_error) => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getBancos()', detail: `No se pudo obtener los bancos` });
        // })
    }

    // getTiposMoneda(){
    //     this.commonService.getMultipleCombosPromise([
    //         'TIPO_MONEDA_TRAMA'
    //     ]).then(resp => {
    //         if (resp[0]['data']) {
    //             const tiposMonedas:any[] = resp[0]['data'];
    //             this.tipoMoneda = tiposMonedas.map(moneda=>{
    //                 return {
    //                     id:moneda.valNumEntero,
    //                     descripcion:moneda.valCadCorto
    //                 }
    //             })
    //         }

    //     })
    // }

    getCuentasProveedor() {
        this.proveedorService.getBancoCuentaProveedor(this.idProveedor).subscribe((resp: any) => {
            if (resp) {
                if (resp['codigo'] == 0) {
                    this.datosCuentaProveedor = resp.data;
                    this.datosCuentaProveedor.map(item => {
                        const banco = this.banco.find((e: any) => e.idBanco == item.idBanco)
                        const tipoCuenta = this.tipoCuenta.find((e: any) => e.id == item.tipoCuenta)
                        const tipoMoneda = this.tipoMoneda.find((e: any) => e.id == +item.moneda)
                        this.cuentas.push(this.cuentaExistFormGroup(banco, tipoCuenta, item.nroCuenta, tipoMoneda, item.idBancoCuentaPartner))

                    })
                }
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error getCuentasProveedor()', detail: `No se pudo obtener las cuentas del proveedor` });
            }
        }, (_error) => {
            this.toastr.add({ severity: 'error', summary: 'Error getCuentasProveedor()', detail: `Error no contraldo` });
            //this.toastr.error(`Error no contraldo`, 'Error getCuentasProveedor')
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

    changeModelBanco(event: any, type: any, index: any) {
        console.log(this.cuentas.at(index));
        // this.cuentas.at(index).get('numCuenta').setValue('2222222222222222')
        if (event) {
            this.cuentas.at(index).get('tipoCuenta')!.setValue(null)
            // this.cuentas.at(index).get('tipoMoneda').setValue(null)
            // this.cuentas.at(index).get('numCuenta').setValue(null)
        }
    }

    changeModelTipoCuenta(event: any, type: any, index: any) {
        console.log(type, ' ', event, ' ', index, ' ', 'type,event,index');

        this.cuentas.at(index).get('tipoMoneda')!.setValue(null);
        this.cuentas.at(index).get('numCuenta')!.setValue(null);
        // if (event) {
        //     const idTipoMoneda = event.id=='1'? 604:840;
        //     const tipoMoneda = this.tipoMoneda.find((e: any) => e.id === idTipoMoneda)
        //     this.cuentas.at(index).get('tipoMoneda').setValue(tipoMoneda);
        // } else {
        //     this.cuentas.at(index).get('tipoMoneda').setValue(null);
        // }
    }
    changeModelTipoMoneda(event: any, type: any, index: any) {
        this.cuentas.at(index).get('numCuenta')!.setValue(null);
    }

    requireMatch(control: FormControl): ValidationErrors | null {
        const selection: any = control.value;
        if (typeof selection === 'string') {
            return { requireMatch: true };
        }
        return null;
    }
}