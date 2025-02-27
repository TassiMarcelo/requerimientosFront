export interface Requerimiento {
  id: number;
  codigo: string;
  asunto: string;
  descripcion: string;
  categRequerimiento: string;
  estado: string;
  fechaAlta: string;
  horaAlta?: string;
  prioridad: string;
  tipoRequerimiento: { 
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
  codigoRequerimientoRelacionado?: string[];
}