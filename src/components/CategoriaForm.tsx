'use client'

import { useState, useEffect } from 'react'
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

interface TipoRequerimiento {
  id: number;
  descripcion: string;
  codigo: string;
}

interface CategoriaFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CategoriaForm({ onSave, onCancel }: CategoriaFormProps) {
  // Estado para tipo de requerimiento
  const [descripcionTipo, setDescripcionTipo] = useState('');
  const [codigo, setCodigo] = useState('');
  
  // Estado para categoría
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | "">("");

  // Estado de error
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para manejar los tipos de requerimiento
  const [tipos, setTipos] = useState<TipoRequerimiento[]>([]);

  // Obtener los tipos de requerimiento al cargar el componente
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await fetch('http://localhost:8080/verTodosTipoRequerimiento');
        if (!response.ok) {
          throw new Error('Error al obtener los tipos de requerimiento');
        }
        const data: TipoRequerimiento[] = await response.json();
        setTipos(data);
      } catch (error) {
        console.error('Error al obtener tipos de requerimiento:', error);
        setErrorMessage('No se pudieron cargar los tipos de requerimiento.');
      }
    };

    fetchTipos();
  }, []);

  const handleTipoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descripcionTipo.trim() || !codigo.trim()) {
      setErrorMessage('Todos los campos son obligatorios para registrar tipo.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/registrarTipoRequerimiento', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          descripcion: descripcionTipo,
          codigo
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      // Verifica si la respuesta tiene contenido antes de intentar analizarla
      const responseText = await response.text();
      if (!responseText) {
        alert('Tipo de requerimiento creado con éxito!'); // Solo muestra el mensaje si la respuesta está vacía
        return;
      }
  
      const data = JSON.parse(responseText); // Ahora puedes analizar el JSON
      setTipos([...tipos, data]); // Agregar el nuevo tipo al estado
      setDescripcionTipo('');
      setCodigo('');
      onSave(data);
      alert('Tipo de requerimiento creado con éxito!');
    } catch (error) {
      console.error('Error al crear tipo de requerimiento:', error);
      setErrorMessage(`Ocurrió un error: ${error.message}`);
    }
  };
  

  const handleCategoriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!descripcionCategoria.trim() || tipoSeleccionado === "") {
      setErrorMessage('Todos los campos son obligatorios para registrar categoría.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/registrarCategoriaRequerimiento', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          descripcion: descripcionCategoria,
          tipoRequerimiento: { id: tipoSeleccionado }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      // Verifica si la respuesta tiene contenido antes de intentar analizarla
      const responseText = await response.text();
      if (!responseText) {
        alert('Categoría creada con éxito!'); // Solo muestra el mensaje si la respuesta está vacía
        return;
      }

      const data = JSON.parse(responseText); // Ahora puedes analizar el JSON
      setDescripcionCategoria('');
      setTipoSeleccionado('');
      onSave(data);
      alert('Categoría creada con éxito!');
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      setErrorMessage(`Ocurrió un error: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-4 rounded-md shadow-lg">
        {/* Formulario para alta de tipo de requerimiento */}
        <form onSubmit={handleTipoSubmit} className="space-y-4 mb-8">
          <h1 className="text-lg font-semibold">Registrar Tipo de Requerimiento</h1>
          <div>
            <Label htmlFor="descripcionTipo">Descripción</Label>
            <Input id="descripcionTipo" value={descripcionTipo} onChange={(e) => setDescripcionTipo(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="codigo">Código (Máximo 3 caracteres)</Label>
            <Input id="codigo" value={codigo} maxLength={3} onChange={(e) => setCodigo(e.target.value)} required />
          </div>
          <Button type="submit">Guardar Tipo</Button>
        </form>

        {/* Formulario para alta de categoría */}
        <form onSubmit={handleCategoriaSubmit} className="space-y-4">
          <h1 className="text-lg font-semibold">Registrar Categoría</h1>
          <div>
            <Label htmlFor="descripcionCategoria">Descripción</Label>
            <Input id="descripcionCategoria" value={descripcionCategoria} onChange={(e) => setDescripcionCategoria(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo de Requerimiento</Label>
            <select id="tipo" value={tipoSeleccionado} onChange={(e) => setTipoSeleccionado(Number(e.target.value))} required>
              <option value="">Seleccionar tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.descripcion} ({tipo.codigo})</option>
              ))}
            </select>
          </div>
          <Button type="submit">Guardar Categoría</Button>
        </form>
      </div>
    </div>
  );
}
