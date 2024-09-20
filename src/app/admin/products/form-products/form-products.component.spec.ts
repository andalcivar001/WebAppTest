import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RouterModule } from '@angular/router';

import { FormProductsComponent } from './form-products.component';
import { ProductService } from '../../../core/services/product.service';
import { AlertService } from '../../../shared/services/alert.service'; // Asegúrate de importar el servicio de alertas
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('FormProductsComponent', () => {
  let component: FormProductsComponent;
  let fixture: ComponentFixture<FormProductsComponent>;
  let mockProductService: Partial<ProductService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockAlertService: Partial<AlertService>;

  beforeEach(async () => {
    mockProductService = {
      getProductId: jest.fn().mockReturnValue(
        of({
          id: 'mockId',
          name: 'Mock Product',
          description: 'This is a mock product description',
          logo: 'mockLogo.png',
          date_release: new Date('2024-07-30T06:33:07.327Z'),
          date_revision: new Date('2024-07-30T06:33:07.327Z'),
        })
      ),
      postProduct: jest.fn().mockReturnValue(
        of({
          id: 'mockId',
          name: 'Mock Product',
          description: 'This is a mock product description',
          logo: 'mockLogo.png',
          date_release: new Date(),
          date_revision: new Date(),
        })
      ),

      // Simula otros métodos si es necesario
    };
    mockActivatedRoute = {
      queryParams: of({ id: 'mockId' }), // Simula los parámetros de consulta
    };

    mockAlertService = {
      error: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormProductsComponent,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]), // Configura el router con forRoot
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call getProductId and handle response', () => {
    component.ngOnInit(); // Ejecuta la lógica que debería llamar a getProductId

    expect(mockProductService.getProductId).toHaveBeenCalledWith('mockId');
    expect(component.titulo).toBe('Editando Producto - Mock Product');
    // Verifica propiedades específicas
    expect(component.product?.id).toBe('mockId');
    expect(component.product?.name).toBe('Mock Product');
    expect(component.product?.description).toBe(
      'This is a mock product description'
    );
    expect(component.product?.logo).toBe('mockLogo.png');
    expect(component.product?.date_release).toEqual(
      new Date('2024-07-30T06:33:07.327Z')
    );
    expect(component.product?.date_revision).toEqual(
      new Date('2024-07-30T06:33:07.327Z')
    );
  });

  it('should handle error from getProductId', () => {
    // Simula un error
    (mockProductService.getProductId as jest.Mock).mockReturnValue(
      throwError(() => new Error('Test Error'))
    );

    component.ngOnInit(); // Ejecuta la lógica que debería llamar a getProductId

    expect(mockAlertService.error).toHaveBeenCalledWith(
      'Error al consultar el producto mockId Test Error'
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
