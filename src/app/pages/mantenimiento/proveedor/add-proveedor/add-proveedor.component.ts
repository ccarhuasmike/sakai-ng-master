import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { CommonService } from "app/main/services/shared/common.service";
import { TYPE_PARTNER } from "app/main/utils/constants/aba.constants";
import { ProveedorService } from "../proveedor.service";
import { ToastrService } from "ngx-toastr";
import { BancoService } from "../../banco/banco.service";
import { forkJoin } from "rxjs";

@Component({
    selector: 'app-add-proveedor',
    templateUrl: './add-proveedor.component.html',
    styleUrls: ['./add-proveedor.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AddProveedorComponent implements OnInit {

    formTipoProveedor: FormGroup;
    filteredElement: any[];
    tipoProveedor: any[] = TYPE_PARTNER;

    //Seccion 2 Informacion basica de proveedor
    formInfoBasicaProveedor: FormGroup;
    tipoDocumentoProveedor: any[] = [];
    nroCaracterProveedor: number = 0;

    //Seccion 3 Informacion de Contacto
    formInfoContactoProveedor: FormGroup;

    //Seccion 4 Direccion de Proveedor
    formDatosDireccion: FormGroup;
    departamento: any[] = [];
    provincia: any[] = [];
    distrito: any[] = [];

    //Seccion 5 Cuentas Bancarios
    formAddCuentas: FormGroup;
    // banco: any[] = [{ id: '01', descripcion: 'INTERBANK' }, { id: '02', descripcion: 'BCP', }];
    banco: any[] = [];
    tipoCuenta: any[] = [{ id: '1', descripcion: 'CUENTA DE AHORROS' }, { id: '2', descripcion: 'CUENTA CORRIENTE' }]
    // tipoMoneda: any[] = [{ id: '1', descripcion: 'PEN' }, { id: '2', descripcion: 'USD' }]
    tipoMoneda: any[] = [];

    proveedores: any[] = []

    //Cuando se registre el proveedor
    idProveedor: any;

    constructor(
        private router: Router,
        private commonService: CommonService,
        private proveedorService: ProveedorService,
        private bancoService: BancoService,
        private toastr: ToastrService,
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

    createFormTipoProveedor() {
        this.formTipoProveedor = new FormGroup({
            tipoProveedor: new FormControl(null, [Validators.required])
        })
    }

    createFormInfoBasicaProveedor() {
        this.formInfoBasicaProveedor = new FormGroup({
            isPartner: new FormControl(),
            proveedor: new FormControl(),
            tipoDocumento: new FormControl(null,[this.requireMatch,Validators.required]),
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
            numCuenta: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(20)]),
            tipoMoneda: new FormControl(null, [Validators.required]),
        })
    }

    getCombos() {
        this.commonService.getMultipleCombosPromiseCliente(['documentos/tipos'])
            .then(resp => {
                this.tipoDocumentoProveedor = resp[0]['data']['content'].map((item) => {
                    return {
                        id: item['codigo'],
                        descripcion: item['nombre']
                    }
                });
            })

        this.commonService.getDepartamento()
            .subscribe((resp: any) => {
                resp['data'].map((item) => {
                    this.departamento.push({
                        id: item['id'].dptUbigeo,
                        descripcion: item['desUbigeo']
                    });

                    // this.departamentoApoderado = this.departamentoBeneficiario;
                })
            });
    }

    getBancos() {
        this.bancoService.getObtenerBancos().subscribe((resp: any) => {
            if (resp) {
                if (resp['codigo'] == 0) {
                    this.banco = resp.data;
                    // this.getCuentasProveedor();
                } else {
                    this.toastr.error(`No se pudo obtener los bancos`, 'Error getBancos()')
                }
            }
        }, (_error) => {
            this.toastr.error(`No se pudo obtener los bancos`, 'Error no controlado getBancos()');
        })
    }

    getTipoMonedas() {
        this.commonService.getMultipleCombosPromise([
            'TIPO_MONEDA_TRAMA'
        ]).then(respMoneda => {
            if (respMoneda[0]['data']) {
                const tiposMonedas: any[] = respMoneda[0]['data'];
                this.tipoMoneda = tiposMonedas.map(moneda => {
                    return {
                        id: moneda.valNumEntero,
                        descripcion: moneda.valCadCorto
                    }
                })
            }
        })
    }

    getProveedores() {
        this.proveedorService.getObtenerProveedor().subscribe((resp: any) => {
            if (resp && resp['codigo'] == 0) {

                this.proveedores = resp.data;

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
            } else {
                this.toastr.error(`No se pudo obtener los proveedores`, 'Error getProveedores()')
            }
        }, (_error) => {
            this.toastr.error(`No se pudo obtener los proveedores`, 'Error no controlado getProveedores()');
        });
    }

    filterElementProveedor(event, data) {
        this.filteredElement = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.nombreGenerico.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(element);
            }
        }
    }

    filterElement(event, data) {
        this.filteredElement = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.descripcion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(element);
            }
        }
    }

    filterElementBanco(event, data) {
        this.filteredElement = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(element);
            }
        }
    }

    onChangeSwitch(event) {
        console.log(event);
        if (event?.checked) {
            this.formInfoBasicaProveedor.get('proveedor').setValidators(Validators.required)
            this.formInfoBasicaProveedor.get('proveedor').updateValueAndValidity()
        } else {
            this.formInfoBasicaProveedor.get('proveedor').clearValidators()
            this.formInfoBasicaProveedor.get('proveedor').updateValueAndValidity()
        }

    }

    changeModelProveedor(event, type) {
        console.log(event, type);

    }

    changeModelTipoProveedor(event, type) {
        console.log(event, type);
        if (event) {
            if (event.id==2) {//PersJuridica
                // this.formInfoBasicaProveedor.get('primerNombre').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('segundoNombre').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('primerApellido').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('segundoApellido').setValidators(Validators.required)
                // this.formInfoBasicaProveedor.get('razonSocial').clearValidators();
                this.formInfoBasicaProveedor.get('tipoDocumento').disable();
                const tipoDocu = this.tipoDocumentoProveedor.find(e => e.id=='03')
                this.formInfoBasicaProveedor.get('tipoDocumento').setValue(tipoDocu);
            } else {//PersNatu
                // this.formInfoBasicaProveedor.get('primerNombre').clearValidators()
                // this.formInfoBasicaProveedor.get('segundoNombre').clearValidators()
                // this.formInfoBasicaProveedor.get('primerApellido').clearValidators()
                // this.formInfoBasicaProveedor.get('segundoApellido').clearValidators()
                // this.formInfoBasicaProveedor.get('razonSocial').setValidators(Validators.required)
                this.formInfoBasicaProveedor.get('tipoDocumento').enable();
            }
        }
    }

    changeModelTipoDocumento(event, type) {
        console.log(event);
        console.log(type);
        if (event !== null) {
            this.formInfoBasicaProveedor.get('nroDocumento').reset();
            if (event.id == '01') {
                this.nroCaracterProveedor = 8;
                this.formInfoBasicaProveedor.get('primerNombre').setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerNombre').updateValueAndValidity();
                this.formInfoBasicaProveedor.get('segundoNombre').clearValidators()
                this.formInfoBasicaProveedor.get('segundoNombre').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('primerApellido').setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerApellido').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoApellido').setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('segundoApellido').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('razonSocial').clearValidators();
                this.formInfoBasicaProveedor.get('razonSocial').updateValueAndValidity();
                // this.formInfoBasicaProveedor.get('tipoDocumento').enable();
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            } else if (event.id == '02') {
                this.nroCaracterProveedor = 9;
                this.formInfoBasicaProveedor.get('primerNombre').setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerNombre').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoNombre').clearValidators()
                this.formInfoBasicaProveedor.get('segundoNombre').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('primerApellido').setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('primerApellido').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoApellido').setValidators([Validators.required])
                this.formInfoBasicaProveedor.get('segundoApellido').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('razonSocial').clearValidators();
                this.formInfoBasicaProveedor.get('razonSocial').updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').enable();
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            } else if (event.id == '03') {
                this.nroCaracterProveedor = 11;
                this.formInfoBasicaProveedor.get('primerNombre').clearValidators()
                this.formInfoBasicaProveedor.get('primerNombre').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoNombre').clearValidators()
                this.formInfoBasicaProveedor.get('segundoNombre').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('primerApellido').clearValidators()
                this.formInfoBasicaProveedor.get('primerApellido').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('segundoApellido').clearValidators()
                this.formInfoBasicaProveedor.get('segundoApellido').updateValueAndValidity()
                this.formInfoBasicaProveedor.get('razonSocial').setValidators(Validators.required)
                this.formInfoBasicaProveedor.get('razonSocial').updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').enable();
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            } else {
                this.nroCaracterProveedor = 1;
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            }
        }
    }

    changeModelDepartamento() {
        this.provincia = [];
        this.distrito = [];

        this.formDatosDireccion.get('provincia').setValue(null);
        this.formDatosDireccion.get('distrito').setValue(null);

        this.commonService.getProvincia(this.formDatosDireccion.get('departamento').value['id'])
            .subscribe((resp: any) => {
                resp['data'].map((item) => {
                    this.provincia.push({
                        id: item['id'].prvUbigeo,
                        descripcion: item['desUbigeo']
                    });
                })
            });
    }

    changeModelProvincia() {
        this.distrito = [];
        this.formDatosDireccion.get('distrito').setValue(null);

        this.commonService.getDistrito(this.formDatosDireccion.get('departamento').value['id'], this.formDatosDireccion.get('provincia').value['id'])
            .subscribe((resp: any) => {
                resp['data'].map((item) => {
                    const descripcion:String = item['desUbigeo']
                    this.distrito.push({
                        id: item['id'].dstUbigeo,
                        descripcion: descripcion.replace('¿','Ñ')
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
    quitarCuenta(index) {
        this.cuentas.removeAt(index);
    }

    changeModelBanco(event, type, index) {
        console.log(this.cuentas.at(index));
        if (event) {
            this.cuentas.at(index).get('tipoCuenta').setValue(null)
        }
    }
    changeModelTipoMoneda(event, type, index){
        this.cuentas.at(index).get('numCuenta').setValue(null);
    }

    changeModelTipoCuenta(event, type, index) {
        console.log(type, ' ', event, ' ', index, ' ', 'type,event,index');

        this.cuentas.at(index).get('numCuenta').setValue(null);
        this.cuentas.at(index).get('tipoMoneda').setValue(null);
        // if (event) {
        //     const idTipoMoneda = event.id == '1' ? 604 : 840;
        //     const tipoMoneda = this.tipoMoneda.find((e: any) => e.id === idTipoMoneda)
        //     this.cuentas.at(index).get('tipoMoneda').setValue(tipoMoneda);
        // } else {
        //     this.cuentas.at(index).get('tipoMoneda').setValue(null);
        // }
    }

    crearProveedor() {
        const usuario = JSON.parse(localStorage.getItem('userABA'));
        console.log(this.formTipoProveedor);
        console.log(this.formInfoBasicaProveedor);
        console.log(this.formInfoContactoProveedor);
        console.log(this.formDatosDireccion);
        let idPartnerRelacionado;
        if (this.formInfoBasicaProveedor.get('isPartner').value) {
            idPartnerRelacionado = this.formInfoBasicaProveedor.get('proveedor').value?.idPartner || 0;
        }
        const proveedor = {
            anexo: this.formInfoContactoProveedor.get('anexo').value,
            apellidoMaterno: this.formInfoBasicaProveedor.get('segundoApellido').value,
            apellidoPaterno: this.formInfoBasicaProveedor.get('primerApellido').value,
            celular: this.formInfoContactoProveedor.get('celular').value,
            correoContacto:this.formInfoContactoProveedor.get('correo').value,
            direccion: this.formDatosDireccion.get('direccion').value,
            dptUbigeo: (this.formDatosDireccion.get('departamento').value?.id==undefined||null)?null:this.formDatosDireccion.get('departamento').value?.id,
            dstUbigeo: (this.formDatosDireccion.get('distrito').value?.id==undefined||null)?null:this.formDatosDireccion.get('distrito').value?.id,
            estado: 1,
            idPartnerRelacionado:idPartnerRelacionado,
            nombreContacto:this.formInfoContactoProveedor.get('nombre').value,
            numeroDocIdentidad: this.formInfoBasicaProveedor.get('nroDocumento').value,
            idc: this.formInfoBasicaProveedor.get('idc').value,
            primerNombre: this.formInfoBasicaProveedor.get('primerNombre').value,
            prvUbigeo: (this.formDatosDireccion.get('provincia').value?.id==undefined||null)?null:this.formDatosDireccion.get('provincia').value?.id,
            razonSocial: this.formInfoBasicaProveedor.get('razonSocial').value,
            segundoNombre: this.formInfoBasicaProveedor.get('segundoNombre').value,
            telefono: this.formInfoContactoProveedor.get('anexo').value,
            tipoDocIdentidad: this.formInfoBasicaProveedor.get('tipoDocumento').value.id,
            tipoPartner: +this.formTipoProveedor.get('tipoProveedor').value.id,
            usuarioRegistro: usuario.email,
        }
        console.log(proveedor);

        this.proveedorService.postRegistrarProveedor(proveedor).subscribe((resp: any) => {
            if (resp) {
                if (resp['codigo'] == 0) {
                    this.toastr.success('Proveedor creado correctamente', 'Registro exitoso');
                    this.idProveedor = resp.data.idPartner;
                    if (this.cuentas.length > 0) {
                        this.postAddCuentas(proveedor.tipoDocIdentidad, proveedor.numeroDocIdentidad);
                    } else {
                        this.router.navigate(['/apps/mantenimiento/proveedor/edit/' + proveedor.tipoDocIdentidad + '/' + proveedor.numeroDocIdentidad]);
                    }
                } else {
                    this.toastr.error('Error en el servicio de registro de proveedor', 'Error crearProveedor');
                }
            }
        }, (_error) => {
            this.toastr.error('Error en el servicio de registro de proveedor - no controlado', 'Error crearProveedor');
        })
        //   this.postAddCuentas(proveedor.tipoDocIdentidad,proveedor.numeroDocIdentidad);
    }

    postAddCuentas(tipoDocIdentidad, numeroDocIdentidad) {
        const usuario = JSON.parse(localStorage.getItem('userABA'));
        const observables = [];
        let indExito = true;
        for (let index = 0; index < this.cuentas.length; index++) {
            const numCuenta:String = this.cuentas.at(index).get('numCuenta').value;
            let cuenta = {
                idBanco: this.cuentas.at(index).get('banco').value.idBanco,
                idPartner: this.idProveedor,
                indActivo: "1",
                moneda: this.cuentas.at(index).get('tipoMoneda').value.id,
                // nroCuenta: numCuenta.split('-').join(''),
                nroCuenta: numCuenta,
                tipoCuenta: this.cuentas.at(index).get('tipoCuenta').value.id,
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
                        this.toastr.success(`Se registro la cuenta al proveedor`, 'Registro exitoso');
                    } else {
                        indExito = false;
                        this.toastr.error(`No se pudo registrar la cuenta`, 'Error postAddCuentas()');
                    }
                }
            }, (_error) => {
                this.toastr.error(`No se pudo registrar la cuenta`, 'Error postAddCuentas()');
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