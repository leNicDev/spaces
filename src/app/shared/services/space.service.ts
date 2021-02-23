import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, toArray, } from 'rxjs/operators';
import { CryptoService } from './crypto.service';
import { Secret } from 'src/app/models/secret';
import { StateService } from './state.service';
import { ArweaveService } from './arweave.service';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(private http: HttpClient,
              private cryptoService: CryptoService,
              private state: StateService,
              private arweaveService: ArweaveService) { }

  async createSecret(secret: Secret) {    
    this.cryptoService.encrypt(JSON.stringify(secret), this.state.privateKey).subscribe((encrypted: string) => {
      this.arweaveService.storeSecret(encrypted, JSON.parse(this.state.privateKey)).then(tx => {
        this.state.secrets = [...this.state.secrets, secret];
      });
    });
  }

  async getAllSecrets() {
    // fetch all encrypted secrets
    const encryptedSecrets = await this.arweaveService.fetchAllSecrets(this.state.walletAddress);

    // no secrets found
    if (!encryptedSecrets || !encryptedSecrets.length) {
      return [];
    }
    
    return new Promise((resolve, reject) => {
      from(encryptedSecrets).pipe(
        mergeMap(encrypted => this.cryptoService.decrypt(encrypted, this.state.privateKey)),
        map(decrypted => JSON.parse(decrypted)),
        toArray()
      ).subscribe(secrets => {
        this.state.secrets = secrets;
        resolve(secrets);
      });
    });
  }
}
