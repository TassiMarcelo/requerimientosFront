export interface Requerimiento {
  id: number;
  codigo: string;
  asunto: string;
  descripcion: string;
  categRequerimiento: string; // Cambiado de 'categoria'
  estado: string;
  fechaAlta: string;
  horaAlta?: string;
  prioridad: string;
  tipoRequerimiento: {    // Cambiado de 'tipo'
    codigo: string;
    descripcion: string;
  };
  propietario: {
    nombre: string;
    apellido: string;
  };
  emisor:{
    nombre: string;
    apellido: string;
  }
  archivos: Array<{
    nombre: string;
    tipo: string;
  }>;
  requerimientosRelacionados?: string[];
}