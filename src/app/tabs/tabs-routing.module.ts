import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'qr',
        loadChildren: () => import('./qr/qr.module').then(m => m.QrPageModule)
      },
      {
        path: 'asist',
        loadChildren: () => import('./asist/asist.module').then(m => m.AsistPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/qr',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/qr',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
