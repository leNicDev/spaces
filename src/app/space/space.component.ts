import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Secret } from '../models/secret';
import { ArweaveService } from '../shared/services/arweave.service';
import { SpaceService } from '../shared/services/space.service';
import { StateService } from '../shared/services/state.service';
import { ClipboardUtil } from '../utils/clipboard';

@Component({
  selector: 'spaces-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnDestroy {

  createSecretForm: FormGroup;

  secretName: string;
  username: string;
  secret: string;
  url: string;
  description: string;

  balance$: Observable<number>;
  secrets$: Observable<Secret[]>;

  updateBalanceTaskId: number;

  constructor(private spaceService: SpaceService,
              private stateService: StateService,
              private arweaveService: ArweaveService,
              private router: Router,
              fb: FormBuilder) {
    this.balance$ = this.stateService.walletBalance$;
    this.secrets$ = this.stateService.secrets$;

    this.createSecretForm = fb.group({
      secretName: ['', Validators.required],
      username: [''],
      secret: ['', Validators.required],
      url: [''],
      description: ['']
    });

    // Update wallet balance every 5 seconds
    this.subscribeArBalance();
  }

  ngOnDestroy() {
    clearInterval(this.updateBalanceTaskId);
  }

  subscribeArBalance() {
    setInterval(async () => {
      const balance = await this.arweaveService.getBalance(this.stateService.walletAddress);
      this.stateService.walletBalance = balance;
    }, 5000);
  }

  async createSecret() {
    if (!this.createSecretForm.valid) {
      return;
    }

    const secret = new Secret();
    secret.name = this.createSecretForm.get('secretName').value;
    secret.username = this.createSecretForm.get('username').value;
    secret.secret = this.createSecretForm.get('secret').value;
    secret.url = this.createSecretForm.get('url').value;
    secret.description = this.createSecretForm.get('description').value;
    await this.spaceService.createSecret(secret);

    this.createSecretForm.reset();

    await this.spaceService.getAllSecrets();
  }

  copySecretToClipboard(secret: Secret) {
    ClipboardUtil.copyToClipboard(secret.secret);
  }

  logout() {
    this.router.navigate(['/']);
    this.stateService.reset();
  }

}
