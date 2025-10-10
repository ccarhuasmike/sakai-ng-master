import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { CALENDAR_DETAIL } from "app/main/utils/constants/aba.constants";
import { ToastrService } from "ngx-toastr";
import { FeriadoService } from "../../feriado.service";

@Component({
    selector: 'app-add-feriado',
    templateUrl: './add-feriado.component.html',
    styleUrls: ['./add-feriado.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class AddFeriadoComponent implements OnInit {

    form: FormGroup;
    es = CALENDAR_DETAIL;
    comboTipoFecha: any[] = [];
    labelHeader: String = "";
    tipoFecha: any[] = [
        { tipoFecha: 0, descripcionTipoFecha: 'FERIADO' }, { tipoFecha: 1, descripcionTipoFecha: 'FERIADO - PUBLICO' }
    ]
    usuario:any;

    constructor(
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<AddFeriadoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any = [],
        private datePipe: DatePipe,
        private feriadoService : FeriadoService,
    ) {
        const fechaFeriado = data?.isEdit ? new Date(data?.datosFeriado?.fecha) : null;
        this.form = new FormGroup({
            descripcion: new FormControl(null || data?.datosFeriado?.descripcion,[Validators.required]),
            tipoFecha: new FormControl(null || (data) ? data?.datosFeriado?.tipoFecha.toString() : '',[Validators.required]),
            fecha: new FormControl(fechaFeriado,[Validators.required]),
            isRepeat: new FormControl(0 || data?.datosFeriado?.indRepetir)
        });
        console.log("datos feriado: ", data);
        this.labelHeader = (data.isEdit) ? "Editar feriado" : "Registrar nuevo feriado";

    }

    ngOnInit(): void {
        // this.getComboTipoFecha();
        this.usuario = JSON.parse(localStorage.getItem('userABA'));
    }

    getComboTipoFecha() {
        //Llamada servicio
        this.comboTipoFecha = [
            { tipoFecha: 1, descripcionTipoFecha: 'FERIADO' },
            { tipoFecha: 2, descripcionTipoFecha: 'FERIADO - PUBLICO' }
        ];
    }

    addFeriado() {
        console.log("form: ", this.form);
        const repetir = this.form.get('isRepeat').value ? 1:0
        const data = {
            codigo: "string",
            descripcion: this.form.get('descripcion').value,
            fecha: this.form.get('fecha').value,
            indRepetir: repetir,
            tipoFecha: Number (this.form.get('tipoFecha').value),
            usuarioRegistro: this.usuario.email
        }
        this.feriadoService.postRegistrarFeriado(data).subscribe((resp:any)=>{
            if (resp['codigo']==0) {
                this.dialogRef.close({
                    event:'close',data:resp,accion:'create'
                })
            } else {
                this.toastr.error(`No se pudo registrar el feriado`, 'Registro fallido');
            }
        }, (_error)=>{
            this.toastr.error(`No se pudo registrar el feriado`, 'Registro fallido');
        })

    }

    updateFeriado() {
        console.log(this.form)
        const fecha= this.datePipe.transform(this.form.get('fecha').value,'yyyy-MM-dd')
        const repetir = this.form.get('isRepeat').value ? 1:0
        const data = {
            codigo: "string",
            descripcion:this.form.get('descripcion').value,
            fecha: fecha,
            idCalendario: this.data.datosFeriado.idCalendario,
            indRepetir: repetir,
            tipoFecha: Number (this.form.get('tipoFecha').value),
            usuarioActualizacion: this.usuario.email
        };
        this.feriadoService.putActualizarFeriado(data).subscribe((resp:any)=>{
            if (resp['codigo']==0) {
                this.dialogRef.close({
                    event:'close',data:resp,accion:'update'
                })
            } else {
                this.toastr.error(`No se pudo actualizar el feriado`, 'Actualizacion fallida');
            }
        }, (_error)=>{
            this.toastr.error(`No se pudo actualizar el feriado`, 'Actualizacion fallida');
        })
    }
}
