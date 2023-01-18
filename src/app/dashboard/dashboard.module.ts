import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule, MatNavList } from '@angular/material/list';
import { TruncatePipe } from '../pipes/truncate.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    // TruncatePipe
    // SideNavComponent
    // MatSort,
    // MatPaginator
    // MatTableDataSource
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatIconModule,
    // TruncatePipe
    // MatToolbarModule,
    // MatListModule,
    // MatSidenavModule
  ],
  providers: [ MatIconRegistry ]
})
export class DashboardModule { }
