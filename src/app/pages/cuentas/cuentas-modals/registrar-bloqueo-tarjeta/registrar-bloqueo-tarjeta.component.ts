import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RegistrarBloqueoTarjetaService } from './registrar-bloqueo-tarjeta.service';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ROLES } from '@/layout/Utils/constants/aba.constants';
import { CommonService } from '@/pages/service/commonService';
import { SecurityEncryptedService } from '@/layout/service/SecurityEncryptedService';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-registrar-bloqueo-tarjeta',
    standalone: true,
    templateUrl: './registrar-bloqueo-tarjeta.component.html',
    styleUrls: ['./registrar-bloqueo-tarjeta.component.scss'],
    imports: [MessageModule,ToastModule,ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService],
    encapsulation: ViewEncapsulation.None
})
export class RegistrarBloqueoTarjetaComponent implements OnInit {
    uidCliente: any = '';
    uidCuenta: any = '';
    tarjeta: any;
    formBloqueo: FormGroup;
    files: File[] = [];
    filteredElement: any[] = [];
    estadoTarjeta: any[] = [];
    motivosBloqueoTarjeta: any[] = [];
    loadingFile = false;
    disableButton = false;
    roles: any = ROLES;
    constructor(
        private commonService: CommonService,
        private securityEncryptedService: SecurityEncryptedService,        
        private toastr: MessageService,
        private registrarBloqueoTarjetaService: RegistrarBloqueoTarjetaService,        
        private fb: FormBuilder,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {

        this.uidCliente = config.data.uidCliente;
        this.uidCuenta = config.data.uidCuenta;
        this.tarjeta = config.data.tarjeta;

        this.formBloqueo = this.fb.group({
            tipoBloqueo: new FormControl(null, [Validators.required]),
            descripcion: new FormControl(null, [Validators.maxLength(255)]),
            nombreArchivo: new FormControl(null),
            archivosAdjuntos: new FormControl(null)
        });
    }

    ngOnInit() {
        this.getcombos();
    }

    getcombos() {
        const role = this.securityEncryptedService.getRolesDecrypted();
        
        var resp: any = [
            {
                "data": {
                    "listaMotivoBloqueoTarjeta": [
                        {
                            "codigo": "00",
                            "descripcion": "ACTIVA",
                            "codigoEstadoTarjeta": "01",
                            "codigoExterno": "A"
                        },
                        {
                            "codigo": "02",
                            "descripcion": "ROBO",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "X"
                        },
                        {
                            "codigo": "03",
                            "descripcion": "FRAUDE",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "F"
                        },
                        {
                            "codigo": "04",
                            "descripcion": "TRANS. NO RECONOCIDA",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "Q"
                        },
                        {
                            "codigo": "05",
                            "descripcion": "AFIL. NO RECONOCIDA",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "B"
                        },
                        {
                            "codigo": "06",
                            "descripcion": "PERDIDA",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "E"
                        },
                        {
                            "codigo": "07",
                            "descripcion": "DETERIORO",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "G"
                        },
                        {
                            "codigo": "08",
                            "descripcion": "RETENIDA ATM",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "N"
                        },
                        {
                            "codigo": "09",
                            "descripcion": "FALLECIMIENTO",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "L"
                        },
                        {
                            "codigo": "10",
                            "descripcion": "TEMPORAL TARJETA BO",
                            "codigoEstadoTarjeta": "02",
                            "codigoExterno": "K"
                        },
                        {
                            "codigo": "11",
                            "descripcion": "ALERTA PREVENCIÓN",
                            "codigoEstadoTarjeta": "02",
                            "codigoExterno": "T"
                        },
                        {
                            "codigo": "12",
                            "descripcion": "DECISIÓN DE CLIENTE",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "I"
                        },
                        {
                            "codigo": "13",
                            "descripcion": "DECISIÓN DE LA FOH",
                            "codigoEstadoTarjeta": "03",
                            "codigoExterno": "Y"
                        },
                        {
                            "codigo": "99",
                            "descripcion": "INACTIVA",
                            "codigoEstadoTarjeta": "00",
                            "codigoExterno": "R"
                        }
                    ]
                }
            },
            {
                "codigo": 0,
                "mensaje": "OK",
                "data": {
                    "listaEstadoTarjeta": [
                        {
                            "codigo": "00",
                            "descripcion": "INACTIVA"
                        },
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
                            "descripcion": "BLOQUEO TEMPORAL APP"
                        }
                    ]
                }
            }
        ]
        this.motivosBloqueoTarjeta = resp[0]['data']['listaMotivoBloqueoTarjeta'];
        if (role == this.roles.FRAUDE) {
            this.motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter((e: any) =>
                e.descripcion != 'DETERIORO' &&
                e.descripcion != 'RETENIDA ATM' &&
                e.descripcion != 'FALLECIMIENTO' &&
                e.descripcion != 'TEMPORAL TARJETA BO' &&
                e.descripcion != 'INACTIVA'
            );
        }
        if (role == this.roles.ATENCION_CLIENTE || role == this.roles.ATENCION_CLIENTE_TD) {
            this.motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter((e: any) =>
                e.descripcion != 'ACTIVA' &&
                e.descripcion != 'INACTIVA' &&
                e.descripcion != 'DECISIÓN DE LA FOH' &&
                e.descripcion != 'FRAUDE' &&
                e.descripcion != 'FALLECIMIENTO' &&
                e.descripcion != 'TEMPORAL TARJETA BO' &&
                e.descripcion != 'ALERTA PREVENCIÓN'
            );
        }
        this.estadoTarjeta = resp[1]['data']['listaEstadoTarjeta'];
        this.estadoTarjeta = this.estadoTarjeta.map((x: any) => {
            const motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter(
                (y: any) => x.codigo === y.codigoEstadoTarjeta
            );

            return {
                ...x,
                motivosBloqueoTarjeta: motivosBloqueoTarjeta
            }
        }).filter((x: any) => x.motivosBloqueoTarjeta.length > 0);
        this.motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter((e: any) => e.codigo != this.tarjeta.codigoMotivoEstado);
        // this.commonService.getMultipleCombosPromiseCuenta(['motivo-bloqueo-tarjeta', 'estado-tarjeta'])
        //     .then((resp: any) => {
        //         this.motivosBloqueoTarjeta = resp[0]['data']['listaMotivoBloqueoTarjeta'];

        //         if (role == this.roles.FRAUDE) {
        //             this.motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter((e: any) =>
        //                 e.descripcion != 'DETERIORO' &&
        //                 e.descripcion != 'RETENIDA ATM' &&
        //                 e.descripcion != 'FALLECIMIENTO' &&
        //                 e.descripcion != 'TEMPORAL TARJETA BO' &&
        //                 e.descripcion != 'INACTIVA'
        //             );
        //         }

        //         if (role == this.roles.ATENCION_CLIENTE || role == this.roles.ATENCION_CLIENTE_TD) {
        //             this.motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter((e: any) =>
        //                 e.descripcion != 'ACTIVA' &&
        //                 e.descripcion != 'INACTIVA' &&
        //                 e.descripcion != 'DECISIÓN DE LA FOH' &&
        //                 e.descripcion != 'FRAUDE' &&
        //                 e.descripcion != 'FALLECIMIENTO' &&
        //                 e.descripcion != 'TEMPORAL TARJETA BO' &&
        //                 e.descripcion != 'ALERTA PREVENCIÓN'
        //             );
        //         }

        //         this.estadoTarjeta = resp[1]['data']['listaEstadoTarjeta'];
        //         this.estadoTarjeta = this.estadoTarjeta.map((x: any) => {
        //             const motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter(
        //                 (y: any) => x.codigo === y.codigoEstadoTarjeta
        //             );

        //             return {
        //                 ...x,
        //                 motivosBloqueoTarjeta: motivosBloqueoTarjeta
        //             }
        //         }).filter((x: any) => x.motivosBloqueoTarjeta.length > 0);

        //         this.motivosBloqueoTarjeta = this.motivosBloqueoTarjeta.filter((e: any) => e.codigo != this.tarjeta.codigoMotivoEstado);
        //     }).catch((_error: any) => {
        //         this.toastr.add({ severity: 'error', summary: 'Error getParametros', detail: 'Error en el servicio de obtener parámetros' });
        //     })
    }

