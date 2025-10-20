import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
//import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize } from 'rxjs/operators';
import moment from 'moment';
import { Campania, ListaValores, ListaValoresEntero, ListaValoresDias } from '../../../../../layout/models/campania';
import { DetallesCampania } from '../../../../../layout/models/detalleCampania';
import { DAYS, CAMPAIGN_VALIDATION_TYPES, CAMPAIGN_TYPES } from '@/layout/Utils/constants/aba.constants';
import { CambioMonedaService } from '../../cambiomoneda.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
@Component({
    selector: 'app-add-cambiomoneda',
    templateUrl: './add-cambiomoneda.component.html',
    styleUrls: ['./add-cambiomoneda.component.scss'],
    standalone:true,
    imports: [NgxMaterialTimepickerModule,ConfirmDialogModule, TooltipModule, TabsModule, MenuModule, DividerModule, InputNumberModule, DatePickerModule, TableModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService, DialogService, ConfirmationService],
    encapsulation: ViewEncapsulation.None
})
export class AddCambioMonedaComponent implements OnInit {

    titleModal: String = '';
    idCambioMonedaCampana: any = 0;

    campania: Campania | null = null;
    detalleCampania: DetallesCampania | null = null;
    detallesCampania: DetallesCampania[] = [];

    diasAlmacenado: ListaValoresEntero[] = DAYS;
    tipoValidacion: ListaValores[] = CAMPAIGN_VALIDATION_TYPES;
    tipoCampania: ListaValores[] = CAMPAIGN_TYPES;

    estados: ListaValoresEntero[] = [];
    dias: ListaValoresEntero[] = [];

    filteredElementTipoValidacion: any[] = [];
    filteredElementTipoCampania: any[] = [];
    filteredElementDias: any[] = [];

    formAddCabecera!: FormGroup;
    formAddDetalle!: FormGroup;

    disableButtonAdd: boolean = false;
    initializedTipoCampania: boolean = false;

    constructor(
        public datepipe: DatePipe,
        //public dialogRef: MatDialogRef<AddCambioMonedaComponent>,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        //@Inject(MAT_DIALOG_DATA) public data: Campania,
        private toastr: MessageService,
        private cambioMonedaService: CambioMonedaService,
        private confirmationService: ConfirmationService,
    ) {
        this.idCambioMonedaCampana = config.data ? config.data.idCambioMonedaCampana : 0;
        //this.titleModal = config.data ? 'MODIFICAR DATOS CAMPAÑA' : 'REGISTRAR CAMPAÑA'
        this.createformAddCabecera();
        this.createformAddDetalle()
    }

    async ngOnInit() {
        await this.cargarEstadosCampania();

        if (this.idCambioMonedaCampana > 0) {
            await this.cargarDatosCampania(this.idCambioMonedaCampana);
        } else {
            const estadoTipoCambio = this.estados.find((item: any) => item.nombre === 'REGISTRO');
            const tipoCampania = CAMPAIGN_TYPES.find((item: any) => item.nombre === 'Por Tipo Cambio Fijo');
            this.formAddCabecera.patchValue({
                estadoCampania: estadoTipoCambio,
                tipoCampania: tipoCampania,
            });
            if (this.formAddCabecera.value.tipoValidacion) {
                this.habilitarMontoValidacion(this.formAddCabecera.value.tipoValidacion.id);
            } else {
                this.habilitarTCporTipoCampania(this.formAddCabecera.value.tipoCampania.id);
            }
            this.formAddCabecera.get('estadoCampania')!.disable();
        }
    }

    async cargarEstadosCampania() {
        try {
            const response = await this.cambioMonedaService.getEstadoCampania(4);

            if (response.codigo === 0) {
                this.formAddDetalle.patchValue({
                    diasSemana: null,
                    horaInicio: '10:30',
                    horaFin: '11:30'
                });

                this.estados = response.data.map((estado: any): ListaValoresEntero => ({
                    nombre: estado.descripcionCorta,
                    id: estado.idCambioMonedaEstado
                }));
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error cargarEstadosCampania', detail: response.mensaje });
            }
        } catch (error) {
            this.toastr.add({ severity: 'error', summary: 'Error cargarEstadosCampania', detail: 'Error en el servicio cargar los estados de campaña' });
        }
    }

