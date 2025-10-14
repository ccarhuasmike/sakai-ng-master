import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { CommonService } from "app/main/services/shared/common.service";
import { LEGAL_TYPE_PERSON, TYPE_PARTNER } from "app/main/utils/constants/aba.constants";
import { ProveedorService } from "../proveedor.service";
import { ToastrService } from "ngx-toastr";
import { Observable, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Component({
    selector: 'app-edit-proveedor',
    templateUrl: './edit-proveedor.component.html',
    styleUrls: ['./edit-proveedor.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EditProveedorComponent implements OnInit {

    data: any;
    filteredElement: any[];
    proveedor: any = null;
    proveedores: any[] = [];
    proveedoresListado: any[] = [];
    //formTipoProveedor: FormGroup;
    formInfoBasicaProveedor: FormGroup;
    formInfoContactoProveedor: FormGroup;
    formDatosDireccion: FormGroup;
    formCuentas: FormGroup;
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
        private router: Router,
        public activatedRoute: ActivatedRoute,
        private commonService: CommonService,
        private proveedorService: ProveedorService,
        private toastr: ToastrService,
    ) {
        // this.createFormInfoBasicaProveedor();
        // this.createFormInfoContactoProveedor();
        // this.createFormDatosDireccion();
        // this.createFormCuentas();
        // this.setCuentas();
    }

    ngOnInit(): void {
        console.log('dev');

        this.activatedRoute.params.subscribe(params => {
            this.data = params;
            this.commonService.getMultipleCombosPromiseCliente(['documentos/tipos']).then(resp => {
                this.tipoDocumentoProveedor = resp[0]['data']['content'].map((item) => {
                    return {
                        id: item['codigo'],
                        descripcion: item['nombre']
                    }
                });

            }).then(_resp => {
                this.getProveedor();
                // this.getCombosUbigeo();
            })

        })
    }

    getProveedor() {
        this.proveedorService.getObtenerProveedor().subscribe((resp: any) => {
            if (resp['codigo'] == 0) {
                this.proveedores = resp.data;
                this.proveedor = this.proveedores.find(e => e.numeroDocIdentidad == this.data['doc'] && e.tipoDocIdentidad == this.data['tipo'])
                //this.proveedor = resp.data[0];
                this.proveedoresListado = this.proveedores.filter(item => item.numeroDocIdentidad !== this.data['doc'])
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
                // this.proveedoresListado = this.proveedores.map((item:any)=>{
                //     if (item.numeroDocIdentidad!=this.data['doc']) {
                //         return 
                //     }
                // })
                this.proveedor['cuentas'] = this.datosCuentas;
                this.createFormInfoBasicaProveedor();

                this.createFormInfoContactoProveedor();
                this.createFormDatosDireccion();
                this.getCombosUbigeo();
                this.getBancoCuentaProveedor();
            } else {
                this.toastr.error(resp['mensaje'], 'Error getObtenerProveedor');
            }
        }, (_error) => {
            this.toastr.error('Error en el servicio de obtener datos del apoderado', 'Error getApoderado');
        })
    }

    getCombosUbigeo() {

        this.commonService.getUbigeo(this.proveedor.dptUbigeo, this.proveedor.prvUbigeo)
            .subscribe((resp: any) => {
                resp[0]['data'].forEach((item) => {
                    this.departamento.push({
                        id: item['id'].dptUbigeo,
                        descripcion: item['desUbigeo']
                    });
                })
                this.departamentoSelected = this.departamento.find(departamento => departamento.id == this.proveedor.dptUbigeo)
                this.formDatosDireccion.get('departamento').patchValue(this.departamentoSelected);

                if (resp[1]['codigo'] == 0) {
                    resp[1]['data'].forEach((item) => {
                        this.provincia.push({
                            id: item['id'].prvUbigeo,
                            descripcion: item['desUbigeo']
                        });
                    })
                    this.provinciaSelected = this.provincia.find(provincia => provincia.id == this.proveedor.prvUbigeo)
                    this.formDatosDireccion.get('provincia').patchValue(this.provinciaSelected);
                }

                if (resp[2]['codigo']==0) {
                    resp[2]['data'].forEach((item) => {
                        this.distrito.push({
                            id: item['id'].dstUbigeo,
                            descripcion: item['desUbigeo']
                        });
                    })
                    this.distritoSelected = this.distrito.find(distrito => distrito.id == this.proveedor.dstUbigeo)
                    this.formDatosDireccion.get('distrito').patchValue(this.distritoSelected);
                }
                this.formDatosDireccion.get('direccion').setValue(this.proveedor.direccion);
            });
    }

    getBancoCuentaProveedor() {
        this.proveedorService.getBancoCuentaProveedor(this.proveedor.idPartner).subscribe((resp: any) => {
            if (resp['codigo'] == 0) {
                this.proveedor.cuentas = resp.data;
                this.createFormCuentas();
                this.proveedor.cuentas.forEach(cuenta => {
                    this.setCuentas(cuenta);
                });
            } else {
                this.toastr.error(resp['mensaje'], 'Error getBancoCuentaProveedor');
            }
        }, (_error) => {
            this.toastr.error('Error en el servicio de obtener datos de las cuentas del proveedor', 'Error getBancoCuentaProveedor');
        })
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
        this.formInfoBasicaProveedor.get('tipoProveedor').setValue(tipoProveedor);
        this.formInfoBasicaProveedor.get('tipoDocumento').setValue(this.tipoDocumentoProveedorSelected);
        if (this.tipoDocumentoProveedorSelected.id == '01') {
            this.nroCaracterProveedor = 8;
            this.formInfoBasicaProveedor.get('nroDocumento').setValue(this.proveedor.numeroDocIdentidad);
            this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            this.formInfoBasicaProveedor.get('nroDocumento').updateValueAndValidity()
            // this.formInfoBasicaProveedor.get('tipoDocumento').disable();
        } else if (this.tipoDocumentoProveedorSelected.id == '02') {
            this.nroCaracterProveedor = 9;
            this.formInfoBasicaProveedor.get('nroDocumento').setValue(this.proveedor.numeroDocIdentidad);
            this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            this.formInfoBasicaProveedor.get('nroDocumento').updateValueAndValidity()
            // this.formInfoBasicaProveedor.get('tipoDocumento').disable()
        } else if (this.tipoDocumentoProveedorSelected.id == '03') {
            this.nroCaracterProveedor = 11;
            this.formInfoBasicaProveedor.get('nroDocumento').setValue(this.proveedor.numeroDocIdentidad);
            this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            this.formInfoBasicaProveedor.get('nroDocumento').updateValueAndValidity()
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

    changeModelTipoProveedor(event, type) {
        console.log(event, type);
        if (event) {
            if (event.id == 2) {//PersJuridica
                this.formInfoBasicaProveedor.get('tipoDocumento').enable();
                const tipoDocu = this.tipoDocumentoProveedor.find(e => e.id == '03')
                this.formInfoBasicaProveedor.get('tipoDocumento').setValue(tipoDocu);
            } else {//PersNatu
                this.formInfoBasicaProveedor.get('tipoDocumento').enable();
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
                    this.distrito.push({
                        id: item['id'].dstUbigeo,
                        descripcion: item['desUbigeo']
                    });
                })
            });
    }

    changeModelTipoDocumento(event, type) {
        console.log(event);
        console.log(type);
        if (event !== null) {
            this.formInfoBasicaProveedor.get('nroDocumento').reset();
            if (event.id == '01') {
                this.nroCaracterProveedor = 8;
                this.formInfoBasicaProveedor.get('nroDocumento').setValue(this.proveedor.numeroDocIdentidad);
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
                this.formInfoBasicaProveedor.get('nroDocumento').updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').disable();
            } else if (event.id == '02') {
                this.nroCaracterProveedor = 9;
                this.formInfoBasicaProveedor.get('nroDocumento').setValue(this.proveedor.numeroDocIdentidad);
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
                this.formInfoBasicaProveedor.get('nroDocumento').updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').disable()
            } else if (event.id == '03') {
                this.nroCaracterProveedor = 11;
                this.formInfoBasicaProveedor.get('nroDocumento').setValue(this.proveedor.numeroDocIdentidad);
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
                this.formInfoBasicaProveedor.get('nroDocumento').updateValueAndValidity()
                // this.formInfoBasicaProveedor.get('tipoDocumento').disable();
            } else {
                this.nroCaracterProveedor = 1;
                this.formInfoBasicaProveedor.get('nroDocumento').setValidators([Validators.minLength(this.nroCaracterProveedor), Validators.maxLength(this.nroCaracterProveedor), Validators.required])
            }

        }
        this.formInfoBasicaProveedor
    }

    changeModelBanco(event, index) {
        // this.cuentas.get[index].get('idCuenta').setValue(null)
        // this.cuentas.get[index].get('banco').setValue(null)
        this.cuentas.get[index].get('tipoCuenta').setValue(null)
        this.cuentas.get[index].get('tipoMoneda').setValue(null)
        this.cuentas.get[index].get('numCuenta').setValue(null)
    }

    changeModelTipoCuenta(event, index) {
        if (event) {
            const tipoMoneda = this.cuentas.get[index].get('tipoMoneda').value
            this.cuentas.get[index].get('tipoMoneda').setValue(tipoMoneda)
            this.cuentas.get[index].get('numCuenta').setValue(null)
        }
    }

    changeModelTipoMoneda(event, index) {

    }

    onChangeSwitch(event) {
        if (event?.checked) {
            this.formInfoBasicaProveedor.get('proveedor').setValidators(Validators.required)
        } else {
            this.formInfoBasicaProveedor.get('proveedor').clearValidators()
        }
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

    changeModelProveedor(event, type) {
        console.log(event, type);
    }

    quitarCuenta(index) {
        this.cuentas.removeAt(index);
    }


    putProveedor() {
        const usuario = JSON.parse(localStorage.getItem('userABA'));
        let idPartnerRelacionado;
        if (this.formInfoBasicaProveedor.get('isPartner').value) {
            idPartnerRelacionado = this.formInfoBasicaProveedor.get('proveedor').value?.idPartner || 0;
        }


        const proveedorUpdated = {
            anexo: this.formInfoContactoProveedor.get('anexo').value,
            apellidoMaterno: this.formInfoBasicaProveedor.get('segundoApellido').value,
            apellidoPaterno: this.formInfoBasicaProveedor.get('primerApellido').value,
            celular: this.formInfoContactoProveedor.get('celular').value,
            correoContacto: this.formInfoContactoProveedor.get('correo').value,
            direccion: this.formDatosDireccion.get('direccion').value,
            dptUbigeo: (this.formDatosDireccion.get('departamento').value?.id == undefined || null) ? null : this.formDatosDireccion.get('departamento').value?.id,
            dstUbigeo: (this.formDatosDireccion.get('distrito').value?.id == undefined || null) ? null : this.formDatosDireccion.get('distrito').value?.id,
            estado: 1,
            idPartnerRelacionado: idPartnerRelacionado,
            idPartner: this.proveedor.idPartner,
            numeroDocIdentidad: this.formInfoBasicaProveedor.get('nroDocumento').value,
            idc: this.formInfoBasicaProveedor.get('idc').value,
            primerNombre: this.formInfoBasicaProveedor.get('primerNombre').value,
            prvUbigeo: (this.formDatosDireccion.get('provincia').value?.id == undefined || null) ? null : this.formDatosDireccion.get('provincia').value?.id,
            razonSocial: this.formInfoBasicaProveedor.get('razonSocial').value,
            segundoNombre: this.formInfoBasicaProveedor.get('segundoNombre').value,
            telefono: this.formInfoContactoProveedor.get('telefono').value,
            tipoDocIdentidad: this.formInfoBasicaProveedor.get('tipoDocumento').value.id,
            tipoPartner: +this.formInfoBasicaProveedor.get('tipoProveedor').value.id,
            usuarioActualizacion: usuario.email,
        }

        console.log(proveedorUpdated);
        // this.postBancoCuentaProveedor();
        this.proveedorService.putActualizarPartner(proveedorUpdated).subscribe((resp: any) => {
            if (resp) {
                if (resp['codigo'] == 0) {
                    // if (this.cuentas.length>0) {
                    //     this.postBancoCuentaProveedor();
                    // }else {

                    // }
                    this.toastr.success('Proveedor actualizado correctamente', 'Actualizacion exitosa');
                    this.router.navigate(['/apps/mantenimiento/proveedor']);
                } else {
                    this.toastr.error('Error en el servicio de registro de proveedor', 'Error crearProveedor');
                }
            }
        }, (_error) => {
            this.toastr.error('Error en el servicio de registro de proveedor - no controlado', 'Error crearProveedor');
        })
    }

    postBancoCuentaProveedor() {
        const usuario = JSON.parse(localStorage.getItem('userABA'));
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
            cuentasArray.forEach(request => {
                this.proveedorService.postRegistrarBancoCuentaPartner(request)
            })
        ).subscribe(resp => {
            resp.forEach(response => {
                console.log(response);

            });
        })



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