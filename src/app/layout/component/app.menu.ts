import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of modelT; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
        <br>
        <br>
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    modelT: MenuItem[] = [];

    ngOnInit() {
        this.modelT = [
            {
                label: 'Cuentas', icon: 'pi pi-fw pi-id-card',
                items: [{ label: 'Listar cuenta', icon: 'pi pi-fw pi-id-card', routerLink: ['/cuenta'] }]
            },
            {
                label: 'Mantenimiento',
                items: [
                    {
                        label: 'Parámetros',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Débito',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['mantenimiento/parametro/debito']

                            },
                            {
                                label: 'Tipo de Cambio',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['mantenimiento/parametro/tipo-cambio']
                            }
                        ]
                    },
                    { label: 'Feriados', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/formlayout'] },
                    { label: 'Proveedor', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Banco', icon: 'pi pi-fw pi-building-columns', routerLink: ['/uikit/formlayout'] },
                    { label: 'Cambio de Moneda', icon: 'pi pi-fw pi-dollar', routerLink: ['/uikit/formlayout'] },
                ]
            },
            {
                label: 'Consultas',
                items: [
                    { label: 'Transacciones Observadas', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Autorizaciones', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    {
                        label: 'Tipo de Cambio', icon: 'pi pi-fw pi-id-card',
                        items: [
                            {
                                label: 'Transacciones',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Log de Transacciones',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Pre-Liquidacion',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Liquidaciones',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Consultas',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Operaciones por campaña',
                                icon: 'pi pi-fw pi-bookmark'
                            }
                        ]
                    },
                    { label: 'Tokenización', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Solicitudes Ahorros Oh!', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                ]
            },

            {
                label: 'Ajustes Masivos',
                items: [
                    {
                        label: 'Bloqueos', icon: 'pi pi-fw pi-id-card',
                        items: [
                            {
                                label: 'Ejecutar Bloqueos',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Historial Bloqueos',
                                icon: 'pi pi-fw pi-bookmark'
                            }
                        ]
                    },
                    {
                        label: 'Solicitudes Oh!', icon: 'pi pi-fw pi-id-card',
                        items: [
                            {
                                label: 'Ejecutar Solicitudes',
                                icon: 'pi pi-fw pi-bookmark'
                            },
                            {
                                label: 'Historial Solicitudes',
                                icon: 'pi pi-fw pi-bookmark'
                            }
                        ]
                    },
                ]
            }



        ]
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            }
        ];
    }
}
