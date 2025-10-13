import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
//import { CALENDAR_DETAIL } from "app/main/utils/constants/aba.constants";
//import { AddFeriadoComponent } from "./modals/add-feriado/add-feriado.component";
import { CommonModule, DatePipe } from "@angular/common";
import { FeriadoService } from "./feriado.service";
import moment from 'moment';
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
import { CALENDAR_DETAIL } from "@/layout/Utils/constants/aba.constants";
import { AddFeriadoComponent } from "./modals/add-feriado/add-feriado.component";


@Component({
    selector: 'app-feriado',
    templateUrl: './feriado.component.html',
    styleUrls: ['./feriado.component.scss'],
    standalone: true,
    imports: [ConfirmDialogModule, TooltipModule, TabsModule, MenuModule, DividerModule, InputNumberModule, DatePickerModule, TableModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [DatePipe, MessageService, DialogService, ConfirmationService],
})
export class FeriadoComponent implements OnInit {
    mostrarFiltro = false;
    panelOpenState = false;
    formBusqueda: FormGroup;
    es = CALENDAR_DETAIL;
    filteredElementFeriadoRecurrente: any[] = [];
    isRepeat: any[] = [];
    fechaFeriadoDesde: any = moment().format('YYYY-MM-DD');
    fechaFeriadoHasta: any = moment().format('YYYY-MM-DD');
    fechaRangoFeriados: [Date, Date] = [new Date(), new Date()];

    cols: any = [
        { field: 'descripcion', header: 'Descripción' },
        { field: 'tipoFecha', header: 'Tipo de Fecha' },
        { field: 'fecha', header: 'Fecha' },
        { field: 'isRepeat', header: 'Repetir' },
        { field: 'acciones', header: 'Acciones' },
    ]
    first = 0;
    rows = 15;
    totalRecords = 0;
    loadingFeriados: boolean = false;
    datosFeriados: any[] = [];
    tipoFeriados: any[] = [
        { tipoFecha: 0, descripcionTipoFecha: 'FERIADO' }, { tipoFecha: 1, descripcionTipoFecha: 'FERIADO - PUBLICO' }
    ]

    constructor(
        // public dialog: MatDialog,
        // private toastr: ToastrService,
        private dialog: DialogService,
        private toastr: MessageService,
        private datepipe: DatePipe,
        private feriadoService: FeriadoService,
        private confirmationService: ConfirmationService,

    ) {
        const primerDia = new Date();
        primerDia.setMonth(primerDia.getMonth() - 11);
        this.fechaFeriadoDesde = this.datepipe.transform(primerDia, 'yyyy-MM-dd');
        this.fechaFeriadoHasta = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        this.fechaRangoFeriados = [primerDia, new Date()];
        this.formBusqueda = new FormGroup({
            fechaRangoFeriados: new FormControl(this.fechaRangoFeriados),
            isRepeat: new FormControl()
        })
    }
    ngOnInit(): void {
        this.getCombos();
        this.getFeriados();
    }
    getCombos() {
        //LLamada servicio 
        this.isRepeat = [
            { id: 1, descripcion: 'Sí' },
            { id: 0, descripcion: 'No' }
        ]
    }
    changeModelFechaRangoFeriado(event: any) {
        this.fechaFeriadoDesde = '';
        this.fechaFeriadoHasta = '';
        if (event[0] !== null && event[1] !== null) {
            this.fechaFeriadoDesde = moment(event[0]).format('YYYY-MM-DD');
            this.fechaFeriadoHasta = moment(event[1]).format('YYYY-MM-DD');
            //Valida maximo 2 meses
            const fechaConfirmacionHastaAux = new Date(this.fechaFeriadoHasta);
            fechaConfirmacionHastaAux.setMonth(fechaConfirmacionHastaAux.getMonth() - 12);
            const finiAutorizacionesAux = new Date(this.fechaFeriadoDesde)
            if (finiAutorizacionesAux < fechaConfirmacionHastaAux) {
                return this.toastr.add({ severity: 'error', summary: 'Validacion de Fechas', detail: 'El intervalo de rango de fechas es 12 meses como maximo' });
                //return this.toastr.warning('El intervalo de rango de fechas es 12 meses como maximo', 'Validacion de Fechas: ');
            }
            //this.getCuentaAutorizaciones();
        }
    }
    getFeriados() {
        this.loadingFeriados = true;
        this.datosFeriados = [];
        const indFeriado = this.formBusqueda.get('isRepeat')!.value;

        this.loadingFeriados = false;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idCalendario": 14,
                    "codigo": "04",
                    "descripcion": "INMACULADA CONCEPCION",
                    "tipoFecha": 1,
                    "fecha": "2024-12-08T00:00:00",
                    "indRepetir": 1,
                    "usuarioRegistro": "FOH",
                    "fechaRegistro": "2024-02-28T15:55:48.397",
                    "usuarioActualizacion": "FOH",
                    "fechaActualizacion": "2024-03-07T15:59:08.056"
                },
                {
                    "idCalendario": 15,
                    "codigo": "04",
                    "descripcion": "BATALLA DE AYACUCHO",
                    "tipoFecha": 1,
                    "fecha": "2024-12-09T00:00:00",
                    "indRepetir": 1,
                    "usuarioRegistro": "FOH",
                    "fechaRegistro": "2024-02-28T15:55:48.397",
                    "usuarioActualizacion": "FOH",
                    "fechaActualizacion": "2024-03-07T15:59:08.056"
                },
                {
                    "idCalendario": 16,
                    "codigo": "04",
                    "descripcion": "NAVIDAD",
                    "tipoFecha": 1,
                    "fecha": "2024-12-25T00:00:00",
                    "indRepetir": 1,
                    "usuarioRegistro": "FOH",
                    "fechaRegistro": "2024-02-28T15:55:48.397",
                    "usuarioActualizacion": "FOH",
                    "fechaActualizacion": "2024-03-07T15:59:08.056"
                }
            ]
        }
        this.datosFeriados = resp.data
        this.datosFeriados.map(item => {
            const tipoFecha = this.tipoFeriados.find(e => e.tipoFecha == item.tipoFecha)
            item['descripcionTipoFecha'] = tipoFecha.descripcionTipoFecha;
        })
        this.loadingFeriados = false;

        // this.feriadoService.getFeriados(this.fechaFeriadoDesde, this.fechaFeriadoHasta, indFeriado?.id).subscribe((resp: any) => {
        //     this.loadingFeriados = false;
        //     this.datosFeriados = resp.data
        //     this.datosFeriados.map(item => {
        //         const tipoFecha = this.tipoFeriados.find(e => e.tipoFecha == item.tipoFecha)
        //         item['descripcionTipoFecha'] = tipoFecha.descripcionTipoFecha;
        //     })
        // }, (_error) => {
        //     this.loadingFeriados = false;
        //     this.toastr.add({ severity: 'error', summary: 'Error getFeriados', detail: 'Error en el servicio de obtencion de Feriados' });
        // })
    }
    openDialogAddFeriado() {
        const dialogRef = this.dialog.open(AddFeriadoComponent, {
            header: 'Registrar nuevo feriado',
            width: '40vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            data: {
                isEdit: false
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });
        dialogRef.onClose.subscribe((resp: any) => {
            if (resp != undefined && resp != "") {
                console.log("Registro de feriado", resp);
                if (resp.data['codigo'] == 0) {
                    this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado registrado' });
                    //this.toastr.success('Feriado registrado')
                    this.getFeriados();
                } else {
                    this.toastr.add({ severity: 'error', summary: 'Error openDialogAddFeriado', detail: 'Error en el servicio de agregar feriado' });
                    //this.toastr.error('Error en el servicio de agregar feriado', 'Error openDialogAddFeriado')
                }
            }
            // if (res !== undefined && res !== "") {
            //     if (res.data['codigo'] == 0 && res.accion == 'create') {
            //         this.toastr.add({ severity: 'success', summary: '', detail: 'Banco registrado' });
            //         this.getBancos();
            //     } else if (res.data['codigo'] == 0 && res.accion == 'update') {
            //         this.toastr.add({ severity: 'success', summary: '', detail: 'Banco actualizado' });
            //         this.getBancos();
            //     } else {
            //         this.toastr.add({ severity: 'error', summary: 'Error openDialogAdd', detail: 'Error al registrar/actualizar el banco' });
            //     }
            // }
        });

        // const dialogRef = this.dialog.open(AddFeriadoComponent, {
        //     width: '900px',
        //     data: {
        //         isEdit: false
        //     }
        // });
        // dialogRef.onClose.subscribe(resp => {
        //     if (resp != undefined && resp != "") {
        //         console.log("Registro de feriado", resp);
        //         if (resp.data['codigo'] == 0) {
        //             this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado registrado' });
        //             //this.toastr.success('Feriado registrado')
        //             this.getFeriados();
        //         } else {
        //             this.toastr.add({ severity: 'error', summary: 'Error openDialogAddFeriado', detail: 'Error en el servicio de agregar feriado' });
        //             //this.toastr.error('Error en el servicio de agregar feriado', 'Error openDialogAddFeriado')
        //         }
        //     }
        // })
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
                    this.openDialogEditarFeriado(rowData)
                    menu?.hide();  // cerrar directamente
                }, 5);
            }
        });
        items.push({
            label: 'Eliminar',
            icon: 'pi pi-ban',
            command: () => this.eliminarFeriado(rowData)
        });
        return items;
    }
    openDialogEditarFeriado(feriado: any) {
        const dialogRef = this.dialog.open(AddFeriadoComponent, {
            header: 'Editar feriado',
            width: '40vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            data: {
                isEdit: true,
                datosFeriado: feriado
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });
        dialogRef.onClose.subscribe((res: any) => {
            if (res != undefined && res != "") {
                if (res.data['codigo'] == 0) {
                    this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado actualizado' });
                    this.getFeriados();
                } else {
                    this.toastr.add({ severity: 'error', summary: 'Error openDialogAddFeriado', detail: 'Error en el servicio de actualizar feriado' });
                }
            }
        });

        // const dialogRef = this.dialog.open(AddFeriadoComponent, {
        //     width: '900px',
        //     data: {
        //         isEdit: true,
        //         datosFeriado: feriado
        //     }
        // });
        // dialogRef.onClose.subscribe(resp => {
        //     if (resp != undefined && resp != "") {
        //         if (resp.data['codigo'] == 0) {
        //             this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado actualizado' });
        //             this.getFeriados();
        //         } else {
        //             this.toastr.add({ severity: 'error', summary: 'Error openDialogAddFeriado', detail: 'Error en el servicio de actualizar feriado' });
        //         }
        //     }
        // })

    }
    eliminarFeriado(feriado: any) {
        this.confirmationService.confirm({
            header: 'Eliminar feriado',
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
                this.feriadoService.deleteFeriado(feriado.idCalendario).subscribe((resp: any) => {
                    if (resp) {
                        if (resp['codigo'] == 0) {
                            this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado eliminado' });                            
                            this.getFeriados();
                        } else {
                            this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
                        }
                    } else {
                        this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
                    }
                }, (_error) => {
                    this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error no controlado' });
                })
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });

        // Swal.fire({
        //     title: 'Eliminar feriado',
        //     text: '¿Estás seguro de querer realizar esta acción?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Aceptar',
        //     cancelButtonText: 'Cancelar'
        // }).then((inputValue: any) => {
        //     if (inputValue.value === true) {
        //         this.feriadoService.deleteFeriado(feriado.idCalendario).subscribe((resp: any) => {
        //             if (resp) {
        //                 if (resp['codigo'] == 0) {
        //                     this.toastr.add({ severity: 'success', summary: '', detail: 'Feriado eliminado' });
        //                     //this.toastr.success('Feriado eliminado');
        //                     this.getFeriados();
        //                 } else {
        //                     this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
        //                 }
        //             } else {
        //                 this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error en el servicio de eliminar feriado' });
        //             }
        //         }, (_error) => {
        //             this.toastr.add({ severity: 'error', summary: 'Error eliminarFeriado', detail: 'Error no controlado' });
        //         })
        //     }
        // });

    }

    filterElementFeriadoRecurrente(event: any, data: any) {
        this.filteredElementFeriadoRecurrente = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.descripcion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementFeriadoRecurrente.push(element);
            }
        }
    }
}
