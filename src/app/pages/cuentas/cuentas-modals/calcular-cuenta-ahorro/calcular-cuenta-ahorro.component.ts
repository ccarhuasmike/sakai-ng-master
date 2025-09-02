import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, AbstractControl, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { ToastModule } from 'primeng/toast';
import { CalcularCuentaAhorroService } from './calcular-cuenta-ahorro.service';
import { CommonService } from '@/pages/service/commonService';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
export interface Tasa {
    fechaInicio: String;
    fechaFin: String;
    tasa: Number;
};

export interface Particion {
    fechaInicio: Date| null | undefined;
    fechaFin: Date| null | undefined;
    monto: Number;
    tasa: Number| null | undefined;
    importe: Number;
    transaccion: String;
    glosa: String;
};

@Component({
    selector: 'app-calcular-cuenta-ahorro',
    templateUrl: './calcular-cuenta-ahorro.component.html',
    styleUrls: ['./calcular-cuenta-ahorro.component.scss'],
    standalone: true,
    imports: [InputNumberModule,DatePickerModule,TableModule,MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],    
    providers: [MessageService],
    encapsulation: ViewEncapsulation.None
})

export class CalcularCuentaAhorroComponent implements OnInit {
    formCalculoInteres!: FormGroup;
    tiposPlan = [
        {
            id: '01',
            nombre: 'Disponible'
        },
        {
            id: '02',
            nombre: 'Retenido'
        },
    ];

    filteredElementTipoPlan: any[] = [];
    tiposAjuste = [];
    filteredElementTipoAjuste: any[] = [];

    codigosComercio = [];
    filteredElementCodigoComercio: any[] = [];

    historialTasas: Tasa[] = [];

    particiones: Particion[] = [];

    fechaActual!: Date;
    numeroCuenta: any = '';
    saldoDisponible: any = 0;
    tasa: any = 0;
    planes: [] = [];
    uidCliente: any = '';
    uidCuenta: any = '';
    codigoGrupo: any = '';
    disableButton = false;

