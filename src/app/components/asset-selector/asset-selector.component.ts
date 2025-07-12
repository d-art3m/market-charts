import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-asset-selector',
  imports: [NgFor],
  templateUrl: './asset-selector.component.html',
  styleUrls: ['./asset-selector.component.scss']
})
export class AssetSelectorComponent implements OnInit {
  instruments: any[] = [];
  @Output() assetSelected = new EventEmitter<any>();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getInstruments().subscribe((res: any) => {
      this.instruments = Array.isArray(res.data) ? res.data : [];
      if (this.instruments.length) {
        this.onSelectById(this.instruments[0].id);
      }
    });
  }

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const instrumentId = select.value;
    this.onSelectById(instrumentId);
  }

  onSelectById(instrumentId: string) {
    const selected = this.instruments.find(i => i.id === instrumentId);
    this.assetSelected.emit(selected);
  }
} 