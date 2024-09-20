import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  success(message: string, title?: string) {
    Swal.fire({
      title: title || 'Success',
      text: message,
      icon: undefined,
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'button-guardar',
        cancelButton: 'button-reiniciar',
      },
      width: '400px', // ancho del diálogo
      heightAuto: false, // desactiva la altura automática
    });
  }

  error(message: string, title?: string) {
    Swal.fire({
      title: title || 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'button-guardar',
        cancelButton: 'button-reiniciar',
      },
      width: '400px', // ancho del diálogo
      heightAuto: false, // desactiva la altura automática
    });
  }

  warning(message: string, title?: string) {
    Swal.fire({
      title: title || 'Warning',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'button-guardar',
        cancelButton: 'button-reiniciar',
      },
      width: '400px', // ancho del diálogo
      heightAuto: false, // desactiva la altura automática
    });
  }

  info(message: string, title?: string) {
    Swal.fire({
      title: title || 'Info',
      text: message,
      icon: 'info',
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'button-guardar',
        cancelButton: 'button-reiniciar',
      },
      width: '400px', // ancho del diálogo
      heightAuto: false, // desactiva la altura automática
    });
  }
  async confirm(message: string, title?: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: message,
      icon: undefined,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'button-guardar',
        cancelButton: 'button-reiniciar',
      },
      width: '400px', // ancho del diálogo
      heightAuto: false, // desactiva la altura automática
    });
    return result.isConfirmed;
  }
}
