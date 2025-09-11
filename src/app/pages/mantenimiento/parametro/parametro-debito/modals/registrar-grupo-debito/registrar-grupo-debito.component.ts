import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-registrar-grupo-debito',
  templateUrl: './registrar-grupo-debito.component.html',
  styleUrls: ['./registrar-grupo-debito.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [MessageModule, ToastModule, ButtonModule, ReactiveFormsModule, CommonModule, InputTextModule],
  //animations: fuseAnimations,
  providers: [MessageService],
})
export class RegistrarGrupoDebitoComponent implements OnInit {
  form: FormGroup;
  groups: any[];
  constructor(

    private toastr: MessageService,
    private fb: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.groups = config.data;
    this.form = this.fb.group({
      codTabla: new FormControl(null),
      nomTabla: new FormControl(null, [Validators.required, Validators.maxLength(50)])
    });
  }

  ngOnInit() {
    // This is a ngOnInit
  }
  closeGrupo(){
    this.dialogRef.close({
      event: 'cerrar'
    });
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
