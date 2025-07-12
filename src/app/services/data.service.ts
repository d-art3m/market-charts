import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private ws: WebSocketSubject<any> | null = null;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getInstruments(): Observable<any> {
    return this.auth.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const params = new HttpParams()
          .set('provider', 'oanda')
          .set('kind', 'forex');
        return this.http.get(`/api/instruments/v1/instruments`, { headers, params });
      })
    );
  }

  getHistoricalBars(instrumentId: string, barsCount: number = 50): Observable<any> {
    return this.auth.getAccessToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        const params = new HttpParams()
          .set('instrumentId', instrumentId)
          .set('provider', 'oanda')
          .set('interval', '1')
          .set('periodicity', 'day')
          .set('barsCount', barsCount.toString());
        return this.http.get(`/api/bars/v1/bars/count-back`, { headers, params });
      })
    );
  }

  connectRealtime(token: string): WebSocketSubject<any> {
    const wsUrl = `wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${token}`;
    this.ws = webSocket(wsUrl);
    return this.ws;
  }

  disconnectRealtime() {
    if (this.ws) {
      this.ws.complete();
      this.ws = null;
    }
  }
}
