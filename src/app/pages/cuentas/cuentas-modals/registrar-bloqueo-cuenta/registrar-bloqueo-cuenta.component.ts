import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
// import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
// import { CommonService } from 'app/main/services/shared/common.service';
// import { SecurityEncryptedService } from 'app/main/services/shared/security-encrypted.service';
import { RegistrarBloqueoCuentaService } from './registrar-bloqueo-cuenta.service';
// import { ROLES } from 'app/main/utils/constants/aba.constants';
// import { ToastrService } from 'ngx-toastr';
import { ROLES } from '@/layout/Utils/constants/aba.constants';
import { CommonService } from '@/pages/service/commonService';
import { SecurityEncryptedService } from '@/layout/service/SecurityEncryptedService';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-registrar-bloqueo-cuenta',
    templateUrl: './registrar-bloqueo-cuenta.component.html',
    styleUrls: ['./registrar-bloqueo-cuenta.component.scss'],
    standalone: true,
    imports: [MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    //animations: fuseAnimations,
    providers: [MessageService],
    encapsulation: ViewEncapsulation.None
})
export class RegistrarBloqueoCuentaComponent implements OnInit {

    uidCliente: any = '';
    uidCuenta: any = '';
    datosCuenta: any;
    datosCliente: any;
    formBloqueo: FormGroup;
    tipo: any = '';
    //SMCCB
    showCancelButton: any = false;
    files: File[] = [];
    filteredElementMotivo: any[] = [];
    filteredElementEstado: any[] = [];
    estadosBloqueoCuenta: any[] = [];
    motivosBloqueoCuenta: any[] = [];
    estadosMotivosBloqueoCuenta: any[] = [];
    opcionesEstadoBloqueoCuenta: any[] = [];
    opcionesMotivoBloqueoCuenta: any[] = [];
    loadingFile = false;
    disableButton = false;

    roles: any = ROLES;

    constructor(
        private commonService: CommonService,
        private securityEncryptedService: SecurityEncryptedService,
        private toastr: MessageService,
        private fb: FormBuilder,
        private registrarBloqueoCuentaService: RegistrarBloqueoCuentaService,
        // public dialogRef: MatDialogRef<RegistrarBloqueoCuentaComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig

    ) {
        this.uidCliente = config.data.uidCliente;
        this.uidCuenta = config.data.uidCuenta;
        this.datosCuenta = config.data.datosCuenta;
        this.datosCliente = config.data.datosCliente;
        this.tipo = config.data.tipo;
        //SMCCB
        this.showCancelButton = config.data.showCancelButton;

        this.formBloqueo = this.fb.group({
            tipoBloqueo: new FormControl(null, [Validators.required]),
            estadoBloqueo: new FormControl(null, [Validators.required]),
            descripcion: new FormControl(null, [Validators.maxLength(255)]),
            nombreArchivo: new FormControl(null),
            archivosAdjuntos: new FormControl(null)
        });
    }

    ngOnInit() {
        this.getCombos();
    }

    getCombos() {
        var resp: any[] = [
            {
                "codigo": 0,
                "mensaje": "OK",
                "data": {
                    "listaMotivoBloqueoCuenta": [
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "00",
                            "descripcion": "ACTIVA"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "01",
                            "descripcion": "FRAUDE"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "02",
                            "descripcion": "INACTIVIDAD"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "03",
                            "descripcion": "MANDATO LEGAL"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "04",
                            "descripcion": "DECISIÓN DE CLIENTE"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "05",
                            "descripcion": "DECISIÓN DE LA FOH"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "06",
                            "descripcion": "FALLECIMIENTO"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "07",
                            "descripcion": "TEMPORAL CONTRATO"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "08",
                            "descripcion": "JUDICIAL"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "09",
                            "descripcion": "ALERTA FRAUDE"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "10",
                            "descripcion": "ALERTA PLAFT"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "11",
                            "descripcion": "AFIL NO RECONOCIDA"
                        },
                        {
                            "codigoEstadoCuenta": null,
                            "codigo": "12",
                            "descripcion": "POR ROBO CELULAR"
                        }
                    ]
                }
            },
            {
                "codigo": 0,
                "mensaje": "OK",
                "data": {
                    "listaEstadoCuenta": [
                        {
                            "codigo": "01",
                            "descripcion": "ACTIVA"
                        },
                        {
                            "codigo": "02",
                            "descripcion": "BLOQUEO TEMPORAL"
                        },
                        {
                            "codigo": "03",
                            "descripcion": "BLOQUEO PERMANENTE"
                        },
                        {
                            "codigo": "04",
                            "descripcion": "CIERRE"
                        }
                    ]
                }
            }
        ];
        this.estadosBloqueoCuenta = resp[1]['data']['listaEstadoCuenta'].map((item: any) => {
            return {
                codigo: item.codigo,
                descripcion: item.descripcion,
                motivosBloqueoCuenta: []
            }
        });

