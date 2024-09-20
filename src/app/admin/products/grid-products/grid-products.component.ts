import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-grid-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './grid-products.component.html',
  styleUrl: './grid-products.component.css',
})
export class GridProductsComponent implements OnInit {
  products: Product[] = [];
  filteredData: Product[] = [];
  pageSize = 5; // valor inicial
  showDropdown = false;

  get pagedData() {
    return this.filteredData.slice(0, this.pageSize);
  }

  constructor(
    private _productSerive: ProductService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos() {
    this._productSerive.getAll().subscribe({
      next: (res) => {
        this.products = [...res.data];
        this.filteredData = [...res.data];
        this.filteredData = this.products.slice(0, this.pageSize);
      },
      error: (error) => {
        this._alertService.error(
          `Error al consultar los productos ${error.message}`
        );
      },
    });
  }

  editarProducto(id: string) {
    this._router.navigate(['productForm'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        id,
      },
    });
  }

  eliminarProducto(id: string, name: string) {
    this._alertService
      .confirm(`¿Está seguro de eliminar el producto ${name}?`)
      .then((confirmed) => {
        if (confirmed) {
          this._productSerive.deleteProduct(id).subscribe({
            next: (res) => {
              this.obtenerDatos();
              this._alertService.success(res.message, 'Deleted');
            },
            error: (error) => {
              this._alertService.error(
                `Hubo un error al eliminar ${error.message}`,
                'Error'
              );
            },
          });
        }
      });
  }
  onSearch(event: any) {
    if (event) {
      const searchTerm = event.target.value.toLowerCase();
      this.filteredData = this.products.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.date_release.toString().toLowerCase().includes(searchTerm) ||
          item.date_revision.toString().toLowerCase().includes(searchTerm)
      );
    }
  }
  crearProducto() {
    this._router.navigate(['productForm']);
  }

  onChangePageSize(): void {
    this.filteredData = this.products.slice(0, this.pageSize);
  }
}