    registrarBloqueo() {
        this.disableButton = true;
        const formValue = this.formBloqueo.value;
        const usuario = JSON.parse(localStorage.getItem('userABA')!);
        let estado = this.motivosBloqueoTarjeta.find((e: any) => e.codigo == formValue.tipoBloqueo.codigo);
        estado = estado ? estado.codigoEstadoTarjeta : null

        const object = {
            archivoSustento: formValue.archivosAdjuntos,
            nombreSustento: formValue.nombreArchivo,
            descripcion: formValue.descripcion,
            parametros: {
                codigoMotivo: formValue.tipoBloqueo.codigo,
                estado: estado,
                token: this.tarjeta.token,
                uIdCliente: this.uidCliente,
                uIdCuenta: this.uidCuenta
            },
            usuario: usuario.email
        }

        console.log('BLOQUEO DE TARJETA...', object);

        this.registrarBloqueoTarjetaService.postBloqueoTarjeta(object)
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
            debugger;
            this.formBloqueo.get('archivosAdjuntos')!.setValue(filereader.result);
            this.formBloqueo.get('nombreArchivo')!.setValue(this.files[0].name);
            this.toastr.add({ severity: 'success', summary: 'Carga exitosa', detail: `${this.files.length} archivos listos para enviar` });
            //this.toastr.success(`${this.files.length} archivos listos para enviar`, 'Carga exitosa');
            this.loadingFile = false;
        };
        filereader.onerror = () => {
            debugger;
            this.toastr.add({ severity: 'error', summary: 'Carga fallida', detail: `No se pudo cargar los archivos` });
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

    filterElement(event: any, data: any) {
        this.filteredElement = [];
        const query = event.query;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.descripcion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(element);
            }
        }
        
    }
}
