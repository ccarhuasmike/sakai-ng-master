import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ParametroTipoCambioService } from "./parametro-tipo-cambio.service";
import { Router } from "@angular/router";
import { CommonService } from "@/pages/service/commonService";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DatePickerModule } from "primeng/datepicker";
import { DividerModule } from "primeng/divider";
import { DialogService } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
import { ParametroDebitoEditComponent } from "../parametro-debito/parametro-debito-edit/parametro-debito-edit.component";
import { ParametroTipoCambioAddComponent } from "./parametro-tipo-cambio-add/parametro-tipo-cambio-add.component";
// import { CommonService } from "app/main/services/shared/common.service"
CommonService;

@Component({
    selector: 'app-parametro-tipo-cambio',
    templateUrl: './parametro-tipo-cambio.component.html',
    styleUrls: ['./parametro-tipo-cambio.component.scss'],
    standalone: true,
    imports: [ConfirmDialogModule, TooltipModule, TabsModule, MenuModule, DividerModule, InputNumberModule, DatePickerModule, TableModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService, DialogService, ConfirmationService],
})
export class ParametroTipoCambioComponent implements OnInit {
    data: any[] = [];
    rows = 10;
    rowsPerPageOptions: any[] = [];
    loading: boolean = false;

    constructor(
        private parametroTipoCambioService: ParametroTipoCambioService,
        private toastr: MessageService,
        private router: Router,
        private commonService: CommonService,
        private dialog: DialogService,
        private confirmationService: ConfirmationService,
    ) { }