    async cargarDatosCampania(id: number) {
        try {
            const response = await this.cambioMonedaService.getObtenerDatosCampaniaPorId(id);
            if (response.codigo === 0) {
                this.campania = response.data;
                this.setFormulario();

                await this.listarDetalleCampania();
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error cargarDatosCampania', detail: response.mensaje });
            }
        } catch (error) {
            this.toastr.add({ severity: 'error', summary: 'Error cargarDatosCampania', detail: 'Error en el servicio cargar los datos de campaña' });
        }
    }

    async listarDetalleCampania() {
        try {
            const response = await this.cambioMonedaService.getListarDetalleCampania(this.idCambioMonedaCampana);
            if (response.codigo == 0) {
                this.detallesCampania = response.data.filter((x: any) => { return x.indActivo == 1 || x.indActivo == null }).map((item: any) => {
                    const nombreDias = this.diasAlmacenado.find(e => e.id == parseInt(item.codigoDia))!.nombre;
                    const horaInicio = this.convertirA12Horas(item.horaInicio);
                    const horaFin = this.convertirA12Horas(item.horaFin);
                    const indActivo = item.indActivo == null ? '1' : item.indActivo;

                    return {
                        ...item,
                        nombreDias: nombreDias,
                        horaInicio: horaInicio,
                        horaFin: horaFin,
                        indActivo: indActivo
                    }
                });
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error listarDetalleCampania', detail: response.mensaje });
            }
        } catch (error) {
            this.toastr.add({ severity: 'error', summary: 'Error listarDetalleCampania', detail: 'Error en el servicio listar detalle campaña' });
        }
    }

    grabarCabecera() {
        this.disableButtonAdd = true;
        const usuario = JSON.parse(localStorage.getItem('userABA')!);

        const getValue = (control: string) => this.formAddCabecera.value[control];
        const getRawId = (control: string) => this.formAddCabecera.getRawValue()[control]?.id || 0;
        const parseOrZero = (value: any) => value == null ? 0 : parseFloat(value);

        this.campania = {
            idCambioMonedaCampana: this.idCambioMonedaCampana,
            codigoCampana: '',
            descripcion: getValue('nombreCampania'),
            tipoValidacion: getValue('tipoValidacion')?.id || 0,
            idCambioMonedaEstado: getRawId('estadoCampania'),
            montoValidacion: parseOrZero(getValue('montoValidacion')),
            tipoCampana: getValue('tipoCampania')?.id || 0,
            tipoCambioCompraOh: parseOrZero(getValue('tcCompra')),
            tipoCambioVentaOh: parseOrZero(getValue('tcVenta')),
            tasaCompraOh: parseOrZero(getValue('tasaCompra')),
            tasaVentaOh: parseOrZero(getValue('tasaVenta')),
            fechaInicio: this.formAddCabecera.get('fechaInicio')?.value,
            fechaFin: this.formAddCabecera.get('fechaFin')?.value,
            usuarioRegistro: usuario?.email || '',
            fechaHoraAprobacion: '',
            usuarioAprobacion: '',
            fechaHoraVencimiento: '',
            usuarioVencimiento: '',
            fechaRegistro: '',
            usuarioCancelacion: '',
            fechaHoraCancelacion: ''
        };


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
                const operacion = this.idCambioMonedaCampana > 0
                    ? this.cambioMonedaService.postActualizarCabeceraCampania(this.campania!)
                    : this.cambioMonedaService.postRegistrarCabeceraCampania(this.campania!);

                operacion
                    .pipe(finalize(() => this.disableButtonAdd = false))
                    .subscribe({
                        next: (resp: any) => {
                            if (resp?.codigo === 0) {
                                this.campania = resp.data;

                                this.toastr.add({
                                    severity: 'success', summary: '', detail: this.idCambioMonedaCampana > 0
                                        ? 'Se actualizó correctamente la campaña'
                                        : 'Se registró correctamente la campaña'
                                });

                                this.idCambioMonedaCampana = this.campania!.idCambioMonedaCampana;
                            } else {
                                this.disableButtonAdd = true;
                            }
                        },
                        error: () => this.dialogRef.close()
                    });
            },
            reject: () => {
                //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });

        // Swal.fire({
        //     title: 'Registro de Campaña',
        //     text: '¿Estás seguro de querer realizar esta acción?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: 'Aceptar',
        //     cancelButtonText: 'Cancelar'
        // }).then(({ value }) => {
        //     if (!value) return;

        //     const operacion = this.idCambioMonedaCampana > 0
        //         ? this.cambioMonedaService.postActualizarCabeceraCampania(this.campania)
        //         : this.cambioMonedaService.postRegistrarCabeceraCampania(this.campania);

        //     operacion
        //         .pipe(finalize(() => this.disableButtonAdd = false))
        //         .subscribe({
        //             next: (resp: any) => {
        //                 if (resp?.codigo === 0) {
        //                     this.campania = resp.data;
        //                     this.toastr.success(
        //                         this.idCambioMonedaCampana > 0
        //                             ? 'Se actualizó correctamente la campaña'
        //                             : 'Se registró correctamente la campaña'
        //                     );

        //                     this.idCambioMonedaCampana = this.campania.idCambioMonedaCampana;
        //                 } else {
        //                     this.disableButtonAdd = true;
        //                 }
        //             },
        //             error: () => this.dialogRef.close()
        //         });
        // });
    }

