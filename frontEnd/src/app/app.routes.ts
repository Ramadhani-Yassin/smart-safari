import { Routes } from '@angular/router';
import { DriverDashboard } from './component/driver-dashboard/driver-dashboard';
import { Home } from './component/home/home';
import { Login } from './component/login/login';
import { Profile } from './component/profile/profile';
import { Signup } from './component/signup/signup';
import { Support } from './component/support/support';
import { Administration } from './component/administration/administration';
import { Dashboard } from'./component/dashboard/dashboard';

export const routes: Routes = [  
    { path : 'driver-dashboard', component: DriverDashboard},
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'profile', component: Profile },
    { path: 'dashboard', component: Dashboard },
    { path: 'support', component: Support },
    { path: 'admin', component: Administration },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
