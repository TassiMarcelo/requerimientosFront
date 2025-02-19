'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface TipoRequerimiento {
  id: number;
  descripcion: string;
  codigo: string;
  categoriaRequerimiento: { id: number, descripcion: string }[]; // Relación de categorías por tipo
}

interface CategoriaRequerimiento {
  id: number;
  descripcion: string;
  tipoRequerimiento: { id: number }; // Relación inversa a tipo
}

interface CategoriaFormProps {
  onCancel: () => void;
}

export function CategoriaForm({ onCancel }: CategoriaFormProps) {
  const [tipos, setTipos] = useState<TipoRequerimiento[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Estados para los formularios
  const [showTipoForm, setShowTipoForm] = useState(false);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);
  
  // Estado para tipo
  const [descripcionTipo, setDescripcionTipo] = useState('');
  const [codigo, setCodigo] = useState('');
  
  // Estado para categoría
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<number | "">("");
  
  // Obtener los tipos de requerimiento y categorías al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposResponse, categoriasResponse] = await Promise.all([
          fetch('http://localhost:8080/verTodosTipoRequerimiento'),
          fetch('http://localhost:8080/verTodosCategoriaRequerimiento'),
        ]);

        if (!tiposResponse.ok || !categoriasResponse.ok) {
          throw new Error('Error al obtener los datos');
        }

        const tiposData: TipoRequerimiento[] = await tiposResponse.json();
        const categoriasData: CategoriaRequerimiento[] = await categoriasResponse.json();

        // Asignar categorías a los tipos correspondientes
        const tiposConCategorias = tiposData.map((tipo) => {
          const categoriasRelacionadas = categoriasData.filter(
            (categoria) => categoria.tipoRequerimiento?.id === tipo.id
          );
          return {
            ...tipo,
            categoriaRequerimiento: categoriasRelacionadas.map((categoria) => ({
              id: categoria.id,
              descripcion: categoria.descripcion,
            })),
          };
        });

        setTipos(tiposConCategorias);

      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setErrorMessage('No se pudieron cargar los tipos de requerimiento.');
      }
    };

    fetchData();
  }, []);
  
