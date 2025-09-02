import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { CommonService } from '@/pages/service/commonService';
//import { VerArchivoComponent } from '../ver-archivo/ver-archivo.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CuentasDetailsService } from '../../cuentas-details/cuentas-details.service';
import { FILE_TYPE, BALANCE_ADJUSTMENT_STATUS, ACCOUNT_TYPES } from '@/layout/Utils/constants/aba.constants';
import { VerArchivoComponent } from '../ver-archivo/ver-archivo.component';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';
@Component({
    selector: 'app-detalle-movimiento',
    templateUrl: './detalle-movimiento.component.html',
    styleUrls: ['./detalle-movimiento.component.scss'],
    standalone: true,
    imports: [TabsModule,DividerModule,InputNumberModule, DatePickerModule, TableModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService,DialogService],
    encapsulation: ViewEncapsulation.None
})
export class DetalleMovimientoComponent implements OnInit {

    datosRequest: any;
    datosMovimiento: any;
    datosCliente: any;
    datosCuenta: any;
    datosAjuste: any;
    datosDetalleMovimiento: any;
    tipoCuenta: any;
    datosAjusteDetalle = [];
    disableTabAjuste: boolean = true;
    showCardContainer: boolean = false;

    constructor(
        //public dialog: MatDialog,
         private dialog: DialogService,
        // public dialogRef: MatDialogRef<DetalleMovimientoComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private cuentasDetailsService: CuentasDetailsService,
        private commonService: CommonService,
        //private toastr: ToastrService

        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private toastr: MessageService,
    ) {
        this.datosMovimiento = config.data.movimiento;
        this.datosCliente = config.data.datosCliente;
        this.datosCuenta = config.data.datosCuenta;

        if (this.datosMovimiento && this.datosMovimiento.request) {
            this.datosRequest = JSON.parse(this.datosMovimiento.request);
        }

        const numeroCuenta = this.datosCuenta.numeroCuenta;
        const bin = numeroCuenta.slice(0, 2);
        this.tipoCuenta = ACCOUNT_TYPES.find((type: any) => type.bin === bin);

        this.showCardContainer = false;

        if (bin == '41') {
            this.showCardContainer = true;
        }
    }

    ngOnInit() {
        this.getCombos();
        this.getDatosAjuste();
    }

    getCombos() {
        this.commonService.getMultipleCombosPromise([
            'TIPO_DOCUMENTO',
            'BANCO_TIN_INTEROP'
        ]).then((resp: any) => {
            const tipoDocumentos = resp[0]['data'].map((item: any) => {
                return {
                    id: item['valNumEntero'],
                    descripcion: item['desElemento']
                }
            });

            const bancos = resp[1]['data'].map((item: any) => {
                return {
                    id: item['valCadCorto'],
                    descripcion: item['desElemento']
                }
            });

            if (this.datosRequest && this.datosRequest.originAccountData) {
                const documentType = tipoDocumentos.find((e: any) => String(e.id) == this.datosRequest.originAccountData.identDocType);
                if (documentType) {
                    this.datosRequest.originAccountData.documentType = documentType.descripcion;
                }

                const entityCode = bancos.find((e: any) => e.id == this.datosRequest.originAccountData.entityCode);
                if (entityCode) {
                    this.datosRequest.originAccountData.entityCode = entityCode.descripcion;
                }
            }

            if (this.datosRequest && this.datosRequest.destinationAccountData) {
                const documentType = tipoDocumentos.find((e: any) => String(e.id) == this.datosRequest.destinationAccountData.identDocType);
                if (documentType) {
                    this.datosRequest.destinationAccountData.documentType = documentType.descripcion;
                }

                const entityCode = bancos.find((e: any) => e.id == this.datosRequest.destinationAccountData.entityCode);
                if (entityCode) {
                    this.datosRequest.destinationAccountData.entityCode = entityCode.descripcion;
                }
            }

        }, (_error) => { })
    }

