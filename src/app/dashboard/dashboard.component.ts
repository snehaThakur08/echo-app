import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import {MatButtonModule} from '@angular/material/button';
import { AlertService } from '../alert/alert.service';
import { AlertComponent } from '../alert/alert.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'title', 'createdAt', 'comment', 'select', 'selectShare'];
  dataSource = new MatTableDataSource<Post>();
  clickedRows = new Set<Post>();
  code = '';
  state = '';
  personid = '';
  accessToken = '';
  loggedInPersonId = '';
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  showFiller = false;

  lessons: Post[] = [];
  public comment : any = [];
  
  selection = new SelectionModel<Post>(true, []);
  selectionShare = new SelectionModel<Post>(true, []);

  //private alertService: AlertService;
  private subscription!: Subscription;
  message: any;
  isLoggedIn : any;
  
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private alertService: AlertService
  ) {
    this.matIconRegistry.addSvgIcon("linkedin", this.domSanitizer
    .bypassSecurityTrustResourceUrl("assets/images/linkedin.svg"));
    
    this.isLoggedIn = false;
    const lcstouid123 = localStorage.getItem('loggedInPersonId') || '';
    if(lcstouid123 == "") {
      this.isLoggedIn = false;
    }
    else {
      this.isLoggedIn = true;
    }

    const lcstouid = localStorage.getItem('loggedInPersonId') || '';
    if(lcstouid == "") {
      window.location.href = 'https://amplify.ness.com:8080/api/login';
    }
  }

  ngOnInit(): void {
    this.code = this.route?.snapshot?.queryParams['code'];
    this.state = this.route?.snapshot?.queryParams['state'];
    localStorage.setItem('code', this.code);
    localStorage.setItem('state', this.state);
    //console.log('current Route is ', this.code, this.state);
    const accessCode = localStorage.getItem('code') || '';
    const localStorageLoggedinUserid = localStorage.getItem('loggedInPersonId') || '';
    this.dashboardService.getAccessToken(accessCode, localStorageLoggedinUserid).subscribe(res => {
      //console.log('res in Login API', res);
      let accessTokenResponse = <AccessToken>(res);

      localStorage.setItem('accessToken', accessTokenResponse.access_token);
      localStorage.setItem('loggedInPersonId', accessTokenResponse.person_id);
    });
    this.accessToken = localStorage.getItem('accessToken') || '';
    this.loggedInPersonId = localStorage.getItem('loggedInPersonId') || '';
    // this.dashboardService.verifyAccess(this.accessToken).subscribe(res => {
    //   console.log('res to verify access', res);
    // });
    this.getPosts();

    this.subscription = this.alertService.getMessage().subscribe(message => { 
      this.message = message; 
  });
  }

  registerSucess:boolean = true;

submitTableAction() {
    this.message = false ;
    let selectedPostsLike = [];
    for (let itemLike of this.selection.selected) {
      let likeJson = {
        postId: itemLike.uid,
        title: itemLike.commentary.substring(0,50)+"..." 
      };
      selectedPostsLike.push(likeJson);
    }

    let selectedPostsShare = [];
    for (let itemShare of this.selectionShare.selected) {
      let shareJson = {
        postId: itemShare.uid,
        title: itemShare.commentary.substring(0,50)+"...",                                                  
        comment : (<HTMLInputElement>document.getElementById("text_"+itemShare.id)).value
      };
      selectedPostsShare.push(shareJson);
    }

    console.log(selectedPostsLike);
    console.log(selectedPostsShare);

    if(selectedPostsLike.length == 0 && selectedPostsShare.length == 0) {
      this.alertService.error("Atleast one post must be selected",true);
      setTimeout(() => {
        this.hideErrSuccDiv()
      }, 5000);
    } else {
      this.dashboardService.postLikeShare(selectedPostsLike, selectedPostsShare, this.loggedInPersonId, this.accessToken).subscribe(res => {
        console.log('res', res);
        let likeShareResponse = <LikeShare>(res);
        if(likeShareResponse.status == "SUCCESS") { 
          this.alertService.success(likeShareResponse.message,true);
          this.selection.clear();
          this.selectionShare.clear();
          setTimeout(() => {
            this.hideErrSuccDiv()
          }, 5000);
        } else {
          this.alertService.error(likeShareResponse.message,true);
          this.selection.clear();
          this.selectionShare.clear();
          setTimeout(() => {
            this.hideErrSuccDiv()
          }, 5000);
        }
      });
    }
  }

hideErrSuccDiv () {
  this.message = true;
}  

  /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRows() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}

 /** Whether the number of selected elements matches the total number of rows. */
isAllSelectedShare() {
  const numSelected = this.selectionShare.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
toggleAllRowsShare() {
  this.isAllSelectedShare() ?
      this.selectionShare.clear() :
      this.dataSource.data.forEach(row => this.selectionShare.select(row));
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
      //console.log('res', res);
      this.dataSource= new MatTableDataSource(res);
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

  openPostInWindow(postId : string) {
    let postUrl = "https://www.linkedin.com/feed/update/"+postId;
    //console.log(postUrl);
    let w = 500; 
    let h = 500;
    let left = Number((screen.width/2)-(w/2));
    let tops = Number((screen.height/2)-(h/2)); 
    window.open(postUrl, "PostPage", "height="+h+",width="+w+",top="+tops+",left="+left);
  }
}

export interface Post {
  name: string;
  post: string;
  title: string;
  createdAt: string;
  select: string;
  selectShare : string;
  uid: string;
  commentary : string;
  comment : string;
  id : number
}

export interface AccessToken {
  code: string;
  state: string;
  access_token : string;
  person_id : string;
}

export interface LikeShare {
  statusCode : string;
  status : string;
  message : string;
  comment : string;
}

export interface LikeJson {
  postId: string,
  title: string,
  comment : string;
}
