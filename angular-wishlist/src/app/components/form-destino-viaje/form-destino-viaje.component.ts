import { Component, OnInit, Output, EventEmitter, Inject, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { APP_CONFIG, AppConfig } from 'src/app/app.module';



@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})

export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 3;
  searchResults: string[];
  fb: any;

  constructor(fb: FormBuilder, @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig) { 
    //inicializar
    this.onItemAdded = new EventEmitter();
    //vinculacion con tag html
    this.fg = fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreValidator,
        this.nomnbreVallidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    });
    
    //observador de tipeo
    this.fg.valueChanges.subscribe(
      (form: any) => {
      console.log('cambio el formulario: ', form);
    });
  }

  ngOnInit() {
    const elemNombre = <HTMLInputElement>document.getElementById('nombre');
    fromEvent(elemNombre, 'input')
      .pipe(
        map((e:KeyboardEvent) => (e.target as HTMLInputElement).value),
        filter(text => text.length > 2),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text: string) => ajax(this.config.apiEndpoint + '/ciudades?q=' + text))
        ).subscribe(ajaxResponse => this.searchResults = ajaxResponse.response);
  }

  guardar(nombre: string, url: string): boolean {
    const d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control: FormControl): { [s: string]: boolean } {
    const l = control.value.toString().trim().length;
    if(l > 0 && l < 5) {
      return {invalidNommbre: true};
    }
    return null;
  }

  nomnbreVallidatorParametrizable(minLong: number): ValidatorFn {
    return (control: FormControl): { [s: string]: boolean } | null =>  {
      const l = control.value.toString().trim().length;
      if ( l > 0 && l < minLong) {
        return { minLongNombre: true};
      } 
      return null;
    }
  }

}