    async reintentarAjuste(idCabeceraAjuste: any, idDetalleAjuste: any, request: any) {
        let respuestaAjuste: any;
        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        const tipoAjuste = Number(this.datosAjuste.tipoAjuste);

        let uidCuenta = '';
        let uidCliente = '';

        if (request.accountUid !== undefined) {

            uidCliente = request.uidCliente;
            uidCuenta = request.uidCuenta;

            const object = {
                ...request,
                user: usuario.email
            }
            respuestaAjuste = tipoAjuste === 1
                ? await this.cuentasDetailsService.postAjusteAbonoInteres(object)
                : await this.cuentasDetailsService.postAjusteRetiroInteres(object);
        } else {

            uidCliente = request.customerUid;
            uidCuenta = request.accountUid;

            const object = {
                ...request,
                usuarioCreacion: usuario.email
            }
            respuestaAjuste = tipoAjuste === 1
                ? await this.cuentasDetailsService.postAjusteAbonoCapital(object)
                : await this.cuentasDetailsService.postAjusteRetiroCapital(object);
        }

        if (respuestaAjuste?.codigo === 0) {
            const object = {
                estado: 1,
                estadoSolicitud: 1,
                fechaModificacion: new Date(),
                idCabeceraAjuste: idCabeceraAjuste,
                idDetalleAjuste: idDetalleAjuste,
                idMovimiento: respuestaAjuste?.data?.idMovimiento,
                idTransaccion: respuestaAjuste?.data?.idTransaccion,
                nroOperacion: respuestaAjuste?.data?.nroOperacion,
                observacion: false,
                request: JSON.stringify(request),
                response: JSON.stringify(respuestaAjuste?.data),
                uidCuenta: uidCuenta,
                uidcliente: uidCliente,
                usuarioModificacion: usuario.email
            }

            let respuestaDetalleAjusteSaldo = await this.cuentasDetailsService.postDetalleAjusteSaldo(object);

            if (respuestaDetalleAjusteSaldo?.codigo === 0) {
                 this.toastr.add({ severity: 'success', summary: '', detail: 'Se proceso correctamente' });             
            } else {
                this.toastr.add({ severity: 'error', summary: '', detail:'Ocurrio un error al actualizar el detalle'});            
            }
        } else {
            this.toastr.add({ severity: 'error', summary: '', detail:'Ocurrio un error en el ajuste de saldos'});            
        }
    }

    getDatosAjuste() {
        this.cuentasDetailsService.getDatosAjuste(this.datosMovimiento.idTransaccion)
            .subscribe((resp1: any) => {
                if (resp1['codigo'] == 0) {
                    this.datosAjuste = resp1['data'];
                    this.disableTabAjuste = false;
                    this.cuentasDetailsService.getDatosCabeceraMovimiento(
                        this.datosMovimiento.idTransaccion,
                        this.datosCuenta.numeroCuenta
                    ).subscribe((resp2: any) => {
                        if (resp2['codigo'] == 0 && resp2['data'].length > 0) {
                            this.cuentasDetailsService.getDatosDetalleMovimiento(resp2['data'][0].idCabecera).subscribe((resp3: any) => {
                                if (resp3['codigo'] == 0) {
                                    this.datosAjusteDetalle = resp3['data'].map((x: any) => {
                                        const request = JSON.parse(x.request);
                                        const status:any = BALANCE_ADJUSTMENT_STATUS.find((e: any) => e.codigo === x.estadoSolicitud);
                                        const object = {
                                            request: request,
                                            estadoSolicitudDescripcion: status.descripcion,
                                            estadoSolicitud: x.estadoSolicitud,
                                            idCabeceraAjuste: x.idCabeceraAjuste,
                                            idDetalleAjuste: x.idDetalleAjuste,
                                            plan: (request.accountUid !== undefined ? request.ptyCode : request.tipoPlan) == '01' ? 'Disponible (Plan 1)' : 'Retenido (Plan 2)',
                                            monto: request.accountUid !== undefined ? request.amount : request.monto,
                                            tasa: request.accountUid !== undefined ? request.aer : request.tasa,
                                            descripcion: request.accountUid !== undefined ? `Ajuste de interés - ${request.description}` : `Capitalización de interés - ${request.glosa}`,
                                            usuario: request.accountUid !== undefined ? request.user : request.usuarioCreacion
                                        }

                                        return object;
                                    });
                                }
                            });
                        }
                    });
                } else if (resp1['codigo'] == -1) {
                    this.toastr.add({ severity: 'error', summary: 'Error getDatosAjuste', detail:resp1['mensaje']});                 
                }
            }, (_error) => {
                this.toastr.add({ severity: 'error', summary: 'Error getDatosAjuste', detail:'Error en el servicio de obtener datos del ajuste'});                
            });
    }

    openDialogVerArchivo(base64File:any, fileName:any): void {
        const type = base64File.substring(base64File.indexOf('/') + 1, base64File.indexOf(';base64'));
        let displayFile = true;

        if (type !== FILE_TYPE.PDF && type !== FILE_TYPE.JPEG && type !== FILE_TYPE.PNG) {
            this.commonService.downloadFile(base64File, fileName);
            return;
        }

        this.dialog.open(VerArchivoComponent, {
            width: '1000px',
            height: displayFile ? '90vh' : '150px',
            data: {
                base64File: base64File,
                fileName: fileName,
                displayFile: displayFile
            }
        });
    }
}
