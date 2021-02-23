import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from './services/state.service';
import { SpaceService } from './services/space.service';
import { SpaceResolver } from './resolvers/space.resolver';
import { HttpClientModule } from '@angular/common/http';
import { CryptoService } from './services/crypto.service';
import { ArweaveService } from './services/arweave.service';
import { WeaveidService } from './services/weaveid.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [StateService, SpaceService, SpaceResolver, CryptoService, ArweaveService, WeaveidService]
    };
  }
}
