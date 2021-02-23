import { Component } from '@angular/core';
import { ArweaveService } from './shared/services/arweave.service';

@Component({
  selector: 'spaces-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private arweaveService: ArweaveService) {
    this.arweaveService.initArweave();
  }

}
