import { BehaviorSubject, Subject } from 'rxjs';
import { DestinoViaje } from './destino-viaje.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.module';
import { ElegidoFavoritoAction, NuevoDestinoAction } from './destinos-viajes-state.models';
import { Injectable } from '@angular/core';

@Injectable()
export class DestinosApiClient {
  getById: any;
	constructor(private store: Store<AppState>) {

	}
	add(d: DestinoViaje) {
		this.store.dispatch(new NuevoDestinoAction(d));
	}
	
	elegir(d: DestinoViaje) {
		this.store.dispatch(new ElegidoFavoritoAction(d));
	}
}