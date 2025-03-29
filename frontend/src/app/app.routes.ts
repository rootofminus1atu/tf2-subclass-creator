import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { CreateLoadoutComponent } from './pages/create-loadout/create-loadout.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { EditLoadoutComponent } from './pages/edit-loadout/edit-loadout.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './misc/adminGuard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Home' },
    { path: 'about', component: AboutComponent, title: 'About' },
    { path: 'loadout-creator', component: CreateLoadoutComponent, canActivate: [AuthGuard], title: 'LoadoutCreator' },
    { path: 'gallery', component: GalleryComponent, title: 'Gallery' },
    { path: 'gallery/:id/edit', component: EditLoadoutComponent, canActivate: [AuthGuard], title: 'Edit' },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, adminGuard], title: 'Admin' }
];
