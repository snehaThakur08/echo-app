import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'post', 'title', 'createdAt'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<Post>();
  code = '';
  state = '';
  accessToken = '';
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  showFiller = false;

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon("linkedin", this.domSanitizer
    .bypassSecurityTrustResourceUrl("assets/images/linkedin.svg")); 
  }

  ngOnInit(): void {
    this.code = this.route?.snapshot?.queryParams['code'];
    this.state = this.route?.snapshot?.queryParams['state'];
    localStorage.setItem('code', this.code);
    localStorage.setItem('state', this.state);
    console.log('current Route is ', this.code, this.state);
    const accessCode = localStorage.getItem('code') || '';
    this.dashboardService.getAccessToken(accessCode).subscribe(res => {
      console.log('res in Login API', res);
      localStorage.setItem('accessToken', res['accessToken']);
    });
    this.accessToken = localStorage.getItem('accessToken') || '';
    // this.dashboardService.verifyAccess(this.accessToken).subscribe(res => {
    //   console.log('res to verify access', res);
    // });
    this.getPosts();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  close(reason: string) {
    // this.reason = reason;
    this.sidenav.close();
  }

  getPosts(sortState?: Sort) {
    this.dashboardService.getPosts(this.accessToken, sortState).subscribe(res => {
      console.log('res', res);
      this.dataSource = res;
      // this.dataSource.sort = this.sort;
    });
  }

  getPageSize(event: any) {
    console.log('event', event);
  }

  /** Announce the change in sort state for assistive technology. */
  sortPost(sortState: Sort) {
    console.log('Sorting the post', sortState);
    if (sortState.direction) {
      this.getPosts(sortState);
    } 
    // else {
    //   this._liveAnnouncer.announce('Sorting cleared');
    // }
  }
}

export interface Post {
  name: string;
  post: string;
  title: string;
  createdAt: string;
}

const ELEMENT_DATA: Post[] = [
  {name: 'LinkedIn', post: 'Case Study', title: 'Cloud-native OTT is next big thing', createdAt: '07/04/2022'},
  {name: 'LinkedIn', post: 'Whitepaper', title: 'A robust network security plan', createdAt: '07/04/2022'},
  {name: 'Twitter', post: 'Anouncement', title: 'Ness is proud to sponsor Vineet Singh who will represent Team India at the XXI World Racquetball Championships in San Luis Potosi, Mexico', createdAt: '08/04/2022'},
  {name: 'Facebook', post: 'Event Announcement', title: 'Meet our experts in-person at IBC 2022, Amsterdam', createdAt: '01/12/2022'},
  {name: 'Instagram', post: 'Event Announcement', title: 'Watch the On-demand video to learn about Re-orchestration, the 7th R to Migrating to the Cloud from Peter Meulbroek, Global Head of Cloud and Data at Ness', createdAt: '25/12/2022'}
];
