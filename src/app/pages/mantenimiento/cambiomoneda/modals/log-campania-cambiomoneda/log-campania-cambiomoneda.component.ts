import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { CAMPAIGN_TYPES, CAMPAIGN_VALIDATION_TYPES } from '@/layout/Utils/constants/aba.constants';
import { CommonService } from '@/pages/service/commonService';
import { CambioMonedaService } from '../../cambiomoneda.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-log-campania-cambiomoneda',
  templateUrl: './log-campania-cambiomoneda.component.html',
  styleUrls: ['./log-campania-cambiomoneda.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [TableModule,InputGroupAddonModule, InputGroupModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
  providers: [MessageService, DialogService, ConfirmationService],
})
export class LogCampaniaCambiomonedaComponent implements OnInit {

  rows = 10;
  rowsPerPageOptions: any[] = [];
  estadosTipoCambio: any[] = [];
  datosLogs: any[] = [];
  loadingLogs: boolean = false;
  idCambioMonedaCampana: string = '';

  constructor(
    public datepipe: DatePipe,
    public currencyPipe: CurrencyPipe,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private toastr: MessageService,
    private commonService: CommonService,
    private cambioMonedaService: CambioMonedaService
  ) {
    this.idCambioMonedaCampana = config.data.idCambioMonedaCampana;
  }

  ngOnInit(): void {
    this.getEstadosTipoCambio();
    this.getLogs();
  }

  getEstadosTipoCambio() {
    this.commonService.getEstadosTipoCambio().subscribe((resp: any) => {
      this.estadosTipoCambio = resp['data'];
    }, (_error: any) => {
      this.toastr.add({ severity: 'error', summary: 'Error getEstadosTipoCambio', detail: 'Error en el servicio de obtener estados tipo de cambio' });
    })
  }
  close() {
    this.dialogRef.close({
      event: 'cerrar'
    });
  }
  getLogs() {
    this.loadingLogs = true;

    this.cambioMonedaService.getLogsCampanias(this.idCambioMonedaCampana).subscribe((resp: any) => {
      this.loadingLogs = false;

      if (resp['codigo'] == 0) {
        this.datosLogs = resp['data'].map((item: any) => {

          const tipoLogDesc = item.tipoLog === '1' ? 'Registro' : 'Actualización';
          const tipoCampanaDesc = CAMPAIGN_TYPES.find((e: any) => e.id == item.tipoCampana)?.nombre;
          const tipoValidacionDesc = CAMPAIGN_VALIDATION_TYPES.find((e: any) => e.id == item.tipoValidacion)?.nombre;
          const estadoDesc = this.estadosTipoCambio.find((e: any) => e.idCambioMonedaEstado == item.idCambioMonedaEstado)?.descripcionCorta;

          const tipoCambioCompraOh = item.tipoCambioCompraOh || 0;
          const tipoCambioCompraOhFormat = this.currencyPipe.transform(tipoCambioCompraOh, ' ', 'symbol', '1.2-2');

          const tipoCambioVentaOh = item.tipoCambioVentaOh || 0;
          const tipoCambioVentaOhFormat = this.currencyPipe.transform(tipoCambioVentaOh, ' ', 'symbol', '1.2-2');

          const tasaCompraOh = item.tasaCompraOh || 0;
          const tasaCompraOhFormat = this.currencyPipe.transform(tasaCompraOh, ' ', 'symbol', '1.2-2');

          const tasaVentaOh = item.tasaVentaOh || 0;
          const tasaVentaOhFormat = this.currencyPipe.transform(tasaVentaOh, ' ', 'symbol', '1.2-2');

          const montoValidacion = item.montoValidacion || 0;
          const montoValidacionFormat = this.currencyPipe.transform(montoValidacion, ' ', 'symbol', '1.2-2');

          return {
            ...item,
            estadoDesc: estadoDesc,
            tipoLogDesc: tipoLogDesc,
            tipoCampanaDesc: tipoCampanaDesc,
            tipoValidacionDesc: tipoValidacionDesc,
            tipoCambioCompraOhFormat: tipoCambioCompraOhFormat,
            tipoCambioVentaOhFormat: tipoCambioVentaOhFormat,
            tasaCompraOhFormat: tasaCompraOhFormat,
            tasaVentaOhFormat: tasaVentaOhFormat,
            montoValidacionFormat: montoValidacionFormat,
            fechaInicioFormat: this.datepipe.transform(item.fechaInicio, 'dd/MM/yyyy HH:mm:ss'),
            fechaFinFormat: this.datepipe.transform(item.fechaFin, 'dd/MM/yyyy HH:mm:ss'),
            fechaRegistroFormat: this.datepipe.transform(item.fechaRegistro, 'dd/MM/yyyy HH:mm:ss'),
            fechaHoraAprobacionFormat: this.datepipe.transform(item.fechaHoraAprobacion, 'dd/MM/yyyy HH:mm:ss'),
            fechaHoraVencimientoFormat: this.datepipe.transform(item.fechaHoraVencimiento, 'dd/MM/yyyy HH:mm:ss')
          }
        });

        this.rowsPerPageOptions = this.commonService.getRowsPerPageOptions(this.rows, this.datosLogs.length);
      } else {
        this.toastr.add({ severity: 'error', summary: 'Error getLogs', detail: resp['mensaje'] });
      }
    }, (_error: any) => {
      this.loadingLogs = false;
      this.toastr.add({ severity: 'error', summary: 'Error getLogs', detail: 'Error en el servicio de obtener logs de campañas' });
    })
  }
}