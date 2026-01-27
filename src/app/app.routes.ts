import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { ArtistPageComponent } from './pages/artist-page/artist-page.component';
import { FramesComponent } from './pages/frames/frames.component';
import { CartComponent } from './pages/cart/cart.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { AdminLoginComponent } from './admin/login/admin-login.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'artist/:id', component: ArtistPageComponent },
  { path: 'frames', component: FramesComponent },
  { path: 'cart', component: CartComponent },
  
  // Admin Routes
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent }
    ]
  }
];
