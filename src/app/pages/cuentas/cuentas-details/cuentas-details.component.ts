import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonModule, DatePipe } from '@angular/common';
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
import { CALENDAR_DETAIL, DOCUMENT, FILE_TYPE, ROLES, TYPE_TRANSACTION } from '@/layout/Utils/constants/aba.constants';
import { SecurityEncryptedService } from '@/layout/service/SecurityEncryptedService';
import { ActivatedRoute, Router } from '@angular/router';
import { Cuenta } from '@/layout/models/cuenta';
import { FieldsetModule } from 'primeng/fieldset';
import { CuentasDetailsService } from './cuentas-details.service';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { RegistrarBloqueoCuentaComponent } from '../cuentas-modals/registrar-bloqueo-cuenta/registrar-bloqueo-cuenta.component';
import { RegistrarBloqueoTarjetaComponent } from '../cuentas-modals/registrar-bloqueo-tarjeta/registrar-bloqueo-tarjeta.component';
import { DetalleBotoneraComponent } from '../cuentas-modals/detalle-botonera/detalle-botonera.component';
import { VerCuentaRelacionadaComponent } from '../cuentas-modals/ver-cuenta-relacionada/ver-cuenta-relacionada.component';
import { SplitButton } from 'primeng/splitbutton';
import { RegistrarRetencionComponent } from '../cuentas-modals/registrar-retencion/registrar-retencion.component';
import { CalcularCuentaAhorroComponent } from '../cuentas-modals/calcular-cuenta-ahorro/calcular-cuenta-ahorro.component';
import { CobroComisionComponent } from '../cuentas-modals/cobro-comision/cobro-comision.component';
import { DisableContentByRoleDirective } from '@/layout/Utils/directives/disable-content-by-role.directive';
import { DetalleMovimientoComponent } from '../cuentas-modals/detalle-movimiento/detalle-movimiento.component';
import { DatePicker } from 'primeng/datepicker';
import moment from 'moment';
import { ExcelService } from '@/pages/service/excel.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-cuentas-details',
    standalone: true,
    templateUrl: './cuentas-details.component.html',
    styleUrls: ['./cuentas-details.component.scss'],
    imports: [        
        DatePicker,
        DisableContentByRoleDirective,
        SplitButton,
        TabsModule,
        DynamicDialogModule,
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
        FieldsetModule,
        MenuModule,
        TooltipModule,
        Breadcrumb
    ],
    providers: [DatePipe,DialogService, ConfirmationService, MessageService, CustomerService, ProductService, DatetzPipe]
})
export class CuentasDetailsComponent implements OnInit {
    items: MenuItem[] = [{ label: 'Consulta' , routerLink: '/uikit/cuenta' }, { label: 'Detalle Cuenta'  }];
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
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

    //fechaRangoMovimientos: [Date | null, Date | null] = [null, null];
    fechaRangoMovimientos: Date[] | undefined;
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

    datosTarjetaBloqueos: any[] = [];
    loadingTarjetaBloqueos!: boolean;

    datosPagosPorBloqueo = [];
    loadingPagosPorBloqueo!: boolean;

    // Holdbacks
    datosPagoRetencion = [];
    loadingPagoRetencion!: boolean;

    datosRetenciones: any[] = [];
    loadingRetenciones!: boolean;

    // Intereses
    datosInteresTarifario: any;

    roles: any = ROLES;


    itemsOpciones: MenuItem[] = [
        {
            label: 'Registrar retención',
            icon: 'pi pi-undo',
            command: () => this.openDialogRegistrarRetencion(),
            //disabled: this.shouldDisableForRoles([roles.PLAFT, roles.FRAUDE, roles.ATENCION_CLIENTE, roles.ATENCION_CLIENTE_TD]) || this.disableActions
        },
        {
            label: 'Bloqueo/Desbloqueo Cuenta',
            icon: 'pi pi-lock',
            command: () => this.openDialogRegistrarBloqueoCuenta('bloqueo'),
            disabled: this.disableActions
        },
        {
            label: 'Cancelación Cuenta',
            icon: 'pi pi-ban',
            command: () => this.openDialogRegistrarBloqueoCuenta('cancelacion'),
            //disabled: this.shouldDisableForRoles([roles.PLAFT, roles.ATENCION_CLIENTE, roles.ATENCION_CLIENTE_TD]) || this.disableActions
        },
        {
            label: 'Desbloqueo de Cuenta',
            icon: 'pi pi-unlock',
            command: () => this.openDialogRegistrarBloqueoCuenta('desbloqueo'),
            //disabled: this.shouldDisableForRoles([roles.PLAFT, roles.ATENCION_CLIENTE, roles.ATENCION_CLIENTE_TD]) || !this.disableActions
        },
        {
            label: 'Envío de EECC',
            icon: 'pi pi-file',
            command: () => this.openDialogEnvioEstadoCuenta(),
            //visible: this.bin === '41',
            //disabled: this.shouldDisableForRoles([roles.PLAFT, roles.FRAUDE, roles.ATENCION_CLIENTE]) || this.disableActions
        },
        {
            label: 'Ajustes Saldo',
            icon: 'pi pi-cog',
            command: () => this.openDialogCalcularCuentaAhorro(),
            //disabled: this.shouldDisableForRoles([roles.PLAFT, roles.FRAUDE, roles.ATENCION_CLIENTE]) || this.disableActions
        }



    ];
    constructor(
        
        private excelService: ExcelService,
        private cuentasDetailsService: CuentasDetailsService,
        private router: Router,
        private toastr: MessageService,
        public datepipe: DatePipe,
        private customerService: CustomerService,
        private productService: ProductService,
        private commonService: CommonService,
        private securityEncryptedService: SecurityEncryptedService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private dialog: DialogService
    ) {
        const fechaFin = new Date(); // hoy
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaFin.getDate() - 6); // hoy - 6 días

        this.fechaRangoMovimientos = [fechaInicio, fechaFin];

