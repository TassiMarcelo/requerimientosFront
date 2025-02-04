import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusSquare, User } from 'lucide-react';

interface Requerimiento {
  codigo: string;
  prioridad: 'MEDIA' | 'BAJA' | 'URGENTE';
  tipo: string;
  categoria: string;
  fechaAlta: string;
  estado: string;
  asunto: string;
  propietario: string;
  descripcion?: string;
  requerimientosRelacionados: string[];
}

interface CrearRequerimientoProps {
  onCrear: (requerimiento: Requerimiento) => void;
}

export function CrearRequerimiento({ onCrear }: CrearRequerimientoProps) {
  const navigate = useNavigate();
  const [nuevoRequerimiento, setNuevoRequerimiento] = useState<Requerimiento>({
    codigo: '',
    prioridad: 'MEDIA',
    tipo: '',
    categoria: '',
    fechaAlta: '',
    estado: 'Abierto',
    asunto: '',
    propietario: 'g.jorge',
    descripcion: '',
    requerimientosRelacionados: [], 
  });

  const handleRelacionadosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Añadimos el valor al array, asegurándonos de que no haya duplicados
    setNuevoRequerimiento({
      ...nuevoRequerimiento,
      requerimientosRelacionados: value ? value.split(',').map(item => item.trim()) : [],
    });
  };

  const crearRequerimiento = () => {
    const nuevoId = `REQ-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 1000000,
    )
      .toString()
      .padStart(9, '0')}`;
    const fechaActual = new Date().toLocaleDateString('es-ES');
    const nuevoReq = {
      ...nuevoRequerimiento,
      codigo: nuevoId,
      fechaAlta: fechaActual,
    };

    onCrear(nuevoReq);
    navigate('/'); // Redirige a la tabla después de guardar
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center bg-[#556B2F] text-white p-4 rounded-t-md">
        <h2 className="text-2xl font-bold">Crear Requerimiento</h2>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <span>g.jorge</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="asunto" className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
            Asunto:
          </label>
          <input
            id="asunto"
            value={nuevoRequerimiento.asunto}
            onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, asunto: e.target.value })}
            className="w-full border-2 rounded-lg p-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">Tipo</label>
            <select
  onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, tipo: e.target.value })}
  className="w-full border rounded-b-lg p-2"
>
  <option value="">Seleccionar tipo</option>
  {/* Solo muestra estas opciones si se cumplen ciertas condiciones */}
  <option value="hardware">Requerimiento de Hardware</option>
  <option value="software">Requerimiento de Software</option>
  <option value="error">Error</option>
</select>
          </div>

          <div>
            <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">Categoría</label>
            <select
              onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, categoria: e.target.value })}
              className="w-full border rounded-b-lg p-2"
            >
              <option value="">Seleccionar categoría</option>
              <option value="reparacion">Solicitud reparación de hardware</option>
              <option value="instalacion">Instalación de software</option>
              <option value="falla">Nueva falla</option>
            </select>
          </div>

          <div>
            <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">Estado</label>
            <input value="Abierto" disabled className="w-full bg-gray-100 border rounded-b-lg p-2" />
          </div>

          <div>
            <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">Prioridad</label>
            <select
              onChange={(e) =>
                setNuevoRequerimiento({ ...nuevoRequerimiento, prioridad: e.target.value as 'MEDIA' | 'BAJA' | 'URGENTE' })
              }
              className="w-full border rounded-b-lg p-2"
            >
              <option value="">Seleccionar Prioridad</option>
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="descripcion"
            className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg"
          >
            Descripción:
          </label>
          <textarea
            id="descripcion"
            value={nuevoRequerimiento.descripcion}
            onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, descripcion: e.target.value })}
            className="min-h-[200px] w-full border-2 rounded-lg p-2"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="requerimientosRelacionados"
            className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg"
          >
            Requerimientos Relacionados (Códigos separados por coma):
          </label>
          <input
            id="requerimientosRelacionados"
            value={nuevoRequerimiento.requerimientosRelacionados.join(', ')} // Muestra los códigos separados por coma
            onChange={handleRelacionadosChange}
            className="w-full border-2 rounded-lg p-2"
            placeholder="Ej: REQ-2025-000123, REQ-2025-000456"
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 text-white px-8 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={crearRequerimiento}
            className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
