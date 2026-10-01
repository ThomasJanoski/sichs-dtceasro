import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CaixaListComponent } from './components/caixa-list/caixa-list.component';
import { CaixaFormComponent } from './components/caixa-form/caixa-form.component';
import { MilitarListComponent } from './components/militar-list/militar-list.component';
import { MilitarFormComponent } from './components/militar-form/militar-form.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'leituras', component: CaixaListComponent },
      { path: 'leituras/new', component: CaixaFormComponent },
      { path: 'militares', component: MilitarListComponent },
      { path: 'militares/new', component: MilitarFormComponent },
      { path: 'militares/:id/edit', component: MilitarFormComponent },
      { path: 'relatorio', component: RelatorioComponent },
      { path: '', redirectTo: 'leituras', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
