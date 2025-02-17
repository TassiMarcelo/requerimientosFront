'use client'

import { useState, useEffect } from 'react'
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

interface Categoria {
  id: number;
  descripcion: string;
}

interface CategoriaFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CategoriaForm({ onSave, onCancel }: CategoriaFormProps) {
  // Estado para tipo de requerimiento
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | undefined>(undefined);
  
  // Estado para categoria
  const [categoriaDescripcion, setCategoriaDescripcion] = useState('');
  
  // Estado de error
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para manejar las categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Obtener las categorías al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8080/verTodosCategoriaRequerimiento');
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data: Categoria[] = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setErrorMessage('No se pudieron cargar las categorías.');
      }
    };

    fetchCategorias();
  }, []);

  const handleTipoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!descripcion.trim() || !codigo.trim() || categoriaSeleccionada === undefined) {
      setErrorMessage('Todos los campos son obligatorios para registrar tipo.');
      return;
    }
  
    console.log('Datos enviados al servidor:', {
      categoriaRequerimiento: { id: categoriaSeleccionada },
      descripcion,
      codigo
    });
  
    try {
      const response = await fetch('http://localhost:8080/registrarTipoRequerimiento', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          categoriaRequerimiento: { id: categoriaSeleccionada },
          descripcion,
          codigo
        })
      });
  
      // Verificar si la respuesta tiene contenido
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      // Si la respuesta tiene contenido JSON
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log('Tipo de requerimiento creado:', data);
        onSave(data);
      } else {
        console.log('La respuesta no contiene datos JSON, respuesta vacía o diferente.');
        // Aquí puedes manejar una respuesta vacía, si es esperada
      }
    } catch (error) {
      console.error('Error al crear tipo de requerimiento:', error);
      setErrorMessage(`Ocurrió un error: ${error.message}`);
    }
  };
  
  

  // Manejo del submit para categoría
  const handleCategoriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!categoriaDescripcion.trim()) {
      setErrorMessage('La descripción de la categoría es obligatoria.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/registrarCategoriaRequerimiento', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ descripcion: categoriaDescripcion })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      // Si la respuesta no tiene cuerpo (código 204 o similar), no intentamos parsear JSON
      if (response.status === 204) {
        console.log('Categoría creada exitosamente sin respuesta');
        onSave({ descripcion: categoriaDescripcion }); // Puedes manejar lo que necesites aquí
      } else {
        // Si hay contenido JSON, intentamos parsearlo
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log('Categoría creada:', data);
          onSave(data);
        } else {
          console.log('Categoría creada sin respuesta JSON');
          onSave({ descripcion: categoriaDescripcion }); // Puedes manejar lo que necesites aquí
        }
      }
  
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      setErrorMessage(`Ocurrió un error: ${error.message}`);
    }
  };
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-4 rounded-md shadow-lg">
        {/* Formulario para alta de categoría */}
        <form onSubmit={handleCategoriaSubmit} className="space-y-4 mb-8">
          <h1 className="text-lg font-semibold">Registrar Categoría</h1>
          <div>
            <Label htmlFor="categoriaDescripcion">Descripción</Label>
            <Input
              id="categoriaDescripcion"
              value={categoriaDescripcion}
              onChange={(e) => setCategoriaDescripcion(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-between items-center mt-6">
            <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-500 text-white">
              Cancelar
            </Button>
            <Button type="submit">Guardar Categoría</Button>
          </div>
        </form>

        {/* Formulario para alta de tipo de requerimiento */}
        <form onSubmit={handleTipoSubmit} className="space-y-4">
          <h1 className="text-lg font-semibold">Registrar Tipo de Requerimiento</h1>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <select
              id="categoria"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.descripcion}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <div className="flex justify-between items-center mt-6">
            <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-500 text-white">
              Cancelar
            </Button>
            <Button type="submit">Guardar Tipo</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
