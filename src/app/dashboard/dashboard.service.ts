import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { AccessToken } from '../model/access-token';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  BASE_URL = 'https://amplify.ness.com:8080';

  constructor(private http: HttpClient) { }

  // public getAccessToken(): Observable<any> {
  //   return this.http.get<any>('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77m71340tgxr9i&redirect_uri=http://localhost:8080/login&state=secure23456&scope=r_liteprofile%20r_emailaddress%20w_member_social')
  // }

  /*addUser(userObject : User) : Observable<any>
    {
      return this.http.post(this.baseUrl+"/addUser",userObject); 
    }
    
   getUsers () : Observable<User[]>
   { 
      return this.http.get<User[]>(this.baseUrl);
    }*/

  public getAccessToken(code?: string, localStorageLoggedinUserid?: string): Observable<any> {
    // return this.http.get<any>('http://localhost:8080/getToken?code='+code);
    return this.http.post<AccessToken>(this.BASE_URL+`/api/getToken?code=`+code+`&loggedInUserId=`+localStorageLoggedinUserid, {});
    //return this.http.get("/api/users").map((res: Response) => res.json())
  }

  public verifyAccess(accessToken: string): Observable<any> {
    return this.http.post(this.BASE_URL+`/api/tokenIntrospection?token=`+accessToken, {});
  }

  public getPosts(accessToken: string, sortState?: Sort, ): Observable<any> {
    return this.http.get<any>(this.BASE_URL+`/linkedIn/posts`);
    // return this.http.get<any>('assets/post.json');
  }

  public postLikeShare<LikeShare>(selectedPostsLike : {}, selectedPostsShare : {}, loggedinuser : string, accessToken : string) {
    const body = { personId: loggedinuser, sharePostIds: selectedPostsShare, likePostIds : selectedPostsLike };
    return this.http.post(this.BASE_URL+`/linkedIn/postAction`, body, {});
  }
}
