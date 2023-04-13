import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertComponent } from './alert.component';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  { path: 'alert', component: AlertComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    MatTableModule
  ],
  exports: [RouterModule]
})
export class AlertRoutingModule { }
