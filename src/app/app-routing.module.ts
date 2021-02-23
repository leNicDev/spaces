import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HasSpaceGuard } from './shared/guards/has-space.guard';
import { SpaceResolver } from './shared/resolvers/space.resolver';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'space',
    loadChildren: () => import('./space/space.module').then(m => m.SpaceModule),
    canActivate: [HasSpaceGuard],
    resolve: {
      space: SpaceResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
