import { Component } from '@angular/core';
import { SpaceService } from '../shared/services/space.service';
import { FormBuilder } from '@angular/forms';
import { WeaveidService } from '../shared/services/weaveid.service';
import { StateService } from '../shared/services/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'spaces-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private weaveIdService: WeaveidService,
              private stateService: StateService,
              private router: Router,
              fb: FormBuilder) {}

  async openSpace() {
    // navigate to /space if private key is already present
    if (this.stateService.privateKey) {
      this.router.navigate(['/space']);
      return;
    }

    // open WeaveID login modal
    await this.weaveIdService.openLoginModal();
  }

}
