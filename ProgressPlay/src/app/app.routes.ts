import { Routes } from '@angular/router';
import { EntryComponent } from './components/entry/entry.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { profileEnd } from 'console';
import { ProfileComponent } from './components/profile/profile.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { AskaiComponent } from './components/askai/askai.component';

export const routes: Routes = [
    {path: '', component: EntryComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'homepage', component: HomepageComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'about', component: AboutComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'rewards', component: RewardsComponent},
    {path: 'askai', component: AskaiComponent},
    {path: '**', component: PagenotfoundComponent},
];
