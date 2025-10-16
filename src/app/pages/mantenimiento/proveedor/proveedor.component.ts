import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProveedorService } from "./proveedor.service";
import { EditCuentasProveedorComponent } from "./modals/edit-cuentas-proveedor/edit-cuentas-proveedor.component";
import { TYPE_PARTNER } from "@/layout/Utils/constants/aba.constants";
import { CommonModule, DatePipe } from "@angular/common";
import { MessageService, ConfirmationService, MenuItem } from "primeng/api";
import { AutoCompleteModule } from "primeng/autocomplete";
import { Breadcrumb } from "primeng/breadcrumb";
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
import { CommonService } from "@/pages/service/commonService";
import { Router } from "@angular/router";
import { SelectModule } from "primeng/select";
import { InputGroupModule } from "primeng/inputgroup";
import { AddProveedorComponent } from "./add-proveedor/add-proveedor.component";

@Component({
    selector: 'app-proveedor',
    templateUrl: './proveedor.component.html',
    styleUrls: ['./proveedor.component.scss'],
    imports: [InputGroupModule, SelectModule, Breadcrumb, ConfirmDialogModule, TooltipModule, TabsModule, MenuModule, DividerModule, InputNumberModule, DatePickerModule, TableModule, MessageModule, ToastModule, ButtonModule, FileUploadModule, ReactiveFormsModule, CommonModule, InputTextModule, AutoCompleteModule],
    providers: [DatePipe, MessageService, DialogService, ConfirmationService],
    encapsulation: ViewEncapsulation.None
})
export class ProveedorComponent implements OnInit {
    items: MenuItem[] = [{ label: 'Consulta', routerLink: '/uikit/cuenta' }, { label: 'Detalle Cuenta' }];
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
    mostrarFiltro = false;
    formBusqueda!: FormGroup;
    tipoDocumento: any = '';
    nroDocumento: any = '';
    nroCaracter: number = 0;
    documentos: any[] = [];
    proveedores: any[] = [];
    tipoProveedor: any[] = TYPE_PARTNER;

    constructor(
        //private fuseSidebarService: FuseSidebarService,
        private fb: FormBuilder,
        private commonService: CommonService,
        private proveedorService: ProveedorService,
        private toastr: MessageService,
        private dialog: DialogService,
        private router: Router
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.getCombos();
        this.searchProveedor();
    }
   
    getCombos() {
        this.commonService.getMultipleCombosPromiseCliente(['documentos/tipos'])
            .then((resp: any) => {
                this.documentos = resp[0]['data']['content'].map((item: any) => {
                    return {
                        id: item['codigo'],
                        descripcion: item['nombre']
                    }
                });
            })
    }

    createForm() {
        this.formBusqueda = this.fb.group({
            tipoDocumento: new FormControl(this.tipoDocumento, [Validators.required]),
            nroDocumento: new FormControl(this.nroDocumento, [Validators.required])
        });
    }

    changeModelTipoDocumento(event: any) {
        if (event == 1) {
            this.nroCaracter = 8;
            this.formBusqueda.get('nroDocumento')!.setValidators([Validators.required, Validators.minLength(this.nroCaracter), Validators.maxLength(this.nroCaracter)])
        } else if (event == 2) {
            this.nroCaracter = 9;
            this.formBusqueda.get('nroDocumento')!.setValidators([Validators.required, Validators.minLength(this.nroCaracter), Validators.maxLength(this.nroCaracter)])
        } else if (event == 3) {
            this.nroCaracter = 11;
            this.formBusqueda.get('nroDocumento')!.setValidators([Validators.required, Validators.minLength(this.nroCaracter), Validators.maxLength(this.nroCaracter)])
        } else {
            this.nroCaracter = 0;
            this.formBusqueda.get('nroDocumento')!.clearValidators();
        }
        this.formBusqueda.get('nroDocumento')!.updateValueAndValidity();
    }