    files: File[] = [];
    loadingFile = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private toastr: MessageService,
        private commonService: CommonService,
        private calcularCuentaAhorroService: CalcularCuentaAhorroService
    ) {
        this.numeroCuenta = config.data.numeroCuenta;
        this.saldoDisponible = config.data.saldoDisponible;
        this.planes = config.data.planes;
        this.tasa = config.data.tasa;
        this.uidCliente = config.data.uidCliente;
        this.uidCuenta = config.data.uidCuenta;
    }

    ngOnInit(): void {
        this.getCombos();

        this.fechaActual = new Date();
        this.fechaActual.setHours(0, 0, 0, 0);

        this.formCalculoInteres = this.fb.group({
            fechaActual: new FormControl(this.fechaActual.toISOString().split('T')[0]),
            tipoPlan: new FormControl(null, [Validators.required, this.requireMatch]),
            tipoAjuste: new FormControl(null, [this.requireMatch, Validators.required]),
            codigoComercio: new FormControl(null, [this.requireMatch, Validators.required]),
            fechaAjuste: new FormControl(null, [this.fechaValidaValidator, Validators.required]),
            importe: new FormControl(null, Validators.required),
            glosa: new FormControl(null, [Validators.required]),
            referencia: new FormControl(null),
            nombreArchivo: new FormControl(null),
            archivosAdjuntos: new FormControl(null)
        });

        this.formCalculoInteres.valueChanges.subscribe(valores => {
            this.particiones = [];
        });
    }

    fechaValidaValidator(control: AbstractControl): ValidationErrors | null {
        const valor = control.value;

        if (valor instanceof Date) {
            return null;
        }

        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(valor)) {
            return { fechaInvalida: true };
        }

        const [dia, mes, anio] = valor.split('/').map(Number);
        const fecha = new Date(anio, mes - 1, dia);

        if (
            fecha.getFullYear() !== anio ||
            fecha.getMonth() !== mes - 1 ||
            fecha.getDate() !== dia
        ) {
            return { fechaInvalida: true };
        }

        return null;
    }

    getCombos() {
        this.commonService.getMultipleCombosPromise([
            'TRANSACCION_ORIGINAL_AJUSTE',
            'CODIGO_COMERCIO_AJUSTE'
        ]).then(resp => {
            this.tiposAjuste = resp[0]['data'];
            this.tiposAjuste = this.tiposAjuste.filter((e: any) =>
                e.desElemento === 'Ajuste para abonar capital' ||
                e.desElemento === 'Ajuste para retirar capital'
            )

            this.codigosComercio = resp[1]['data'];
        })
    }

    getTasas(event: any) {
        if (!event) {
            return;
        }

        this.historialTasas = [];
        this.particiones = [];
        const fechaInicio = this.formatoFecha(event);
        const fechaFin = this.formatoFecha(this.fechaActual);

        if (new Date(fechaInicio) >= new Date(fechaFin)) {
            return;
        }

        this.calcularCuentaAhorroService.getTasas(
            fechaInicio,
            fechaFin,
            this.numeroCuenta
        ).subscribe((resp: any) => {
            if (resp['codigo'] == 0) {

                this.historialTasas = resp['data'].map((e: any) => {
                    return {
                        fechaInicio: e.fechaInicio,
                        fechaFin: e.fechaFin,
                        tasa: e.tea
                    }
                }).sort((a: any, b: any) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());

                if (this.historialTasas.length === 0) {

                    const fechaLimite = new Date(this.fechaActual);
                    fechaLimite.setHours(0, 0, 0, 0);
                    fechaLimite.setDate(fechaLimite.getDate() - 1);

                    this.historialTasas.unshift({
                        fechaInicio: event.toString(),
                        fechaFin: fechaLimite.toString(),
                        tasa: this.tasa
                    });

                    return;
                }

                const registroConFechaInicioMenor = this.historialTasas.reduce((menor, actual) => {
                    return new Date(actual.fechaInicio.toString()) < new Date(menor.fechaInicio.toString()) ? actual : menor;
                });

                const fechaInicio = new Date(registroConFechaInicioMenor.fechaInicio.toString());

                if (event < fechaInicio) {
                    fechaInicio.setDate(fechaInicio.getDate() - 1);

                    this.historialTasas.unshift({
                        fechaInicio: event.toString(),
                        fechaFin: fechaInicio.toString(),
                        tasa: this.tasa
                    });
                }

                const registroConFechaVigenciaMayor = this.historialTasas.reduce((menor, actual) => {
                    return new Date(actual.fechaFin.toString()) > new Date(menor.fechaFin.toString()) ? actual : menor;
                });

                const fechaFin = new Date(registroConFechaVigenciaMayor.fechaFin.toString());

                const fechaLimite = new Date(this.fechaActual);
                fechaLimite.setHours(0, 0, 0, 0);
                fechaLimite.setDate(fechaLimite.getDate() - 1);

                if (fechaLimite > fechaFin) {
                    fechaFin.setDate(fechaFin.getDate() + 1);

                    this.historialTasas.push({
                        fechaInicio: fechaFin.toString(),
                        fechaFin: fechaLimite.toString(),
                        tasa: this.tasa
                    });
                }

                this.historialTasas = this.unirPeriodosConTasaIgual();
            } else if (resp['codigo'] == 1) {
                const fechaLimite = new Date(this.fechaActual);
                fechaLimite.setHours(0, 0, 0, 0);
                fechaLimite.setDate(fechaLimite.getDate() - 1);

                this.historialTasas.push({
                    fechaInicio: event.toString(),
                    fechaFin: fechaLimite.toString(),
                    tasa: this.tasa
                });
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error getTasas', detail: resp['mensaje'] });
            }
        }, (_error) => {
            this.toastr.add({ severity: 'error', summary: 'Error getTasas', detail: 'Error en el servicio de obtener tasas' });
        })
    }

    unirPeriodosConTasaIgual() {
        const periodosUnidos = [];

        for (let i = 0; i < this.historialTasas.length; i++) {
            const actual = this.historialTasas[i];
            const ultimo = periodosUnidos[periodosUnidos.length - 1];

            if (ultimo && ultimo.tasa === actual.tasa) {
                ultimo.fechaFin = actual.fechaFin;
            } else {
                periodosUnidos.push({ ...actual });
            }
        }

        return periodosUnidos;
    }

    formatoFecha(fecha: any) {
        let year = fecha.getFullYear();
        let month = ('0' + (fecha.getMonth() + 1)).slice(-2);
        let day = ('0' + fecha.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    }

    sumarDias = (fecha: Date, dias: number): Date => {
        const nuevaFecha = new Date(fecha);
        nuevaFecha.setDate(nuevaFecha.getDate() + dias);
        return nuevaFecha;
    };

    obtenerUltimoDiaMes = (fecha: Date): Date => {
        const year = fecha.getFullYear();
        const month = fecha.getMonth();
        return new Date(year, month + 1, 0);
    };

    validarParticionEnMesActual = (fechaInicio: Date): boolean => {
        const mesInicio = fechaInicio.getMonth();
        const anioInicio = fechaInicio.getFullYear();
        const mesFin = this.fechaActual.getMonth();
        const anioFin = this.fechaActual.getFullYear();

        if (mesInicio === mesFin && anioInicio === anioFin) {
            return true;
        } else {
            return false;
        }
    };

    particionarTasas = async () => {
        this.particiones = [];

        const formValue = this.formCalculoInteres.value;
        const fechaInicial = new Date(formValue.fechaAjuste);

        if (fechaInicial > this.fechaActual) {
            this.toastr.add({ severity: 'warn', summary: 'Error getTasas', detail: 'La fecha de ajuste no puede ser mayor a la fecha actual del sistema para realizar el ajuste' });
            //this.toastr.warning('La fecha de ajuste no puede ser mayor a la fecha actual del sistema para realizar el ajuste');
            return;
        }

        this.particiones.push({
            fechaInicio: null,
            fechaFin: null,
            monto: formValue.importe,
            tasa: null,
            importe: formValue.importe,
            transaccion: `Ajuste de ${formValue.tipoAjuste.desElemento === 'Ajuste para abonar capital' ? 'abono' : 'retiro'}`,
            glosa: formValue.tipoAjuste.desElemento
        });

        if (
            fechaInicial.getTime() === this.fechaActual.getTime() ||
            !this.historialTasas.some(elemento => elemento.tasa !== 0)
        ) {
            return;
        }

        for (let i = 0; i < this.historialTasas.length; i++) {

            if (this.historialTasas[i].tasa == 0) {
                continue;
            }

            let { fechaInicio, fechaFin, tasa }: any = this.historialTasas[i];

            fechaInicio = new Date(fechaInicio);
            fechaInicio.setHours(fechaInicio.getHours() + 5);

            fechaFin = new Date(fechaFin);
            fechaFin.setHours(fechaFin.getHours() + 5);

            if (fechaFin < fechaInicial || fechaInicio > this.fechaActual) {
                continue;
            }

            if (fechaInicio < fechaInicial) {
                fechaInicio = fechaInicial;
            }
            if (fechaFin > this.fechaActual) {
                fechaFin = this.fechaActual;
            }

            let fechaInicioParcial = fechaInicio;

            while (fechaInicioParcial <= fechaFin) {
                let cierreMes = this.obtenerUltimoDiaMes(fechaInicioParcial);
                let fechaFinParcial = fechaFin < cierreMes ? fechaFin : cierreMes;
                let descripcion = 'Capitalización de interés';

                if (this.validarParticionEnMesActual(fechaInicioParcial)) {
                    descripcion = 'Ajuste de interés';
                }

                if (fechaInicioParcial <= fechaFinParcial) {
                    let diferenciaMilisegundos = Math.abs(fechaFinParcial - fechaInicioParcial);
                    let diferenciaDias = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;

                    try {
                        const monto = this.particiones.map(t => t.importe).reduce((acc: any, value: any) => acc + value, 0);

                        var simulacion = await this.calcularCuentaAhorroService.postAjusteSimulacion({
                            aer: tasa,
                            balance: monto,
                            days: diferenciaDias
                        });

                        this.particiones.push({
                            fechaInicio: fechaInicioParcial,
                            fechaFin: fechaFinParcial,
                            monto: monto,
                            tasa: tasa,
                            importe: simulacion.data.interes,
                            transaccion: descripcion,
                            glosa: `Intereses del ${fechaInicioParcial.toISOString().split('T')[0]} al ${fechaFinParcial.toISOString().split('T')[0]}`
                        });
                    } catch (error) {
                        this.particiones = [];
                        this.toastr.add({ severity: 'error', summary: 'Error particionarTasas', detail: 'Error al calcular la simulación de ajuste de interés' });
                        return;
                    }
                }

                fechaInicioParcial = this.sumarDias(fechaFinParcial, 1);
            }
        }
    };

    requireMatch(control: FormControl): ValidationErrors | null {
        const selection: any = control.value;
        if (typeof selection === 'string') {
            return { requireMatch: true };
        }
        return null;
    }

    filterElementCompleteTipoPlan(event: any) {
        this.filteredElementTipoPlan = [];
        const query = event.query;
        for (let i = 0; i < this.tiposPlan.length; i++) {
            const element = this.tiposPlan[i];
            if (element.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementTipoPlan.push(element);
            }
        }
    }

    filterElementCompleteTipoAjuste(event: any) {
        this.filteredElementTipoAjuste = [];
        const query = event.query;
        for (let i = 0; i < this.tiposAjuste.length; i++) {
            const element: any = this.tiposAjuste[i];
            if (element.desElemento.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementTipoAjuste.push(element);
            }
        }
    }

    filterElementCodigoComercio(event: any, data: any) {
        this.filteredElementCodigoComercio = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.valCadLargo.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementCodigoComercio.push(element);
            }
        }
    }

    onSelectTipoAjuste(event: any) {
        if (event.desElemento === 'Ajuste para abonar capital') {
            this.codigoGrupo = '51';
        }

        if (event.desElemento === 'Ajuste para retirar capital') {
            this.codigoGrupo = '49';
        }
    }

    async ajustarSaldo() {

        this.disableButton = true;

        const usuario = JSON.parse(localStorage.getItem('userABA')!);

        const formValue = this.formCalculoInteres.value;

        if (formValue.tipoAjuste.valNumEntero === 2) {

            const datosCuentas: any = await this.commonService.getCuenta(this.uidCliente).toPromise();

            if (datosCuentas['codigo'] !== 0) {
                this.toastr.add({ severity: 'error', summary: 'Error ajustarSaldo', detail: 'Error en el servicio de obtener datos de la cuenta' });
                //this.toastr.error('Error en el servicio de obtener datos de la cuenta');
                return;
            }

            const datosCuenta = datosCuentas['data'].content.find((e: any) => e.uIdCuenta === this.uidCuenta);

            if (!datosCuenta) {
                this.toastr.add({ severity: 'error', summary: 'Error ajustarSaldo', detail: 'No se encontró la cuenta' });
                return;
            }

            const importeTotalCapitalizacionYAjuste = this.particiones
                .filter((particion: any) => ['Capitalización de interés', 'Ajuste de retiro'].includes(particion.transaccion))
                .reduce((acc: number, particion: any) => acc + particion.importe, 0);

            const planMap: any = {
                '01': { saldo: datosCuenta.saldoDisponible, mensaje: 'El monto a retirar no tiene que ser mayor al capital disponible' },
                '02': { saldo: datosCuenta.saldoRetenido, mensaje: 'El monto a retirar no tiene que ser mayor al capital retenido' }
            };

            const selectedPlan = planMap[formValue.tipoPlan.id];

            if (selectedPlan && importeTotalCapitalizacionYAjuste > selectedPlan.saldo) {
                this.disableButton = false;
                this.toastr.add({ severity: 'warn', summary: 'Advertencia ajustarSaldo', detail: selectedPlan.mensaje });
                return;
            }

            const importeTotalAjusteInteres = this.particiones
                .filter((particion: any) => particion.transaccion === 'Ajuste de interés')
                .reduce((acc: number, particion: any) => acc + particion.importe, 0);

            const interesPlan: any = this.planes.find((plan: any) => plan.codigoPlan === formValue.tipoPlan.id);

            if (importeTotalAjusteInteres && importeTotalAjusteInteres > interesPlan.interes) {
                this.disableButton = false;
                const tipoInteres = formValue.tipoPlan.id === '01' ? 'disponible' : 'retenido';
                this.toastr.add({ severity: 'warn', summary: 'Advertencia ajustarSaldo', detail: `El interés a retirar no tiene que ser mayor al interés ${tipoInteres}` });
                return;
            }
        }

        const capitalizacionInteres = this.particiones
            .filter((particion: any, index: any) => { return particion.transaccion == 'Capitalización de interés' })
            .map((particion: any) => {
                return {
                    saldoDisponible: this.saldoDisponible,
                    codigoGrupo: '00',
                    referencia: particion.transaccion,
                    glosa: particion.glosa,
                    monto: particion.importe,
                    tasa: particion.tasa,
                    tipoPlan: formValue.tipoPlan.id,
                    codigoComercio: formValue.codigoComercio.valCadLargo,
                    nombreComercio: formValue.codigoComercio.valCadCorto,
                    tipoFactura: formValue.tipoAjuste.codTablaElemento,
                    nombreSustento: '',
                    archivoSustento: '',
                    rutaSustento: ''
                }
            });

        const ajusteInteres = this.particiones
            .filter((particion: any, index: any) => { return particion.transaccion == 'Ajuste de interés' })
            .map((particion: any) => {
                return {
                    aer: particion.tasa,
                    amount: particion.importe,
                    description: particion.glosa,
                    ptyCode: formValue.tipoPlan.id
                }
            });

        if (this.particiones.length > 1) {
            const object = {
                uidCliente: this.uidCliente,
                uidCuenta: this.uidCuenta,
                numeroCuenta: this.numeroCuenta,
                tipoAjuste: formValue.tipoAjuste.valNumEntero,
                ajusteCuenta: {
                    codigoGrupo: this.codigoGrupo,
                    saldoDisponible: this.saldoDisponible,
                    glosa: formValue.glosa,
                    referencia: formValue.referencia,
                    monto: formValue.importe,
                    tipoFactura: formValue.tipoAjuste.codTablaElemento,
                    codigoComercio: formValue.codigoComercio.valCadLargo,
                    nombreComercio: formValue.glosa,
                    nombreSustento: formValue.nombreArchivo,
                    archivoSustento: formValue.archivosAdjuntos,
                    rutaSustento: ''
                },
                capitalizacionInteres: capitalizacionInteres,
                ajusteInteres: ajusteInteres,
                usuarioCreacion: usuario.email
            }

            this.calcularCuentaAhorroService.postAjusteSaldoInteres(object).pipe(
                finalize(() => {
                    this.disableButton = false;
                })
            ).subscribe((resp: any) => {
                this.dialogRef.close({
                    event: 'close', data: resp
                });
            }, (_error) => {
                this.dialogRef.close();
            });
        } else {
            const object = {
                uidCliente: this.uidCliente,
                uidCuenta: this.uidCuenta,
                codigoGrupo: this.codigoGrupo,
                saldoDisponible: this.saldoDisponible,
                glosa: formValue.glosa,
                referencia: formValue.referencia,
                monto: formValue.importe,
                tipoAjuste: formValue.tipoAjuste.valNumEntero,
                tipoFactura: formValue.tipoAjuste.codTablaElemento,
                codigoComercio: formValue.codigoComercio.valCadLargo,
                nombreComercio: formValue.glosa,
                usuarioCreacion: usuario.email,
                idTerminal: 10001,
                idTransaccionTerminal: 1,
                nombreSustento: formValue.nombreArchivo,
                archivoSustento: formValue.archivosAdjuntos
            };

            if (object.tipoAjuste === 1) {
                this.calcularCuentaAhorroService.postAjusteSaldoAbono(object).pipe(
                    finalize(() => {
                        this.disableButton = false;
                    })
                ).subscribe((resp: any) => {
                    this.dialogRef.close({
                        event: 'close', data: resp
                    });
                }, (_error) => {
                    this.dialogRef.close();
                });
            } else if (object.tipoAjuste === 2) {
                this.calcularCuentaAhorroService.postAjusteSaldoRetiro(object).pipe(
                    finalize(() => {
                        this.disableButton = false;
                    })
                ).subscribe((resp: any) => {
                    this.dialogRef.close({
                        event: 'close', data: resp
                    });
                }, (_error) => {
                    this.dialogRef.close();
                });
            }
        }
    }

    close() {
        this.dialogRef.close({
            event: 'close'
        });
    }

    uploader(event: any) {
        this.loadingFile = true;
        this.files = event.files;
        const filereader = new FileReader();
        filereader.readAsDataURL(this.files[0]);
        filereader.onload = () => {
            this.formCalculoInteres.get('archivosAdjuntos')!.setValue(filereader.result);
            this.formCalculoInteres.get('nombreArchivo')!.setValue(this.files[0].name);
            this.toastr.add({ severity: 'info', summary: 'Carga exitosa', detail: `${this.files.length} archivos listos para enviar` });
            this.loadingFile = false;
        };
        filereader.onerror = () => {
            this.toastr.add({ severity: 'error', summary: 'Carga fallida', detail: `No se pudo cargar los archivos` });
            this.loadingFile = false;
        };
    }

    removeAll() {
        this.files = [];
    }

    removeElement(event: any) {
        if (this.files.length > 0) {
            this.formCalculoInteres.get('archivosAdjuntos')!.setValue(null);
            this.formCalculoInteres.get('nombreArchivo')!.setValue(null);
            this.files = this.files.filter((element) => {
                return element !== event.file;
            });
        }
    }
}
