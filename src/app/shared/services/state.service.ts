import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Secret } from 'src/app/models/secret';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private arweaveInitializedSubject = new BehaviorSubject<boolean>(false);
  private weaveIdInitializedSubject = new BehaviorSubject<boolean>(false);
  private privateKeySubject = new BehaviorSubject<string>(null);
  private walletAddressSubject = new BehaviorSubject<string>(null);
  private walletBalanceSubject = new BehaviorSubject<number>(0);
  private secretsSubject = new BehaviorSubject<any>([]);

  constructor() {
    this.load();
  }

  reset() {
    this.privateKey = null;
    this.walletAddress = null;
    this.walletBalance = 0;
    this.secrets = [];
  }

  /**
   * Save the current state to local storage
   */
  save() {
    const state = {
      privateKey: this.privateKey,
      walletAddress: this.walletAddress,
      walletBalance: this.walletBalance
    };
    localStorage.setItem('state', JSON.stringify(state));
  }

  /**
   * Load the saved state from local storage
   */
  load() {
    const savedState = localStorage.getItem('state');

    if (!savedState) {
      return;
    }

    const state = JSON.parse(savedState);

    this.privateKey = state.privateKey;
    this.walletAddress = state.walletAddress;
    this.walletBalance = state.walletBalance;
  }

  get arweaveInitialized$(): Observable<boolean> {
    return this.arweaveInitializedSubject.asObservable();
  }

  get arweaveInitialized(): boolean {
    return this.arweaveInitializedSubject.value;
  }

  set arweaveInitialized(arweaveInitialized: boolean) {
    this.arweaveInitializedSubject.next(arweaveInitialized);
  }

  get weaveIdInitialized$(): Observable<boolean> {
    return this.weaveIdInitializedSubject.asObservable();
  }

  get weaveIdInitialized(): boolean {
    return this.weaveIdInitializedSubject.value;
  }

  set weaveIdInitialized(weaveIdInitialized: boolean) {
    this.weaveIdInitializedSubject.next(weaveIdInitialized);
  }

  get privateKey$(): Observable<string> {
    return this.privateKeySubject.asObservable();
  }

  get privateKey(): string {
    return this.privateKeySubject.value;
  }

  set privateKey(privateKey: string) {
    this.privateKeySubject.next(privateKey);
    this.save();
  }

  get walletAddress$(): Observable<string> {
    return this.walletAddressSubject.asObservable();
  }

  get walletAddress(): string {
    return this.walletAddressSubject.value;
  }

  set walletAddress(walletAddress: string) {
    this.walletAddressSubject.next(walletAddress);
    this.save();
  }

  get walletBalance$(): Observable<number> {
    return this.walletBalanceSubject.asObservable();
  }

  get walletBalance(): number {
    return this.walletBalanceSubject.value;
  }

  set walletBalance(walletBalance: number) {
    this.walletBalanceSubject.next(walletBalance);
    this.save();
  }

  get secrets$(): Observable<Secret[]> {
    return this.secretsSubject.asObservable();
  }

  get secrets(): any {
    return this.secretsSubject.value;
  }

  set secrets(secrets: any) {
    this.secretsSubject.next(secrets);
  }
}
