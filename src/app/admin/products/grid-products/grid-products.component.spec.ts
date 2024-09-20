import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GridProductsComponent } from './grid-products.component';
import { ProductService } from '../../../core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertService } from '../../../shared/services/alert.service'; // Asegúrate de importar el servicio de alertas
import { of, throwError } from 'rxjs';
import { Product } from '../../../core/models/product.model';

// Crear mocks de los servicios usando Partial
const mockProductService: Partial<ProductService> = {
  getAll: jest.fn(),
};

const mockAlertService: Partial<AlertService> = {
  confirm: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
};

describe('GridProductsComponent', () => {
  let component: GridProductsComponent;
  let fixture: ComponentFixture<GridProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GridProductsComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridProductsComponent);
    component = fixture.componentInstance;
    // Simular una respuesta vacía de getAll()
    (mockProductService.getAll as jest.Mock).mockReturnValue(of([]));

    fixture.detectChanges();
  });
  it('should call obtenerDatos on ngOnInit and handle success response', () => {
    const mockProducts: Product[] = [
      {
        id: 'mockId1',
        name: 'Mock Product 1',
        description: 'Mock Description 1',
        logo: 'Mock Logo 1',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: 'mockId2',
        name: 'Mock Product 2',
        description: 'Mock Description 2',
        logo: 'Mock Logo 2',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];

    // Simular una respuesta exitosa de getAll()
    (mockProductService.getAll as jest.Mock).mockReturnValue(of(mockProducts));

    // Ejecutar ngOnInit para que se llame a obtenerDatos
    component.ngOnInit();

    // Verificar que getAll() fue llamado
    expect(mockProductService.getAll).toHaveBeenCalled();

    // Verificar que productos se asignan correctamente
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredData).toEqual(
      mockProducts.slice(0, component.pageSize)
    );
  });

  it('should handle obtenerDatos error', () => {
    const mockError = new Error('Network error');

    // Simular un error en getAll()
    (mockProductService.getAll as jest.Mock).mockReturnValue(
      throwError(() => mockError)
    );

    // Ejecutar ngOnInit para que se llame a obtenerDatos
    component.ngOnInit();

    // Verificar que getAll() fue llamado
    expect(mockProductService.getAll).toHaveBeenCalled();

    // Verificar que se muestra el mensaje de error
    expect(mockAlertService.error).toHaveBeenCalledWith(
      `Error al consultar los productos ${mockError.message}`
    );
    expect(mockAlertService.error).toHaveBeenCalledTimes(1);
  });

  it('should create', () => {
    (mockProductService.getAll as jest.Mock).mockReturnValue(of([]));

    expect(component).toBeTruthy();
  });
});
