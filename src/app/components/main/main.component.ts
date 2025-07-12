import { Component } from '@angular/core';
import { AssetSelectorComponent } from '../asset-selector/asset-selector.component';
import { PriceTickerComponent } from '../price-ticker/price-ticker.component';
import { HistoricalChartComponent } from '../historical-chart/historical-chart.component';

@Component({
  selector: 'app-main',
  imports: [AssetSelectorComponent, PriceTickerComponent, HistoricalChartComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  selectedInstrument: any = null;

  onInstrumentSelect(instrument: any) {
    this.selectedInstrument = instrument;
  }
}
