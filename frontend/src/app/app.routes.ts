import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { CreateLoadoutComponent } from './pages/create-loadout/create-loadout.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { EditLoadoutComponent } from './pages/edit-loadout/edit-loadout.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'loadout-creator', component: CreateLoadoutComponent, canActivate: [AuthGuard] },
    { path: 'gallery', component: GalleryComponent },
    { path: 'gallery/:id/edit', component: EditLoadoutComponent, canActivate: [AuthGuard] },
];