    ngOnInit() {
        this.getParametros();
    }
    goToAddParametro() {
        const dialogRef = this.dialog.open(ParametroTipoCambioAddComponent, {
            header: 'Registrar parámetro de débito',
            width: '50vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            // data: {
            //     codParametro: parametro.codParametro,
            // }
        });
    }
    getParametros() {
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "codParametro": 2,
                    "codTabla": 1,
                    "nomTabla": "VARIACION_TIPO_CAMBIO",
                    "codTablaElemento": 2,
                    "desElemento": "VARIACION TIPO CAMBIO COMPRA",
                    "valCadCorto": null,
                    "valCadLargo": null,
                    "valNumEntero": 1,
                    "valNumDecimal": 1.0000000000,
                    "estParametro": 1,
                    "fechaModificacion": "2024-03-06T20:32:27.649",
                    "fechaCreacion": "2024-03-01T03:29:39.170",
                    "usuarioCreacion": "FU72080811",
                    "usuarioModificacion": "FU72080811"
                },
                {
                    "codParametro": 17,
                    "codTabla": 4,
                    "nomTabla": "TASA ITF",
                    "codTablaElemento": 1,
                    "desElemento": "TASA ITF",
                    "valCadCorto": null,
                    "valCadLargo": null,
                    "valNumEntero": null,
                    "valNumDecimal": 0.0050000000,
                    "estParametro": 1,
                    "fechaModificacion": null,
                    "fechaCreacion": "2024-03-13T12:31:38.832",
                    "usuarioCreacion": null,
                    "usuarioModificacion": null
                },
                {
                    "codParametro": 18,
                    "codTabla": 5,
                    "nomTabla": "INTERVALO_TIEMPO_SIMULACION",
                    "codTablaElemento": 1,
                    "desElemento": "INTERVALO DE TIEMPO PARA OBTENER LA SIMULACION DE REDIS",
                    "valCadCorto": null,
                    "valCadLargo": null,
                    "valNumEntero": 30,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": null,
                    "fechaCreacion": "2024-04-19T10:56:54.345",
                    "usuarioCreacion": "FU72080811",
                    "usuarioModificacion": null
                },
                {
                    "codParametro": 9,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 5,
                    "desElemento": "CANAL WEB",
                    "valCadCorto": "WEB",
                    "valCadLargo": "WEB",
                    "valNumEntero": 3,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T11:29:34.648",
                    "fechaCreacion": "2024-03-11T12:28:56.255",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 8,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 4,
                    "desElemento": "CANAL APP",
                    "valCadCorto": "APP",
                    "valCadLargo": "APP",
                    "valNumEntero": 2,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T11:31:53.594",
                    "fechaCreacion": "2024-03-11T12:27:31.404",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 10,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 6,
                    "desElemento": "CANALES IVR",
                    "valCadCorto": "IVR",
                    "valCadLargo": "IVR",
                    "valNumEntero": 4,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T11:34:14.457",
                    "fechaCreacion": "2024-03-11T12:29:14.743",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 11,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 7,
                    "desElemento": "CANALES AutoAtencion",
                    "valCadCorto": "AutoAtencion",
                    "valCadLargo": "AutoAtencion",
                    "valNumEntero": 5,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T11:35:03.509",
                    "fechaCreacion": "2024-03-11T12:29:29.468",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 12,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 8,
                    "desElemento": "CANALES AGORA",
                    "valCadCorto": "AGORA",
                    "valCadLargo": "AGORA",
                    "valNumEntero": 6,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T11:35:51.752",
                    "fechaCreacion": "2024-03-11T12:29:46.461",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 13,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 9,
                    "desElemento": "CANALES OTROS",
                    "valCadCorto": "OTROS",
                    "valCadLargo": "OTROS SISTEMAS",
                    "valNumEntero": 9,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T11:37:11.655",
                    "fechaCreacion": "2024-03-11T12:30:14.877",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 14,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 10,
                    "desElemento": "CANALES PGO",
                    "valCadCorto": "PGO",
                    "valCadLargo": "Plataforma de gestiones operartivas",
                    "valNumEntero": 10,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T11:38:09.245",
                    "fechaCreacion": "2024-03-11T12:30:47.263",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 15,
                    "codTabla": 6,
                    "nomTabla": "CANALES",
                    "codTablaElemento": 11,
                    "desElemento": "CANALES APP-PRECA",
                    "valCadCorto": "APP-PRECA",
                    "valCadLargo": "APP DE PRECALIFICACIÓN",
                    "valNumEntero": 13,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T12:21:06.507",
                    "fechaCreacion": "2024-03-11T12:31:38.832",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 1,
                    "codTabla": 1,
                    "nomTabla": "VARIACION_TIPO_CAMBIO",
                    "codTablaElemento": 1,
                    "desElemento": "VARIACION TIPO CAMBIO VENTA",
                    "valCadCorto": null,
                    "valCadLargo": null,
                    "valNumEntero": 1,
                    "valNumDecimal": 1.0000000000,
                    "estParametro": 1,
                    "fechaModificacion": "2024-04-23T12:22:00.567",
                    "fechaCreacion": "2024-03-01T03:29:24.860",
                    "usuarioCreacion": "FU72080811",
                    "usuarioModificacion": "FU72080811"
                },
                {
                    "codParametro": 7,
                    "codTabla": 6,
                    "nomTabla": "VARIACION_TIPO_CAMBIO",
                    "codTablaElemento": 3,
                    "desElemento": "CANALES",
                    "valCadCorto": "PUC",
                    "valCadLargo": "SISTEMA PUC",
                    "valNumEntero": 1,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-05-09T10:33:19.633",
                    "fechaCreacion": "2024-03-11T12:24:07.999",
                    "usuarioCreacion": "FOH",
                    "usuarioModificacion": "FOH"
                },
                {
                    "codParametro": 3,
                    "codTabla": 2,
                    "nomTabla": "TIEMPO_DURACION_TIPO_CAMBIO",
                    "codTablaElemento": 1,
                    "desElemento": "TIEMPO DE DURACION PARA TIPO DE CAMBIO PEN",
                    "valCadCorto": "",
                    "valCadLargo": "TIEMPO DURACION SOLES",
                    "valNumEntero": 60,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-05-09T10:47:12.139",
                    "fechaCreacion": "2024-03-01T03:30:55.978",
                    "usuarioCreacion": "FU72080811",
                    "usuarioModificacion": "Esteban.Castillo@somosoh.pe"
                },
                {
                    "codParametro": 16,
                    "codTabla": 2,
                    "nomTabla": "TIEMPO_DURACION_TIPO_CAMBIO",
                    "codTablaElemento": 2,
                    "desElemento": "TIEMPO DE DURACION PARA TIPO DE CAMBIO USD",
                    "valCadCorto": "",
                    "valCadLargo": "TIEMPO DURACION DOLARES",
                    "valNumEntero": 0,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-03-27T18:04:38.511",
                    "fechaCreacion": "2024-03-27T17:46:28.076",
                    "usuarioCreacion": "FU72080811",
                    "usuarioModificacion": "FU72080811"
                },
                {
                    "codParametro": 4,
                    "codTabla": 3,
                    "nomTabla": "CANTIDAD_CONSULTAS_BASE_DATOS",
                    "codTablaElemento": 1,
                    "desElemento": "CANTIDAD DE CONSULTAS DIARIAS - CMC",
                    "valCadCorto": null,
                    "valCadLargo": "CAMBIO MONEDA CONSULTAS",
                    "valNumEntero": 10000,
                    "valNumDecimal": 0E-10,
                    "estParametro": 1,
                    "fechaModificacion": "2024-05-09T12:28:30.653",
                    "fechaCreacion": "2024-03-01T03:31:06.288",
                    "usuarioCreacion": "FU72080811",
                    "usuarioModificacion": "Edgar.Sanchez@somosoh.pe"
                }
            ]
        };
        if (resp) {
            if (resp['codigo'] == 0) {
                this.data = resp.data;
                this.data.sort((a, b) => a.nomTabla.localeCompare(b.nomTabla));
                this.rowsPerPageOptions = this.commonService.getRowsPerPageOptions(this.rows, this.data.length);
            } else {
                this.toastr.add({ severity: 'warn', summary: 'Error getParametros()', detail: resp.mensaje });
                //this.toastr.warning(resp.mensaje, 'getParametros()')
            }
        }
        this.parametroTipoCambioService.getParametros().subscribe((resp: any) => {
            if (resp) {
                if (resp['codigo'] == 0) {
                    this.data = resp.data;
                    this.data.sort((a, b) => a.nomTabla.localeCompare(b.nomTabla));

                    this.rowsPerPageOptions = this.commonService.getRowsPerPageOptions(this.rows, this.data.length);
                } else {
                    this.toastr.add({ severity: 'warn', summary: 'Error getParametros()', detail: resp.mensaje });
                    //this.toastr.warning(resp.mensaje, 'getParametros()')
                }
            }
        }, (_error) => {
            this.toastr.add({ severity: 'warn', summary: 'Error getParametros()', detail: 'Error en el servicio de obtener parametros' });
            //this.toastr.warning('Error en el servicio de obtener parametros', 'Error getParametros()')
        })
    }

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
                    this.goToEditParametro(rowData)
                    menu?.hide();  // cerrar directamente
                }, 5);
            }
        });
        items.push({
            label: 'Eliminar',
            icon: 'pi pi-ban',
            command: () => this.deleteParametro(rowData)
        });

        return items;
    }

    deleteParametro(parametro: any) {

        this.confirmationService.confirm({
            header: 'Eliminar parámetro',
            message: '¿Estás seguro de querer realizar esta acción?',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Aceptar',
            },
            accept: () => {
                this.parametroTipoCambioService.deleteParametro(parametro.codParametro).subscribe(
                    (res: any) => {
                        if (res['codigo'] == 0) {
                            const index = this.data.findIndex((d: any) => d.codParametro === parametro.codParametro);
                            this.data.splice(index, 1);
                            this.toastr.add({ severity: 'success', summary: '', detail: 'Parámetro eliminado' });
                            //this.toastr.success('Parámetro eliminado');
                        } else {
                            this.toastr.add({ severity: 'error', summary: 'Error deleteParametro', detail: 'Error en el servicio de inactivar parámetro' });
                        }
                    }
                )
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });

        // Swal.fire({
        //     title: 'Eliminar parámetro',
        //     text: '¿Estás seguro de querer realizar esta acción?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Aceptar',
        //     cancelButtonText: 'Cancelar'
        // }).then((inputValue: any) => {
        //     if (inputValue.value === true) {
        //         this.parametroTipoCambioService.deleteParametro(parametro.codParametro).subscribe(
        //             (res: any) => {
        //                 if (res['codigo'] == 0) {
        //                     const index = this.data.findIndex((d: any) => d.codParametro === parametro.codParametro);
        //                     this.data.splice(index, 1);
        //                     this.toastr.success('Parámetro eliminado');
        //                 } else {
        //                     this.toastr.error('Error en el servicio de inactivar parámetro', 'Error deleteParametro');
        //                 }
        //             }
        //         )
        //     }
        // });
    }

    goToEditParametro(parametro: any) {
        const dialogRef = this.dialog.open(ParametroDebitoEditComponent, {
            header: 'Editando parámetro de débito',
            width: '50vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                codParametro: parametro.codParametro,
            }
        });
        //this.router.navigate(['/apps/mantenimiento/parametro/tipo-cambio/edit/' + parametro.codParametro]);
    }


}