import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { CaixaListComponent } from './components/caixa-list.component';
import { CaixaFormComponent } from './components/caixa-form.component';
import { MilitarListComponent } from './components/militar-list.component';
import { MilitarFormComponent } from './components/militar-form.component';
import { RelatorioComponent } from './components/relatorio.component';
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
