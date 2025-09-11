import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametroDebitoService } from '../parametro-debito.service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DialogService } from 'primeng/dynamicdialog';
import { RegistrarGrupoDebitoComponent } from '../modals/registrar-grupo-debito/registrar-grupo-debito.component';
@Component({
  selector: 'app-parametro-debito-add',
  templateUrl: './parametro-debito-add.component.html',
  styleUrls: ['./parametro-debito-add.component.scss'],
  standalone: true,
  imports: [InputGroupAddonModule, InputGroupModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
  providers: [MessageService, DialogService, ConfirmationService],
})
export class ParametroDebitoAddComponent implements OnInit {

  groups: any[] = [];
  filteredElement: any[] = [];
  formAdd!: FormGroup;

  constructor(
    private parametroDebitoService: ParametroDebitoService,
    private toastr: MessageService,
    private dialog: DialogService,
    private fb: FormBuilder,
    private router: Router,

  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getGrupoParametros();
  }

  createForm() {
    this.formAdd = this.fb.group({
      grupoParametro: new FormControl(null, [Validators.required]),
      desElemento: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      valNumEntero: new FormControl(null, [Validators.pattern(/^\d+([,]\d+)?$/)]),
      valNumDecimal: new FormControl(null, [Validators.pattern(/^\d{0,2}(\.\d{1,2})?$/)]),
      valCadCorto: new FormControl(null, [Validators.maxLength(10)]),
      valCadLargo: new FormControl(null, [Validators.maxLength(50)])
    });
  }

  getGrupoParametros() {
    this.parametroDebitoService.getGrupoParametros().subscribe((resp: any) => {
      if (resp['codigo'] == 0) {
        this.groups = resp['data'].map((item: any) => {
          return {
            codTabla: item['codTabla'],
            nomTabla: item['nomTabla']
          }
        });
      } else if (resp['codigo'] == -1) {
        this.toastr.add({ severity: 'error', summary: 'Error getGrupoParametros', detail: resp['mensaje'] });
      }
    }, (_error) => {
      this.toastr.add({ severity: 'error', summary: 'Error getGrupoParametros', detail: 'Error en el servicio de obtener grupos de parámetros' });
    })
  }

  addParametro() {
    const formValue = this.formAdd.value;

    if (
      !formValue.valCadCorto &&
      !formValue.valCadLargo &&
      !formValue.valNumDecimal &&
      !formValue.valNumEntero
    ) {
      this.toastr.add({ severity: 'warn', summary: 'Valor requerido', detail: 'Debe registrar al menos un valor para el parámetro' });
      return;
    }
    const usuario = JSON.parse(localStorage.getItem('userABA')!);
    const object = {
      codTabla: formValue.grupoParametro.codTabla,
      nomTabla: formValue.grupoParametro.nomTabla,
      desElemento: formValue.desElemento,
      valCadCorto: formValue.valCadCorto,
      valCadLargo: formValue.valCadLargo,
      valNumDecimal: Number(formValue.valNumDecimal),
      valNumEntero: Number(formValue.valNumEntero),
      estParametro: 1,
      usuarioCreacion: usuario.email
    };

    this.parametroDebitoService.postParametro(object).subscribe(
      (resp: any) => {
        if (resp['codigo'] == 0) {
          this.toastr.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Parámetro creado correctamente' });
          this.router.navigate(['/apps/parametro/debito']);
        } else {
          this.toastr.add({ severity: 'error', summary: 'Error addParametro', detail: 'Error en el servicio de registro de parámetro' });
        }
      }
    )
  }
  //Registrar nuevo grupo
  openDialogAgregarGrupo() {
    const dialogRef = this.dialog.open(RegistrarGrupoDebitoComponent, {
      header: 'Registrar nuevo grupo',
      width: '25vw',
      modal: true,
      styleClass: 'header-modal',
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: this.groups
    });
    dialogRef.onClose.subscribe((res: any) => {
      if (res !== undefined) {
        this.groups.push(res.data);
        this.formAdd.get('grupoParametro')!.patchValue(res.data);
      }
    });
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
