import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ParametroTipoCambioService } from "../parametro-tipo-cambio.service";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MessageService, ConfirmationService } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { DialogService } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
@Component({
    selector: 'app-parametro-tipo-cambio-edit',
    templateUrl: './parametro-tipo-cambio-edit.component.html',
    styleUrls: ['./parametro-tipo-cambio-edit.component.scss'],
    standalone: true,
    imports: [InputGroupAddonModule, InputGroupModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService, DialogService, ConfirmationService],
})
export class ParametroTipoCambioEditComponent implements OnInit {

    codParametro: any = null;
    parametro: any = null;
    groups: any[] = [];
    filteredElement: any[] = [];
    formEdit!: FormGroup;

    constructor(
        private parametroTipoCambioService: ParametroTipoCambioService,
        private toastr: MessageService,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
    ) {
        this.codParametro = this.activatedRoute.snapshot.paramMap.get('id');
        this.createForm();
        this.getParametro();
    }

    ngOnInit(): void {
        this.getGrupoParametros();
    }

    createForm() {
        this.formEdit = this.fb.group({
            grupoParametro: new FormControl({ value: null, disabled: true }, [Validators.required]),
            desElemento: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
            valNumEntero: new FormControl(null, [Validators.pattern(/^\d+([,]\d+)?$/)]),
            valNumDecimal: new FormControl(null, [Validators.pattern(/^\d{0,2}(\.\d{1,2})?$/)]),
            valCadCorto: new FormControl(null, [Validators.maxLength(10)]),
            valCadLargo: new FormControl(null, [Validators.maxLength(50)]),
            estParametro: new FormControl(null, [Validators.required])
        });
    }

    getParametro() {
        this.parametroTipoCambioService.getParametro(this.codParametro).subscribe((resp: any) => {
            if (resp['codigo'] == 0) {
                this.parametro = resp['data'];
                this.formEdit.setValue({
                    grupoParametro: {
                        codTabla: this.parametro.codTabla,
                        nomTabla: this.parametro.nomTabla,
                    },
                    desElemento: this.parametro.desElemento,
                    valNumEntero: this.parametro.valNumEntero,
                    valNumDecimal: this.parametro.valNumDecimal,
                    valCadCorto: this.parametro.valCadCorto,
                    valCadLargo: this.parametro.valCadLargo,
                    estParametro: 1
                })
            } else {
                this.toastr.add({ severity: 'error', summary: 'Error getParametro', detail: resp['mensaje'] });
                //this.toastr.error(resp['mensaje'], 'Error getParametro');
            }
        }, (_error) => {
            this.toastr.add({ severity: 'error', summary: 'Error getParametro', detail: 'Error en el servicio de obtener parámetros' });
            //this.toastr.error('Error en el servicio de obtener parámetros', 'Error getParametro');
        })
    }

    getGrupoParametros() {
        this.parametroTipoCambioService.getGrupoParametros().subscribe((resp: any) => {
            if (resp['codigo'] == 0) {
                this.groups = resp['data'].map((item: any) => {
                    return {
                        codTabla: item['codTabla'],
                        nomTabla: item['nomTabla']
                    }
                });
            } else if (resp['codigo'] == -1) {
                this.toastr.add({ severity: 'error', summary: 'Error getGrupoParametros', detail: resp['mensaje'] });
                //this.toastr.error(resp['mensaje'], 'Error getGrupoParametros');
            }
        }, (_error) => {
              this.toastr.add({ severity: 'error', summary: 'Error getGrupoParametros', detail: 'Error en el servicio de obtener grupos de parámetros' });
            //this.toastr.error('Error en el servicio de obtener grupos de parámetros', 'Error getGrupoParametros');
        })
    }

    editParametro() {
        const formValue = this.formEdit.value;

        if (!formValue.valCadCorto &&
            !formValue.valCadLargo &&
            !formValue.valNumDecimal &&
            !formValue.valNumEntero
        ) {
            this.toastr.add({ severity: 'warn', summary: 'Valor requerido', detail: 'Debe registrar al menos un valor para el parámetro' });
            //this.toastr.warning('Debe registrar al menos un valor para el parámetro', 'Valor requerido');
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('userABA')!);

        const object = {
            codParametro: this.parametro.codParametro,
            codTabla: this.parametro.codTabla,
            nomTabla: this.parametro.nomTabla,
            codTablaElemento: this.parametro.codTablaElemento,
            desElemento: formValue.desElemento,
            valCadCorto: formValue.valCadCorto,
            valCadLargo: formValue.valCadLargo,
            valNumDecimal: Number(formValue.valNumDecimal),
            valNumEntero: Number(formValue.valNumEntero),
            estParametro: formValue.estParametro,
            usuarioModificacion: usuario.email
        };

        this.parametroTipoCambioService.putParametro(object).subscribe(
            (resp: any) => {
                if (resp['codigo'] == 0) {
                    this.toastr.add({ severity: 'success', summary: 'Registro actualizado', detail: 'Parámetro actualizado correctamente' });
                    //this.toastr.success('Parámetro actualizado correctamente', 'Registro actualizado');
                } else {
                    this.toastr.add({ severity: 'error', summary: 'Error editParametro', detail: 'Error en el servicio de actualizar parámetro' });
                    //this.toastr.error('Error en el servicio de actualizar parámetro', 'Error editParametro');
                }
            }
        )
    }

    filterElement(event: any, data: any) {
        this.filteredElement = [];
        const query = event.query;
        for (let value of data) {
            if (value.nomTabla.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                this.filteredElement.push(value);
            }
        }
    }
}