    searchProveedor() {
        const tipoDoc = this.formBusqueda.get('tipoDocumento')!.value;
        const numDoc = this.formBusqueda.get('nroDocumento')!.value;
        var resp = {
            "codigo": 0,
            "mensaje": "OK",
            "data": [
                {
                    "idPartner": 6,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "01",
                    "numeroDocIdentidad": "70499320",
                    "primerNombre": "Eduardo",
                    "segundoNombre": "Enrique",
                    "apellidoPaterno": "Gonzales",
                    "apellidoMaterno": "Velasquez",
                    "razonSocial": null,
                    "celular": "977115938",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "Av. Brasil 1233",
                    "dptUbigeo": null,
                    "prvUbigeo": null,
                    "dstUbigeo": null,
                    "nombreContacto": "Eduardo",
                    "correoContacto": "eduasd@erq.com",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-04-01T13:26:04.551",
                    "usuarioActualizacion": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaActualizacion": "2024-04-01T14:29:53.361",
                    "idc": null
                },
                {
                    "idPartner": 7,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "01",
                    "numeroDocIdentidad": "49006528",
                    "primerNombre": "WILMER",
                    "segundoNombre": "ANTONIO",
                    "apellidoPaterno": "BELLO",
                    "apellidoMaterno": "GOZAR",
                    "razonSocial": null,
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "AV. AVIACIÓN 2405",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "WILME ANTONIO BELLO GOZAR",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:13:17.56",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": null,
                    "idc": null
                },
                {
                    "idPartner": 9,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "02",
                    "numeroDocIdentidad": "490065280",
                    "primerNombre": "WILMER",
                    "segundoNombre": "ANTONIO",
                    "apellidoPaterno": "BELLO",
                    "apellidoMaterno": "GOZAR",
                    "razonSocial": null,
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "AV. AVIACIÓN 2405",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "WILMER ANTONIO BELLO GOZAR",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:55:15.608",
                    "usuarioActualizacion": null,
                    "fechaActualizacion": null,
                    "idc": null
                },
                {
                    "idPartner": 4,
                    "tipoPartner": 1,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20490065281",
                    "primerNombre": "WILMER",
                    "segundoNombre": "ANTONIO",
                    "apellidoPaterno": "BELLO",
                    "apellidoMaterno": "GOZAR",
                    "razonSocial": "OPERACIONES PASIVAS",
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "A.H. LIBERACIÓN MZ A LOTE 7",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "32",
                    "nombreContacto": "WILMER ANTONIO BELLO GOZAR",
                    "correoContacto": "SOLOPARATRABAJOS97@GMAIL.COM",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-03-26T16:12:50.806",
                    "usuarioActualizacion": "Wilmer.Bello@somosoh.pe",
                    "fechaActualizacion": "2024-04-04T17:55:59.24",
                    "idc": null
                },
                {
                    "idPartner": 1,
                    "tipoPartner": 2,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20605636935",
                    "primerNombre": null,
                    "segundoNombre": null,
                    "apellidoPaterno": null,
                    "apellidoMaterno": null,
                    "razonSocial": "FIRBID FINANZAS DIGITALES SAC",
                    "celular": "937086007",
                    "telefono": "0",
                    "anexo": "0",
                    "direccion": "Av. Canada 123",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "Jose Antonio Duarte",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": null,
                    "estado": 1,
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-22T10:35:19.716",
                    "usuarioActualizacion": "Wilmer.Bello@somosoh.pe",
                    "fechaActualizacion": "2024-04-09T19:47:17.36",
                    "idc": null
                },
                {
                    "idPartner": 8,
                    "tipoPartner": 2,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20490065281",
                    "primerNombre": null,
                    "segundoNombre": null,
                    "apellidoPaterno": null,
                    "apellidoMaterno": null,
                    "razonSocial": "PRUEBA",
                    "celular": "937086007",
                    "telefono": null,
                    "anexo": null,
                    "direccion": "AV. AVIACIÓN 2405 ",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "30",
                    "nombreContacto": "WILMER ANTONIO BELLO GOZAR",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": 6,
                    "estado": 1,
                    "usuarioRegistro": "Wilmer.Bello@somosoh.pe",
                    "fechaRegistro": "2024-04-04T17:22:42.053",
                    "usuarioActualizacion": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaActualizacion": "2024-05-02T16:34:32.424",
                    "idc": "777777"
                },
                {
                    "idPartner": 2,
                    "tipoPartner": 2,
                    "tipoDocIdentidad": "03",
                    "numeroDocIdentidad": "20556216089",
                    "primerNombre": null,
                    "segundoNombre": null,
                    "apellidoPaterno": null,
                    "apellidoMaterno": null,
                    "razonSocial": "FIDEICOMISO FIRBID",
                    "celular": "937086007",
                    "telefono": "0343",
                    "anexo": "0",
                    "direccion": "Av. Lima 444",
                    "dptUbigeo": "15",
                    "prvUbigeo": "01",
                    "dstUbigeo": "01",
                    "nombreContacto": "Jose Antonio Duarte",
                    "correoContacto": "wilmer.bello@somosoh.pe",
                    "idPartnerRelacionado": 1,
                    "estado": 1,
                    "usuarioRegistro": "HRCP.Eduardo.Gonzales@somosoh.pe",
                    "fechaRegistro": "2024-03-22T10:37:31.263",
                    "usuarioActualizacion": "Esteban.Castillo@somosoh.pe",
                    "fechaActualizacion": "2024-05-02T16:49:04.552",
                    "idc": "09490270"
                }
            ]
        };
        if (resp && resp['codigo'] == 0) {
            this.proveedores = resp.data;
            this.proveedores.map((item: any) => {
                const tipoPartner = this.tipoProveedor.find(e => e.id == item.tipoPartner)
                item['tipoPartnerDesc'] = tipoPartner.descripcion;
                return item;
            })
        } else {
            this.toastr.add({ severity: 'error', summary: 'Error searchProveedor()', detail: 'No se pudo obtener al proveedor' });
        }

        // this.proveedorService.getObtenerProveedor(numDoc, tipoDoc).subscribe((resp: any) => {
        //     if (resp && resp['codigo'] == 0) {
        //         this.proveedores = resp.data;
        //         this.proveedores.map((item: any) => {
        //             const tipoPartner = this.tipoProveedor.find(e => e.id == item.tipoPartner)
        //             item['tipoPartnerDesc'] = tipoPartner.descripcion;
        //             return item;
        //         })
        //     } else {
        //         this.toastr.add({ severity: 'error', summary: 'Error searchProveedor()', detail: 'No se pudo obtener al proveedor' });
        //     }
        // })
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
                    this.openDialogEditCuentas(rowData)
                    menu?.hide();  // cerrar directamente
                }, 5);
            }
        });
        items.push({
            label: 'Editar Info',
            icon: 'pi pi-pencil',
            command: () => this.openDialogEditInfo(rowData)
        });
        return items;
    }

    toggleSidebar(name: any): void {
        //this.fuseSidebarService.getSidebar(name).toggleOpen();
    }

    //  agregarProveedor(): void {
    //     this.router.navigate(['/apps/mantenimiento/proveedor/agregar']);
    // }
      openDialogCrearProveedor() {

        const dialogRef = this.dialog.open(AddProveedorComponent, {
            header: 'CREAR Proveedor',
            width: '50vw',
            modal: true,
            styleClass: 'header-modal',
            dismissableMask: true,  // permite cerrar al hacer click fuera
            data: null,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            }
        });

        // const dialogRef = this.dialog.open(EditCuentasProveedorComponent, {
        //     width: '900px',
        //     data: data
        // });

        // dialogRef.afterClosed().subscribe((resp:any) => {
        //     console.log(resp);
        // })
    }

    openDialogEditCuentas(data: any) {

        const dialogRef = this.dialog.open(EditCuentasProveedorComponent, {
            header: 'ACTUALIZAR CUENTAS',
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

        // const dialogRef = this.dialog.open(EditCuentasProveedorComponent, {
        //     width: '900px',
        //     data: data
        // });

        // dialogRef.afterClosed().subscribe((resp:any) => {
        //     console.log(resp);
        // })
    }
    openDialogEditInfo(rowData: any) {
        this.router.navigate([
            '/apps/mantenimiento/proveedor/edit',
            rowData.tipoDocIdentidad,
            rowData.numeroDocIdentidad
        ]);
    }
}