    async editarDetalle(request: DetallesCampania) {
        try {
            const response = await this.cambioMonedaService.getDetalleCampaniaPorDia(request);
            if (response.codigo == 0) {
                const diasSemana = this.diasAlmacenado.find(e => e.id == parseInt(request.codigoDia!));

                this.detalleCampania = response.data.find((x: any) => { return x.idCambioMonedaCamDia == request.idCambioMonedaCamDia });
                const horaInicio = this.detalleCampania!.horaInicio!.slice(0, 5);
                const horaFin = this.detalleCampania!.horaFin!.slice(0, 5);

                this.formAddDetalle.patchValue({
                    diasSemana: diasSemana,
                    horaInicio: horaInicio,
                    horaFin: horaFin
                });
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error editarDetalle', detail: response.mensaje });
                //this.toastr.error(response.mensaje, 'Error editarDetalle');
            }
        } catch (error) {
            this.toastr.add({ severity: 'error', summary: 'Error editarDetalle', detail: 'Error en el servicio editar campaña' });
            //this.toastr.error('Error en el servicio editar campaña', 'Error editarDetalle');
        }
    }

    async eliminarDetalle(request: DetallesCampania) {
        try {
            const response = await this.cambioMonedaService.getDetalleCampaniaPorDia(request);
            if (response.codigo == 0) {
                const usuario = JSON.parse(localStorage.getItem('userABA')!);
                let detalleCampania = response.data.find((x: any) => { return x.idCambioMonedaCamDia == request.idCambioMonedaCamDia });
                detalleCampania.indActivo = '0';
                detalleCampania.usuarioActualizacion = usuario.email;


                this.confirmationService.confirm({
                    header: 'Eliminación de Campaña',
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
                        this.cambioMonedaService.postActualizarDetalleCampania(detalleCampania).subscribe(async (resp: any) => {
                            if (resp['codigo'] == 0) {
                                this.toastr.add({ severity: 'success', summary: '', detail: 'Se eliminó correctamente detalle de la campaña' });
                                await this.listarDetalleCampania();
                            } else {
                                this.toastr.add({ severity: 'error', summary: 'Error eliminarDetalle', detail: response.mensaje });
                            }
                        }, (_error: any) => {
                            this.toastr.add({ severity: 'error', summary: 'Error eliminarDetalle', detail: 'Error en el servicio eliminar detalle campaña' });
                        });
                    },
                    reject: () => {
                        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                    }
                });

                // Swal.fire({
                //     title: 'Eliminación de Campaña',
                //     text: '¿Estás seguro de querer realizar esta acción?',
                //     icon: 'warning',
                //     showCancelButton: true,
                //     confirmButtonText: 'Aceptar',
                //     cancelButtonText: 'Cancelar'
                // }).then((inputValue: any) => {
                //     if (inputValue.value === true) {
                //         this.cambioMonedaService.postActualizarDetalleCampania(detalleCampania).subscribe(async (resp: any) => {
                //             if (resp['codigo'] == 0) {
                //                 this.toastr.add({ severity: 'success', summary: '', detail: 'Se eliminó correctamente detalle de la campaña' });
                //                 await this.listarDetalleCampania();
                //             } else {
                //                 this.toastr.add({ severity: 'error', summary: 'Error eliminarDetalle', detail: response.mensaje });
                //             }
                //         }, (_error: any) => {
                //             this.toastr.add({ severity: 'error', summary: 'Error eliminarDetalle', detail: 'Error en el servicio eliminar detalle campaña' });
                //         });
                //     }
                // })
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error eliminarDetalle', detail: response.mensaje });
            }
        } catch (error) {
            this.toastr.add({ severity: 'error', summary: 'Error eliminarDetalle', detail: 'Error en el servicio eliminar detalle campaña' });
        }
    }

    agregarDetalle() {
        const { diasSemana, horaInicio, horaFin } = this.formAddDetalle.controls;
        if (!diasSemana.value) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'La selección de día es obligatoria' });
        }
        const nuevoHorario = {
            diaSemana: diasSemana.value.nombre,
            horaInicio: horaInicio.value,
            horaFin: horaFin.value
        };

        if (this.detallesCampania.length > 1 && this.hayConflicto(nuevoHorario)) {
            this.toastr.add({ severity: 'warn', summary: '', detail: 'El horario se cruza con uno existente' });
        }

        const diaId = diasSemana.value.id;
        const maxSecuencial = this.detallesCampania
            .filter(e => e.codigoDia === diaId)
            .reduce((max, item) => Math.max(max, item.secuencial!), 0);

        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        const formatoHora = (hora: string) => this.datepipe.transform(`1970-01-01T${hora}`, 'HH:mm:ss');

        const baseDetalle = {
            codigoDia: diaId,
            horaInicio: formatoHora(nuevoHorario.horaInicio),
            horaFin: formatoHora(nuevoHorario.horaFin),
            idCambioMonedaCampana: this.idCambioMonedaCampana,
            fechaRegistro: '',
            indActivo: '1',
            usuarioRegistro: usuario.email
        };

        const manejarRespuesta = async (resp: any, mensajeExito: string) => {
            this.detalleCampania = null;
            if (resp?.codigo === 0) {
                this.toastr.add({ severity: 'success', summary: '', detail: mensajeExito });
                await this.listarDetalleCampania();
            } else {
                this.toastr.add({ severity: 'warn', summary: 'Error agregarDetalle', detail: resp?.mensaje || 'Error desconocido' });

            }

            this.formAddDetalle.patchValue({ diasSemana: null });
            this.disableButtonAdd = false;
        };

        this.disableButtonAdd = true;

        const operacion = this.detalleCampania
            ? this.cambioMonedaService.postActualizarDetalleCampania({
                ...this.detalleCampania,
                ...baseDetalle,
                usuarioActualizacion: usuario.email
            })
            : this.cambioMonedaService.postRegistrarDetalleCampania({
                ...baseDetalle,
                secuencial: maxSecuencial + 1
            });

        const mensaje = this.detalleCampania
            ? 'Se actualizó correctamente el detalle de la campaña'
            : 'Se registró correctamente el detalle de la campaña';

        operacion.subscribe(
            (resp: any) => manejarRespuesta(resp, mensaje),
            () => this.toastr.add({ severity: 'error', summary: 'Error agregarDetalle', detail: 'Error en el servicio detalle campaña' })

        );
    }
    close() {
        this.dialogRef.close({
            event: 'close'
        });
    }
    createformAddDetalle() {
        this.formAddDetalle = new FormGroup({
            diasSemana: new FormControl<string | null>(null, {
                validators: [Validators.required]
            }),
            //diasSemana: new FormControl(null, [this.requireMatch, Validators.required]),
            horaInicio: new FormControl('10:30', Validators.required),
            horaFin: new FormControl('11:30', Validators.required),
        });
    }

    //  <button mat-icon-button [matMenuTriggerFor]="menu" matTooltipPosition="above"
    //                             matTooltip="Opciones" *ngIf="true">
    //                             <mat-icon>more_vert</mat-icon>
    //                         </button>
    //                         <mat-menu #menu="matMenu">
    //                             <button mat-menu-item (click)="editarDetalle(rowData)">
    //                                 <i class="pi pi-pencil"></i>
    //                                 <span>Editar</span>
    //                             </button>
    //                             <button mat-menu-item (click)="eliminarDetalle(rowData)">
    //                                 <i class="pi pi-eye"></i>
    //                                 <span>Eliminar</span>
    //                             </button>
    //                         </mat-menu>

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
                    this.editarDetalle(rowData)
                    menu?.hide();  // cerrar directamente
                }, 5);
            }
        });
        items.push({
            label: 'Eliminar',
            icon: 'pi pi-eye',
            command: () => {
                setTimeout(() => {
                    this.eliminarDetalle(rowData)
                    menu?.hide();  // cerrar directamente
                }, 5);
            }
        });
        return items;
    }
    createformAddCabecera() {
        const fechaActual = new Date();
        const fechaFin = new Date();
        fechaFin.setDate(fechaActual.getDate() + 30);

        this.formAddCabecera = new FormGroup({
            codigoCampana: new FormControl(''),
            nombreCampania: new FormControl('', [Validators.required]),
            estadoCampania: new FormControl('', [this.requireMatch, Validators.required]),
            tipoCampania: new FormControl(null, [this.requireMatch, Validators.required]),
            tipoValidacion: new FormControl(null, [this.requireMatch, Validators.required]),
            montoValidacion: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
            tasaVenta: new FormControl(null, [Validators.pattern(/^[-+]?\d{0,1}(\.\d{1,4})?$/)]),
            tasaCompra: new FormControl(null, [Validators.pattern(/^[-+]?\d{0,1}(\.\d{1,4})?$/)]),
            tcCompra: new FormControl(null, [Validators.pattern(/^\d{0,1}(\.\d{1,4})?$/)]),
            tcVenta: new FormControl(null, [Validators.pattern(/^\d{0,1}(\.\d{1,4})?$/)]),
            fechaInicio: new FormControl(new Date(), Validators.required),
            fechaFin: new FormControl(fechaFin, Validators.required),
        });

        this.generarDiasSemanaEnBaseFecha(
            this.formAddCabecera.get('fechaInicio')!.value,
            this.formAddCabecera.get('fechaFin')!.value
        )
    }

    setFormulario() {
        let tipoCampaniaLocal = null;
        let tipoValidacionLocal = null;
        let estadoLocal = null;

        if (this.idCambioMonedaCampana > 0) {
            tipoCampaniaLocal = this.tipoCampania.find(x => { return x.id == this.campania!.tipoCampana });
            tipoValidacionLocal = this.tipoValidacion.find(x => { return x.id == this.campania!.tipoValidacion });
            estadoLocal = this.estados.find(x => { return x.id == this.campania!.idCambioMonedaEstado });
        }

        this.formAddCabecera.patchValue({
            fechaInicio: new Date(this.campania!.fechaInicio!),
            fechaFin: new Date(this.campania!.fechaFin!),
            codigoCampana: this.campania!.codigoCampana,
            nombreCampania: this.campania!.descripcion,
            montoValidacion: this.campania!.montoValidacion,
            tasaVenta: this.campania!.tasaVentaOh,
            tasaCompra: this.campania!.tasaCompraOh,
            tcCompra: this.campania!.tipoCambioCompraOh,
            tcVenta: this.campania!.tipoCambioVentaOh,
            tipoCampania: tipoCampaniaLocal,
            tipoValidacion: tipoValidacionLocal,
            estadoCampania: estadoLocal
        });

        if (this.formAddCabecera.value.tipoValidacion) {
            this.habilitarMontoValidacion(this.formAddCabecera.value.tipoValidacion.id);
        } else {
            this.habilitarTCporTipoCampania(this.formAddCabecera.value.tipoCampania.id);
        }

        this.generarDiasSemanaEnBaseFecha(
            this.formAddCabecera.get('fechaInicio')!.value,
            this.formAddCabecera.get('fechaFin')!.value
        )
    }

    habilitarMontoValidacion(id: string) {
        switch (id) {
            case '04'://Sin Validación
                this.formAddCabecera.get('montoValidacion')!.clearValidators();
                this.formAddCabecera.controls['montoValidacion'].disable();
                break;
            default://Diferente a Sin Validación
                this.formAddCabecera.get('montoValidacion')!.setValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]);
                this.formAddCabecera.controls['montoValidacion'].enable();
                break;
        }

        this.formAddCabecera.get('montoValidacion')!.updateValueAndValidity();
    }

    habilitarTCporTipoCampania(id: string) {
        switch (id) {
            case '01'://Por Tipo Cambio Fijo
                this.formAddCabecera.get('tasaVenta')!.clearValidators();
                this.formAddCabecera.get('tasaCompra')!.clearValidators();
                this.formAddCabecera.get('tcCompra')!.setValidators([Validators.required, Validators.pattern(/^[-+]?\d{0,1}(\.\d{1,4})?$/)]);
                this.formAddCabecera.get('tcVenta')!.setValidators([Validators.required, Validators.pattern(/^[-+]?\d{0,1}(\.\d{1,4})?$/)]);
                break;
            case '02'://Por Tasa
                this.formAddCabecera.get('tcCompra')!.clearValidators();
                this.formAddCabecera.get('tcVenta')!.clearValidators();
                this.formAddCabecera.get('tasaVenta')!.setValidators([Validators.required, Validators.pattern(/^[-+]?\d{0,1}(\.\d{1,4})?$/)]);
                this.formAddCabecera.get('tasaCompra')!.setValidators([Validators.required, Validators.pattern(/^[-+]?\d{0,1}(\.\d{1,4})?$/)]);//
                break;
        }

        this.formAddCabecera.get('tasaVenta')!.updateValueAndValidity();
        this.formAddCabecera.get('tasaCompra')!.updateValueAndValidity();
        this.formAddCabecera.get('tcCompra')!.updateValueAndValidity();
        this.formAddCabecera.get('tcVenta')!.updateValueAndValidity();
    }

    filterElementTipoValidacion(event: any) {
        this.filteredElementTipoValidacion = [];
        const query = event.query;
        for (let i = 0; i < this.tipoValidacion.length; i++) {
            const element = this.tipoValidacion[i];
            if (element.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementTipoValidacion.push(element);
            }
        }
    }

    filterElementTipoCampania(event: any) {
        this.filteredElementTipoCampania = [];
        const query = event.query;
        for (let i = 0; i < this.tipoCampania.length; i++) {
            const element = this.tipoCampania[i];
            if (element.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementTipoCampania.push(element);
            }
        }
    }

    filterElementDias(event: any) {
        this.filteredElementDias = [];
        const query = event.query;
        for (let i = 0; i < this.dias.length; i++) {
            const element = this.dias[i];
            if (element.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementDias.push(element);
            }
        }
    }

    parseFechaDDMMYYYY(fechaStr: any) {
        const [dia, mes, anio] = fechaStr.split('/');
        return new Date(+anio, +mes - 1, +dia);
    }

    obtenerListaDiasYFechas(fechaInicio: any, fechaFin: any) {
        let lista: ListaValoresDias[] = [];
        let fechaInicioParse = this.parseFechaDDMMYYYY(fechaInicio);
        const fechaFinParse = this.parseFechaDDMMYYYY(fechaFin);

        while (fechaInicioParse <= fechaFinParse) {
            let nombreDia = fechaInicioParse.toLocaleDateString('es-ES', { weekday: 'long' });
            let fecha = fechaInicioParse.toISOString().split('T')[0];
            let nombre = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
            let numeroDiaSemana = fechaInicioParse.getDay();

            lista.push({
                fecha: fecha,
                nombre: nombre,
                numeroDiaSemana: numeroDiaSemana
            });

            fechaInicioParse.setDate(fechaInicioParse.getDate() + 1);
        }

        return lista;
    }

    requireMatch(control: FormControl): ValidationErrors | null {
        const selection: any = control.value;
        if (typeof selection === 'string') {
            return { requireMatch: true };
        }
        return null;
    }

    changeModelFecha() {
        this.generarDiasSemanaEnBaseFecha(
            this.formAddCabecera.get('fechaInicio')!.value,
            this.formAddCabecera.get('fechaFin')!.value
        )
    }

    changeTipoCampania($event: any) {
        if (!this.initializedTipoCampania) {
            this.initializedTipoCampania = true;
            return;
        }

        const tipoCampaniaId = $event.id;

        this.formAddCabecera.patchValue({
            tcCompra: null,
            tcVenta: null,
            tasaVenta: null,
            tasaCompra: null,
        });

        this.habilitarTCporTipoCampania(tipoCampaniaId);
    }

    changeModelTipoValidacion($event: any) {
        const tipoValidacionId = $event.id;
        this.habilitarMontoValidacion(tipoValidacionId)
    }

    generarDiasSemanaEnBaseFecha(fechaInicio: any, fechaFin: any) {
        const listaDias = this.obtenerListaDiasYFechas(
            moment(fechaInicio).format('DD/MM/YYYY'),
            moment(fechaFin).format('DD/MM/YYYY')
        );

        const uniqueByNombreAndNumeroDiaSemana = listaDias.filter((obj, index, self) =>
            index === self.findIndex(o => o.nombre === obj.nombre && o.numeroDiaSemana === obj.numeroDiaSemana)
        );

        this.dias = uniqueByNombreAndNumeroDiaSemana.map(dia => {
            const item: ListaValoresEntero = {
                nombre: dia.nombre,
                id: dia.numeroDiaSemana
            }

            return item
        });

        this.dias.push(this.diasAlmacenado.find(dia => dia.nombre == 'Feriado')!);
        this.dias.sort((a: any, b: any) => a.id - b.id);
    }

    convertirA12Horas(time24: string): string {
        const [hours, minutes, seconds] = time24.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    convertirAHoraMinutos(hora: any) {
        const [time, meridiem] = hora.split(' ');
        let [hh, mm] = time.split(':').map(Number);

        if (meridiem === 'PM' && hh !== 12) hh += 12;
        if (meridiem === 'AM' && hh === 12) hh = 0;

        return hh * 60 + mm;
    }

    hayConflicto(horarioNuevo: any) {
        return this.detallesCampania.some(horarioExistente => {
            const inicioExistente = this.convertirAHoraMinutos(horarioExistente.horaInicio);
            const finExistente = this.convertirAHoraMinutos(horarioExistente.horaFin);
            const inicioNuevo = this.convertirAHoraMinutos(horarioNuevo.horaInicio);
            const finNuevo = this.convertirAHoraMinutos(horarioNuevo.horaFin);

            return (
                inicioNuevo < finExistente &&
                finNuevo > inicioExistente &&
                horarioExistente.nombreDias == horarioNuevo.diaSemana
            );
        });
    }
}