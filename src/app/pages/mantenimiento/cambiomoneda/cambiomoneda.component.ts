import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Campania } from '../../../layout/models/campania';
import { ListarCampania } from '../../../layout/models/listarCampania';
import { CAMPAIGN_TYPES, CAMPAIGN_VALIDATION_TYPES, ROLES } from '@/layout/Utils/constants/aba.constants';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { AddCambioMonedaComponent } from './modals/add-cambiomoneda/add-cambiomoneda.component';
import { DetailCambioMonedaComponent } from './modals/detail-cambiomoneda/detail-cambiomoneda.component';
import { LogCampaniaCambiomonedaComponent } from './modals/log-campania-cambiomoneda/log-campania-cambiomoneda.component';
import { CambioMonedaService } from './cambiomoneda.service';
import { CommonService } from '@/pages/service/commonService';

@Component({
    selector: 'app-cambiomoneda',
    templateUrl: './cambiomoneda.component.html',
    styleUrls: ['./cambiomoneda.component.scss'],
    //animations: fuseAnimations,
    standalone: true,
    imports: [InputGroupModule, SelectModule, Breadcrumb, ConfirmDialogModule, TooltipModule, TabsModule, MenuModule, DividerModule, InputNumberModule, DatePickerModule, TableModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [CurrencyPipe,DatePipe, MessageService, DialogService, ConfirmationService],
    encapsulation: ViewEncapsulation.None,    
})
export class CambioMonedaComponent implements OnInit {

    rows = 20;
    rowsPerPageOptions: any[] = [];
    estadosTipoCambio: any[] = [];
    data: ListarCampania[] = [];
    campania!: Campania;
    loading: boolean = false;
    roles: any = ROLES;

    constructor(
        public dialog: DialogService,
        public datepipe: DatePipe,
        public currencyPipe: CurrencyPipe,
        private toastr: MessageService,
        private commonService: CommonService,
        private cambioMonedaService: CambioMonedaService,
        private confirmationService: ConfirmationService,
    ) { }

    ngOnInit(): void {
        this.getEstadosTipoCambio();
        this.getCampanias();
    }

    getEstadosTipoCambio() {
        this.commonService.getEstadosTipoCambio().subscribe((resp: any) => {
            this.estadosTipoCambio = resp['data'];
        }, (_error: any) => {
            this.toastr.add({ severity: 'error', summary: 'Error getEstadosTipoCambio', detail: 'Error en el servicio de obtener estados tipo de cambio' });
        })
    }


    // <button mat-icon-button [matMenuTriggerFor]="menu" matTooltipPosition="above"
    //     matTooltip="Opciones">
    //     <mat-icon>more_vert</mat-icon>
    // </button>
    // <mat-menu #menu="matMenu">
    //     <button mat-menu-item (click)="openDialogEditar(rowData)">
    //         <i class="pi pi-pencil" aria-hidden="true"></i>
    //         <span>Editar</span>
    //     </button>
    //     <button mat-menu-item (click)="openDialogDetalle(rowData)">
    //         <i class="pi pi-eye" aria-hidden="true"></i>
    //         <span>Ver Detalle</span>
    //     </button>
    //     <button *appDisableContentByRole="[roles.OPERACION_PASIVA]" mat-menu-item
    //         (click)="openDialogAprobar(rowData)">
    //         <i class="pi pi-check" aria-hidden="true"></i>
    //         <span>Aprobar</span>
    //     </button>
    //     <button *appDisableContentByRole="[roles.OPERACION_PASIVA]" mat-menu-item
    //         (click)="openDialoVigente(rowData)">
    //         <i class="pi pi-check" aria-hidden="true"></i>
    //         <span>Vigente</span>
    //     </button>
    //     <button *appDisableContentByRole="[roles.OPERACION_PASIVA]" mat-menu-item
    //         (click)="openDialogCancelar(rowData)">
    //         <i class="pi pi-minus-circle" aria-hidden="true"></i>
    //         <span>Cancelar</span>
    //     </button>
    //     <button mat-menu-item (click)="openDialogLogs(rowData)">
    //         <i class="pi pi-eye" aria-hidden="true"></i>
    //         <span>Ver Logs</span>
    //     </button>
    // </mat-menu>

    menuItems: any[] = [];
    onButtonClick(event: Event, rowData: any, menu: any) {
        this.menuItems = this.getMenuItems(rowData);
        menu.toggle(event);
    }
    // ✅ Este método devuelve el menú según la fila + rol
    getMenuItems(rowData: any, menu?: any): MenuItem[] {
        const items: MenuItem[] = [];
        items.push({
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                setTimeout(() => {
                    //this.openDialogAdd(rowData)
                    menu?.hide();  // cerrar directamente
                }, 5);
            }
        });
        items.push({
            label: 'Ver Detalle',
            icon: 'pi pi-eye',
            command: () => this.openDialogDetalle(rowData)
        });
        items.push({
            label: 'Aprobar',
            icon: 'pi pi-check',
            command: () => this.openDialogAprobar(rowData)
        });
        items.push({
            label: 'Vigente',
            icon: 'pi pi-check',
            command: () => this.openDialoVigente(rowData)
        });
        items.push({
            label: 'Cancelar',
            icon: 'pi pi-minus-circle',
            command: () => this.openDialogCancelar(rowData)
        });
        items.push({
            label: 'Ver Logs',
            icon: 'pi pi-eye',
            command: () => this.openDialogLogs(rowData)
        });
        return items;
    }
    getCampanias() {
        this.loading = true;

        var respCampania = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idCambioMonedaCampana": 9,
                    "codigoCampana": "009",
                    "descripcion": "Prueba 8",
                    "tipoValidacion": "03",
                    "montoValidacion": 2.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.0500,
                    "tasaVentaOh": -0.3330,
                    "fechaInicio": "2025-08-16T03:34:21.579",
                    "fechaFin": "2025-08-15T10:00:00",
                    "idCambioMonedaEstado": 22,
                    "codigoEstado": "04",
                    "descripcionLarga": "VENCIDO",
                    "fechaHoraAprobacion": null,
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-08-15T17:35:29.163882",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-08-15T17:36:49.455512"
                },
                {
                    "idCambioMonedaCampana": 8,
                    "codigoCampana": "008",
                    "descripcion": "Prueba 7",
                    "tipoValidacion": "03",
                    "montoValidacion": 1.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.0500,
                    "tasaVentaOh": -0.3330,
                    "fechaInicio": "2025-08-15T10:00:00",
                    "fechaFin": "2025-08-15T10:00:00",
                    "idCambioMonedaEstado": 22,
                    "codigoEstado": "04",
                    "descripcionLarga": "VENCIDO",
                    "fechaHoraAprobacion": null,
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-08-15T17:10:48.402833",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-08-15T17:18:41.93362"
                },
                {
                    "idCambioMonedaCampana": 7,
                    "codigoCampana": "007",
                    "descripcion": "Prueba  6",
                    "tipoValidacion": "03",
                    "montoValidacion": 1.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.1620,
                    "tasaVentaOh": -0.2810,
                    "fechaInicio": "2025-06-19T23:48:22.62",
                    "fechaFin": "2025-06-19T05:00:00",
                    "idCambioMonedaEstado": 22,
                    "codigoEstado": "04",
                    "descripcionLarga": "VENCIDO",
                    "fechaHoraAprobacion": "2025-06-19T18:59:11.10892",
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-06-19T18:57:43.548927",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-06-19T18:59:11.108924"
                },
                {
                    "idCambioMonedaCampana": 6,
                    "codigoCampana": "006",
                    "descripcion": "Prueba 5",
                    "tipoValidacion": "03",
                    "montoValidacion": 5.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.1090,
                    "tasaVentaOh": -0.2600,
                    "fechaInicio": "2025-06-17T05:00:00",
                    "fechaFin": "2025-06-17T05:00:00",
                    "idCambioMonedaEstado": 22,
                    "codigoEstado": "04",
                    "descripcionLarga": "VENCIDO",
                    "fechaHoraAprobacion": "2025-06-17T18:30:53.804091",
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-06-17T18:27:56.095015",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-06-17T18:30:53.804096"
                },
                {
                    "idCambioMonedaCampana": 5,
                    "codigoCampana": "005",
                    "descripcion": "Prueba 4",
                    "tipoValidacion": "03",
                    "montoValidacion": 5.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.0990,
                    "tasaVentaOh": -0.2600,
                    "fechaInicio": "2025-06-17T23:14:42.347",
                    "fechaFin": "2025-07-17T23:14:42.347",
                    "idCambioMonedaEstado": 22,
                    "codigoEstado": "04",
                    "descripcionLarga": "VENCIDO",
                    "fechaHoraAprobacion": "2025-06-17T18:17:01.228707",
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-06-17T18:16:15.91427",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-06-17T18:17:01.228714"
                },
                {
                    "idCambioMonedaCampana": 4,
                    "codigoCampana": "004",
                    "descripcion": "Prueba 3",
                    "tipoValidacion": "03",
                    "montoValidacion": 5.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.1500,
                    "tasaVentaOh": -0.1500,
                    "fechaInicio": "2025-06-17T22:56:30.821",
                    "fechaFin": "2025-07-17T22:56:30.82",
                    "idCambioMonedaEstado": 23,
                    "codigoEstado": "05",
                    "descripcionLarga": "CANCELADO",
                    "fechaHoraAprobacion": "2025-06-17T18:04:09.751802",
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-06-17T18:00:27.433973",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-06-17T18:04:09.75181"
                },
                {
                    "idCambioMonedaCampana": 3,
                    "codigoCampana": "003",
                    "descripcion": "Prueba 2",
                    "tipoValidacion": "03",
                    "montoValidacion": 5.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.1000,
                    "tasaVentaOh": -0.1000,
                    "fechaInicio": "2025-06-17T22:46:21.212",
                    "fechaFin": "2025-07-17T22:46:21.21",
                    "idCambioMonedaEstado": 23,
                    "codigoEstado": "05",
                    "descripcionLarga": "CANCELADO",
                    "fechaHoraAprobacion": "2025-06-17T17:53:59.732934",
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-06-17T17:48:21.294584",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-06-17T17:53:59.732944"
                },
                {
                    "idCambioMonedaCampana": 2,
                    "codigoCampana": "002",
                    "descripcion": "Prueba1",
                    "tipoValidacion": "03",
                    "montoValidacion": 5.00,
                    "tipoCampana": "02",
                    "tipoCambioCompraOh": 0.0000,
                    "tipoCambioVentaOh": 0.0000,
                    "tasaCompraOh": 0.1000,
                    "tasaVentaOh": -0.1000,
                    "fechaInicio": "2025-06-03T22:52:04.375",
                    "fechaFin": "2025-06-03T05:00:00",
                    "idCambioMonedaEstado": 22,
                    "codigoEstado": "04",
                    "descripcionLarga": "VENCIDO",
                    "fechaHoraAprobacion": "2025-06-03T17:54:08.657119",
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-06-03T17:52:55.960012",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-06-03T17:54:08.657126"
                },
                {
                    "idCambioMonedaCampana": 1,
                    "codigoCampana": "001",
                    "descripcion": "Prueba",
                    "tipoValidacion": "03",
                    "montoValidacion": 10.00,
                    "tipoCampana": "01",
                    "tipoCambioCompraOh": 0.1000,
                    "tipoCambioVentaOh": -0.1000,
                    "tasaCompraOh": 0.0000,
                    "tasaVentaOh": 0.0000,
                    "fechaInicio": "2025-06-03T22:41:45.987",
                    "fechaFin": "2025-06-03T05:00:00",
                    "idCambioMonedaEstado": 23,
                    "codigoEstado": "05",
                    "descripcionLarga": "CANCELADO",
                    "fechaHoraAprobacion": "2025-06-03T17:47:02.769626",
                    "usuarioAprobacion": "Edgar.Sanchez@somosoh.pe",
                    "fechaHoraVencimiento": null,
                    "usuarioVencimiento": "",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2025-06-03T17:43:20.937641",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": "2025-06-03T17:47:02.769635"
                }
            ]
        }
        this.loading = false;

        if (respCampania['codigo'] == 0) {
            this.data = respCampania['data'].map((item: any) => {

                const tipoCampanaDesc = CAMPAIGN_TYPES.find((e: any) => e.id == item.tipoCampana)?.nombre;
                const tipoValidacionDesc = CAMPAIGN_VALIDATION_TYPES.find((e: any) => e.id == item.tipoValidacion)?.nombre;

                const tipoCambioCompraOh = item.tipoCambioCompraOh || 0;
                const tipoCambioCompraOhFormat = this.currencyPipe.transform(tipoCambioCompraOh, ' ', 'symbol', '1.2-4');

                const tipoCambioVentaOh = item.tipoCambioVentaOh || 0;
                const tipoCambioVentaOhFormat = this.currencyPipe.transform(tipoCambioVentaOh, ' ', 'symbol', '1.2-4');

                const tasaCompraOh = item.tasaCompraOh || 0;
                const tasaCompraOhFormat = this.currencyPipe.transform(tasaCompraOh, ' ', 'symbol', '1.2-4');

                const tasaVentaOh = item.tasaVentaOh || 0;
                const tasaVentaOhFormat = this.currencyPipe.transform(tasaVentaOh, ' ', 'symbol', '1.2-4');

                const montoValidacion = item.montoValidacion || 0;
                const montoValidacionFormat = this.currencyPipe.transform(montoValidacion, ' ', 'symbol', '1.2-2');

                return {
                    ...item,
                    tipoCampanaDesc: tipoCampanaDesc,
                    tipoValidacionDesc: tipoValidacionDesc,
                    tipoCambioCompraOhFormat: tipoCambioCompraOhFormat,
                    tipoCambioVentaOhFormat: tipoCambioVentaOhFormat,
                    tasaCompraOhFormat: tasaCompraOhFormat,
                    tasaVentaOhFormat: tasaVentaOhFormat,
                    montoValidacionFormat: montoValidacionFormat,
                    fechaInicioFormat: this.datepipe.transform(item.fechaInicio, 'dd/MM/yyyy'),
                    fechaFinFormat: this.datepipe.transform(item.fechaFin, 'dd/MM/yyyy'),
                    fechaRegistroFormat: this.datepipe.transform(item.fechaRegistro, 'dd/MM/yyyy HH:mm:ss'),
                    fechaHoraAprobacionFormat: this.datepipe.transform(item.fechaHoraAprobacion, 'dd/MM/yyyy HH:mm:ss'),
                    fechaCancelacionFormat: this.datepipe.transform(item.fechaCancelacion, 'dd/MM/yyyy HH:mm:ss'),
                    fechaHoraVencimientoFormat: this.datepipe.transform(item.fechaHoraVencimiento, 'dd/MM/yyyy HH:mm:ss'),
                    fechaActualizacionFormat: this.datepipe.transform(item.fechaActualizacion, 'dd/MM/yyyy HH:mm:ss')
                }
            });

            this.rowsPerPageOptions = this.commonService.getRowsPerPageOptions(this.rows, this.data.length);
        }
        // this.cambioMonedaService.getCampanias().subscribe((resp: any) => {
        //     this.loading = false;

        //     if (resp['codigo'] == 0) {
        //         this.data = resp['data'].map((item: any) => {

        //             const tipoCampanaDesc = CAMPAIGN_TYPES.find((e: any) => e.id == item.tipoCampana)?.nombre;
        //             const tipoValidacionDesc = CAMPAIGN_VALIDATION_TYPES.find((e: any) => e.id == item.tipoValidacion)?.nombre;

        //             const tipoCambioCompraOh = item.tipoCambioCompraOh || 0;
        //             const tipoCambioCompraOhFormat = this.currencyPipe.transform(tipoCambioCompraOh, ' ', 'symbol', '1.2-4');

        //             const tipoCambioVentaOh = item.tipoCambioVentaOh || 0;
        //             const tipoCambioVentaOhFormat = this.currencyPipe.transform(tipoCambioVentaOh, ' ', 'symbol', '1.2-4');

        //             const tasaCompraOh = item.tasaCompraOh || 0;
        //             const tasaCompraOhFormat = this.currencyPipe.transform(tasaCompraOh, ' ', 'symbol', '1.2-4');

        //             const tasaVentaOh = item.tasaVentaOh || 0;
        //             const tasaVentaOhFormat = this.currencyPipe.transform(tasaVentaOh, ' ', 'symbol', '1.2-4');

        //             const montoValidacion = item.montoValidacion || 0;
        //             const montoValidacionFormat = this.currencyPipe.transform(montoValidacion, ' ', 'symbol', '1.2-2');

        //             return {
        //                 ...item,
        //                 tipoCampanaDesc: tipoCampanaDesc,
        //                 tipoValidacionDesc: tipoValidacionDesc,
        //                 tipoCambioCompraOhFormat: tipoCambioCompraOhFormat,
        //                 tipoCambioVentaOhFormat: tipoCambioVentaOhFormat,
        //                 tasaCompraOhFormat: tasaCompraOhFormat,
        //                 tasaVentaOhFormat: tasaVentaOhFormat,
        //                 montoValidacionFormat: montoValidacionFormat,
        //                 fechaInicioFormat: this.datepipe.transform(item.fechaInicio, 'dd/MM/yyyy'),
        //                 fechaFinFormat: this.datepipe.transform(item.fechaFin, 'dd/MM/yyyy'),
        //                 fechaRegistroFormat: this.datepipe.transform(item.fechaRegistro, 'dd/MM/yyyy HH:mm:ss'),
        //                 fechaHoraAprobacionFormat: this.datepipe.transform(item.fechaHoraAprobacion, 'dd/MM/yyyy HH:mm:ss'),
        //                 fechaCancelacionFormat: this.datepipe.transform(item.fechaCancelacion, 'dd/MM/yyyy HH:mm:ss'),
        //                 fechaHoraVencimientoFormat: this.datepipe.transform(item.fechaHoraVencimiento, 'dd/MM/yyyy HH:mm:ss'),
        //                 fechaActualizacionFormat: this.datepipe.transform(item.fechaActualizacion, 'dd/MM/yyyy HH:mm:ss')
        //             }
        //         });

        //         this.rowsPerPageOptions = this.commonService.getRowsPerPageOptions(this.rows, this.data.length);
        //     } else {
        //         this.toastr.add({ severity: 'error', summary: 'Error getCampanias', detail: resp['mensaje'] });
        //     }
        // }, (_error: any) => {
        //     this.loading = false;
        //     this.toastr.add({ severity: 'error', summary: 'Error getCampanias', detail: 'Error en el servicio de obtener campañas' });
        // })
    }

    openDialogAgregar() {

         const dialogRef = this.dialog.open(AddCambioMonedaComponent, {
            header: 'REGISTRAR CAMPAÑA',
            width: '40vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            //data: data,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });

        // const dialogRef = this.dialog.open(AddCambioMonedaComponent, {
        //     width: '700px',
        //     data: null
        // });
        // dialogRef.afterClosed().subscribe((resp: any) => {
        //     this.getCampanias();
        // });
    }

    openDialogEditar(data: any) {
        // const dialogRef = this.dialog.open(AddCambioMonedaComponent, {
        //     width: '700px',
        //     data: data
        // });
        // dialogRef.afterClosed().subscribe((resp: any) => {
        //     this.getCampanias();
        // });
    }
    openDialogDetalle(data: any = null) {
        const dialogRef = this.dialog.open(DetailCambioMonedaComponent, {
            header: 'Detalle Campaña',
            width: '60vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            data: data,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });
    }
    openDialogLogs(data: any = null) {
        const dialogRef = this.dialog.open(LogCampaniaCambiomonedaComponent, {
            header: 'Logs Campañas',
            width: '60vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            data: data,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });
    }

    async openDialogAprobar(data: any) {
        const estadoTipoCambio = this.estadosTipoCambio.find((item: any) => item.idCambioMonedaEstado === data.idCambioMonedaEstado);

        if (
            !estadoTipoCambio ||
            (estadoTipoCambio.tipoEstado === 4 && estadoTipoCambio.codigoEstado !== '01')
        ) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede aprobar la campaña ya que el estado es diferente a REGISTRO' });
            return;
        }

        const idCambioMonedaEstado = this.estadosTipoCambio.find((item: any) => item.tipoEstado === 4 && item.codigoEstado === '02')?.idCambioMonedaEstado;

        if (!idCambioMonedaEstado) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede aprobar la campaña ya que el estado es inválido' });
            //this.toastr.warning('No se puede aprobar la campaña ya que el estado es inválido');
            return;
        }

        const respuestaListadoDetalleCampania = await this.cambioMonedaService.getListarDetalleCampania(data.idCambioMonedaCampana);

        if (respuestaListadoDetalleCampania.codigo === 0 && respuestaListadoDetalleCampania.data.length <= 0) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede aprobar la campaña ya que no tiene días registrados' });
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('userABA')!);

        const campania = { ...data };
        campania.usuarioAprobacion = usuario.email;
        campania.idCambioMonedaEstado = idCambioMonedaEstado;
        this.campania = campania;


        this.confirmationService.confirm({
            header: 'Aprobar Campaña',
            message: '¿Estás seguro de querer realizar esta acción?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Aceptar',
            },
            accept: () => {
                this.cambioMonedaService.postActualizarCabeceraCampania(this.campania)
                    .subscribe((resp: any) => {
                        if (resp['codigo'] == 0) {
                            this.toastr.add({ severity: 'success', summary: '', detail: 'Se aprobó correctamente la campaña' });
                            this.getCampanias();
                        } else {
                            this.toastr.add({ severity: 'error', summary: 'Error openDialogAprobar', detail: resp['mensaje'] });
                        }
                    }, (_error: any) => {
                        this.toastr.add({ severity: 'error', summary: 'Error openDialogAprobar', detail: 'Error en el servicio de actualizar campaña' });
                    });
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });

        // await Swal.fire({
        //     title: 'Aprobar Campaña',
        //     text: '¿Estás seguro de querer realizar esta acción?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Aceptar',
        //     cancelButtonText: 'Cancelar'
        // }).then((inputValue: any) => {
        //     if (inputValue.value === true) {
        //         this.cambioMonedaService.postActualizarCabeceraCampania(this.campania)
        //             .subscribe((resp: any) => {
        //                 if (resp['codigo'] == 0) {
        //                     this.toastr.add({ severity: 'success', summary: '', detail: 'Se aprobó correctamente la campaña' });
        //                     this.getCampanias();
        //                 } else {
        //                     this.toastr.add({ severity: 'error', summary: 'Error openDialogAprobar', detail: resp['mensaje'] });
        //                 }
        //             }, (_error: any) => {
        //                 this.toastr.add({ severity: 'error', summary: 'Error openDialogAprobar', detail: 'Error en el servicio de actualizar campaña' });
        //             });
        //     }
        // })
    }


    async openDialoVigente(data: any) {
        const estadoTipoCambio = this.estadosTipoCambio.find((item: any) => item.idCambioMonedaEstado === data.idCambioMonedaEstado);

        if (
            !estadoTipoCambio ||
            (estadoTipoCambio.tipoEstado === 4 && estadoTipoCambio.codigoEstado !== '02')
        ) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede pasar a vigente la campaña ya que el estado es diferente a APROBADO' });
            return;
        }

        const idCambioMonedaEstado = this.estadosTipoCambio.find((item: any) => item.tipoEstado === 4 && item.codigoEstado === '03')?.idCambioMonedaEstado;

        if (!idCambioMonedaEstado) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede pasar a vigente la campaña ya que el estado es inválido' });
            return;
        }

        const respuestaListadoDetalleCampania = await this.cambioMonedaService.getListarDetalleCampania(data.idCambioMonedaCampana);

        if (respuestaListadoDetalleCampania.codigo === 0 && respuestaListadoDetalleCampania.data.length <= 0) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede aprobar la campaña ya que no tiene días registrados' });
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('userABA')!);

        const campania = { ...data };
        campania.usuarioAprobacion = usuario.email;
        campania.idCambioMonedaEstado = idCambioMonedaEstado;
        this.campania = campania;


        this.confirmationService.confirm({
            header: 'Vigente Campaña',
            message: '¿Estás seguro de querer realizar esta acción?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Aceptar',
            },
            accept: () => {

                this.cambioMonedaService.postActualizarCabeceraCampania(this.campania)
                    .subscribe((resp: any) => {
                        if (resp['codigo'] == 0) {
                            this.toastr.add({ severity: 'success', summary: '', detail: 'Se paso a vigente correctamente la campaña' });
                            this.getCampanias();
                        } else {
                            this.toastr.add({ severity: 'error', summary: '', detail: resp['mensaje'] });
                        }
                    }, (_error: any) => {
                        this.toastr.add({ severity: 'error', summary: 'Error openDialoVigente', detail: 'Error en el servicio de actualizar campaña' });
                    });

                // this.feriadoService.deleteFeriado(feriado.idCalendario).subscribe((resp: any) => {
                //     if (resp) {
                //         if (resp['codigo'] == 0) {
                //             this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado eliminado' });
                //             this.getFeriados();
                //         } else {
                //             this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
                //         }
                //     } else {
                //         this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
                //     }
                // }, (_error) => {
                //     this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error no controlado' });
                // })
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });

        // await Swal.fire({
        //     title: 'Vigente Campaña',
        //     text: '¿Estás seguro de querer realizar esta acción?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Aceptar',
        //     cancelButtonText: 'Cancelar'
        // }).then((inputValue: any) => {
        //     if (inputValue.value === true) {
        //         this.cambioMonedaService.postActualizarCabeceraCampania(this.campania)
        //             .subscribe((resp: any) => {
        //                 if (resp['codigo'] == 0) {
        //                     this.toastr.add({ severity: 'success', summary: '', detail: 'Se paso a vigente correctamente la campaña' });
        //                     this.getCampanias();
        //                 } else {
        //                     this.toastr.add({ severity: 'error', summary: '', detail: resp['mensaje'] });
        //                 }
        //             }, (_error: any) => {
        //                 this.toastr.add({ severity: 'error', summary: 'Error openDialoVigente', detail: 'Error en el servicio de actualizar campaña' });
        //             });
        //     }
        // })
    }

    async openDialogCancelar(data: any) {
        const estadoTipoCambio = this.estadosTipoCambio.find((item: any) => item.idCambioMonedaEstado === data.idCambioMonedaEstado);

        if (
            !estadoTipoCambio ||
            (estadoTipoCambio.tipoEstado === 4 && estadoTipoCambio.codigoEstado == '04')
        ) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede cancelar la campaña ya que el estado tiene que ser diferente a VENCIDO' });
            return;
        }
        const idCambioMonedaEstado = this.estadosTipoCambio.find((item: any) => item.tipoEstado === 4 && item.codigoEstado === '05')?.idCambioMonedaEstado;

        if (!idCambioMonedaEstado) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'No se puede cancelar la campaña ya que el estado es inválido' });
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('userABA')!);

        const campania = { ...data };
        campania.usuarioCancelacion = usuario.email
        campania.idCambioMonedaEstado = idCambioMonedaEstado;
        this.campania = campania;

        this.confirmationService.confirm({
            header: 'Cancelar Campaña',
            message: '¿Estás seguro de querer realizar esta acción?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Aceptar',
            },
            accept: () => {
                this.cambioMonedaService.postActualizarCabeceraCampania(this.campania).subscribe((resp: any) => {
                    if (resp['codigo'] == 0) {
                        this.toastr.add({ severity: 'success', summary: '', detail: 'Se canceló correctamente la campaña' });
                        this.getCampanias();
                    } else {
                        this.toastr.add({ severity: 'error', summary: 'Error openDialogCancelar', detail: resp['mensaje'] });
                    }
                }, (_error: any) => {
                    this.toastr.add({ severity: 'error', summary: 'Error openDialogCancelar', detail: 'Error en el servicio de actualizar campaña' });
                });
                // this.feriadoService.deleteFeriado(feriado.idCalendario).subscribe((resp: any) => {
                //     if (resp) {
                //         if (resp['codigo'] == 0) {
                //             this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado eliminado' });
                //             this.getFeriados();
                //         } else {
                //             this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
                //         }
                //     } else {
                //         this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
                //     }
                // }, (_error) => {
                //     this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error no controlado' });
                // })
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });

        // Swal.fire({
        //     title: 'Cancelar Campaña',
        //     text: '¿Estás seguro de querer realizar esta acción?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Aceptar',
        //     cancelButtonText: 'Cancelar'
        // }).then((inputValue: any) => {
        //     if (inputValue.value === true) {
        //         this.cambioMonedaService.postActualizarCabeceraCampania(this.campania).subscribe((resp: any) => {
        //             if (resp['codigo'] == 0) {
        //                 this.toastr.add({ severity: 'success', summary: '', detail: 'Se canceló correctamente la campaña' });
        //                 this.getCampanias();
        //             } else {
        //                 this.toastr.add({ severity: 'error', summary: 'Error openDialogCancelar', detail: resp['mensaje'] });
        //             }
        //         }, (_error: any) => {
        //             this.toastr.add({ severity: 'error', summary: 'Error openDialogCancelar', detail: 'Error en el servicio de actualizar campaña' });
        //         });
        //     }
        // })
    }
}