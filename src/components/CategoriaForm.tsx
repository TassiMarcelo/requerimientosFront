'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Select from 'react-select'
import CloseButton from "./ui/CloseButton";

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
  onClose: () => void;
}

export function CategoriaForm({ onClose }: CategoriaFormProps) {
  const [tipos, setTipos] = useState<TipoRequerimiento[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTipoForm, setShowTipoForm] = useState(false);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);
  
  const [descripcionTipo, setDescripcionTipo] = useState('');
  const [codigo, setCodigo] = useState('');
  
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoRequerimiento | null>(null);
  const filteredTipos = tipos.filter((tipo) => {
    const matchesTipo = tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        tipo.codigo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = tipo.categoriaRequerimiento.some(
      (categoria) => categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
        return matchesTipo || matchesCategoria;
  });
  
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
  }, [tipos]); 
  
  
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
      throw new Error('Error al crear el tipo de requerimiento.');
    }

    const responseText = await response.text();
    if (!responseText) {
      const tipoConId = { id: Date.now(), descripcion: descripcionTipo, codigo, categoriaRequerimiento: [] };
      setTipos(prevTipos => [...prevTipos, tipoConId]);
      setDescripcionTipo('');
      setCodigo('');
      setShowTipoForm(false);
      setErrorMessage('');
      alert('Tipo de requerimiento creado con éxito!');
      return;
    }

    const newTipo = JSON.parse(responseText);

    const tipoConId = newTipo?.id ? newTipo : { id: Date.now(), descripcion: descripcionTipo, codigo, categoriaRequerimiento: [] };

    setTipos(prevTipos => [...prevTipos, tipoConId]);

    setDescripcionTipo('');
    setCodigo('');
    setShowTipoForm(false);  
    setErrorMessage('');
    alert('Tipo de requerimiento creado con éxito!');
  } catch (error) {
    console.error('Error al crear tipo:', error);
    setErrorMessage('Ocurrió un error al crear el tipo de requerimiento.');
  }
};




const handleCategoriaSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!descripcionCategoria.trim() || tipoSeleccionado === null) {
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
        tipoRequerimiento: { id: tipoSeleccionado.id }
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear la categoría.');
    }

    const responseText = await response.text();
    if (!responseText) {
      alert('Categoría creada con éxito!');
      setDescripcionCategoria('');
      setTipoSeleccionado(null);
      setShowCategoriaForm(false); 
      return;
    }

    const newCategoria = JSON.parse(responseText);

    setTipos(prevTipos => 
      prevTipos.map(tipo => 
        tipo.id === tipoSeleccionado.id
          ? { 
              ...tipo, 
              categoriaRequerimiento: [...tipo.categoriaRequerimiento, newCategoria] 
            }
          : tipo
      )
    );

    setDescripcionCategoria('');
    setTipoSeleccionado(null);
    setShowCategoriaForm(false); 
    setErrorMessage('');
    alert('Categoría creada con éxito!');
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    setErrorMessage('Ocurrió un error al crear la categoría.');
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-lg relative overflow-y-auto max-h-[80vh]">
      <CloseButton onClick={onClose} />
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <div className="mb-4 mt-6">
        <Input
          placeholder="Buscar tipos o categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
       
      <div>
        {filteredTipos.length === 0 ? (
          <p>No se encontraron coincidencias.</p>
        ) : (
          filteredTipos.map((tipo) => (
            <div key={tipo.id} className="mb-4 p-4 border rounded-md">
              <h2 className="font-semibold">{tipo.descripcion} ({tipo.codigo})</h2>
              <div className="mt-2">
                <h3 className="font-semibold">Categorías:</h3>
                {tipo.categoriaRequerimiento.length === 0 ? (
                  <p>No hay categorías asociadas a este tipo.</p>
                ) : (
                  <ul className="list-disc pl-5">
                  {tipo.categoriaRequerimiento.map((categoria) => {
                    const matchesCategoria = categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
                    return (
                      <li key={categoria.id} className={matchesCategoria ? "font-semibold" : ""}>
                        {categoria.descripcion}
                      </li>
                    );
                  })}
                  </ul>
                )}
              </div>
            </div>
          ))
        )}
      </div>

        <div className="flex justify-between mt-4">
          <div className="flex space-x-2">
            <Button onClick={() => setShowTipoForm(true)}>+ Tipo</Button>
            <Button onClick={() => setShowCategoriaForm(true)}>+ Categoría</Button>
          </div>
          <Button onClick={onClose}>Cerrar</Button>
        </div>

        {showTipoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
          <div className="w-full max-w-md bg-white p-4 rounded-md shadow-lg relative">
          <CloseButton onClick={() => setShowTipoForm(false)} />
            <form onSubmit={handleTipoSubmit} className="space-y-4 mt-6">
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
              <Button type="button" onClick={() => setShowTipoForm(false)}>Cancelar</Button>
            </form>
          </div>
        </div>
      )}

        {/* Formulario para crear Categoría */}
        {showCategoriaForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
            <div className="w-full max-w-md bg-white p-4 rounded-md shadow-lg relative">
            <CloseButton onClick={() => setShowCategoriaForm(false)} />
              <form onSubmit={handleCategoriaSubmit} className="space-y-4">
                <h1 className="text-lg font-semibold">Registrar Categoría</h1>
                <div>
                  <Label htmlFor="descripcionCategoria">Descripción</Label>
                  <Input id="descripcionCategoria" value={descripcionCategoria} onChange={(e) => setDescripcionCategoria(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Requerimiento</Label>
         <Select
                  id="tipo"
                  value={tipoSeleccionado ? {
                    value: tipoSeleccionado.id,  // ID del tipo
                    label: `${tipoSeleccionado.descripcion} (${tipoSeleccionado.codigo})` // Descripción + Código
                  } : null}
                  onChange={(e) => {
                    const selectedTipo = tipos.find(tipo => tipo.id === e?.value);
                    setTipoSeleccionado(selectedTipo || null);  // Guarda el objeto completo
                  }}
                  options={tipos.map((tipo) => ({
                    value: tipo.id,
                    label: `${tipo.descripcion} (${tipo.codigo})` // Mostrar descripción + código en las opciones
                  }))}
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: '1px solid black',        // Borde negro
                      backgroundColor: 'white',         // Fondo blanco
                      borderRadius: '4px',              // Esquinas redondeadas
                      padding: '1px 8px',
                      height: '36px', 
                      width: '100%',  
                      justifyContent: 'center', 
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: 'black',                   // Icono de la flecha también negro
                    }),
                    indicatorSeparator: (base) => ({
                      ...base,
                      backgroundColor: 'black',         // Separador de los indicadores negro
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: 'white',         
                      border: '1px solid black',  
                      maxHeight: '250px', 
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#f0f0f0' : 'white', // Fondo blanco, pero cambia cuando está seleccionado
                      color: 'black',                   // Color del texto negro
                    }),
                  }}
                  placeholder="Seleccionar tipo"
                  required
                />


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