        this.motivosBloqueoCuenta = resp[0]['data']['listaMotivoBloqueoCuenta'].map((item: any) => {
            return {
                codigo: item.codigo,
                descripcion: item.descripcion
            }
        });

        this.getEstadosMotivosBloqueoCuenta();

        // this.commonService.getMultipleCombosPromiseCuenta(['motivo-bloqueo-cuenta', 'estado-cuenta']).then(resp => {
        //     this.estadosBloqueoCuenta = resp[1]['data']['listaEstadoCuenta'].map((item: any) => {
        //         return {
        //             codigo: item.codigo,
        //             descripcion: item.descripcion,
        //             motivosBloqueoCuenta: []
        //         }
        //     });

        //     this.motivosBloqueoCuenta = resp[0]['data']['listaMotivoBloqueoCuenta'].map((item: any) => {
        //         return {
        //             codigo: item.codigo,
        //             descripcion: item.descripcion
        //         }
        //     });

        //     this.getEstadosMotivosBloqueoCuenta();

        // }).catch(_error => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getMultipleCombosPromiseCuenta', detail: 'Error en el servicio de obtener parámetros' });
        //     //this.toastr.error('Error en el servicio de obtener parámetros', 'Error getMultipleCombosPromiseCuenta');
        // });
    }

    getEstadosMotivosBloqueoCuenta() {

        const role = this.securityEncryptedService.getRolesDecrypted();
        var resp: any = {
            "codigo": 0,
            "mensaje": "OK",
            "data": {
                "content": [
                    {
                        "id": {
                            "codigoRazonCuenta": "00",
                            "codigoEstadoCuenta": "01"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "01",
                            "codigoEstadoCuenta": "03"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "01",
                            "codigoEstadoCuenta": "04"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "02",
                            "codigoEstadoCuenta": "03"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "02",
                            "codigoEstadoCuenta": "04"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "03",
                            "codigoEstadoCuenta": "03"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "03",
                            "codigoEstadoCuenta": "04"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "04",
                            "codigoEstadoCuenta": "02"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "04",
                            "codigoEstadoCuenta": "03"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "04",
                            "codigoEstadoCuenta": "04"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "05",
                            "codigoEstadoCuenta": "03"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "05",
                            "codigoEstadoCuenta": "04"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "06",
                            "codigoEstadoCuenta": "03"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "06",
                            "codigoEstadoCuenta": "04"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "07",
                            "codigoEstadoCuenta": "02"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "08",
                            "codigoEstadoCuenta": "02"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "09",
                            "codigoEstadoCuenta": "02"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "10",
                            "codigoEstadoCuenta": "02"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "11",
                            "codigoEstadoCuenta": "03"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "11",
                            "codigoEstadoCuenta": "04"
                        }
                    },
                    {
                        "id": {
                            "codigoRazonCuenta": "12",
                            "codigoEstadoCuenta": "02"
                        }
                    }
                ]
            }
        }
        if (resp['codigo'] == 0) {

            this.estadosMotivosBloqueoCuenta = resp['data'].content;

            this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.map(element => {
                const estado = this.estadosBloqueoCuenta.find(item => item.codigo === element.id.codigoEstadoCuenta);
                const motivo = this.motivosBloqueoCuenta.find(item => item.codigo === element.id.codigoRazonCuenta);

                return {
                    ...element,
                    estado,
                    motivo
                };
            }).filter(element => element.estado.descripcion !== 'CIERRE');

            if (this.tipo == 'cancelacion') {

                this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
                    e.estado.descripcion === 'BLOQUEO PERMANENTE' &&
                    (
                        e.motivo.descripcion === 'DECISIÓN DE CLIENTE' ||
                        e.motivo.descripcion === 'DECISIÓN DE LA FOH' ||

                        e.motivo.descripcion === 'FRAUDE' ||
                        e.motivo.descripcion === 'INACTIVIDAD' ||
                        e.motivo.descripcion === 'MANDATO LEGAL' ||
                        e.motivo.descripcion === 'FALLECIMIENTO' ||
                        e.motivo.descripcion === 'AFIL NO RECONOCIDA'

                    )
                );

            } else if (this.tipo == 'bloqueo') {

                this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
                    !(e.estado.descripcion == 'BLOQUEO PERMANENTE' &&
                        (e.motivo.descripcion == 'DECISIÓN DE CLIENTE' ||
                            e.motivo.descripcion == 'DECISIÓN DE LA FOH'))
                );

            } else {
                const estadoMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.find((e: any) =>
                    e.estado.descripcion == 'ACTIVA' &&
                    e.motivo.descripcion == 'ACTIVA'
                );

                if (estadoMotivosBloqueoCuenta) {
                    this.formBloqueo.patchValue({
                        estadoBloqueo: estadoMotivosBloqueoCuenta.estado,
                        tipoBloqueo: estadoMotivosBloqueoCuenta.motivo
                    });
                }
            }

            if (role == this.roles.PLAFT) {
                this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
                    e.estado.descripcion == 'BLOQUEO TEMPORAL' &&
                    e.motivo.descripcion == 'ALERTA PLAFT'
                );
            }

            if (role == this.roles.FRAUDE) {
                this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
                    (e.estado.descripcion == 'ACTIVA' && e.motivo.descripcion == 'ACTIVA') ||
                    (e.estado.descripcion == 'BLOQUEO TEMPORAL' && e.motivo.descripcion == 'ALERTA FRAUDE')
                );
            }

            if (role == this.roles.ATENCION_CLIENTE || role == this.roles.ATENCION_CLIENTE_TD) {
                this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
                    (e.estado.descripcion == 'ACTIVA' && e.motivo.descripcion == 'ACTIVA') ||
                    (e.estado.descripcion == 'BLOQUEO TEMPORAL' && e.motivo.descripcion == 'TEMPORAL CONTRATO')
                );
            }

            for (const element of this.estadosMotivosBloqueoCuenta) {

                const index = this.estadosBloqueoCuenta.findIndex((item: any) => item.codigo === element.id.codigoEstadoCuenta);

                if (index > -1) {

                    const motivo = this.motivosBloqueoCuenta.find((item: any) => item.codigo === element.id.codigoRazonCuenta);

                    if (motivo) {
                        this.estadosBloqueoCuenta[index].motivosBloqueoCuenta.push(motivo);
                    }
                }
            }

            this.opcionesMotivoBloqueoCuenta = Array.from(new Set(
                this.estadosMotivosBloqueoCuenta.filter((item: any) =>
                    item.estado.codigo != this.datosCuenta.codigoEstadoBloqueo &&
                    item.motivo.codigo != this.datosCuenta.codigoMotivoBloqueo
                ).map((item: any) => item.motivo)
            ));
        } else if (resp['codigo'] == -1) {
            this.toastr.add({ severity: 'error', summary: 'Error getEstadosMotivosBloqueoCuenta', detail: resp['mensaje'] });
        }
        // this.registrarBloqueoCuentaService.getEstadosMotivosBloqueoCuenta().subscribe((resp: any) => {
        //     if (resp['codigo'] == 0) {

        //         this.estadosMotivosBloqueoCuenta = resp['data'].content;

        //         this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.map(element => {
        //             const estado = this.estadosBloqueoCuenta.find(item => item.codigo === element.id.codigoEstadoCuenta);
        //             const motivo = this.motivosBloqueoCuenta.find(item => item.codigo === element.id.codigoRazonCuenta);

        //             return {
        //                 ...element,
        //                 estado,
        //                 motivo
        //             };
        //         }).filter(element => element.estado.descripcion !== 'CIERRE');

        //         if (this.tipo == 'cancelacion') {

        //             this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
        //                 e.estado.descripcion === 'BLOQUEO PERMANENTE' &&
        //                 (
        //                     e.motivo.descripcion === 'DECISIÓN DE CLIENTE' ||
        //                     e.motivo.descripcion === 'DECISIÓN DE LA FOH' ||

        //                     e.motivo.descripcion === 'FRAUDE' ||
        //                     e.motivo.descripcion === 'INACTIVIDAD' ||
        //                     e.motivo.descripcion === 'MANDATO LEGAL' ||
        //                     e.motivo.descripcion === 'FALLECIMIENTO' ||
        //                     e.motivo.descripcion === 'AFIL NO RECONOCIDA'

        //                 )
        //             );

        //         } else if (this.tipo == 'bloqueo') {

        //             this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
        //                 !(e.estado.descripcion == 'BLOQUEO PERMANENTE' &&
        //                     (e.motivo.descripcion == 'DECISIÓN DE CLIENTE' ||
        //                         e.motivo.descripcion == 'DECISIÓN DE LA FOH'))
        //             );

        //         } else {
        //             const estadoMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.find((e: any) =>
        //                 e.estado.descripcion == 'ACTIVA' &&
        //                 e.motivo.descripcion == 'ACTIVA'
        //             );

        //             if (estadoMotivosBloqueoCuenta) {
        //                 this.formBloqueo.patchValue({
        //                     estadoBloqueo: estadoMotivosBloqueoCuenta.estado,
        //                     tipoBloqueo: estadoMotivosBloqueoCuenta.motivo
        //                 });
        //             }
        //         }

        //         if (role == this.roles.PLAFT) {
        //             this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
        //                 e.estado.descripcion == 'BLOQUEO TEMPORAL' &&
        //                 e.motivo.descripcion == 'ALERTA PLAFT'
        //             );
        //         }

        //         if (role == this.roles.FRAUDE) {
        //             this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
        //                 (e.estado.descripcion == 'ACTIVA' && e.motivo.descripcion == 'ACTIVA') ||
        //                 (e.estado.descripcion == 'BLOQUEO TEMPORAL' && e.motivo.descripcion == 'ALERTA FRAUDE')
        //             );
        //         }

        //         if (role == this.roles.ATENCION_CLIENTE || role == this.roles.ATENCION_CLIENTE_TD) {
        //             this.estadosMotivosBloqueoCuenta = this.estadosMotivosBloqueoCuenta.filter((e: any) =>
        //                 (e.estado.descripcion == 'ACTIVA' && e.motivo.descripcion == 'ACTIVA') ||
        //                 (e.estado.descripcion == 'BLOQUEO TEMPORAL' && e.motivo.descripcion == 'TEMPORAL CONTRATO')
        //             );
        //         }

        //         for (const element of this.estadosMotivosBloqueoCuenta) {

        //             const index = this.estadosBloqueoCuenta.findIndex((item: any) => item.codigo === element.id.codigoEstadoCuenta);

        //             if (index > -1) {

        //                 const motivo = this.motivosBloqueoCuenta.find((item: any) => item.codigo === element.id.codigoRazonCuenta);

        //                 if (motivo) {
        //                     this.estadosBloqueoCuenta[index].motivosBloqueoCuenta.push(motivo);
        //                 }
        //             }
        //         }

        //         this.opcionesMotivoBloqueoCuenta = Array.from(new Set(
        //             this.estadosMotivosBloqueoCuenta.filter((item: any) =>
        //                 item.estado.codigo != this.datosCuenta.codigoEstadoBloqueo &&
        //                 item.motivo.codigo != this.datosCuenta.codigoMotivoBloqueo
        //             ).map((item: any) => item.motivo)
        //         ));
        //     } else if (resp['codigo'] == -1) {
        //         this.toastr.add({ severity: 'error', summary: 'Error getEstadosMotivosBloqueoCuenta', detail: resp['mensaje'] });
        //     }
        // }, (_error) => {
        //     this.toastr.add({ severity: 'error', summary: 'Error getEstadosMotivosBloqueoCuenta', detail: 'Error en el servicio de obtener motivos de bloqueo' });
        // });
    }

    registrarBloqueo() {
        this.disableButton = true;
        const formValue = this.formBloqueo.value;
        console.log(formValue);
        //SMCCB
        if (formValue.tipoBloqueo.codigo == "02"
            //|| formValue.tipoBloqueo.codigo == "04") && formValue.estadoBloqueo.codigo == "03"
        ) {
            // 02-INACTIVIDAD
            // 03-MANDATO LEGAL
            // 04-DECISIÓN DE CLIENTE
            if (this.tipo == 'cancelacion' && !this.showCancelButton) {
                this.toastr.add({ severity: 'warn', summary: 'Error getEstadosMotivosBloqueoCuenta', detail: 'No se puede realizar la cancelación ya que la cuenta registra saldos mayores a 0.00' });
                return;
            }
        }
        const usuario = JSON.parse(localStorage.getItem('userABA')!);

        let flagActivacion = this.tipo == 'desbloqueo' ? true : false;

        const object = {
            archivoSustento: formValue.archivosAdjuntos,
            nombreSustento: formValue.nombreArchivo,
            descripcion: formValue.descripcion,
            parametros: {
                codigoMotivo: formValue.tipoBloqueo.codigo,
                estado: formValue.estadoBloqueo.codigo,
                flagActivacion: flagActivacion,
                origen: 'BO ABA',
                uIdCliente: this.uidCliente,
                uIdCuenta: this.uidCuenta
            },
            usuario: usuario.email
        }

        this.registrarBloqueoCuentaService.postBloqueoCuenta(object)
            .pipe(
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

    removeAll() {
        this.files = [];
    }

    uploader(event: any) {
        this.loadingFile = true;
        this.files = event.files;
        const filereader = new FileReader();
        filereader.readAsDataURL(this.files[0]);
        filereader.onload = () => {
            this.formBloqueo.get('archivosAdjuntos')!.setValue(filereader.result);
            this.formBloqueo.get('nombreArchivo')!.setValue(this.files[0].name);
            //this.toastr.info(`${this.files.length} archivos listos para enviar`, 'Carga exitosa');
            this.toastr.add({ severity: 'info', summary: 'Carga exitosa', detail: `${this.files.length} archivos listos para enviar` });
            this.loadingFile = false;
        };
        filereader.onerror = () => {
            this.toastr.add({ severity: 'error', summary: 'Carga fallida', detail: `No se pudo cargar los archivos` });
            //this.toastr.error(`No se pudo cargar los archivos`, 'Carga fallida');
            this.loadingFile = false;
        };
    }

    removeElement(event: any) {
        if (this.files.length > 0) {
            this.formBloqueo.get('archivosAdjuntos')!.setValue(null);
            this.formBloqueo.get('nombreArchivo')!.setValue(null);
            this.files = this.files.filter((element) => {
                return element !== event.file;
            });
        }
    }

    filterElementMotivo(event: any, data: any) {
        this.filteredElementMotivo = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.descripcion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementMotivo.push(element);
            }
        }
    }

    filterElementEstado(event: any, data: any) {
        this.filteredElementEstado = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.descripcion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElementEstado.push(element);
            }
        }
    }

    onElementSelect(event: any) {
        this.opcionesEstadoBloqueoCuenta = [];

        this.formBloqueo.get('estadoBloqueo')!.patchValue(null);

        const estadoMotivos = this.estadosMotivosBloqueoCuenta.filter((item: any) => item.id.codigoRazonCuenta === event.codigo);

        for (const element of estadoMotivos) {

            const estadoCuenta = this.estadosBloqueoCuenta.find((item: any) => item.codigo == element.id.codigoEstadoCuenta);

            if (estadoCuenta) {
                this.opcionesEstadoBloqueoCuenta.push(estadoCuenta);
            }
        }

        if (this.opcionesEstadoBloqueoCuenta.length === 1) {
            this.formBloqueo.get('estadoBloqueo')!.patchValue(this.opcionesEstadoBloqueoCuenta[0]);
        }
    }
}
