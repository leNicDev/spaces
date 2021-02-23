import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { FileService } from './file.service';
import { StateService } from './state.service';

export const SAFAR_VERSION = 'test1';

@Injectable({
  providedIn: 'root'
})
export class ArweaveService {

  private arweave: Arweave;

  constructor(
    private fileService: FileService,
    private state: StateService,
    private router: Router) {}

  /**
   * Initialize Arweave
   */
  initArweave() {
    this.arweave = Arweave.init({});
    this.state.arweaveInitialized = true;
  }

  private async loadPrivateKeyFile(file: File) {
    if (!file) return;

    return this.fileService.loadFileContentsAsString(file);
  }

  private async getWalletAddressFromPrivateKey(privateKey: string) {
    return this.arweave.wallets.jwkToAddress(JSON.parse(privateKey));
  }

  /**
   * Get the current balance by a wallet address
   * @param address The wallet address to get balance of
   */
  async getBalance(address: string): Promise<number> {
    const winston = await this.arweave.wallets.getBalance(address);
    return Number(this.arweave.ar.winstonToAr(winston));
  }

  async openSpace(privateKeyFile: File) {
    const privateKey = await this.loadPrivateKeyFile(privateKeyFile);
    const walletAddress = await this.getWalletAddressFromPrivateKey(privateKey);
    this.state.privateKey = privateKey;
    this.state.walletAddress = walletAddress;
    this.router.navigate(['/space']);
  }

  /**
   * Store some text data on the Arweave network
   * @param data The data to store
   * @param jwk The private key used to store the data
   */
  async storeSecret(secret: string, jwk: JWKInterface): Promise<Transaction> {
    // create transaction
    const tx = await this.arweave.createTransaction({ data: secret }, jwk);
    tx.addTag('Content-Type', 'text/plain');
    tx.addTag('Protocol', 'SAFAR');
    tx.addTag('Safar-Version', SAFAR_VERSION);

    // sign transaction
    await this.arweave.transactions.sign(tx, jwk);
    
    // upload transaction
    const uploader = await this.arweave.transactions.getUploader(tx);

    // wait for upload to complete
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }

    return tx;
  }

  /**
   * Fetch all secrets
   */
  async fetchAllSecrets(address: string): Promise<string[]> {
    const txids = await this.arweave.arql({
      op: 'and',
      expr1: {
        op: 'equals',
        expr1: 'from',
        expr2: address,
      },
      expr2: {
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'Protocol',
          expr2: 'SAFAR',
        },
        expr2: {
          op: 'equals',
          expr1: 'Safar-Version',
          expr2: SAFAR_VERSION,
        },
      }
    });

    const secrets = [];

    for (const txid of txids) {
      const secret = await this.arweave.transactions.getData(txid, {decode: true, string: true});
      secrets.push(secret);
    }

    return secrets;
  }
}
