import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
// import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// import { fuseAnimations } from "@fuse/animations";
// import { ToastrService } from "ngx-toastr";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";

@Component({
    selector: 'app-registrar-tipo-cambio-grupo',
    templateUrl: './registrar-grupo-tipo-cambio.comonent.html',
    styleUrls: ['./registrar-grupo-tipo-cambio.comonent.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MessageModule, ToastModule, ButtonModule, ReactiveFormsModule, CommonModule, InputTextModule],
    //animations: fuseAnimations,
    providers: [MessageService],
    // animations: fuseAnimations,
    // encapsulation: ViewEncapsulation.None
})
export class RegistrarGrupoTipoCambioComponent implements OnInit {

    form: FormGroup;
    groups: any[];

    constructor(
        private toastr: MessageService,
        private fb: FormBuilder,
        public dialogRef: DynamicDialogRef,
        public config: DynamicDialogConfig
        // private toastr: ToastrService,
        // public dialogRef: MatDialogRef<RegistrarGrupoTipoCambioComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any = []
    ) {
        this.groups = config.data;
        this.form = new FormGroup({
            codTabla: new FormControl(null),
            nomTabla: new FormControl(null, [Validators.required, Validators.maxLength(50)])
        });
    }
    closeGrupo() {
        this.dialogRef.close({
            event: 'cerrar'
        });
    }
    ngOnInit(): void {
    }

    addGrupo() {
        const nomTabla = this.groups.find((e: any) => e.nomTabla == this.form.get('nomTabla')!.value);
        if (nomTabla) {
            this.toastr.add({ severity: 'error', summary: 'Error addGrupo', detail: 'Ya existe un grupo de parámetro con este nombre' });
            //this.toastr.error('Ya existe un grupo de parámetro con este nombre', 'Error addGrupo');
            return;
        }

        this.dialogRef.close({
            event: 'close', data: this.form.value
        });
    }

}