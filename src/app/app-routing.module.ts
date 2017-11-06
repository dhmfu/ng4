import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PostsComponent} from './posts/posts.component';
import { UsersComponent } from './users/users.component';
import { SongsComponent } from './songs/songs.component';

import { LoggedIn } from './login/login.service';

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
      path: 'songs',
      component: SongsComponent
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
