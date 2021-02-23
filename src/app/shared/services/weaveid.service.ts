import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import WeaveID from 'weaveid';
import { ArweaveService } from './arweave.service';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class WeaveidService {

  constructor(private state: StateService,
              private arweaveService: ArweaveService,
              private router: Router) {
    // wait for Arweave to be initialized to initialize WeaveID
    this.state.arweaveInitialized$.subscribe((arweaveInitialized: boolean) => {
      if (!arweaveInitialized) return;
      WeaveID.init().then(() => this.state.weaveIdInitialized = true);
    });
  }

  /**
   * Open login modal, wait for authentication, load wallet address, private key and balance
   * and navigate to the /space route
   */
  async openLoginModal() {
    const walletAddress = await WeaveID.openLoginModal();
    const privateKey = await WeaveID.getWallet();
    const balance = await this.arweaveService.getBalance(walletAddress);
    await WeaveID.closeLoginModal();
    this.state.walletAddress = walletAddress;
    this.state.privateKey = JSON.stringify(privateKey);
    this.state.walletBalance = balance;
    this.router.navigate(['/space']);
  }
}
