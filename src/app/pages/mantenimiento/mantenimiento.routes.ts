import { Routes } from '@angular/router';
import { ParametroDebitoComponent } from './parametro/parametro-debito/parametro-debito.component';
import { ParametroTipoCambioComponent } from './parametro/parametro-tipo-cambio/parametro-tipo-cambio.component';
import { BancoComponent } from './banco/banco.component';
import { FeriadoComponent } from './feriado/feriado.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
// import { ButtonDemo } from './buttondemo';
// import { ChartDemo } from './chartdemo';
// import { FileDemo } from './filedemo';
// import { FormLayoutDemo } from './formlayoutdemo';
// import { InputDemo } from './inputdemo';
// import { ListDemo } from './listdemo';
// import { MediaDemo } from './mediademo';
// import { MessagesDemo } from './messagesdemo';
// import { MiscDemo } from './miscdemo';
// import { PanelsDemo } from './panelsdemo';
// import { TimelineDemo } from './timelinedemo';
// import { TableDemo } from './tabledemo';
// import { OverlayDemo } from './overlaydemo';
// import { TreeDemo } from './treedemo';
// import { MenuDemo } from './menudemo';
// import { CuentasComponent } from '../cuentas/cuentas.component';
// import { CuentasDetailsComponent } from '../cuentas/cuentas-details/cuentas-details.component';




export default [
    { path: 'parametro/debito', data: { breadcrumb: 'Button' }, component: ParametroDebitoComponent },
    { path: 'parametro/tipo-cambio', data: { breadcrumb: 'Button' }, component: ParametroTipoCambioComponent },
    { path: 'banco', data: { breadcrumb: 'Button' }, component: BancoComponent },
    { path: 'feriado', data: { breadcrumb: 'Button' }, component: FeriadoComponent },
    { path: 'proveedor', data: { breadcrumb: 'Button' }, component: ProveedorComponent },
    
  
    // { path: 'button', data: { breadcrumb: 'Button' }, component: ButtonDemo },
    // { path: 'charts', data: { breadcrumb: 'Charts' }, component: ChartDemo },
    // { path: 'file', data: { breadcrumb: 'File' }, component: FileDemo },
    // { path: 'formlayout', data: { breadcrumb: 'Form Layout' }, component: FormLayoutDemo },
    // { path: 'input', data: { breadcrumb: 'Input' }, component: InputDemo },
    // { path: 'list', data: { breadcrumb: 'List' }, component: ListDemo },
    // { path: 'media', data: { breadcrumb: 'Media' }, component: MediaDemo },
    // { path: 'message', data: { breadcrumb: 'Message' }, component: MessagesDemo },
    // { path: 'misc', data: { breadcrumb: 'Misc' }, component: MiscDemo },
    // { path: 'panel', data: { breadcrumb: 'Panel' }, component: PanelsDemo },
    // { path: 'timeline', data: { breadcrumb: 'Timeline' }, component: TimelineDemo },
    // { path: 'table', data: { breadcrumb: 'Table' }, component: TableDemo },
    // { path: 'overlay', data: { breadcrumb: 'Overlay' }, component: OverlayDemo },
    // { path: 'tree', data: { breadcrumb: 'Tree' }, component: TreeDemo },
    // { path: 'menu', data: { breadcrumb: 'Menu' }, component: MenuDemo },
    // { path: 'cuenta', data: { breadcrumb: 'Table' }, component: CuentasComponent },
    // { path: 'detalle', data: { breadcrumb: 'Table' }, component: CuentasDetailsComponent },
    // { path: '**', redirectTo: '/notfound' },

] as Routes;
