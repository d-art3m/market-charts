import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-ticker',
  imports: [NgIf, CommonModule],
  templateUrl: './price-ticker.component.html',
  styleUrls: ['./price-ticker.component.scss']
})
export class PriceTickerComponent implements OnChanges, OnDestroy {
  @Input() instrument: any;
  price: string | null = null;
  time: string | null = null;
  private wsSub: Subscription | null = null;
  private tokenSub: Subscription | null = null;

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['instrument'] && this.instrument && this.instrument.id) {
      this.subscribeToRealtime();
    }
  }

  subscribeToRealtime() {
    if (this.wsSub) this.wsSub.unsubscribe();
    if (this.tokenSub) this.tokenSub.unsubscribe();
    this.price = null;
    this.time = null;
    this.tokenSub = this.authService.getAccessToken().subscribe(token => {
      const ws = this.dataService.connectRealtime(token);
      const subscribeL1 = {
        type: 'l1-subscription',
        id: '1',
        instrumentId: this.instrument.id,
        provider: 'simulation',
        subscribe: true,
        kinds: ['ask', 'bid', 'last']
      };
      ws.next(subscribeL1);
      this.wsSub = ws.subscribe({
        next: (msg) => {
          if (msg.type === 'l1-snapshot' && msg.quote) {
            this.setPriceAndTime(msg.quote);
          } else if (msg.type === 'l1-update') {
            this.setPriceAndTime(msg);
          }
        },
        error: () => {
          this.price = null;
          this.time = null;
        }
      });
    });
  }

  private setPriceAndTime(source: any) {
    const priorities = ['last', 'ask', 'bid'];
    for (const key of priorities) {
      if (source[key]) {
        this.price = source[key].price;
        this.time = source[key].timestamp;
        return;
      }
    }
    this.price = null;
    this.time = null;
  }

  ngOnDestroy() {
    if (this.wsSub) this.wsSub.unsubscribe();
    if (this.tokenSub) this.tokenSub.unsubscribe();
  }
}