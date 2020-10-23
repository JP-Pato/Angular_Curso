import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//importando ruteo
import { RouterModule, Routes } from '@angular/router';
//importando formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule as NgRxStoreModule, ActionReducerMap, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { DestinoViajeComponent } from '../../src/app/components/destino-viaje/destino-viaje.component';
import { ListaDestinoComponent } from '../../src/app/components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from '../../src/app/components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from '../../src/app/components/form-destino-viaje/form-destino-viaje.component';
import { DestinosApiClient } from './models/destinos-api-client.model';
import { DestinosViajesState, reducerDestinosViajes, intializeDestinosViajesState, DestinosViajesEffects } from './models/destinos-viajes-state.models';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { AuthService } from './services/auth.service';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';

// definiendo direcciones del nav

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ListaDestinoComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [ UsuarioLogueadoGuard ]
  }
];

// redux init
export interface AppState {
  destinos: DestinosViajesState;
}

const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes
};

const reducersInitialState = {
    destinos: intializeDestinosViajesState()
};
// fin redux init

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinoComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), //registrando las rutas
    FormsModule, //agregar un formulario
    ReactiveFormsModule,
    NgRxStoreModule.forRoot(reducers, { initialState: reducersInitialState }),
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [
    DestinosApiClient, AuthService, UsuarioLogueadoGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
