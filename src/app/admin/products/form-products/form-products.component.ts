import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { DatePipe } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-form-products',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './form-products.component.html',
  styleUrl: './form-products.component.css',
  providers: [DatePipe],
})
export class FormProductsComponent {
  formData: FormGroup;
  id?: string;
  titulo: string = 'Mantenimiento de estudiante';
  errorMin: string = 'La Minima longitud son 10 caracteres';
  errorMax: string = 'La Maxima longitud son 150 caracteres';
  fechaServer: string = this._datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  product?: Product;
  public get frmDatos() {
    return this.formData!.controls;
  }
  isButtonDisabled: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _datePipe: DatePipe,
    private _alertService: AlertService
  ) {
    this.formData = this._formBuilder.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [this.validarIdValido.bind(this)],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: [
        '',
        [Validators.required],
        [this.validarFechaMinima.bind(this)],
      ],
      date_revision: ['', [Validators.required, Validators.maxLength(11)]],
    });

    this.formData.get('date_release')!.valueChanges.subscribe((value) => {
      // Aquí puedes ejecutar el código que deseas cuando el valor de date_release cambia
      if (!value) {
        return;
      }
      const fecha = new Date(value as Date);

      this.frmDatos['date_revision'].enable();
      const dateRevisionDate = new Date(
        fecha.getFullYear() + 1,
        fecha.getMonth(),
        fecha.getDate()
      );
      const date_revision = this._datePipe.transform(
        dateRevisionDate,
        'yyyy-MM-dd'
      );
      this.formData.patchValue({ date_revision });

      this.frmDatos['date_revision'].disable();
    });
  }

  ngOnInit(): void {
    this.frmDatos['date_revision'].disable();
    this._activatedRoute!.queryParams!.subscribe((data) => {
      const { id } = data;
      if (id) {
        this.id = id;
        if (this.id) {
          this._productService.getProductId(this.id).subscribe({
            next: (res) => {
              this.titulo = `Editando Producto - ${res.name}`;
              this.product = { ...res } as Product;
              this.frmDatos['id'].disable();
              const productEdit = {
                ...this.product,
                date_release: this.formatDateForInput(
                  this.product.date_release.toString()
                ),
                date_revision: this.formatDateForInput(
                  this.product.date_revision.toString()
                ),
              };
              productEdit;
              this.formData.patchValue(productEdit);
            },
            error: (error) => {
              this._alertService.error(
                `Error al consultar el producto ${this.id} ${error.message}`
              );
            },
          });
        }
      } else {
        this.id = undefined;
        this.titulo = 'Creando Producto';
        this.formData.reset();
      }
    });
  }

  onSubmit() {
    if (this.formData.invalid) {
      // Marcar todos los controles como tocados para mostrar mensajes de error
      this.formData.markAllAsTouched();
      return;
    }

    this.frmDatos['date_revision'].enable();
    this.frmDatos['id'].enable();
    let { id, name, description, logo, date_release, date_revision } =
      this.formData.value;
    const datos: Product = {
      id,
      name,
      logo,
      description,
      date_release: new Date(date_release),
      date_revision: new Date(date_revision),
    };
    this.frmDatos['date_revision'].disable();

    if (this.id) {
      this.frmDatos['id'].disable();
      this.editarProduct(datos);
    } else {
      this.crearProduct(datos);
    }
  }

  crearProduct(data: Product) {
    this._productService.postProduct(data).subscribe({
      next: (res) => {
        this._alertService.success(res.message, 'Saved');
        this.redireccionarGrid();
      },
      error: (error) => {
        this._alertService.error(`Error al crear el producto ${error.message}`);
      },
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  }
  editarProduct(data: Product) {
    this._productService.putProduct(data.id, data).subscribe({
      next: (res) => {
        this._alertService.success(res.message, 'Update');
        this.redireccionarGrid();
      },
      error: (error) => {
        this._alertService.error(
          `Error al editar el producto ${error.message}`
        );
      },
    });
  }
  reiniciarForm() {
    this.formData.reset();
  }

  redireccionarGrid() {
    this._router.navigate(['/']);
  }

  validarIdValido(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (this.formData) {
      if (control.value) {
        return this._productService.getProductIdVerify(control.value).pipe(
          map((product: boolean) => {
            return product == true ? { idExistente: true } : null;
          }),

          catchError(() => of(null))
        );
      }
    }
    return of(null);
  }

  validarFechaMinima(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    const fecha =
      this.fechaServer > this._datePipe.transform(control.value, 'yyyy-MM-dd')!
        ? true
        : false;
    if (this.formData) {
      if (control.value) {
        const fechaMinima =
          this.fechaServer >
          this._datePipe.transform(control.value, 'yyyy-MM-dd')!;
        return of(fechaMinima ? { ErrorFechaMin: true } : null);
      }
    }
    return of(null);
  }
}
