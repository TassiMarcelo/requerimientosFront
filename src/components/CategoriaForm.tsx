"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "react-select";
import CloseButton from "./ui/CloseButton";
import Button2 from "./ui/Button2/Button2";
import { Pencil, Trash2} from 'lucide-react'

interface TipoRequerimiento {
  descripcion: string;
  codigo: string;
}

interface CategoriaRequerimiento {
  id: number;
  descripcion: string;
  codigoTipoRequerimiento: string;
}

interface CategoriaFormProps {
  onClose: () => void;
}

async function obtenerTipos() {
  const response = await fetch('http://localhost:8080/tiposRequerimientos/getAll');
  const data = await response.json();
  return data.data; // Los tipos de requerimiento
}

async function obtenerCategorias() {
  const response = await fetch('http://localhost:8080/categRequerimientos/todas');
  const data = await response.json();
  return data.data; // Las categorías de requerimiento
}

export function CategoriaForm({ onClose }: CategoriaFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTipoForm, setShowTipoForm] = useState(false);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);

  const [descripcionTipo, setDescripcionTipo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipos, setTipos] = useState<TipoRequerimiento[]>([]);
  const [categorias, setCategorias] = useState<CategoriaRequerimiento[]>([]);
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] =
    useState<TipoRequerimiento | null>(null);
    const filtrarRequerimientos = (searchTerm: string) => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
    
      const filteredTipos = tipos.filter(
        (tipo) =>
          (tipo.descripcion && tipo.descripcion.toLowerCase().includes(lowercasedSearchTerm)) ||
          (tipo.codigo && tipo.codigo.toLowerCase().includes(lowercasedSearchTerm))
      );
    
      const filteredCategorias = categorias.filter(
        (categoria) =>
          (categoria.descripcion && categoria.descripcion.toLowerCase().includes(lowercasedSearchTerm)) || // Filtra por descripción de categoría
          (categoria.codigoTipoRequerimiento && categoria.codigoTipoRequerimiento.toLowerCase().includes(lowercasedSearchTerm)) ||
          tipos.some(
            (tipo) =>
              tipo.codigo === categoria.codigoTipoRequerimiento &&
              (tipo.descripcion && tipo.descripcion.toLowerCase().includes(lowercasedSearchTerm))
          )
      );
      return { filteredTipos, filteredCategorias };
    };
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const tiposResponse = await fetch("http://localhost:8080/tiposRequerimientos/false/todos"); // Obtener solo tipos activos
          const categoriasResponse = await fetch("http://localhost:8080/categRequerimientos/todas"); // Obtener todas las categorías
    
          if (!tiposResponse.ok || !categoriasResponse.ok) {
            throw new Error("Error al obtener los datos");
          }
    
          const tiposData = await tiposResponse.json();
          const categoriasData = await categoriasResponse.json();
    
          // Asignamos los datos de tipos activos y categorías a los estados correspondientes
          const tipos: TipoRequerimiento[] = tiposData.data;
          const categorias: CategoriaRequerimiento[] = categoriasData.data;
    
          setTipos(tipos); // Guardamos los tipos activos en el estado
          setCategorias(categorias); // Guardamos las categorías en el estado
    
        } catch (error) {
          console.error("Error al obtener los datos:", error);
          setErrorMessage("No se pudieron cargar los tipos de requerimiento.");
        }
      };
    
      fetchData();
    }, []);
    

  const { filteredTipos, filteredCategorias } = filtrarRequerimientos(searchTerm);
  const handleDeleteTipo = async (codigo: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/tiposRequerimientos/${codigo}/desactivar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codigo,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Error al eliminar el tipo de requerimiento");
      }
      obtenerTiposActivos();
    } catch (error) {
      console.error("Error al eliminar el tipo:", error);
    }
  };
  const handleEditTipo = (tipo: TipoRequerimiento) => {
    setDescripcionTipo(tipo.descripcion);
    setCodigo(tipo.codigo);
    setShowTipoForm(true); // Abre el formulario de edición
  };

  const obtenerTiposActivos = async () => {
    try {
      const response = await fetch("http://localhost:8080/tiposRequerimientos/false/todos");
      const data = await response.json();
      
      if (response.ok) {
        // Actualizamos el estado solo con los tipos activos
        setTipos(data.data);
      } else {
        console.error("Error al obtener los tipos:", data.message);
      }
    } catch (error) {
      console.error("Error al obtener los tipos:", error);
    }
  };
  
  
  const handleTipoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcionTipo.trim() || !codigo.trim()) {
      setErrorMessage("Todos los campos son obligatorios para registrar tipo.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/tiposRequerimientos/agregar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            descripcion: descripcionTipo,
            codigo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear el tipo de requerimiento.");
      }

      const responseText = await response.text();
      if (!responseText) {
        const tipoConId = {
          id: Date.now(),
          descripcion: descripcionTipo,
          codigo,
          categoriaRequerimiento: [],
        };
        setTipos((prevTipos) => [...prevTipos, tipoConId]);
        setDescripcionTipo("");
        setCodigo("");
        setShowTipoForm(false);
        setErrorMessage("");
        return;
      }

      const newTipo = JSON.parse(responseText);

      const tipoConId = newTipo?.id
        ? newTipo
        : {
            id: Date.now(),
            descripcion: descripcionTipo,
            codigo,
            categoriaRequerimiento: [],
          };

      setTipos((prevTipos) => [...prevTipos, tipoConId]);

      setDescripcionTipo("");
      setCodigo("");
      setShowTipoForm(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al crear tipo:", error);
      setErrorMessage("Ocurrió un error al crear el tipo de requerimiento.");
    }
  };

  const handleCategoriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcionCategoria.trim() || tipoSeleccionado === null) {
      setErrorMessage(
        "Todos los campos son obligatorios para registrar categoría."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/categRequerimientos/agregar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            descripcion: descripcionCategoria,
            codigoTipoRequerimiento: tipoSeleccionado.codigo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la categoría.");
      }

      const responseText = await response.text();
      if (!responseText) {
        setDescripcionCategoria("");
        setTipoSeleccionado(null);
        setShowCategoriaForm(false);
        return;
      }

      const categoriasResponse = await fetch("http://localhost:8080/categRequerimientos/todas");
      if (!categoriasResponse.ok) {
        throw new Error("Error al obtener las categorías.");
      }
      const categoriasData = await categoriasResponse.json();
      const nuevaCategoria = categoriasData.data.find(
        (categoria) =>
          categoria.descripcion === descripcionCategoria &&
          categoria.codigoTipoRequerimiento === tipoSeleccionado.codigo
      );
  
      if (!nuevaCategoria) {
        throw new Error("No se pudo encontrar la categoría recién creada.");
      }
      setCategorias((prevCategorias) => [
        ...prevCategorias,
        nuevaCategoria,
      ]);
  
      setDescripcionCategoria("");
      setTipoSeleccionado(null);
      setShowCategoriaForm(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al crear la categoría:", error);
      setErrorMessage("Ocurrió un error al crear la categoría.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-lg relative overflow-y-auto max-h-[80vh]">
        <div className="border-b border-gray-600 bg-gray-500 w-full relative p-5">
        
          <div className="absolute -top-1 right-4">
          
            <CloseButton onClick={onClose} />
          </div>
        </div>

        <div className="p-6">

          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <div className="mb-4 mt-6">
            <Input
              placeholder="Buscar tipos o categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
  {filteredTipos.length === 0 && filteredCategorias.length === 0 ? (
    <p>No se encontraron coincidencias.</p>
  ) : (
    <>
      {/* Mostrar solo los tipos que coinciden con la búsqueda */}
      {tipos
        .filter((tipo) => {
          const coincideTipo =
            tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tipo.codigo.toLowerCase().includes(searchTerm.toLowerCase());
          const coincideCategoria = categorias.some(
            (categoria) =>
              categoria.codigoTipoRequerimiento === tipo.codigo &&
              categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return coincideTipo || coincideCategoria;
        })
        .map((tipo) => {
          const categoriasDelTipo = categorias.filter(
            (categoria) => categoria.codigoTipoRequerimiento === tipo.codigo
          );

          return (
            <div key={tipo.codigo} className="mb-4 p-4 border rounded-md">
              <h2 className="font-semibold">
                {tipo.descripcion} ({tipo.codigo})
                <div className="flex space-x-2">
            <Pencil className="cursor-pointer" onClick={() => handleEditTipo(tipo)} />
            <Trash2 className="cursor-pointer" onClick={() => handleDeleteTipo(tipo.codigo)} />
          </div>
              </h2>
              <div className="mt-2">
                {categoriasDelTipo.length > 0 ? (
                  <>
                    <h3 className="font-semibold">Categorías:</h3>
                    <ul className="list-disc pl-5">
                      {categoriasDelTipo.map((categoria) => (
                        <li
                          key={categoria.id}
                          className={
                            categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
                              ? "font-bold" // Resaltar en negrita si coincide con la búsqueda
                              : ""
                          }
                        >
                          {categoria.descripcion}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>No existen categorías asociadas.</p>
                )}
              </div>
            </div>
          );
        })}
    </>
  )}
</div>
          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <Button onClick={() => setShowTipoForm(true)}>+ Tipo</Button>
              <Button onClick={() => setShowCategoriaForm(true)}>
                + Categoría
              </Button>
            </div>
            <Button onClick={onClose}>Cerrar</Button>
          </div>
          {showTipoForm && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
              <div className="w-full max-w-md bg-white rounded-md shadow-lg relative">
                <div className="border-b border-gray-600 bg-gray-500 w-full relative p-5 rounded-t-md">
                  <div className="absolute -top-1 right-0">
                    <CloseButton onClick={() => setShowTipoForm(false)} />
                  </div>
                </div>
                <div className="p-6">
                  <form onSubmit={handleTipoSubmit} className="space-y-4 mt-6">
                    <h1 className="text-lg font-semibold">
                    {codigo ? "Editar Tipo de Requerimiento" : "Registrar Tipo de Requerimiento"}
                    </h1>
                    <div>
                      <Label htmlFor="descripcionTipo">Descripción</Label>
                      <Input
                        id="descripcionTipo"
                        value={descripcionTipo}
                        onChange={(e) => setDescripcionTipo(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigo">
                        Código (Máximo 3 caracteres)
                      </Label>
                      <Input
                        id="codigo"
                        value={codigo}
                        maxLength={3}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                      />
                    </div>
                    <Button2 title={"Guardar tipo"} className="NeutralButton" onClick={handleTipoSubmit}></Button2>
                    <Button
                      type="button"
                      onClick={() => setShowTipoForm(false)}
                    >
                      Cancelar
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
          {showCategoriaForm && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
              {/* Contenedor principal con padding en los lados y abajo */}
              <div className="w-full max-w-md bg-white rounded-md shadow-lg relative">
                {" "}
                {/* Padding en los lados y abajo */}
                {/* Barra horizontal sin espacios blancos arriba y a los costados */}
                <div className="border-b border-gray-600 bg-gray-500 w-full relative p-5 rounded-t-md">
                  {" "}
                  {/* Ajustamos márgenes y padding */}
                  <div className="absolute -top-1 right-0">
                    {" "}
                    {/* Ajustamos la posición del botón */}
                    <CloseButton onClick={() => setShowCategoriaForm(false)} />
                  </div>
                </div>
                {/* Contenido del formulario */}
                <div className="p-6">
                  <form onSubmit={handleCategoriaSubmit} className="space-y-4">
                    <h1 className="text-lg font-semibold">
                      Registrar Categoría
                    </h1>
                    <div>
                      <Label htmlFor="descripcionCategoria">Descripción</Label>
                      <Input
                        id="descripcionCategoria"
                        value={descripcionCategoria}
                        onChange={(e) =>
                          setDescripcionCategoria(e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Tipo de Requerimiento</Label>
                      <Select
                        id="tipo"
                        value={
                          tipoSeleccionado
                            ? {
                                value: tipoSeleccionado.id, // ID del tipo
                                label: `${tipoSeleccionado.descripcion} (${tipoSeleccionado.codigo})`, // Descripción + Código
                              }
                            : null
                        }
                        onChange={(e) => {
                          const selectedTipo = tipos.find(
                            (tipo) => tipo.id === e?.value
                          );
                          setTipoSeleccionado(selectedTipo || null); // Guarda el objeto completo
                        }}
                        options={tipos.map((tipo) => ({
                          value: tipo.id,
                          label: `${tipo.descripcion} (${tipo.codigo})`, // Mostrar descripción + código en las opciones
                        }))}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid black", // Borde negro
                            backgroundColor: "white", // Fondo blanco
                            borderRadius: "4px", // Esquinas redondeadas
                            padding: "1px 8px",
                            height: "36px",
                            width: "100%",
                            justifyContent: "center",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "black", // Icono de la flecha también negro
                          }),
                          indicatorSeparator: (base) => ({
                            ...base,
                            backgroundColor: "black", // Separador de los indicadores negro
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            border: "1px solid black",
                            maxHeight: "250px",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#f0f0f0"
                              : "white", // Fondo blanco, pero cambia cuando está seleccionado
                            color: "black", // Color del texto negro
                          }),
                        }}
                        placeholder="Seleccionar tipo"
                        required
                      />
                    </div>
                    <Button2 className="NeutralButton" onClick={handleCategoriaSubmit} title={"Guardar categoria"}></Button2>
                    <Button
                      type="button"
                      onClick={() => setShowCategoriaForm(false)}
                    >
                      Cancelar
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
