"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "react-select";
import CloseButton from "./ui/CloseButton";
import Button2 from "./ui/Button2/Button2";
import { Pencil, Trash2 } from 'lucide-react';

interface TipoRequerimiento {
  descripcion: string;
  codigo: string;
  desactivado: boolean;
}

interface CategoriaRequerimiento {
  id: number;
  descripcion: string;
  codigoTipoRequerimiento: string;
  desactivado: boolean;
}

interface CategoriaFormProps {
  onClose: () => void;
}

export function CategoriaForm({ onClose }: CategoriaFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTipoForm, setShowTipoForm] = useState(false);
  const [showCategoriaForm, setShowCategoriaForm] = useState(false);

  const [descripcionTipo, setDescripcionTipo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipos, setTipos] = useState<TipoRequerimiento[]>([]);
  const [editingCategoriaId, setEditingCategoriaId] = useState<number | null>(null);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [categorias, setCategorias] = useState<CategoriaRequerimiento[]>([]);
  const [descripcionCategoria, setDescripcionCategoria] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoRequerimiento | null>(null);

  const filtrarRequerimientos = (searchTerm: string) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filteredTipos = tipos.filter(
      (tipo) =>
        (tipo.descripcion && tipo.descripcion.toLowerCase().includes(lowercasedSearchTerm)) ||
        (tipo.codigo && tipo.codigo.toLowerCase().includes(lowercasedSearchTerm))
    );

    const filteredCategorias = categorias.filter(
      (categoria) =>
        categoria.desactivado === false &&
        ((categoria.descripcion && categoria.descripcion.toLowerCase().includes(lowercasedSearchTerm)) ||
        (categoria.codigoTipoRequerimiento && categoria.codigoTipoRequerimiento.toLowerCase().includes(lowercasedSearchTerm)) ||
        tipos.some(
          (tipo) =>
            tipo.codigo === categoria.codigoTipoRequerimiento &&
            (tipo.descripcion && tipo.descripcion.toLowerCase().includes(lowercasedSearchTerm)))
        )
    );
    return { filteredTipos, filteredCategorias };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiposResponse = await fetch("http://localhost:8080/tiposRequerimientos/false/todos");
        const categoriasResponse = await fetch("http://localhost:8080/categRequerimientos/todas");
        if (!tiposResponse.ok || !categoriasResponse.ok) {
          throw new Error("Error al obtener los datos");
        }

        const tiposData = await tiposResponse.json();
        const categoriasData = await categoriasResponse.json();

        const categoriasActivas = categoriasData.data.filter(
          (categoria: CategoriaRequerimiento) => categoria.desactivado === false
        );

        setTipos(tiposData.data);
        setCategorias(categoriasActivas);
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

  const handleEditCategoria = (categoriaId: number) => {
    setEditingCategoriaId(categoriaId);
    const categoria = categorias.find((c) => c.id === categoriaId);
    if (categoria) {
      setNuevaDescripcion(categoria.descripcion);
    }
  };

  const handleUpdateCategoria = async (categoriaId: number) => {
    if (!nuevaDescripcion.trim()) {
      setErrorMessage("La descripción no puede estar vacía.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/categRequerimientos/${categoriaId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descripcion: nuevaDescripcion,
            codigoTipoRequerimiento: tipoSeleccionado?.codigo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la categoría.");
      }
      const updatedCategorias = categorias.map((categoria) =>
        categoria.id === categoriaId
          ? { ...categoria, descripcion: nuevaDescripcion }
          : categoria
      );
      setCategorias(updatedCategorias);
      setEditingCategoriaId(null);
      setNuevaDescripcion("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      setErrorMessage("Ocurrió un error al actualizar la categoría.");
    }
  };

  const handleDeleteCategoria = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/categRequerimientos/${id}/desactivar`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la categoría.");
      }

      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          categoria.id === id ? { ...categoria, desactivado: true } : categoria
        )
      );
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const handleEditTipo = (tipo: TipoRequerimiento) => {
    setDescripcionTipo(tipo.descripcion);
    setCodigo(tipo.codigo);
    setTipoSeleccionado(tipo);
    setShowTipoForm(true);
  };

  const handleUpdateTipo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcionTipo.trim() || !codigo.trim() || !tipoSeleccionado) {
      setErrorMessage("Todos los campos son obligatorios para actualizar el tipo.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/tiposRequerimientos/${tipoSeleccionado.codigo}/updateTipo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descripcion: descripcionTipo,
            codigo: codigo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el tipo de requerimiento.");
      }

      const data = await response.json();
      console.log(data.message);

      const updatedTipos = tipos.map((tipo) =>
        tipo.codigo === tipoSeleccionado.codigo
          ? { ...tipo, descripcion: descripcionTipo, codigo: codigo }
          : tipo
      );
      setTipos(updatedTipos);
      const updatedCategorias = categorias.map((categoria) =>
        categoria.codigoTipoRequerimiento === tipoSeleccionado.codigo
          ? { ...categoria, codigoTipoRequerimiento: codigo }
          : categoria
      );
      setCategorias(updatedCategorias);

      setShowTipoForm(false);
      setDescripcionTipo("");
      setCodigo("");
      setTipoSeleccionado(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al actualizar el tipo:", error);
      setErrorMessage("Ocurrió un error al actualizar el tipo de requerimiento.");
    }
  };

  const obtenerTiposActivos = async () => {
    try {
      const response = await fetch("http://localhost:8080/tiposRequerimientos/false/todos");
      const data = await response.json();

      if (response.ok) {
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
       const tiposResponse = await fetch("http://localhost:8080/tiposRequerimientos/getAll");  
      if (!tiposResponse.ok) {
        throw new Error("Error al obtener los tipos de requerimiento.");
      }
      const tiposData = await tiposResponse.json();
  
      const tipoExistente = tiposData.data.find(
        (tipo) => tipo.codigo.toLowerCase() === codigo.toLowerCase()
      );
  
  
      if (tipoExistente) {
        if (!tipoExistente.desactivado) {
          alert("Ya existe un tipo de requerimiento con este código.");
          return;
        } else {
          const reactivarResponse = await fetch(
            `http://localhost:8080/tiposRequerimientos/${codigo}/reactivar`,
            { method: "PATCH" }
          );
  
          if (!reactivarResponse.ok) {
            throw new Error("Error al reactivar el tipo de requerimiento.");
          }
  
          const updateResponse = await fetch(
            `http://localhost:8080/tiposRequerimientos/${codigo}/updateTipo`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ descripcion: descripcionTipo, codigo }),
            }
          );
  
          if (!updateResponse.ok) {
            throw new Error("Error al actualizar la descripción del tipo.");
          }
  
          const nuevosTiposResponse = await fetch("http://localhost:8080/tiposRequerimientos/false/todos");
          if (!nuevosTiposResponse.ok) {
            throw new Error("Error al obtener los tipos actualizados.");
          }
          const nuevosTiposData = await nuevosTiposResponse.json();
  
          setTipos(nuevosTiposData.data);
          setDescripcionTipo("");
          setCodigo("");
          setShowTipoForm(false);
          setErrorMessage("");
          return;
        }
      }
  
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
  
      const nuevosTiposResponse = await fetch("http://localhost:8080/tiposRequerimientos/false/todos");
      if (!nuevosTiposResponse.ok) {
        throw new Error("Error al obtener los tipos actualizados.");
      }
      const nuevosTiposData = await nuevosTiposResponse.json();
  
      setTipos(nuevosTiposData.data);
      setDescripcionTipo("");
      setCodigo("");
      setShowTipoForm(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al crear o actualizar el tipo:", error);
      alert("Error, tipo.codigo repetido");
    }
  };
  
  const handleCategoriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!descripcionCategoria.trim() || tipoSeleccionado === null) {
      setErrorMessage("Todos los campos son obligatorios para registrar categoría.");
      return;
    }
  
    try {
      // Obtener TODAS las categorías (activas e inactivas)
      const categoriasResponse = await fetch("http://localhost:8080/categRequerimientos/todas");
      if (!categoriasResponse.ok) {
        throw new Error("Error al obtener las categorías.");
      }
      const categoriasData = await categoriasResponse.json();
      
      console.log("Lista completa de categorías:", categoriasData.data);
  
      // Buscar si la categoría ya existe, aunque esté desactivada
      const categoriaExistente = categoriasData.data.find(
        (categoria) =>
          categoria.descripcion.toLowerCase() === descripcionCategoria.toLowerCase() &&
          categoria.codigoTipoRequerimiento === tipoSeleccionado.codigo
      );
  
      console.log("Categoría encontrada en el backend:", categoriaExistente);
  
      if (categoriaExistente) {
        if (!categoriaExistente.desactivado) {
          alert("Ya existe una categoría activa con esta descripción dentro de este tipo.");
          return;
        } else {
          console.log("Reactivando categoría:", categoriaExistente.id);
  
          // Reactivar la categoría estableciendo `desactivado: false`
          const response = await fetch(
            `http://localhost:8080/categRequerimientos/${categoriaExistente.id}/update`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                descripcion: categoriaExistente.descripcion,
                codigoTipoRequerimiento: categoriaExistente.codigoTipoRequerimiento,
                desactivado: false,
              }),
            }
          );
  
          if (!response.ok) {
            throw new Error("Error al reactivar la categoría.");
          }
  
          console.log("Obteniendo lista actualizada de categorías...");
          const nuevasCategoriasResponse = await fetch("http://localhost:8080/categRequerimientos/todas");
          if (!nuevasCategoriasResponse.ok) {
            throw new Error("Error al obtener las categorías actualizadas.");
          }
          const nuevasCategoriasData = await nuevasCategoriasResponse.json();
          console.log("Lista actualizada de categorías:", nuevasCategoriasData.data);
  
          setCategorias(nuevasCategoriasData.data);
          setDescripcionCategoria("");
          setTipoSeleccionado(null);
          setShowCategoriaForm(false);
          setErrorMessage("");
          return;
        }
      }
  
      // Si no existe, crear una nueva
      console.log("Creando nueva categoría...");
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
  
      console.log("Obteniendo lista de categorías después de crear...");
      const nuevasCategoriasResponse = await fetch("http://localhost:8080/categRequerimientos/todas");
      if (!nuevasCategoriasResponse.ok) {
        throw new Error("Error al obtener las categorías actualizadas.");
      }
      const nuevasCategoriasData = await nuevasCategoriasResponse.json();
      console.log("Lista de categorías actualizada:", nuevasCategoriasData.data);
  
      setCategorias(nuevasCategoriasData.data);
      setDescripcionCategoria("");
      setTipoSeleccionado(null);
      setShowCategoriaForm(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al crear o actualizar la categoría:", error);
      setErrorMessage("Ocurrió un error al crear o actualizar la categoría.");
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
              <p>No se encontraron resultados.</p>
            ) : (
              <>
                {tipos
                  .filter((tipo) => {
                    const coincideTipo =
                      tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      tipo.codigo.toLowerCase().includes(searchTerm.toLowerCase());
                    const coincideCategoria = categorias.some(
                      (categoria) =>
                        categoria.codigoTipoRequerimiento === tipo.codigo &&
                        categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) &&
                        categoria.desactivado === false
                    );

                    return coincideTipo || coincideCategoria;
                  })
                  .map((tipo) => {
                    const categoriasDelTipo = categorias.filter(
                      (categoria) =>
                        categoria.codigoTipoRequerimiento === tipo.codigo &&
                        categoria.desactivado === false
                    );

                    return (
                      <div key={tipo.codigo} className="mb-4 p-4 border rounded-md flex justify-between items-center">
                        <div>
                          <h2 className="font-semibold">
                            {tipo.descripcion} ({tipo.codigo})
                          </h2>
                          <div className="mt-2">
                            {categoriasDelTipo.length > 0 ? (
                              <>
                                <h3 className="font-semibold">Categorías:</h3>
                                <ul className="list-disc pl-5">
                                  {categoriasDelTipo.map((categoria) => (
                                    <li key={categoria.id} className="flex justify-between items-center">
                                      <span>{categoria.descripcion}</span>
                                     </li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p>No hay categorías asociadas.</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <Pencil className="cursor-pointer" onClick={() => handleEditTipo(tipo)} />
                          <Trash2 className="cursor-pointer" onClick={() => handleDeleteTipo(tipo.codigo)} />
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <Button onClick={() => {
                setDescripcionTipo("");
                setCodigo("");
                setTipoSeleccionado(null);
                setShowTipoForm(true);
              }}>+ Tipo</Button>
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
                  <form onSubmit={tipoSeleccionado ? handleUpdateTipo : handleTipoSubmit} className="space-y-4 mt-6">
                    <h1 className="text-lg font-semibold">
                      {tipoSeleccionado ? "Editar Tipo de Requerimiento" : "Registrar Tipo de Requerimiento"}
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
                      <Label htmlFor="codigo">Código (Máximo 3 caracteres)</Label>
                      <Input
                        id="codigo"
                        value={codigo}
                        maxLength={3}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                      />
                    </div>

                    {tipoSeleccionado && (
                      <div className="mt-4">
                        <h3 className="font-semibold">Categorías:</h3>
                        {categorias
                          .filter((categoria) =>
                            categoria.codigoTipoRequerimiento === tipoSeleccionado.codigo &&
                            categoria.desactivado === false
                          ).length > 0 ? (
                          <ul className="list-disc pl-5">
                            {categorias
                              .filter((categoria) =>
                                categoria.codigoTipoRequerimiento === tipoSeleccionado.codigo &&
                                categoria.desactivado === false
                              )
                              .map((categoria) => (
                                <li key={categoria.id} className="flex justify-between items-center">
                                  {editingCategoriaId === categoria.id ? (
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        value={nuevaDescripcion}
                                        onChange={(e) => setNuevaDescripcion(e.target.value)}
                                        onBlur={() => handleUpdateCategoria(categoria.id)}
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                            handleUpdateCategoria(categoria.id);
                                          }
                                        }}
                                        autoFocus
                                      />
                                    </div>
                                  ) : (
                                    <span>{categoria.descripcion}</span>
                                  )}
                                  <div className="flex space-x-2">
                                    <Pencil
                                      className="cursor-pointer"
                                      onClick={() => handleEditCategoria(categoria.id)}
                                    />
                                    <Trash2
                                      className="cursor-pointer"
                                      onClick={() => handleDeleteCategoria(categoria.id)}
                                    />
                                  </div>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p>No hay categorías asociadas.</p>
                        )}
                      </div>
                    )}

                    <Button2
                      title={tipoSeleccionado ? "Guardar cambios" : "Guardar tipo"}
                      className="NeutralButton"
                      onClick={tipoSeleccionado ? handleUpdateTipo : handleTipoSubmit}
                    />
                    <Button type="button" onClick={() => setShowTipoForm(false)}>
                      Cancelar
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showCategoriaForm && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
              <div className="w-full max-w-md bg-white rounded-md shadow-lg relative">
                <div className="border-b border-gray-600 bg-gray-500 w-full relative p-5 rounded-t-md">
                  <div className="absolute -top-1 right-0">
                    <CloseButton onClick={() => setShowCategoriaForm(false)} />
                  </div>
                </div>
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
                        onChange={(e) => setDescripcionCategoria(e.target.value)}
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
                                value: tipoSeleccionado.codigo,
                                label: `${tipoSeleccionado.descripcion} (${tipoSeleccionado.codigo})`,
                              }
                            : null
                        }
                        onChange={(e) => {
                          const selectedTipo = tipos.find(
                            (tipo) => tipo.codigo === e?.value
                          );
                          setTipoSeleccionado(selectedTipo || null);
                        }}
                        options={tipos.map((tipo) => ({
                          value: tipo.codigo,
                          label: `${tipo.descripcion} (${tipo.codigo})`,
                        }))}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid black",
                            backgroundColor: "white",
                            borderRadius: "4px",
                            padding: "1px 8px",
                            height: "36px",
                            width: "100%",
                            justifyContent: "center",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          indicatorSeparator: (base) => ({
                            ...base,
                            backgroundColor: "black",
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
                              : "white",
                            color: "black",
                          }),
                        }}
                        placeholder="Seleccionar tipo"
                        required
                      />
                    </div>
                    <Button2 className="NeutralButton" onClick={handleCategoriaSubmit} title={"Guardar categoria"} />
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