import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { PostsComponent} from './posts.component';
import { UsersComponent } from './users.component';

import { LoggedIn } from './login.service';

const routes: Routes = [
    {
      path: 'login',
      component: LoginComponent,
      canActivate: [LoggedIn]
    },
    {
      path: 'posts',
      component: PostsComponent
    },
    {
      path: 'users',
      component: UsersComponent,
      canActivate: [LoggedIn]
    },
    {
      path: '',
      redirectTo: '/posts',
      pathMatch: 'full'
  }]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [LoggedIn]
})
export class AppRoutingModule {}
