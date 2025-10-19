import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AddBancoComponent } from "./modals/add-banco/add-banco.component";
import { BancoService } from "./banco.service";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DatePickerModule } from "primeng/datepicker";
import { DividerModule } from "primeng/divider";
import { DialogService } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";

@Component({
    selector: 'app-banco',
    templateUrl: './banco.component.html',
    styleUrls: ['./banco.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [ConfirmDialogModule, TooltipModule, TabsModule, MenuModule, DividerModule, InputNumberModule, DatePickerModule, TableModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [MessageService, DialogService, ConfirmationService],
})
export class BancoComponent implements OnInit {

    data: any[] = [];
    rows = 20;
    rowsPerPageOptions = [5, 10, 20];
    loading: boolean = false;

    constructor(
        private dialog: DialogService,
        private toastr: MessageService,
        private bancoService: BancoService,
    ) { }


    ngOnInit(): void {
        this.getBancos();
    }


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
                    this.openDialogAdd(rowData)
                    menu?.hide();  // cerrar directamente
                }, 5);
            }
        });
        // items.push({
        //     label: 'Eliminar',
        //     icon: 'pi pi-ban',
        //     command: () => this.deleteParametro(rowData)
        // });

        return items;
    }

    getBancos() {
        this.loading = true
        this.data = [];
        // this.data = [
        //     { idBanco: 1, codigo: 1, nombre: 'INTERBANK' },
        //     { idBanco: 2, codigo: 2, nombre: 'BCP' }
        // ];


        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idBanco": 2,
                    "codigo": "01",
                    "nombre": "Bank DevU",
                    "usuarioRegistro": "hrcp.eduardo.gonzales@somosoh.pe",
                    "fechaRegistro": "2024-02-27T17:30:46.754",
                    "fechaActualizacion": "2024-03-05T09:37:51.133"
                },
                {
                    "idBanco": 1,
                    "codigo": "222",
                    "nombre": "bank updated2",
                    "usuarioRegistro": "hrcp.eduardo.gonzales@somosoh.pe",
                    "fechaRegistro": "2024-02-27T16:11:49.084",
                    "fechaActualizacion": "2024-03-06T11:42:16.948"
                },
                {
                    "idBanco": 4,
                    "codigo": "44",
                    "nombre": "JCP",
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-06T11:42:35.506",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 5,
                    "codigo": "02",
                    "nombre": "BCP",
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-19T20:11:15.038",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 6,
                    "codigo": "33",
                    "nombre": "Banco prueba",
                    "usuarioRegistro": "Edgar.Sanchez@somosoh.pe",
                    "fechaRegistro": "2024-03-25T16:44:46.069",
                    "fechaActualizacion": "2024-03-25T16:44:57.505"
                },
                {
                    "idBanco": 7,
                    "codigo": "100",
                    "nombre": "BANCO PRUEBA 2",
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:31:56.905",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 8,
                    "codigo": "035",
                    "nombre": "BANCO PICHINCHA",
                    "usuarioRegistro": "HRCP.Yudith.Hinostroza@somosoh.pe",
                    "fechaRegistro": "2025-04-24T16:41:44.563703",
                    "fechaActualizacion": null
                },
                {
                    "idBanco": 3,
                    "codigo": "03",
                    "nombre": "INTERBANK-2",
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-02-27T18:26:53.962",
                    "fechaActualizacion": "2025-09-10T21:37:00.89217"
                }
            ]
        }
        this.loading = false;
        if (resp['codigo'] == 0) {
            this.data = resp.data;
        } else {
            this.toastr.add({ severity: 'error', summary: 'Error getBancos', detail: resp['mensaje'] });
        }

        // this.bancoService.getObtenerBancos().subscribe((resp: any) => {
        //     this.loading = false;
        //     if (resp['codigo'] == 0) {
        //         this.data = resp.data;
        //     } else {
        //         this.toastr.add({ severity: 'error', summary: 'Error getBancos', detail: resp['mensaje'] });                
        //     }
        // }, (_error) => {
        //     this.loading = false;
        //     this.toastr.add({ severity: 'error', summary: 'Error getBancos', detail: 'Error en el servicio de obtener bancos' });            
        // })
    }

    openDialogAdd(data: any = null) {
        const dialogRef = this.dialog.open(AddBancoComponent, {
            header: 'Registrar parámetro de débito',
            width: '50vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            data: data,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });
        dialogRef.onClose.subscribe((res: any) => {
            if (res !== undefined && res !== "") {
                if (res.data['codigo'] == 0 && res.accion == 'create') {
                    this.toastr.add({ severity: 'success', summary: '', detail: 'Banco registrado' });
                    this.getBancos();
                } else if (res.data['codigo'] == 0 && res.accion == 'update') {
                    this.toastr.add({ severity: 'success', summary: '', detail: 'Banco actualizado' });
                    this.getBancos();
                } else {
                    this.toastr.add({ severity: 'error', summary: 'Error openDialogAdd', detail: 'Error al registrar/actualizar el banco' });
                }
            }
        });
    }
}