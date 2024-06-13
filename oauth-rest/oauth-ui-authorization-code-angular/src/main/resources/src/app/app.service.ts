import {Injectable} from '@angular/core';
import {Cookie} from 'ng2-cookies';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class Foo {
  constructor(
    public id: string,
    public name: string) {
  }
}

@Injectable()
export class AppService {
  public clientId = 'a2a_demo_client';
  public redirectUri = 'http://127.0.0.1:8089/';
  public authServerBaseUrl = 'http://127.0.0.1:8080/oauth2'
  public resourceServerBaseUrl = 'http://127.0.0.1:8080'

  constructor(
    private _http: HttpClient) {
  }

  retrieveToken(code) {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.redirectUri);
    params.append('code', code);
    params.append('client_secret', 'secret');
    params.append('code_verifier', 'Th7UHJdLswIYQxwSg29DbK1a_d9o41uNMTRmuH0PM8zyoMAQ');

    const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    this._http.post(this.authServerBaseUrl + '/token', params.toString(), {headers: headers, withCredentials: true })
      .subscribe(
        data => this.saveToken(data),
        err => alert('Invalid Credentials')
      );
  }

  saveToken(token) {
    const expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set('access_token', token.access_token, expireDate);
    Cookie.set('id_token', token.id_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:8089';
  }

  getResource(resourceUrl): Observable<any> {
    const headers = new HttpHeaders({
      // 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': 'Bearer ' + Cookie.get('access_token')
    });
    return this._http.get(resourceUrl, {headers: headers})
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  checkCredentials() {
    return Cookie.check('access_token');
  }

  logout() {
    const token = Cookie.get('id_token');
    Cookie.delete('access_token');
    Cookie.delete('id_token');
    const logoutURL = this.authServerBaseUrl + '/openid-connect/logout?id_token_hint='
      + token
      + '&post_logout_redirect_uri=' + this.redirectUri;

    window.location.href = logoutURL;
  }
}
