import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenUrl = 'https://platform.fintacharts.com/identity/realms/fintatech/protocol/openid-connect/token';
  private clientId = 'app-cli';

  private username = import.meta.env['NG_APP_USERNAME'];
  private password = import.meta.env['NG_APP_PASSWORD'];

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  public accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAccessToken(): Observable<string> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', this.clientId)
      .set('username', this.username)
      .set('password', this.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<any>(this.tokenUrl, body, { headers }).pipe(
      tap((res) => {
        this.accessTokenSubject.next(res.access_token);
      }),
      map((res) => res.access_token)
    );
  }

  get token(): string | null {
    return this.accessTokenSubject.value;
  }
} 