        this.activatedRoute.params.subscribe((params: any) => {
            this.uidCuenta = params.cuenta ? this.securityEncryptedService.decrypt(params.cuenta) : this.uidCuenta;
            this.uidCliente = params.cliente ? this.securityEncryptedService.decrypt(params.cliente) : this.uidCliente;
            this.tipoDoc = params.tipoDoc ? params.tipoDoc : this.tipoDoc;
            this.numDoc = params.numDoc ? params.numDoc : this.numDoc;
            this.loadPage();
        });
    }

    descargarExcelMovimientosMes() {

        let datosMovimientosMes: any[] = this.datosMovimientos;

        const fechaReporte = new Date();
        const excelName = 'Reporte Movimientos ' + moment(fechaReporte).format('DD/MM/YYYY') + '.xlsx';
        const sheetName = 'Datos';
        const datos: any[] = [];
        const header = [];
        const isCurrency: any[] = [];
        const filterLavel = 'Fecha de Reporte';

        header.push('Fecha Movimiento');
        header.push('Fecha Proceso');
        header.push('Num. Tarjeta');
        header.push('Cod. Descripción');
        header.push('Descripción');
        header.push('Tipo de Movimiento');
        header.push('Importe');
        header.push('Estado Confirmación');
        header.push('Red(descripción)');
        header.push('Reversado');
        datosMovimientosMes.forEach(x => {

            const list = [];

            list.push(this.datepipe.transform(x.fechaTransaccion, 'dd/MM/yyyy HH:mm:ss'));
            list.push(this.datepipe.transform(x.fechaContable, 'dd/MM/yyyy'));
            list.push(x.enmascarado);
            list.push(x.codigoClasificacionTransaccion);
            list.push(x.descripcion);
            list.push(x.tipoMovimiento);
            list.push(x.monto);
            list.push(x.estadoConfirmacion);
            list.push(x.descOrigenInt);
            list.push(x.reversado ? 'Si' : 'No');

            datos.push(list);
        });
        this.excelService.generateExcel(header, excelName, sheetName, isCurrency, datos, fechaReporte, filterLavel);
    }
    openDialogCalcularCuentaAhorro(): void {
        const saldoDisponible = this.datosSaldoPorPlan?.planes.find((e: any) => e.codigoPlan === '01');

        if (!saldoDisponible) {
            this.toastr.add({ severity: 'error', summary: '', detail: 'No se encontró saldo disponible' });
        }

        const dialogRef = this.dialog.open(CalcularCuentaAhorroComponent, {
            header: 'Ajuste de Saldo y Cálculo de Intereses',
            width: '40vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                uidCliente: this.uidCliente,
                uidCuenta: this.uidCuenta,
                numeroCuenta: this.datosCuenta.numeroCuenta,
                planes: this.datosSaldoPorPlan.planes,
                tasa: this.datosInteresTarifario.tasaEquivalenteAnual,
                saldoDisponible: saldoDisponible?.capital
            }
        });

        // dialogRef.afterClosed().subscribe(resp => {
        //     if (resp !== undefined) {
        //         if (resp.data['codigo'] == 0) {
        //             this.getCuenta();
        //             this.toastr.success('Ajuste de saldo registrado');
        //         } else {
        //             this.toastr.error('Error en el servicio de ajustar saldo: ' + resp.data['mensaje'], 'Error openDialogAjustarSaldo');
        //         }
        //     }
        // });
    }

    visibilidadTarjeta(tarjeta: any) {
        
        if (tarjeta.numTarjetaVisible) {
            this.datosTarjetas = this.datosTarjetas.map((item: any) => {
                if (item.idTarjeta == tarjeta.idTarjeta) {
                    item.numTarjetaVisible = false;
                }
                return item;
            })
        } else if (tarjeta?.desenmascarado) {
            this.datosTarjetas = this.datosTarjetas.map((item: any) => {
                if (item.idTarjeta == tarjeta.idTarjeta) {
                    item.numTarjetaVisible = true;
                }
                return item;
            })
        } else {
            const token = tarjeta.token
            this.commonService.getCardNumberFullEncrypted(token).subscribe((resp: any) => {
                if (resp['codigo'] == 0) {
                    const body = resp;
                    const datosTarjetaDecrypted = this.commonService.decryptResponseCardNumber(body);
                    this.datosTarjetas = this.datosTarjetas.map((item: any) => {
                        if (item.idTarjeta == tarjeta.idTarjeta) {
                            item.numTarjetaVisible = true;
                            const desenmascarado = datosTarjetaDecrypted.tarjeta.slice(3);
                            return {
                                ...item,
                                desenmascarado
                            }
                        } else {
                            return item;
                        }
                    })

                } else {
                    this.toastr.add({ severity: 'error', summary: 'Error visibilidadTarjeta()', detail: resp['mensaje'] });
                }
            }, (_error) => {
                this.toastr.add({ severity: 'error', summary: 'Error visibilidadTarjeta()', detail: 'Error en el servicio de obtener tarjeta desencriptada' });
            })
        }
    }

    openDialogEnvioEstadoCuenta(): void {
        const saldoDisponible = this.datosSaldoPorPlan?.planes.find((e: any) => e.codigoPlan === '01');

        if (!saldoDisponible) {
            this.toastr.add({ severity: 'error', summary: '', detail: 'No se encontró saldo disponible' });
        }
        const dialogRef = this.dialog.open(CobroComisionComponent, {
            header: 'Envío de EECC',
            width: '40vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                uidCuenta: this.uidCuenta,
                uidCliente: this.uidCliente,
                saldoDisponible: saldoDisponible?.capital
            }
        });

        // dialogRef.afterClosed().subscribe(resp => {
        //     if (resp !== undefined) {
        //         if (resp.data['codigo'] == 0) {
        //             this.getCuenta();
        //             this.toastr.success('Ajuste de saldo registrado');
        //         } else {
        //             this.toastr.error('Error en el servicio de ajustar saldo', 'Error openDialogEnvioEstadoCuenta');
        //         }
        //     }
        // });
    }
    openDialogDetalleMovimiento(data: any) {
        this.dialog.open(DetalleMovimientoComponent, {
            header: 'Detalle Movimiento',
            width: '50vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                movimiento: data,
                datosCliente: this.datosCliente,
                datosCuenta: this.datosCuenta,
            }
        });
    }
    openDialogRegistrarRetencion(): void {
        const saldoDisponible = this.datosSaldoPorPlan?.planes.find((e: any) => e.codigoPlan === '01');
        if (!saldoDisponible) {
            this.toastr.add({ severity: 'error', summary: '', detail: 'No se encontró saldo disponible' });
        }
        const dialogRef = this.dialog.open(RegistrarRetencionComponent, {
            header: 'Registrar retención',
            width: '30vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                uidCuenta: this.uidCuenta,
                uidCliente: this.uidCliente,
                saldoDisponible: saldoDisponible?.capital
            }
        });

        // dialogRef.afterClosed().subscribe(resp => {
        //     if (resp !== undefined) {
        //         if (resp.data['codigo'] == 0) {
        //             this.getCuenta();
        //             this.getCuentaRetenciones();
        //             this.toastr.success('Retención registrada');
        //         } else {
        //             this.toastr.error('Error en el servicio de registrar retención', 'Error openDialogRegistrarRetencion');
        //         }
        //     }
        // });
    }
    limpiar() {

    }
    buscar() {

    }
    ngOnInit() {
        this.loadPage();
    }
    listAccounts() {
        this.dialog.open(VerCuentaRelacionadaComponent, {
            header: 'Cuentas Relacionadas',
            width: '40vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: this.listProductos
        });
    }
    loadPage() {
        this.getCuenta();
        this.getCliente();
        // this.getClientePuc();
        this.getCuentaTarjetas();
        this.getCuentaRetenciones();
        // this.getCuentaBloqueos();
    }
    getCuentaTarjetas() {
        this.datosTarjetas = [];
        this.loadingTarjetas = true;
        const clienteUid = this.uidCliente;
        const cuentaUid = this.uidCuenta;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": {
                "content": [
                    {
                        "idTarjeta": 47933,
                        "idCuenta": 62370,
                        "token": "2405299000049572",
                        "ultimosDigitos": "7279",
                        "bin": 457339,
                        "tipoTarjeta": "VIRTUAL",
                        "codigoEstado": "01",
                        "descripcionEstado": "ACTIVA",
                        "codigoMotivoEstado": "00",
                        "descripcionMotivoEstado": "ACTIVA",
                        "anteriorCodMotivoBloqueo": null,
                        "descripcionAnteriorMotivoBloqueo": "",
                        "fechaAlta": "2024-05-31T20:25:35",
                        "fechaBaja": "2024-08-08T19:46:31",
                        "enmascarado": "457339******7279"
                    },
                    {
                        "idTarjeta": 47934,
                        "idCuenta": 62370,
                        "token": "2206159000000036",
                        "ultimosDigitos": "0351",
                        "bin": 457339,
                        "tipoTarjeta": "FISICA",
                        "codigoEstado": "01",
                        "descripcionEstado": "ACTIVA",
                        "codigoMotivoEstado": "00",
                        "descripcionMotivoEstado": "ACTIVA",
                        "anteriorCodMotivoBloqueo": null,
                        "descripcionAnteriorMotivoBloqueo": "",
                        "fechaAlta": "2024-05-31T20:31:27",
                        "fechaBaja": "2025-03-20T13:34:20",
                        "enmascarado": "457339******0351"
                    }
                ]
            }
        }
        this.loadingTarjetas = false;
        console.log('getTarjetas()...', resp);
        if (resp['codigo'] == 0) {
            this.datosTarjetas = resp['data'].content;
            this.datosTarjetas = this.datosTarjetas.map((item: any) => {
                return {
                    ...item,
                    numTarjetaVisible: false
                }
            })
        } else if (resp['codigo'] == -1) {
            this.toastr.add({ severity: 'error', summary: 'Error getTarjetas', detail: resp['mensaje'] });
        }
        // this.cuentasDetailsService.getTarjetas(clienteUid, cuentaUid)
        //     .subscribe((resp: any) => {
        //         this.loadingTarjetas = false;

        //         console.log('getTarjetas()...', resp);

        //         if (resp['codigo'] == 0) {
        //             this.datosTarjetas = resp['data'].content;
        //             this.datosTarjetas = this.datosTarjetas.map((item: any) => {
        //                 return {
        //                     ...item,
        //                     numTarjetaVisible: false
        //                 }
        //             })
        //         } else if (resp['codigo'] == -1) {
        //             this.toastr.add({ severity: 'error', summary: 'Error getTarjetas', detail: resp['mensaje'] });
        //         }
        //     }, (_error) => {
        //         this.loadingTarjetas = false;
        //         this.toastr.add({ severity: 'error', summary: 'Error getTarjetas', detail: 'Error en el servicio de obtener datos de las tarjetas' });
        //     });
    }

    getTarjetaBloqueos(event: any) {
        this.datosTarjetaBloqueos = [];
        this.loadingTarjetaBloqueos = true;
        const idTarjeta = event.data.idTarjeta;
        const clienteUid = this.uidCliente;
        const cuentaUid = this.uidCuenta;
        const token = event.data.token;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idBloqueo": null,
                    "idExterno": null,
                    "uidTarjeta": 47934,
                    "uidCliente": "23ac807b-afd9-4782-a12b-d57f42b826d6",
                    "uidCuenta": "8e37cb30-9dd0-4ffe-b1e2-ae9b5ca1101d",
                    "fechaBloqueo": "2025-03-20T13:34:20",
                    "codEstado": "01",
                    "estadoBloqueo": 1,
                    "nombreSustento": null,
                    "archivoSustento": null,
                    "motivoBloqueo": null,
                    "usuarioCreacion": "upforigin01",
                    "descMotivoBloqueo": null,
                    "descCodEstado": "ACTIVA",
                    "descripcion": null,
                    "fechaCreacion": null,
                    "celular": null,
                    "tipoDocumento": null,
                    "numeroDocumento": null,
                    "cliente": null,
                    "tarjeta": null,
                    "correo": null,
                    "codEstadoAnterior": "04",
                    "descEstadoAnterior": "BLOQUEO TEMPORAL APP",
                    "codOrigen": "01",
                    "desCodOrigen": "AgoraApp"
                },
                {
                    "idBloqueo": null,
                    "idExterno": null,
                    "uidTarjeta": 47934,
                    "uidCliente": "23ac807b-afd9-4782-a12b-d57f42b826d6",
                    "uidCuenta": "8e37cb30-9dd0-4ffe-b1e2-ae9b5ca1101d",
                    "fechaBloqueo": "2025-03-20T13:29:05",
                    "codEstado": "04",
                    "estadoBloqueo": 1,
                    "nombreSustento": null,
                    "archivoSustento": null,
                    "motivoBloqueo": null,
                    "usuarioCreacion": "upforigin01",
                    "descMotivoBloqueo": null,
                    "descCodEstado": "BLOQUEO TEMPORAL APP",
                    "descripcion": null,
                    "fechaCreacion": null,
                    "celular": null,
                    "tipoDocumento": null,
                    "numeroDocumento": null,
                    "cliente": null,
                    "tarjeta": null,
                    "correo": null,
                    "codEstadoAnterior": "01",
                    "descEstadoAnterior": "ACTIVA",
                    "codOrigen": "01",
                    "desCodOrigen": "AgoraApp"
                }
            ]
        };
        this.loadingTarjetaBloqueos = false;
        console.log('getTarjetaBloqueos()...', resp);

        if (resp['codigo'] == 0) {
            this.datosTarjetaBloqueos = resp['data'].sort((a, b) => new Date(b.fechaBloqueo).getTime() - new Date(a.fechaBloqueo).getTime());
        } else if (resp['codigo'] == -1) {
            this.toastr.add({ severity: 'error', summary: 'Error getTarjetaBloqueos', detail: resp['mensaje'] });
            //this.toastr.error(resp['mensaje'], 'Error getTarjetaBloqueos');
        }

        // this.cuentasDetailsService.getTarjetaBloqueos(idTarjeta, clienteUid, cuentaUid, token)
        //     .subscribe((resp: any) => {
        //         this.loadingTarjetaBloqueos = false;
        //         console.log('getTarjetaBloqueos()...', resp);

        //         if (resp['codigo'] == 0) {
        //             this.datosTarjetaBloqueos = resp['data'].sort((a, b) => new Date(b.fechaBloqueo).getTime() - new Date(a.fechaBloqueo).getTime());
        //         } else if (resp['codigo'] == -1) {
        //             this.toastr.add({ severity: 'error', summary: 'Error getTarjetaBloqueos', detail: resp['mensaje'] });
        //             //this.toastr.error(resp['mensaje'], 'Error getTarjetaBloqueos');
        //         }
        //     }, (_error) => {
        //         this.loadingTarjetaBloqueos = false;
        //         this.toastr.add({ severity: 'error', summary: 'Error getTarjetaBloqueos', detail: 'Error en el servicio de obtener bloqueos tarjeta' });
        //     });
    }


    getCliente() {
        const tipoDocumento = this.tipoDoc;
        const numeroDocumento = this.numDoc;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": {
                "idCliente": 62372,
                "uIdCliente": "23ac807b-afd9-4782-a12b-d57f42b826d6",
                "numDocIdentidad": "90551060",
                "codTipoDocIdentidad": "01",
                "desCodTipoDoc": "DNI",
                "nombresApellidos": "Liliana Andrea Fonseca De Las Casas",
                "estado": "ACTIVO",
                "fechaIngreso": "2024-05-31T20:25:33",
                "fechaActualizacion": "2024-05-31T20:25:33"
            }
        };

        if (resp['codigo'] == 0) {
            let desCodTipoDoc = resp['data'].desCodTipoDoc;
            let numDocIdentidad = resp['data'].numDocIdentidad;
            if (desCodTipoDoc == 'DNI' && numDocIdentidad.length < 8) {
                const limit = 8 - numDocIdentidad.length;
                for (let index = 0; index < limit; index++) {
                    numDocIdentidad = '0' + numDocIdentidad;
                }
            }
            this.datosCliente.desCodTipoDoc = desCodTipoDoc;
            this.datosCliente.numDocIdentidad = numDocIdentidad;
            this.datosCliente.nombresApellidos = resp['data'].nombresApellidos;
        } else if (resp['codigo'] == -1) {
            this.toastr.add({ severity: 'error', summary: 'Error getCliente', detail: resp['mensaje'] });
        }

        // this.commonService.getCliente(tipoDocumento, numeroDocumento)
        //     .subscribe(
        //         (resp: any) => {
        //             console.log('getCliente()...', resp);
        //             if (resp['codigo'] == 0) {
        //                 let desCodTipoDoc = resp['data'].desCodTipoDoc;
        //                 let numDocIdentidad = resp['data'].numDocIdentidad;
        //                 if (desCodTipoDoc == 'DNI' && numDocIdentidad.length < 8) {
        //                     const limit = 8 - numDocIdentidad.length;
        //                     for (let index = 0; index < limit; index++) {
        //                         numDocIdentidad = '0' + numDocIdentidad;
        //                     }
        //                 }
        //                 this.datosCliente.desCodTipoDoc = desCodTipoDoc;
        //                 this.datosCliente.numDocIdentidad = numDocIdentidad;
        //                 this.datosCliente.nombresApellidos = resp['data'].nombresApellidos;
        //             } else if (resp['codigo'] == -1) {
        //                 this.toastr.add({ severity: 'error', summary: 'Error getCliente', detail: resp['mensaje'] });
        //             }
        //         }, (_error) => {
        //             this.toastr.add({ severity: 'error', summary: 'Error getCliente', detail: 'Error en el servicio de obtener datos del cliente' });
        //         }
        //     );
    }

    openDialogRegistrarBloqueoCuenta(tipo: any): void {
        //SMCCB
        // if (tipo == 'cancelacion' && !this.showCancelButton) {
        //   this.toastr.warning('No se puede realizar la cancelación ya que la cuenta registra saldos mayores a 0.00');
        //   return;
        // }
        let header = "";
        switch (tipo) {
            case 'bloqueo':
                header = 'Bloqueo de cuenta';
                break;
            case 'cancelacion':
                header = 'Cancelación de cuenta';
                break;
            default:
                header = 'Desbloqueo de cuenta';
                break;
        }
        const dialogRef = this.dialog.open(RegistrarBloqueoCuentaComponent, {
            header: header,
            width: '30vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                uidCuenta: this.uidCuenta,
                uidCliente: this.uidCliente,
                datosCuenta: this.datosCuenta,
                datosCliente: this.datosCliente,
                tipo: tipo,
                showCancelButton: this.showCancelButton
            }
        });

        // dialogRef.afterClosed().subscribe((resp:any) => {
        //     if (resp !== undefined) {
        //         if (resp.data['codigo'] == 0) {
        //             this.getCuenta();
        //             this.getCuentaBloqueos();
        //             this.toastr.success('Bloqueo de cuenta registrado');
        //         } else {
        //             this.toastr.error('Error en el servicio de registrar bloqueo de cuenta', 'Error openDialogRegistrarBloqueoCuenta');
        //         }
        //     }
        // });
    }

    descargarTemplateConstanciaBloqueoTarjetaPdf(rowData: any) {

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
            origen: rowData.usuarioCreacion,
            idExternoBloqueo: rowData.idExterno,
            motivoBloqueo: rowData.descMotivoBloqueo,
            numeroTarjeta: rowData.tarjeta,
            tipoDocumento: this.datosCliente.desCodTipoDoc,
            numeroDocumento: this.datosCliente.numDocIdentidad,
            nombreCliente: this.datosCliente.nombres,
            apellidoCliente: this.datosCliente.apellidos,
            producto: this.datosCuenta.producto
        }

        this.cuentasDetailsService.templateConstanciaBloqueoTarjetaPdf(this.replaceNullUndefinedWithEmpty(data));
    }


    menuItems: any[] = [];
    onButtonClick(event: Event, rowData: any, menu: any) {
        this.menuItems = this.getMenuItems(rowData);
        menu.toggle(event);
    }
    // ✅ Este método devuelve el menú según la fila + rol
    getMenuItems(rowData: any, menu?: any): MenuItem[] {
        const items: MenuItem[] = [];
        const role = this.securityEncryptedService.getRolesDecrypted();
        // Mostrar solo si el rol lo permite
        if (![this.roles.OPERACION_CONTABLE, this.roles.PLAFT, this.roles.CONSULTA].includes(role)) {
            items.push({
                label: 'Bloqueo/Desbloqueo Tarjeta',
                icon: 'pi pi-ban',
                disabled: this.disableActions,
                command: () => {
                    setTimeout(() => {
                        this.openDialogRegistrarBloqueoTarjeta(rowData)
                        menu?.hide();  // cerrar directamente
                    }, 5);
                }
            });
        }
        items.push({
            label: 'Botones',
            icon: 'pi pi-cog',
            command: () => this.openDialogDetalleBotonera(rowData)
        });

        return items;
    }
    dialogRef: DynamicDialogRef | undefined;
    openDialogRegistrarBloqueoTarjeta(tarjeta: any) {
        
        this.dialogRef = this.dialog.open(RegistrarBloqueoTarjetaComponent, {
            header: 'Registrar bloqueo de Tarjeta',
            width: '40vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                uidCuenta: this.uidCuenta,
                uidCliente: this.uidCliente,
                tarjeta: tarjeta
            }
        });
        this.dialogRef.onClose.subscribe((result) => {
            //     if (resp !== undefined) {
            //         if (resp.data['codigo'] == 0) {
            //             this.getCuentaTarjetas();
            //             this.toastr.success('Bloqueo de tarjeta registrada');
            //         } else {
            //             this.toastr.error('Error en el servicio de registrar bloqueo de tarjeta', 'Error openDialogRegistrarBloqueoTarjeta');
            //         }
            //     }
        });
    }
    openDialogDetalleBotonera(tarjeta: any) {
        this.dialog.open(DetalleBotoneraComponent, {
            header: 'Estado de la Botonería',
            width: '30vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                uidCuenta: this.uidCuenta,
                uidCliente: this.uidCliente,
                tarjeta: tarjeta
            }

            // width: '750px',
            // data: {
            //     uidCliente: this.uidCliente,
            //     uidCuenta: this.uidCuenta,
            //     tarjeta: tarjeta
            // }
        });
    }
    getCuentaRetenciones() {
        this.datosRetenciones = [];
        this.loadingRetenciones = true;
        const cuentaUid = this.uidCuenta;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "fechaModificacion": "2025-07-07T16:31:55.106034",
                    "fechaCreacion": "2025-07-07T15:32:31.078682",
                    "usuarioCreacion": "HRCP.Segundo.Ccarhuas@somosoh.pe",
                    "usuarioModificacion": "HRCP.Segundo.Ccarhuas@somosoh.pe",
                    "idRetencion": 230,
                    "nroOperacion": 5420,
                    "numeroCuenta": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                    "fechaRetencion": "2025-07-07T15:32:31.026621",
                    "idPersona": 0,
                    "importeTotal": 100.00,
                    "importeParcial": 100.00,
                    "importePendiente": 0.00,
                    "importeLiberado": 100.00,
                    "importePagado": 0,
                    "fechaPago": null,
                    "fechaReversa": null,
                    "estadoRetencion": 2,
                    "tipoRetencion": "1",
                    "archivoSustento": null,
                    "nombreSustento": null,
                    "nombreSustentoReversa": null,
                    "archivoSustentoReversa": null,
                    "descEstadoRetencion": "Saldo Liberado",
                    "descTipoRetencion": "1",
                    "nroOperacionLiberacion": 5457,
                    "idTransaccion": 464353,
                    "fechaLiberacion": "2025-07-07T16:31:55.065979"
                },
                {
                    "fechaModificacion": "2025-08-01T11:57:54.134172",
                    "fechaCreacion": "2025-07-07T16:33:57.292203",
                    "usuarioCreacion": "HRCP.Segundo.Ccarhuas@somosoh.pe",
                    "usuarioModificacion": "HRCP.Segundo.Ccarhuas@somosoh.pe",
                    "idRetencion": 231,
                    "nroOperacion": 5458,
                    "numeroCuenta": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                    "fechaRetencion": "2025-07-07T16:33:57.095225",
                    "idPersona": 0,
                    "importeTotal": 13429.60,
                    "importeParcial": 0.00,
                    "importePendiente": 13429.60,
                    "importeLiberado": 13429.60,
                    "importePagado": 0,
                    "fechaPago": null,
                    "fechaReversa": null,
                    "estadoRetencion": 2,
                    "tipoRetencion": "1",
                    "archivoSustento": null,
                    "nombreSustento": null,
                    "nombreSustentoReversa": null,
                    "archivoSustentoReversa": null,
                    "descEstadoRetencion": "Saldo Liberado",
                    "descTipoRetencion": "1",
                    "nroOperacionLiberacion": 5315,
                    "idTransaccion": 464414,
                    "fechaLiberacion": "2025-08-01T11:57:54.092836"
                },
                {
                    "fechaModificacion": "2025-08-12T17:28:20.930468",
                    "fechaCreacion": "2025-08-12T16:15:26.157728",
                    "usuarioCreacion": "HRCP.Segundo.Ccarhuas@somosoh.pe",
                    "usuarioModificacion": "HRCP.Segundo.Ccarhuas@somosoh.pe",
                    "idRetencion": 232,
                    "nroOperacion": 79,
                    "numeroCuenta": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                    "fechaRetencion": "2025-08-12T16:15:26.089215",
                    "idPersona": 0,
                    "importeTotal": 12970.67,
                    "importeParcial": 0.00,
                    "importePendiente": 12970.67,
                    "importeLiberado": 12970.67,
                    "importePagado": 0,
                    "fechaPago": null,
                    "fechaReversa": null,
                    "estadoRetencion": 2,
                    "tipoRetencion": "1",
                    "archivoSustento": null,
                    "nombreSustento": null,
                    "nombreSustentoReversa": null,
                    "archivoSustentoReversa": null,
                    "descEstadoRetencion": "Saldo Liberado",
                    "descTipoRetencion": "1",
                    "nroOperacionLiberacion": 115,
                    "idTransaccion": 476994,
                    "fechaLiberacion": "2025-08-12T17:28:20.897488"
                },
                {
                    "fechaModificacion": null,
                    "fechaCreacion": "2025-08-12T17:29:16.442353",
                    "usuarioCreacion": "HRCP.Segundo.Ccarhuas@somosoh.pe",
                    "usuarioModificacion": null,
                    "idRetencion": 233,
                    "nroOperacion": 117,
                    "numeroCuenta": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                    "fechaRetencion": "2025-08-12T17:29:16.398826",
                    "idPersona": 0,
                    "importeTotal": 150.00,
                    "importeParcial": 150.00,
                    "importePendiente": 0.00,
                    "importeLiberado": 0,
                    "importePagado": 0,
                    "fechaPago": null,
                    "fechaReversa": null,
                    "estadoRetencion": 1,
                    "tipoRetencion": "1",
                    "archivoSustento": null,
                    "nombreSustento": null,
                    "nombreSustentoReversa": null,
                    "archivoSustentoReversa": null,
                    "descEstadoRetencion": "Saldo Retenido",
                    "descTipoRetencion": "1",
                    "nroOperacionLiberacion": null,
                    "idTransaccion": 477034,
                    "fechaLiberacion": null
                }
            ]
        }
        this.loadingRetenciones = false;

        console.log('getRetenciones()...', resp);

        if (resp['codigo'] == 0) {
            this.datosRetenciones = resp['data'];
            this.getMatchRetenciones();
        } else if (resp['codigo'] == -1) {
            this.toastr.add({ severity: 'error', summary: 'Error getRetenciones', detail: resp['mensaje'] });

        }
        // this.cuentasDetailsService.getCuentaRetenciones(cuentaUid)
        //     .subscribe((resp: any) => {
        //         this.loadingRetenciones = false;

        //         console.log('getRetenciones()...', resp);

        //         if (resp['codigo'] == 0) {
        //             this.datosRetenciones = resp['data'];
        //             this.getMatchRetenciones();
        //         } else if (resp['codigo'] == -1) {
        //             this.toastr.add({ severity: 'error', summary: 'Error getRetenciones', detail: resp['mensaje'] });

        //         }
        //     }, (_error) => {
        //         this.loadingRetenciones = false;
        //         this.toastr.add({ severity: 'error', summary: 'Error getCuenta', detail: 'Error en el servicio de obtener retenciones' });
        //     });
    }
    getMatchRetenciones() {
        if (this.listaTipoRentecion.length > 0) {
            this.datosRetenciones = this.datosRetenciones.map((x: any) => {
                const tipoRentecion = this.listaTipoRentecion.find((y: any) => y.codTablaElemento == parseInt(x.tipoRetencion));
                return {
                    ...x,
                    descTipoRetencion: tipoRentecion?.valCadLargo
                }
            });
        }
    }
    getCuenta() {

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
            this.getCuentaMovimientos();
            this.getInteresTarifarios();
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
    getInteresTarifarios() {
        this.datosInteresTarifario = null;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": {
                "tasaEquivalenteAnual": 1.0,
                "codigoGrupoCuenta": "A01"
            }
        }
        this.loadingPagoRetencion = false;
        if (resp['codigo'] == 0) {
            this.datosInteresTarifario = resp['data'];
        } else if (resp['codigo'] == -1) {
            this.datosInteresTarifario = {
                ...resp['data'],
                tasaEquivalenteAnual: 0
            };
        }
        // this.cuentasDetailsService.getInteresTarifario({
        //     accountUid: this.uidCuenta
        // }).subscribe((resp) => {
        //     this.loadingPagoRetencion = false;
        //     if (resp['codigo'] == 0) {
        //         this.datosInteresTarifario = resp['data'];
        //     } else if (resp['codigo'] == -1) {
        //         this.datosInteresTarifario = {
        //             ...resp['data'],
        //             tasaEquivalenteAnual: 0
        //         };
        //     }
        // }, (_error) => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getInteresTarifarios', detail: 'Error en el servicio de obtener tarifario' });            
        // });
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
    changeModelFechaRango(event: any) {
        this.finiMovimientos = '';
        this.ffinMovimientos = '';
        if (event[0] !== null && event[1] !== null) {
            this.finiMovimientos = moment(this.fechaRangoMovimientos![0]).format('YYYY-MM-DD') + 'T05:00:00.000Z';
            this.ffinMovimientos = moment(this.fechaRangoMovimientos![1]).format('YYYY-MM-DD') + 'T05:00:00.000Z'
            this.getCuentaMovimientos();
        }
    }

    getCuentaMovimientos() {
        this.datosMovimientos = [];
        this.loadingMovimientos = true;

        const uidCliente = this.uidCliente;
        const uidCuenta = this.uidCuenta;
        const numeroCuenta = this.datosCuenta.numeroCuenta;
        const plan = '01';
        const fini = this.finiMovimientos;
        const ffin = this.ffinMovimientos;
        const pagina = 0;
        const tamanio = 999999000;

        let data = {
            fechaDesde: fini,
            fechaHasta: ffin,
            pagina: pagina,
            tamanio: tamanio,
            uidCliente: uidCliente,
            uidCuenta: uidCuenta,
            codigoTipoPlan: plan,
            numeroCuenta: numeroCuenta,
            tipoDocumento: this.tipoDoc,
            numeroDocumento: this.numDoc
        }
        var resp = {
            "data": [
                {
                    "idMovimiento": 244918,
                    "idTransaccion": "477034",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 11941.34,
                    "fechaContable": "2025-08-12",
                    "monto": -150.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-08-12T22:29:16",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 150.0,
                    "fechaConfirmacion": "2025-08-12T22:29:16.1",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 150.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "AA6DC6",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:29:16.100+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "52a1ec6b7b5c45d98fbc06165688ba04",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 117,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"52a1ec6b7b5c45d98fbc06165688ba04\",\"amount\":150.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T22:29:14.629+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":477034,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":150.0,\"confirmationDate\":\"2025-08-12T22:29:16.100+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":150.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:29:16.100+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "52a1ec6b7b5c45d98fbc06165688ba04",
                        "amount": 150.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T22:29:14.629+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 477034,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "150.0",
                            "confirmationDate": "2025-08-12T22:29:16.100+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "150.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:29:16.100+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244916,
                    "idTransaccion": "477033",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 12091.34,
                    "fechaContable": "2025-08-12",
                    "monto": -879.33,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-12T22:28:22",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 879.33,
                    "fechaConfirmacion": "2025-08-12T22:28:22.166",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 879.33,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "DC970B",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:28:22.166+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1755037701657",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 116,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1755037701657\",\"amount\":879.33,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-12T22:28:21.657+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":477033,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":879.33,\"confirmationDate\":\"2025-08-12T22:28:22.166+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":879.33,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:28:22.166+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1755037701657",
                        "amount": 879.33,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-12T22:28:21.657+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 477033,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "879.33",
                            "confirmationDate": "2025-08-12T22:28:22.166+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "879.33",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:28:22.166+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244915,
                    "idTransaccion": "477032",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100230003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 12970.67,
                    "fechaContable": "2025-08-12",
                    "monto": 12970.67,
                    "descripcion": "BO-Liberación de saldo retenido judicial",
                    "detalle": null,
                    "fechaRegistro": "2025-08-12T22:28:20",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 12970.67,
                    "fechaConfirmacion": "2025-08-12T22:28:20.573",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 12970.67,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "23",
                    "codigoAutorizacion": "7F36D9",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:28:20.573+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "66cc2b958f734271acc9ff8c05755505",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 115,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"66cc2b958f734271acc9ff8c05755505\",\"amount\":12970.67,\"messageType\":\"1100\",\"operationCode\":\"23\",\"groupingCode\":\"36\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Liberación de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T22:28:18.904+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100230003\",\"ftcDescription\":\"BO-Liberación de saldo retenido judicial\",\"financialTransaction\":{\"transactionId\":477032,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":12970.67,\"confirmationDate\":\"2025-08-12T22:28:20.573+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":12970.67,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:28:20.573+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "23",
                        "groupingCode": "36",
                        "entryCode": "03",
                        "externalReference": "66cc2b958f734271acc9ff8c05755505",
                        "amount": 12970.67,
                        "commerceCode": "4000",
                        "commerceName": "Liberación de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T22:28:18.904+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100230003",
                        "ftcDescription": "BO-Liberación de saldo retenido judicial",
                        "financialTransaction": {
                            "transactionId": 477032,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "12970.67",
                            "confirmationDate": "2025-08-12T22:28:20.573+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "12970.67",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:28:20.573+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244908,
                    "idTransaccion": "477028",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 0.0,
                    "fechaContable": "2025-08-12",
                    "monto": -50.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-12T22:15:05",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 50.0,
                    "fechaConfirmacion": "2025-08-12T22:15:05.809",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 50.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "3D54A2",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:15:05.809+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1755036905360",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 111,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1755036905360\",\"amount\":50.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-12T22:15:05.360+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":477028,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":50.0,\"confirmationDate\":\"2025-08-12T22:15:05.809+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":50.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:15:05.809+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1755036905360",
                        "amount": 50.0,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-12T22:15:05.360+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 477028,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "50.0",
                            "confirmationDate": "2025-08-12T22:15:05.809+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "50.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:15:05.809+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244907,
                    "idTransaccion": "477027",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100275103",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 50.0,
                    "fechaContable": "2025-08-12",
                    "monto": 50.0,
                    "descripcion": "Ajuste Procesamiento  Abono",
                    "detalle": "datos de prueba",
                    "fechaRegistro": "2025-08-12T22:15:04",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "51",
                    "idTransaccionPadre": null,
                    "montoTrx": 50.0,
                    "fechaConfirmacion": "2025-08-12T22:15:04.233",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 50.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "100000000000010",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "27",
                    "codigoAutorizacion": "9B97D8",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:15:04.233+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "2719ff662c314a34b09fcc40ea860b30",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 110,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"2719ff662c314a34b09fcc40ea860b30\",\"amount\":50.0,\"messageType\":\"1100\",\"operationCode\":\"27\",\"groupingCode\":\"51\",\"entryCode\":\"03\",\"commerceCode\":\"100000000000010\",\"commerceName\":\"datos de prueba\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T22:15:02.657+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":\"datos de prueba\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100275103\",\"ftcDescription\":\"Ajuste Procesamiento  Abono\",\"financialTransaction\":{\"transactionId\":477027,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"51\",\"parentTransactionId\":null,\"amount\":50.0,\"confirmationDate\":\"2025-08-12T22:15:04.233+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":50.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"100000000000010\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:15:04.233+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "27",
                        "groupingCode": "51",
                        "entryCode": "03",
                        "externalReference": "2719ff662c314a34b09fcc40ea860b30",
                        "amount": 50.0,
                        "commerceCode": "100000000000010",
                        "commerceName": "datos de prueba",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T22:15:02.657+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": "datos de prueba",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100275103",
                        "ftcDescription": "Ajuste Procesamiento  Abono",
                        "financialTransaction": {
                            "transactionId": 477027,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "51",
                            "parentTransactionId": null,
                            "amount": "50.0",
                            "confirmationDate": "2025-08-12T22:15:04.233+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "50.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "100000000000010",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:15:04.233+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244880,
                    "idTransaccion": "476998",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 0.0,
                    "fechaContable": "2025-08-12",
                    "monto": -100.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-12T21:16:14",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-08-12T21:16:14.712",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "6D22EF",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T21:16:14.712+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1755033374192",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 83,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1755033374192\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-12T21:16:14.195+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":476998,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-08-12T21:16:14.712+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T21:16:14.712+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1755033374192",
                        "amount": 100.0,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-12T21:16:14.195+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 476998,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-08-12T21:16:14.712+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T21:16:14.712+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244879,
                    "idTransaccion": "476997",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100275103",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 100.0,
                    "fechaContable": "2025-08-12",
                    "monto": 100.0,
                    "descripcion": "Ajuste Procesamiento  Abono",
                    "detalle": "datos de prueba",
                    "fechaRegistro": "2025-08-12T21:16:12",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "51",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-08-12T21:16:12.835",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "100000000000010",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "27",
                    "codigoAutorizacion": "093246",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T21:16:12.835+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "cce3ec075f584cb9a9788ee45c5dbad7",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 82,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"cce3ec075f584cb9a9788ee45c5dbad7\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"27\",\"groupingCode\":\"51\",\"entryCode\":\"03\",\"commerceCode\":\"100000000000010\",\"commerceName\":\"datos de prueba\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T21:16:11.387+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":\"datos de prueba\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100275103\",\"ftcDescription\":\"Ajuste Procesamiento  Abono\",\"financialTransaction\":{\"transactionId\":476997,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"51\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-08-12T21:16:12.835+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"100000000000010\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T21:16:12.835+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "27",
                        "groupingCode": "51",
                        "entryCode": "03",
                        "externalReference": "cce3ec075f584cb9a9788ee45c5dbad7",
                        "amount": 100.0,
                        "commerceCode": "100000000000010",
                        "commerceName": "datos de prueba",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T21:16:11.387+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": "datos de prueba",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100275103",
                        "ftcDescription": "Ajuste Procesamiento  Abono",
                        "financialTransaction": {
                            "transactionId": 476997,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "51",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-08-12T21:16:12.835+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "100000000000010",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T21:16:12.835+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244875,
                    "idTransaccion": "476994",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 0.0,
                    "fechaContable": "2025-08-12",
                    "monto": -12970.67,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-08-12T21:15:25",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 12970.67,
                    "fechaConfirmacion": "2025-08-12T21:15:25.831",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 12970.67,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "932690",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T21:15:25.831+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "795de79906884686989a59206f5060b9",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 79,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"795de79906884686989a59206f5060b9\",\"amount\":14000.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T21:15:24.533+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":476994,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":12970.67,\"confirmationDate\":\"2025-08-12T21:15:25.831+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":12970.67,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T21:15:25.831+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "795de79906884686989a59206f5060b9",
                        "amount": 14000.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T21:15:24.533+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 476994,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "12970.67",
                            "confirmationDate": "2025-08-12T21:15:25.831+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "12970.67",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T21:15:25.831+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244874,
                    "idTransaccion": "476993",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100275103",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 12970.67,
                    "fechaContable": "2025-08-12",
                    "monto": 100.0,
                    "descripcion": "Ajuste Procesamiento  Abono",
                    "detalle": "datos de prueba",
                    "fechaRegistro": "2025-08-12T21:14:43",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "51",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-08-12T21:14:43.298",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "100000000000010",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "27",
                    "codigoAutorizacion": "DD47B5",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T21:14:43.298+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "8ce8ba664bea4b64bbe52f643b2d24ae",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 78,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"8ce8ba664bea4b64bbe52f643b2d24ae\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"27\",\"groupingCode\":\"51\",\"entryCode\":\"03\",\"commerceCode\":\"100000000000010\",\"commerceName\":\"datos de prueba\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T21:14:41.840+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":\"datos de prueba\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100275103\",\"ftcDescription\":\"Ajuste Procesamiento  Abono\",\"financialTransaction\":{\"transactionId\":476993,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"51\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-08-12T21:14:43.298+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"100000000000010\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T21:14:43.298+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "27",
                        "groupingCode": "51",
                        "entryCode": "03",
                        "externalReference": "8ce8ba664bea4b64bbe52f643b2d24ae",
                        "amount": 100.0,
                        "commerceCode": "100000000000010",
                        "commerceName": "datos de prueba",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T21:14:41.840+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": "datos de prueba",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100275103",
                        "ftcDescription": "Ajuste Procesamiento  Abono",
                        "financialTransaction": {
                            "transactionId": 476993,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "51",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-08-12T21:14:43.298+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "100000000000010",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T21:14:43.298+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244132,
                    "idTransaccion": "475789",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 12870.67,
                    "fechaContable": "2025-08-01",
                    "monto": -558.93,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-01T16:57:55",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 558.93,
                    "fechaConfirmacion": "2025-08-01T16:57:55.409",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 558.93,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "D25918",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T16:57:55.409+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1754067474786",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 5316,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1754067474786\",\"amount\":558.93,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-01T16:57:54.786+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":475789,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":558.93,\"confirmationDate\":\"2025-08-01T16:57:55.409+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":558.93,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T16:57:55.409+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1754067474786",
                        "amount": 558.93,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-01T16:57:54.786+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 475789,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "558.93",
                            "confirmationDate": "2025-08-01T16:57:55.409+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "558.93",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T16:57:55.409+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244131,
                    "idTransaccion": "475788",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100230003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13429.6,
                    "fechaContable": "2025-08-01",
                    "monto": 13429.6,
                    "descripcion": "BO-Liberación de saldo retenido judicial",
                    "detalle": null,
                    "fechaRegistro": "2025-08-01T16:57:53",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 13429.6,
                    "fechaConfirmacion": "2025-08-01T16:57:53.79",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 13429.6,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "23",
                    "codigoAutorizacion": "72C5A6",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T16:57:53.790+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "67d581c1e4904b9899b11ee2133a305a",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 5315,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"67d581c1e4904b9899b11ee2133a305a\",\"amount\":13429.6,\"messageType\":\"1100\",\"operationCode\":\"23\",\"groupingCode\":\"36\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Liberación de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-01T16:57:51.939+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100230003\",\"ftcDescription\":\"BO-Liberación de saldo retenido judicial\",\"financialTransaction\":{\"transactionId\":475788,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":13429.6,\"confirmationDate\":\"2025-08-01T16:57:53.790+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":13429.6,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T16:57:53.790+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "23",
                        "groupingCode": "36",
                        "entryCode": "03",
                        "externalReference": "67d581c1e4904b9899b11ee2133a305a",
                        "amount": 13429.6,
                        "commerceCode": "4000",
                        "commerceName": "Liberación de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-01T16:57:51.939+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100230003",
                        "ftcDescription": "BO-Liberación de saldo retenido judicial",
                        "financialTransaction": {
                            "transactionId": 475788,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "13429.6",
                            "confirmationDate": "2025-08-01T16:57:53.790+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "13429.6",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T16:57:53.790+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239215,
                    "idTransaccion": "470910",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 0.0,
                    "fechaContable": "2025-08-01",
                    "monto": -2.22,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-01T06:06:30",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 2.22,
                    "fechaConfirmacion": "2025-08-01T06:06:29.863",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 2.22,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "6C4D6F",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T06:06:29.863+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1754028389456",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 456,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1754028389456\",\"amount\":2.22,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-01T06:06:29.456+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":470910,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":2.22,\"confirmationDate\":\"2025-08-01T06:06:29.863+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":2.22,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T06:06:29.863+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1754028389456",
                        "amount": 2.22,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-01T06:06:29.456+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 470910,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "2.22",
                            "confirmationDate": "2025-08-01T06:06:29.863+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "2.22",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T06:06:29.863+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239199,
                    "idTransaccion": "470898",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100370003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 2.22,
                    "fechaContable": "2025-07-31",
                    "monto": 2.22,
                    "descripcion": "Abono de capitalización de intereses plan disp.",
                    "detalle": "Capitalizacion plan 01",
                    "fechaRegistro": "2025-08-01T06:06:28",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 2.22,
                    "fechaConfirmacion": "2025-08-01T04:59:59.999",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 2.22,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "37",
                    "codigoAutorizacion": "EC05B6",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T04:59:59.999+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "CAPITAUTO1754028384616-1594199861",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 444,
                    "operationNumber": null,
                    "codigoOrigen": "13",
                    "originCode": null,
                    "request": "{\"externalReference\":\"CAPITAUTO1754028384616-1594199861\",\"amount\":2.22,\"messageType\":\"1100\",\"operationCode\":\"37\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0000\",\"commerceName\":\"PROCESSOR\",\"commerceTerminalId\":\"0000\",\"commerceDateTime\":\"2025-08-01T06:06:24.616+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Capitalizacion plan 01\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100370003\",\"ftcDescription\":\"Abono de capitalización de intereses plan disp.\",\"financialTransaction\":{\"transactionId\":470898,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":2.22,\"confirmationDate\":\"2025-08-01T04:59:59.999+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":2.22,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T04:59:59.999+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin13",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "37",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "CAPITAUTO1754028384616-1594199861",
                        "amount": 2.22,
                        "commerceCode": "0000",
                        "commerceName": "PROCESSOR",
                        "commerceTerminalId": "0000",
                        "commerceDateTime": "2025-08-01T06:06:24.616+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Capitalizacion plan 01",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100370003",
                        "ftcDescription": "Abono de capitalización de intereses plan disp.",
                        "financialTransaction": {
                            "transactionId": 470898,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "2.22",
                            "confirmationDate": "2025-08-01T04:59:59.999+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "2.22",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T04:59:59.999+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239183,
                    "idTransaccion": "470887",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 0.0,
                    "fechaContable": "2025-08-01",
                    "monto": -9.25,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-01T06:06:27",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 9.25,
                    "fechaConfirmacion": "2025-08-01T06:06:26.934",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 9.25,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "2809B9",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T06:06:26.934+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1754028386459",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 433,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1754028386459\",\"amount\":9.25,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-01T06:06:26.462+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":470887,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":9.25,\"confirmationDate\":\"2025-08-01T06:06:26.934+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":9.25,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T06:06:26.934+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1754028386459",
                        "amount": 9.25,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-01T06:06:26.462+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 470887,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "9.25",
                            "confirmationDate": "2025-08-01T06:06:26.934+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "9.25",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T06:06:26.934+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239162,
                    "idTransaccion": "470876",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100510003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 9.25,
                    "fechaContable": "2025-07-31",
                    "monto": 9.25,
                    "descripcion": "Abono de capitalización de intereses plan rete.",
                    "detalle": "Capitalizacion plan 02",
                    "fechaRegistro": "2025-08-01T06:06:25",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 9.25,
                    "fechaConfirmacion": "2025-08-01T04:59:59.999",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 9.25,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "51",
                    "codigoAutorizacion": "3A4E33",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T04:59:59.999+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "CAPITAUTO175402838450616543104",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 422,
                    "operationNumber": null,
                    "codigoOrigen": "13",
                    "originCode": null,
                    "request": "{\"externalReference\":\"CAPITAUTO175402838450616543104\",\"amount\":9.25,\"messageType\":\"1100\",\"operationCode\":\"51\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0000\",\"commerceName\":\"PROCESSOR\",\"commerceTerminalId\":\"0000\",\"commerceDateTime\":\"2025-08-01T06:06:24.506+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Capitalizacion plan 02\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100510003\",\"ftcDescription\":\"Abono de capitalización de intereses plan rete.\",\"financialTransaction\":{\"transactionId\":470876,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":9.25,\"confirmationDate\":\"2025-08-01T04:59:59.999+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":9.25,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T04:59:59.999+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin13",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "51",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "CAPITAUTO175402838450616543104",
                        "amount": 9.25,
                        "commerceCode": "0000",
                        "commerceName": "PROCESSOR",
                        "commerceTerminalId": "0000",
                        "commerceDateTime": "2025-08-01T06:06:24.506+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Capitalizacion plan 02",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100510003",
                        "ftcDescription": "Abono de capitalización de intereses plan rete.",
                        "financialTransaction": {
                            "transactionId": 470876,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "9.25",
                            "confirmationDate": "2025-08-01T04:59:59.999+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "9.25",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T04:59:59.999+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 236371,
                    "idTransaccion": "464414",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 0.0,
                    "fechaContable": "2025-07-07",
                    "monto": -13429.6,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-07-07T21:33:56",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 13429.6,
                    "fechaConfirmacion": "2025-07-07T21:33:56.833",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 13429.6,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "BB91A1",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-07-07T21:33:56.833+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "9e0e7a580b484c4aa212219356db6cc9",
                    "externalReference": null,
                    "fechaOperacion": "2025-07-07",
                    "operationDate": null,
                    "numeroOperacion": 5458,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"9e0e7a580b484c4aa212219356db6cc9\",\"amount\":14000.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-07-07T21:33:54.513+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":464414,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":13429.6,\"confirmationDate\":\"2025-07-07T21:33:56.833+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":13429.6,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-07-07T21:33:56.833+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-07-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "9e0e7a580b484c4aa212219356db6cc9",
                        "amount": 14000.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-07-07T21:33:54.513+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 464414,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "13429.6",
                            "confirmationDate": "2025-07-07T21:33:56.833+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "13429.6",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-07-07T21:33:56.833+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 236370,
                    "idTransaccion": "464412",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100230003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13429.6,
                    "fechaContable": "2025-07-07",
                    "monto": 100.0,
                    "descripcion": "BO-Liberación de saldo retenido judicial",
                    "detalle": null,
                    "fechaRegistro": "2025-07-07T21:31:54",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-07-07T21:31:54.71",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "23",
                    "codigoAutorizacion": "F1C9FE",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-07-07T21:31:54.710+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "32932ead6a6e45689d61218e18cecf65",
                    "externalReference": null,
                    "fechaOperacion": "2025-07-07",
                    "operationDate": null,
                    "numeroOperacion": 5457,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"32932ead6a6e45689d61218e18cecf65\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"23\",\"groupingCode\":\"36\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Liberación de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-07-07T21:31:53.121+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100230003\",\"ftcDescription\":\"BO-Liberación de saldo retenido judicial\",\"financialTransaction\":{\"transactionId\":464412,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-07-07T21:31:54.710+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-07-07T21:31:54.710+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-07-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "23",
                        "groupingCode": "36",
                        "entryCode": "03",
                        "externalReference": "32932ead6a6e45689d61218e18cecf65",
                        "amount": 100.0,
                        "commerceCode": "4000",
                        "commerceName": "Liberación de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-07-07T21:31:53.121+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100230003",
                        "ftcDescription": "BO-Liberación de saldo retenido judicial",
                        "financialTransaction": {
                            "transactionId": 464412,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-07-07T21:31:54.710+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-07-07T21:31:54.710+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 236338,
                    "idTransaccion": "464353",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 13329.6,
                    "fechaContable": "2025-07-07",
                    "monto": -100.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-07-07T20:32:30",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-07-07T20:32:30.633",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "140143",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-07-07T20:32:30.633+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "b471700b6f85445c9449bad962c35988",
                    "externalReference": null,
                    "fechaOperacion": "2025-07-07",
                    "operationDate": null,
                    "numeroOperacion": 5420,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"b471700b6f85445c9449bad962c35988\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-07-07T20:32:29.230+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":464353,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-07-07T20:32:30.633+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-07-07T20:32:30.633+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-07-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "b471700b6f85445c9449bad962c35988",
                        "amount": 100.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-07-07T20:32:29.230+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 464353,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-07-07T20:32:30.633+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-07-07T20:32:30.633+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 231117,
                    "idTransaccion": "441894",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100370003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13429.6,
                    "fechaContable": "2025-06-30",
                    "monto": 7.4,
                    "descripcion": "Abono de capitalización de intereses plan disp.",
                    "detalle": "Capitalizacion plan 01",
                    "fechaRegistro": "2025-07-01T06:07:06",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 7.4,
                    "fechaConfirmacion": "2025-07-01T04:59:59.999",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 7.4,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "37",
                    "codigoAutorizacion": "3C6A05",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-07-01T04:59:59.999+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "CAPITAUTO1751350026356-1735768400",
                    "externalReference": null,
                    "fechaOperacion": "2025-07-01",
                    "operationDate": null,
                    "numeroOperacion": 452,
                    "operationNumber": null,
                    "codigoOrigen": "13",
                    "originCode": null,
                    "request": "{\"externalReference\":\"CAPITAUTO1751350026356-1735768400\",\"amount\":7.4,\"messageType\":\"1100\",\"operationCode\":\"37\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0000\",\"commerceName\":\"PROCESSOR\",\"commerceTerminalId\":\"0000\",\"commerceDateTime\":\"2025-07-01T06:07:06.356+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Capitalizacion plan 01\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100370003\",\"ftcDescription\":\"Abono de capitalización de intereses plan disp.\",\"financialTransaction\":{\"transactionId\":441894,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":7.4,\"confirmationDate\":\"2025-07-01T04:59:59.999+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":7.4,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":null,\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin13",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-07-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "37",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "CAPITAUTO1751350026356-1735768400",
                        "amount": 7.4,
                        "commerceCode": "0000",
                        "commerceName": "PROCESSOR",
                        "commerceTerminalId": "0000",
                        "commerceDateTime": "2025-07-01T06:07:06.356+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Capitalizacion plan 01",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100370003",
                        "ftcDescription": "Abono de capitalización de intereses plan disp.",
                        "financialTransaction": {
                            "transactionId": 441894,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "7.4",
                            "confirmationDate": "2025-07-01T04:59:59.999+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "7.4",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": null,
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 228192,
                    "idTransaccion": "436682",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100370003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13422.2,
                    "fechaContable": "2025-05-31",
                    "monto": 0.37,
                    "descripcion": "Abono de capitalización de intereses plan disp.",
                    "detalle": "Capitalizacion plan 01",
                    "fechaRegistro": "2025-06-06T20:29:45",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 0.37,
                    "fechaConfirmacion": "2025-06-01T04:59:59.999",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 0.37,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "37",
                    "codigoAutorizacion": "CC0ED6",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-06-01T04:59:59.999+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "CAPITAUTO17492417847991217183637",
                    "externalReference": null,
                    "fechaOperacion": "2025-06-01",
                    "operationDate": null,
                    "numeroOperacion": 250,
                    "operationNumber": null,
                    "codigoOrigen": "13",
                    "originCode": null,
                    "request": "{\"externalReference\":\"CAPITAUTO17492417847991217183637\",\"amount\":0.37,\"messageType\":\"1100\",\"operationCode\":\"37\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0000\",\"commerceName\":\"PROCESSOR\",\"commerceTerminalId\":\"0000\",\"commerceDateTime\":\"2025-06-06T20:29:44.799+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Capitalizacion plan 01\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100370003\",\"ftcDescription\":\"Abono de capitalización de intereses plan disp.\",\"financialTransaction\":{\"transactionId\":436682,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":0.37,\"confirmationDate\":\"2025-06-01T04:59:59.999+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":0.37,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":null,\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin13",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-06-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "37",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "CAPITAUTO17492417847991217183637",
                        "amount": 0.37,
                        "commerceCode": "0000",
                        "commerceName": "PROCESSOR",
                        "commerceTerminalId": "0000",
                        "commerceDateTime": "2025-06-06T20:29:44.799+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Capitalizacion plan 01",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100370003",
                        "ftcDescription": "Abono de capitalización de intereses plan disp.",
                        "financialTransaction": {
                            "transactionId": 436682,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "0.37",
                            "confirmationDate": "2025-06-01T04:59:59.999+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "0.37",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": null,
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 227620,
                    "idTransaccion": "436176",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100316503",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 13421.83,
                    "fechaContable": "2025-06-04",
                    "monto": -50.0,
                    "descripcion": "Retiro para TIN Diferida Otro Titular",
                    "detalle": null,
                    "fechaRegistro": "2025-06-04T17:18:25",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "65",
                    "idTransaccionPadre": null,
                    "montoTrx": 50.0,
                    "fechaConfirmacion": "2025-06-04T17:18:24.995",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 50.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "099990002",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "31",
                    "codigoAutorizacion": "2F3CCB",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-06-04T17:18:24.995+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "139683503023340188",
                    "externalReference": null,
                    "fechaOperacion": "2025-06-04",
                    "operationDate": null,
                    "numeroOperacion": 78,
                    "operationNumber": null,
                    "codigoOrigen": "12",
                    "originCode": null,
                    "request": "{\"externalReference\":\"139683503023340188\",\"amount\":50.0,\"messageType\":\"1100\",\"operationCode\":\"31\",\"groupingCode\":\"65\",\"entryCode\":\"03\",\"commerceCode\":\"099990002\",\"commerceName\":\"AGORA\",\"commerceTerminalId\":\"101\",\"commerceDateTime\":\"2025-06-04T12:18:24.457+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":{\"principalName\":\"null Quispe Huatta\",\"identDocType\":\"1\",\"identDocNumber\":\"01248626\",\"accountNumber\":\"510000601860\",\"entityCode\":\"094\",\"cellPhoneNumber\":null},\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":false,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\",\"refundParentExternalReference\":null,\"refundParentAuthorizationCode\":null,\"refundParentOrigin\":null}",
                    "response": "{\"ftcCode\":\"1100316503\",\"ftcDescription\":\"Retiro para TIN Diferida Otro Titular\",\"financialTransaction\":{\"transactionId\":436176,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"65\",\"parentTransactionId\":null,\"amount\":50.0,\"confirmationDate\":\"2025-06-04T17:18:24.995+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":50.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"099990002\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":null,\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin12",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-06-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "31",
                        "groupingCode": "65",
                        "entryCode": "03",
                        "externalReference": "139683503023340188",
                        "amount": 50.0,
                        "commerceCode": "099990002",
                        "commerceName": "AGORA",
                        "commerceTerminalId": "101",
                        "commerceDateTime": "2025-06-04T12:18:24.457+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": {
                            "principalName": "null Quispe Huatta",
                            "identDocType": "1",
                            "identDocNumber": "01248626",
                            "accountNumber": "510000601860",
                            "entityCode": "094",
                            "cellPhoneNumber": null
                        },
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": "false"
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100316503",
                        "ftcDescription": "Retiro para TIN Diferida Otro Titular",
                        "financialTransaction": {
                            "transactionId": 436176,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "65",
                            "parentTransactionId": null,
                            "amount": "50.0",
                            "confirmationDate": "2025-06-04T17:18:24.995+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "50.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "099990002",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": null,
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 222682,
                    "idTransaccion": "431119",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "01",
                    "codigoClasificacionTransaccion": "1100370003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13471.83,
                    "fechaContable": "2025-05-31",
                    "monto": 9.55,
                    "descripcion": "Abono de capitalización de intereses plan disp.",
                    "detalle": "Capitalizacion plan 01",
                    "fechaRegistro": "2025-06-01T06:06:29",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 9.55,
                    "fechaConfirmacion": "2025-06-01T04:59:59.999",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 9.55,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "37",
                    "codigoAutorizacion": "F27EF6",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-06-01T04:59:59.999+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "CAPITAUTO17487579886001674430128",
                    "externalReference": null,
                    "fechaOperacion": "2025-06-01",
                    "operationDate": null,
                    "numeroOperacion": 443,
                    "operationNumber": null,
                    "codigoOrigen": "13",
                    "originCode": null,
                    "request": "{\"externalReference\":\"CAPITAUTO17487579886001674430128\",\"amount\":9.55,\"messageType\":\"1100\",\"operationCode\":\"37\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0000\",\"commerceName\":\"PROCESSOR\",\"commerceTerminalId\":\"0000\",\"commerceDateTime\":\"2025-06-01T06:06:28.600+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Capitalizacion plan 01\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100370003\",\"ftcDescription\":\"Abono de capitalización de intereses plan disp.\",\"financialTransaction\":{\"transactionId\":431119,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":9.55,\"confirmationDate\":\"2025-06-01T04:59:59.999+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":9.55,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":null,\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin13",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-06-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "37",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "CAPITAUTO17487579886001674430128",
                        "amount": 9.55,
                        "commerceCode": "0000",
                        "commerceName": "PROCESSOR",
                        "commerceTerminalId": "0000",
                        "commerceDateTime": "2025-06-01T06:06:28.600+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Capitalizacion plan 01",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100370003",
                        "ftcDescription": "Abono de capitalización de intereses plan disp.",
                        "financialTransaction": {
                            "transactionId": 431119,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "9.55",
                            "confirmationDate": "2025-06-01T04:59:59.999+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "9.55",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": null,
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244919,
                    "idTransaccion": "477034",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 1749.73,
                    "fechaContable": "2025-08-12",
                    "monto": 150.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-08-12T22:29:16",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 150.0,
                    "fechaConfirmacion": "2025-08-12T22:29:16.1",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 150.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "AA6DC6",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:29:16.100+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "52a1ec6b7b5c45d98fbc06165688ba04",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 117,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"52a1ec6b7b5c45d98fbc06165688ba04\",\"amount\":150.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T22:29:14.629+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":477034,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":150.0,\"confirmationDate\":\"2025-08-12T22:29:16.100+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":150.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:29:16.100+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "52a1ec6b7b5c45d98fbc06165688ba04",
                        "amount": 150.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T22:29:14.629+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 477034,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "150.0",
                            "confirmationDate": "2025-08-12T22:29:16.100+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "150.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:29:16.100+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244917,
                    "idTransaccion": "477033",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 1599.73,
                    "fechaContable": "2025-08-12",
                    "monto": 879.33,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-12T22:28:22",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 879.33,
                    "fechaConfirmacion": "2025-08-12T22:28:22.166",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 879.33,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "DC970B",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:28:22.166+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1755037701657",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 116,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1755037701657\",\"amount\":879.33,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-12T22:28:21.657+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":477033,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":879.33,\"confirmationDate\":\"2025-08-12T22:28:22.166+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":879.33,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:28:22.166+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1755037701657",
                        "amount": 879.33,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-12T22:28:21.657+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 477033,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "879.33",
                            "confirmationDate": "2025-08-12T22:28:22.166+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "879.33",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:28:22.166+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244914,
                    "idTransaccion": "477032",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100230003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 720.4,
                    "fechaContable": "2025-08-12",
                    "monto": -12970.67,
                    "descripcion": "BO-Liberación de saldo retenido judicial",
                    "detalle": null,
                    "fechaRegistro": "2025-08-12T22:28:20",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 12970.67,
                    "fechaConfirmacion": "2025-08-12T22:28:20.573",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 12970.67,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "23",
                    "codigoAutorizacion": "7F36D9",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:28:20.573+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "66cc2b958f734271acc9ff8c05755505",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 115,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"66cc2b958f734271acc9ff8c05755505\",\"amount\":12970.67,\"messageType\":\"1100\",\"operationCode\":\"23\",\"groupingCode\":\"36\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Liberación de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T22:28:18.904+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100230003\",\"ftcDescription\":\"BO-Liberación de saldo retenido judicial\",\"financialTransaction\":{\"transactionId\":477032,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":12970.67,\"confirmationDate\":\"2025-08-12T22:28:20.573+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":12970.67,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:28:20.573+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "23",
                        "groupingCode": "36",
                        "entryCode": "03",
                        "externalReference": "66cc2b958f734271acc9ff8c05755505",
                        "amount": 12970.67,
                        "commerceCode": "4000",
                        "commerceName": "Liberación de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T22:28:18.904+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100230003",
                        "ftcDescription": "BO-Liberación de saldo retenido judicial",
                        "financialTransaction": {
                            "transactionId": 477032,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "12970.67",
                            "confirmationDate": "2025-08-12T22:28:20.573+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "12970.67",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:28:20.573+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244909,
                    "idTransaccion": "477028",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13691.07,
                    "fechaContable": "2025-08-12",
                    "monto": 50.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-12T22:15:05",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 50.0,
                    "fechaConfirmacion": "2025-08-12T22:15:05.809",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 50.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "3D54A2",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T22:15:05.809+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1755036905360",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 111,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1755036905360\",\"amount\":50.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-12T22:15:05.360+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":477028,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":50.0,\"confirmationDate\":\"2025-08-12T22:15:05.809+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":50.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T22:15:05.809+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1755036905360",
                        "amount": 50.0,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-12T22:15:05.360+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 477028,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "50.0",
                            "confirmationDate": "2025-08-12T22:15:05.809+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "50.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T22:15:05.809+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244881,
                    "idTransaccion": "476998",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13641.07,
                    "fechaContable": "2025-08-12",
                    "monto": 100.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-12T21:16:14",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-08-12T21:16:14.712",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "6D22EF",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T21:16:14.712+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1755033374192",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 83,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1755033374192\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-12T21:16:14.195+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":476998,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-08-12T21:16:14.712+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T21:16:14.712+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1755033374192",
                        "amount": 100.0,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-12T21:16:14.195+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 476998,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-08-12T21:16:14.712+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T21:16:14.712+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244876,
                    "idTransaccion": "476994",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13541.07,
                    "fechaContable": "2025-08-12",
                    "monto": 12970.67,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-08-12T21:15:25",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 12970.67,
                    "fechaConfirmacion": "2025-08-12T21:15:25.831",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 12970.67,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "932690",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-12T21:15:25.831+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "795de79906884686989a59206f5060b9",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-12",
                    "operationDate": null,
                    "numeroOperacion": 79,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"795de79906884686989a59206f5060b9\",\"amount\":14000.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-12T21:15:24.533+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":476994,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":12970.67,\"confirmationDate\":\"2025-08-12T21:15:25.831+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":12970.67,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-12T21:15:25.831+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "795de79906884686989a59206f5060b9",
                        "amount": 14000.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-12T21:15:24.533+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 476994,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "12970.67",
                            "confirmationDate": "2025-08-12T21:15:25.831+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "12970.67",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-12T21:15:25.831+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244133,
                    "idTransaccion": "475789",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 570.4,
                    "fechaContable": "2025-08-01",
                    "monto": 558.93,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-01T16:57:55",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 558.93,
                    "fechaConfirmacion": "2025-08-01T16:57:55.409",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 558.93,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "D25918",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T16:57:55.409+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1754067474786",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 5316,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1754067474786\",\"amount\":558.93,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-01T16:57:54.786+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":475789,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":558.93,\"confirmationDate\":\"2025-08-01T16:57:55.409+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":558.93,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T16:57:55.409+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1754067474786",
                        "amount": 558.93,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-01T16:57:54.786+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 475789,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "558.93",
                            "confirmationDate": "2025-08-01T16:57:55.409+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "558.93",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T16:57:55.409+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 244130,
                    "idTransaccion": "475788",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100230003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 11.47,
                    "fechaContable": "2025-08-01",
                    "monto": -13429.6,
                    "descripcion": "BO-Liberación de saldo retenido judicial",
                    "detalle": null,
                    "fechaRegistro": "2025-08-01T16:57:53",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 13429.6,
                    "fechaConfirmacion": "2025-08-01T16:57:53.79",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 13429.6,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "23",
                    "codigoAutorizacion": "72C5A6",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T16:57:53.790+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "67d581c1e4904b9899b11ee2133a305a",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 5315,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"67d581c1e4904b9899b11ee2133a305a\",\"amount\":13429.6,\"messageType\":\"1100\",\"operationCode\":\"23\",\"groupingCode\":\"36\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Liberación de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-08-01T16:57:51.939+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100230003\",\"ftcDescription\":\"BO-Liberación de saldo retenido judicial\",\"financialTransaction\":{\"transactionId\":475788,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":13429.6,\"confirmationDate\":\"2025-08-01T16:57:53.790+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":13429.6,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T16:57:53.790+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "23",
                        "groupingCode": "36",
                        "entryCode": "03",
                        "externalReference": "67d581c1e4904b9899b11ee2133a305a",
                        "amount": 13429.6,
                        "commerceCode": "4000",
                        "commerceName": "Liberación de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-08-01T16:57:51.939+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100230003",
                        "ftcDescription": "BO-Liberación de saldo retenido judicial",
                        "financialTransaction": {
                            "transactionId": 475788,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "13429.6",
                            "confirmationDate": "2025-08-01T16:57:53.790+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "13429.6",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T16:57:53.790+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239216,
                    "idTransaccion": "470910",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13441.07,
                    "fechaContable": "2025-08-01",
                    "monto": 2.22,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-01T06:06:30",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 2.22,
                    "fechaConfirmacion": "2025-08-01T06:06:29.863",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 2.22,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "6C4D6F",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T06:06:29.863+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1754028389456",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 456,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1754028389456\",\"amount\":2.22,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-01T06:06:29.456+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":470910,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":2.22,\"confirmationDate\":\"2025-08-01T06:06:29.863+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":2.22,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T06:06:29.863+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1754028389456",
                        "amount": 2.22,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-01T06:06:29.456+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 470910,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "2.22",
                            "confirmationDate": "2025-08-01T06:06:29.863+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "2.22",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T06:06:29.863+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239184,
                    "idTransaccion": "470887",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13438.85,
                    "fechaContable": "2025-08-01",
                    "monto": 9.25,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": "Autoretencion Procesador",
                    "fechaRegistro": "2025-08-01T06:06:27",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 9.25,
                    "fechaConfirmacion": "2025-08-01T06:06:26.934",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 9.25,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "2809B9",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T06:06:26.934+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "PROC1754028386459",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 433,
                    "operationNumber": null,
                    "codigoOrigen": "08",
                    "originCode": null,
                    "request": "{\"externalReference\":\"PROC1754028386459\",\"amount\":9.25,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0\",\"commerceName\":null,\"commerceTerminalId\":\"0\",\"commerceDateTime\":\"2025-08-01T06:06:26.462+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Autoretencion Procesador\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":470887,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":9.25,\"confirmationDate\":\"2025-08-01T06:06:26.934+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":9.25,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T06:06:26.934+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin08",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "PROC1754028386459",
                        "amount": 9.25,
                        "commerceCode": "0",
                        "commerceName": null,
                        "commerceTerminalId": "0",
                        "commerceDateTime": "2025-08-01T06:06:26.462+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Autoretencion Procesador",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 470887,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "9.25",
                            "confirmationDate": "2025-08-01T06:06:26.934+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "9.25",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T06:06:26.934+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239161,
                    "idTransaccion": "470876",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100510003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 13429.6,
                    "fechaContable": "2025-07-31",
                    "monto": -9.25,
                    "descripcion": "Abono de capitalización de intereses plan rete.",
                    "detalle": "Capitalizacion plan 02",
                    "fechaRegistro": "2025-08-01T06:06:25",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 9.25,
                    "fechaConfirmacion": "2025-08-01T04:59:59.999",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 9.25,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "51",
                    "codigoAutorizacion": "3A4E33",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T04:59:59.999+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "CAPITAUTO175402838450616543104",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 422,
                    "operationNumber": null,
                    "codigoOrigen": "13",
                    "originCode": null,
                    "request": "{\"externalReference\":\"CAPITAUTO175402838450616543104\",\"amount\":9.25,\"messageType\":\"1100\",\"operationCode\":\"51\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0000\",\"commerceName\":\"PROCESSOR\",\"commerceTerminalId\":\"0000\",\"commerceDateTime\":\"2025-08-01T06:06:24.506+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Capitalizacion plan 02\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100510003\",\"ftcDescription\":\"Abono de capitalización de intereses plan rete.\",\"financialTransaction\":{\"transactionId\":470876,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":9.25,\"confirmationDate\":\"2025-08-01T04:59:59.999+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":9.25,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T04:59:59.999+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin13",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "51",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "CAPITAUTO175402838450616543104",
                        "amount": 9.25,
                        "commerceCode": "0000",
                        "commerceName": "PROCESSOR",
                        "commerceTerminalId": "0000",
                        "commerceDateTime": "2025-08-01T06:06:24.506+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Capitalizacion plan 02",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100510003",
                        "ftcDescription": "Abono de capitalización de intereses plan rete.",
                        "financialTransaction": {
                            "transactionId": 470876,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "9.25",
                            "confirmationDate": "2025-08-01T04:59:59.999+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "9.25",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T04:59:59.999+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 239160,
                    "idTransaccion": "470876",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100510003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13438.85,
                    "fechaContable": "2025-07-31",
                    "monto": 9.25,
                    "descripcion": "Abono de capitalización de intereses plan rete.",
                    "detalle": "Capitalizacion plan 02",
                    "fechaRegistro": "2025-08-01T06:06:25",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 9.25,
                    "fechaConfirmacion": "2025-08-01T04:59:59.999",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 9.25,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "0000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "51",
                    "codigoAutorizacion": "3A4E33",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-08-01T04:59:59.999+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "CAPITAUTO175402838450616543104",
                    "externalReference": null,
                    "fechaOperacion": "2025-08-01",
                    "operationDate": null,
                    "numeroOperacion": 422,
                    "operationNumber": null,
                    "codigoOrigen": "13",
                    "originCode": null,
                    "request": "{\"externalReference\":\"CAPITAUTO175402838450616543104\",\"amount\":9.25,\"messageType\":\"1100\",\"operationCode\":\"51\",\"groupingCode\":null,\"entryCode\":null,\"commerceCode\":\"0000\",\"commerceName\":\"PROCESSOR\",\"commerceTerminalId\":\"0000\",\"commerceDateTime\":\"2025-08-01T06:06:24.506+00:00\",\"commerceTransactionNumber\":0,\"commerceTrxDescription\":\"Capitalizacion plan 02\",\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100510003\",\"ftcDescription\":\"Abono de capitalización de intereses plan rete.\",\"financialTransaction\":{\"transactionId\":470876,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":9.25,\"confirmationDate\":\"2025-08-01T04:59:59.999+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":9.25,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"0000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-08-01T04:59:59.999+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin13",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-08-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "51",
                        "groupingCode": null,
                        "entryCode": null,
                        "externalReference": "CAPITAUTO175402838450616543104",
                        "amount": 9.25,
                        "commerceCode": "0000",
                        "commerceName": "PROCESSOR",
                        "commerceTerminalId": "0000",
                        "commerceDateTime": "2025-08-01T06:06:24.506+00:00",
                        "commerceTransactionNumber": 0,
                        "commerceTrxDescription": "Capitalizacion plan 02",
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100510003",
                        "ftcDescription": "Abono de capitalización de intereses plan rete.",
                        "financialTransaction": {
                            "transactionId": 470876,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "9.25",
                            "confirmationDate": "2025-08-01T04:59:59.999+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "9.25",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "0000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-08-01T04:59:59.999+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 236372,
                    "idTransaccion": "464414",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 13429.6,
                    "fechaContable": "2025-07-07",
                    "monto": 13429.6,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-07-07T21:33:56",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 13429.6,
                    "fechaConfirmacion": "2025-07-07T21:33:56.833",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 13429.6,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "BB91A1",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-07-07T21:33:56.833+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "9e0e7a580b484c4aa212219356db6cc9",
                    "externalReference": null,
                    "fechaOperacion": "2025-07-07",
                    "operationDate": null,
                    "numeroOperacion": 5458,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"9e0e7a580b484c4aa212219356db6cc9\",\"amount\":14000.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-07-07T21:33:54.513+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":464414,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":13429.6,\"confirmationDate\":\"2025-07-07T21:33:56.833+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":13429.6,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-07-07T21:33:56.833+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-07-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "9e0e7a580b484c4aa212219356db6cc9",
                        "amount": 14000.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-07-07T21:33:54.513+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 464414,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "13429.6",
                            "confirmationDate": "2025-07-07T21:33:56.833+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "13429.6",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-07-07T21:33:56.833+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 236369,
                    "idTransaccion": "464412",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100230003",
                    "tipoMovimiento": "WITHDRAW",
                    "saldoContable": 0.0,
                    "fechaContable": "2025-07-07",
                    "monto": -100.0,
                    "descripcion": "BO-Liberación de saldo retenido judicial",
                    "detalle": null,
                    "fechaRegistro": "2025-07-07T21:31:54",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-07-07T21:31:54.71",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "23",
                    "codigoAutorizacion": "F1C9FE",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-07-07T21:31:54.710+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "32932ead6a6e45689d61218e18cecf65",
                    "externalReference": null,
                    "fechaOperacion": "2025-07-07",
                    "operationDate": null,
                    "numeroOperacion": 5457,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"32932ead6a6e45689d61218e18cecf65\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"23\",\"groupingCode\":\"36\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Liberación de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-07-07T21:31:53.121+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100230003\",\"ftcDescription\":\"BO-Liberación de saldo retenido judicial\",\"financialTransaction\":{\"transactionId\":464412,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-07-07T21:31:54.710+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-07-07T21:31:54.710+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-07-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "23",
                        "groupingCode": "36",
                        "entryCode": "03",
                        "externalReference": "32932ead6a6e45689d61218e18cecf65",
                        "amount": 100.0,
                        "commerceCode": "4000",
                        "commerceName": "Liberación de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-07-07T21:31:53.121+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100230003",
                        "ftcDescription": "BO-Liberación de saldo retenido judicial",
                        "financialTransaction": {
                            "transactionId": 464412,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-07-07T21:31:54.710+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-07-07T21:31:54.710+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                },
                {
                    "idMovimiento": 236339,
                    "idTransaccion": "464353",
                    "idCuenta": 371532,
                    "codigoTipoMovimiento": "01",
                    "codigoTipoPlan": "02",
                    "codigoClasificacionTransaccion": "1100220003",
                    "tipoMovimiento": "DEPOSIT",
                    "saldoContable": 100.0,
                    "fechaContable": "2025-07-07",
                    "monto": 100.0,
                    "descripcion": "BO-Retención judicial de saldo disponible",
                    "detalle": null,
                    "fechaRegistro": "2025-07-07T20:32:30",
                    "reversado": false,
                    "entryCode": "03",
                    "groupingCode": "00",
                    "idTransaccionPadre": null,
                    "montoTrx": 100.0,
                    "fechaConfirmacion": "2025-07-07T20:32:30.633",
                    "estadoConfirmacion": "CONFIRMED",
                    "balanceReembolso": 100.0,
                    "tipoReembolso": null,
                    "tipoReversa": null,
                    "transaccionReversada": false,
                    "codigoComercio": "4000",
                    "codigoTipoMensaje": "1100",
                    "codigoOperacion": "22",
                    "codigoAutorizacion": "140143",
                    "estadoAutorizacion": "AUTHORIZED",
                    "authorizationStatus": null,
                    "fechaTransaccion": "2025-07-07T20:32:30.633+00:00",
                    "transactionDate": null,
                    "referenciaExterna": "b471700b6f85445c9449bad962c35988",
                    "externalReference": null,
                    "fechaOperacion": "2025-07-07",
                    "operationDate": null,
                    "numeroOperacion": 5420,
                    "operationNumber": null,
                    "codigoOrigen": "05",
                    "originCode": null,
                    "request": "{\"externalReference\":\"b471700b6f85445c9449bad962c35988\",\"amount\":100.0,\"messageType\":\"1100\",\"operationCode\":\"22\",\"groupingCode\":\"35\",\"entryCode\":\"03\",\"commerceCode\":\"4000\",\"commerceName\":\"Retención de saldo\",\"commerceTerminalId\":\"10001\",\"commerceDateTime\":\"2025-07-07T20:32:29.230+00:00\",\"commerceTransactionNumber\":1,\"commerceTrxDescription\":null,\"customInt1\":null,\"customInt2\":null,\"customDec1\":null,\"customDec2\":null,\"customStr1\":null,\"customStr2\":null,\"originAccountData\":null,\"destinationAccountData\":null,\"commissionOverride\":null,\"notificationOverride\":null,\"commissionFree\":false,\"dataElements\":null,\"customerUID\":\"5b045712-f499-4af0-9cfb-841fd4e7f4ea\",\"accountUID\":\"ed3412d1-46a0-4c16-a6db-dbb39d098682\"}",
                    "response": "{\"ftcCode\":\"1100220003\",\"ftcDescription\":\"BO-Retención judicial de saldo disponible\",\"financialTransaction\":{\"transactionId\":464353,\"accountId\":371532,\"entCode\":\"03\",\"groupingCode\":\"00\",\"parentTransactionId\":null,\"amount\":100.0,\"confirmationDate\":\"2025-07-07T20:32:30.633+00:00\",\"confirmationStatus\":\"CONFIRMED\",\"refundBalance\":100.0,\"refundType\":null,\"reversalType\":null,\"reversed\":false,\"commerceCode\":\"4000\",\"confirmationReqUser\":null,\"confirmationReqTimestamp\":\"2025-07-07T20:32:30.633+00:00\",\"metadata\":{\"authorizationMetadata\":null,\"confirmationMetadata\":null}}}",
                    "codigoRechazoTrx": "OK",
                    "motivoRechazoTrx": "00",
                    "apiUser": "upforigin05",
                    "idTarjeta": null,
                    "tarjetaEstado": null,
                    "motivoBloqueoTarjeta": null,
                    "token": null,
                    "enmascarado": null,
                    "utlimosDigitosTarjeta": null,
                    "bin": null,
                    "tipoTarjeta": null,
                    "tarjetaFechaRegistro": null,
                    "tarjetaFechaActualizacion": null,
                    "anioMes": "2025-07-01",
                    "itf": null,
                    "comision": null,
                    "transaccionRequest": {
                        "dataElements": null,
                        "token": null,
                        "customerUID": "5b045712-f499-4af0-9cfb-841fd4e7f4ea",
                        "accountUID": "ed3412d1-46a0-4c16-a6db-dbb39d098682",
                        "messageType": "1100",
                        "operationCode": "22",
                        "groupingCode": "35",
                        "entryCode": "03",
                        "externalReference": "b471700b6f85445c9449bad962c35988",
                        "amount": 100.0,
                        "commerceCode": "4000",
                        "commerceName": "Retención de saldo",
                        "commerceTerminalId": "10001",
                        "commerceDateTime": "2025-07-07T20:32:29.230+00:00",
                        "commerceTransactionNumber": 1,
                        "commerceTrxDescription": null,
                        "customInt1": null,
                        "customInt2": null,
                        "customStr1": null,
                        "customStr2": null,
                        "customDec1": null,
                        "customDec2": null,
                        "commissionFree": false,
                        "refundParentExternalReference": null,
                        "refundParentAuthorizationCode": null,
                        "refundParentOrigin": null,
                        "originAccountData": null,
                        "destinationAccountData": null,
                        "commissionOverride": null,
                        "notificationOverride": null
                    },
                    "transaccionResponse": {
                        "ftcCode": "1100220003",
                        "ftcDescription": "BO-Retención judicial de saldo disponible",
                        "financialTransaction": {
                            "transactionId": 464353,
                            "accountId": 371532,
                            "entCode": "03",
                            "groupingCode": "00",
                            "parentTransactionId": null,
                            "amount": "100.0",
                            "confirmationDate": "2025-07-07T20:32:30.633+00:00",
                            "confirmationStatus": "CONFIRMED",
                            "refundBalance": "100.0",
                            "refundType": null,
                            "reversalType": null,
                            "reversed": false,
                            "commerceCode": "4000",
                            "confirmationReqUser": null,
                            "confirmationReqTimestamp": "2025-07-07T20:32:30.633+00:00",
                            "metadata": {
                                "authorizationMetadata": null,
                                "confirmationMetadata": null
                            }
                        }
                    }
                }
            ]
        };
        this.loadingMovimientos = false;
        this.datosMovimientos = resp['data'];

        this.datosMovimientos = this.datosMovimientos.filter((movimiento: any) => movimiento.estadoConfirmacion == 'CONFIRMED');

        this.datosMovimientos.forEach((movimiento: any) => {
            if (movimiento.tipoMovimiento == TYPE_TRANSACTION.RETIRO)
                movimiento.tipoMovimiento = 'CARGO';
            if (movimiento.tipoMovimiento == TYPE_TRANSACTION.DEPOSITO)
                movimiento.tipoMovimiento = 'ABONO';

            const red = this.listaRed.find((x: any) => x.codigo == movimiento.codigoOrigen);
            movimiento.descOrigenInt = red ? red.descripcion : '';
        });

        this.datosMovimientos.sort((a, b) => {
            return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();
        });
        // this.cuentasDetailsService.postCuentaMovimientos(data).subscribe((resp: any) => {
        //     this.loadingMovimientos = false;
        //     this.datosMovimientos = resp['data'];

        //     this.datosMovimientos = this.datosMovimientos.filter((movimiento: any) => movimiento.estadoConfirmacion == 'CONFIRMED');

        //     this.datosMovimientos.forEach((movimiento: any) => {
        //         if (movimiento.tipoMovimiento == TYPE_TRANSACTION.RETIRO)
        //             movimiento.tipoMovimiento = 'CARGO';
        //         if (movimiento.tipoMovimiento == TYPE_TRANSACTION.DEPOSITO)
        //             movimiento.tipoMovimiento = 'ABONO';

        //         const red = this.listaRed.find((x: any) => x.codigo == movimiento.codigoOrigen);
        //         movimiento.descOrigenInt = red ? red.descripcion : '';
        //     });

        //     this.datosMovimientos.sort((a, b) => {
        //         return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();
        //     });
        // }, (_error) => {
        //     this.loadingMovimientos = false;
        //     this.toastr.add({ severity: 'error', summary: 'Error getCuentaMovimientos', detail: 'Error en el servicio de obtener movimientos de la cuenta' });
        //     //this.toastr.error('Error en el servicio de obtener movimientos de la cuenta', 'Error getCuentaMovimientos');
        // });
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