// Función para manejar la creación de una nueva categoría
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
      throw new Error('Error al crear la categoría.');
    }

    // Intentar parsear la respuesta como JSON
    let newCategoria;
    try {
      newCategoria = await response.json();
    } catch (error) {
      // Si la respuesta no es JSON válido, crear un objeto de categoría localmente
      newCategoria = {
        id: Date.now(), // Usar un ID temporal (puedes cambiarlo por un ID generado por el backend)
        descripcion: descripcionCategoria,
        tipoRequerimiento: { id: tipoSeleccionado }
      };
    }

    // Actualizar el estado `tipos` de manera inmutable
    setTipos(prevTipos => 
      prevTipos.map(tipo => 
        tipo.id === tipoSeleccionado 
          ? { 
              ...tipo, 
              categoriaRequerimiento: [...tipo.categoriaRequerimiento, newCategoria] 
            }
          : tipo
      )
    );
    
    // Limpiar el formulario y cerrarlo
    setDescripcionCategoria('');
    setTipoSeleccionado('');
    setShowCategoriaForm(false);  // Cerrar formulario categoría después de guardar
    setErrorMessage(''); // Limpiar mensajes de error
    alert('Categoría creada con éxito!');
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    setErrorMessage('Ocurrió un error al crear la categoría.');
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-lg relative overflow-y-auto max-h-[80vh]">
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <div>
          {tipos.length === 0 ? (
            <p>No hay tipos de requerimiento disponibles.</p>
          ) : (
            tipos.map((tipo) => (
              <div key={tipo.id} className="mb-4 p-4 border rounded-md">
                <h2 className="font-semibold">{tipo.descripcion} ({tipo.codigo})</h2>
                <div className="mt-2">
                  <h3 className="font-semibold">Categorías:</h3>
                  {tipo.categoriaRequerimiento.length === 0 ? (
                    <p>No hay categorías asociadas a este tipo.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {tipo.categoriaRequerimiento.map((categoria) => (
                        <li key={categoria.id}>{categoria.descripcion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botones para agregar tipo y categoría */}
        <div className="flex justify-between mt-4">
          <div className="flex space-x-2">
            <Button onClick={() => setShowTipoForm(true)}>+ Tipo</Button>
            <Button onClick={() => setShowCategoriaForm(true)}>+ Categoría</Button>
          </div>

          {/* Botón de Cerrar alineado a la derecha */}
          <Button onClick={onCancel}>Cerrar</Button>
        </div>

        {/* Formulario para crear Categoría */}
        {showCategoriaForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="w-full max-w-md bg-white p-4 rounded-md shadow-lg">
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
                <Button type="button" onClick={() => setShowCategoriaForm(false)}>Cancelar</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/*
'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"

interface TipoRequerimiento {
  id: number;
  descripcion: string;
  codigo: string;
  categoriaRequerimiento: { id: number, descripcion: string }[]; // Relación de categorías por tipo
}

interface CategoriaRequerimiento {
  id: number;
  descripcion: string;
  tipoRequerimiento: { id: number }; // Relación inversa a tipo
}

interface CategoriaFormProps {
  onCancel: () => void;
}

export function CategoriaForm({ onCancel }: CategoriaFormProps) {
  // Estado para manejar los tipos de requerimiento y categorías
  const [tipos, setTipos] = useState<TipoRequerimiento[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Obtener los tipos de requerimiento y categorías al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposResponse, categoriasResponse] = await Promise.all([
          fetch('http://localhost:8080/verTodosTipoRequerimiento'),
          fetch('http://localhost:8080/verTodosCategoriaRequerimiento'),
        ]);

        if (!tiposResponse.ok || !categoriasResponse.ok) {
          throw new Error('Error al obtener los datos');
        }

        const tiposData: TipoRequerimiento[] = await tiposResponse.json();
        const categoriasData: CategoriaRequerimiento[] = await categoriasResponse.json();

        // Asignar categorías a los tipos correspondientes
        const tiposConCategorias = tiposData.map((tipo) => {
          const categoriasRelacionadas = categoriasData.filter(
            (categoria) => categoria.tipoRequerimiento?.id === tipo.id
          );
          return {
            ...tipo,
            categoriaRequerimiento: categoriasRelacionadas.map((categoria) => ({
              id: categoria.id,
              descripcion: categoria.descripcion,
            })),
          };
        });

        setTipos(tiposConCategorias);

      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setErrorMessage('No se pudieron cargar los tipos de requerimiento o categorías.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-lg relative overflow-y-auto max-h-[80vh]">
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <div>
          {tipos.length === 0 ? (
            <p>No hay tipos de requerimiento disponibles.</p>
          ) : (
            tipos.map((tipo) => (
              <div key={tipo.id} className="mb-4 p-4 border rounded-md">
                <h2 className="font-semibold">{tipo.descripcion} ({tipo.codigo})</h2>
                <div className="mt-2">
                  <h3 className="font-medium">Categorías:</h3>
                  {tipo.categoriaRequerimiento.length === 0 ? (
                    <p>No hay categorías asociadas a este tipo.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {tipo.categoriaRequerimiento.map((categoria) => (
                        <li key={categoria.id}>{categoria.descripcion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex space-x-2">
            <Button>+ Tipo</Button>
            <Button>+ Categoría</Button>
          </div>

          <Button onClick={onCancel}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}
*/

/*
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
  
      const responseText = await response.text();
      if (!responseText) {
        alert('Tipo de requerimiento creado con éxito!');
        setDescripcionTipo('');  
        setCodigo(''); 
        return;
      }
  
      const data = JSON.parse(responseText); 

      const fetchTipos = async () => {
      try {
        const response = await fetch('http://localhost:8080/verTodosTipoRequerimiento');
        if (!response.ok) {
          throw new Error('Error al obtener los tipos de requerimiento');
        }
        const data: TipoRequerimiento[] = await response.json();
        setTipos(data); // Actualizar el estado con los tipos obtenidos desde el servidor
      } catch (error) {
      console.error('Error al crear tipo de requerimiento:', error);
      setErrorMessage(`Ocurrió un error: ${error.message}`);
    }
  };

  fetchTipos();

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
        setDescripcionCategoria('');  // Limpiar input
        setTipoSeleccionado('');
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
*/