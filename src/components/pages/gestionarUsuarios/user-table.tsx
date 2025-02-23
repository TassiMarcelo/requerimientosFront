'use client'

import { useState, useEffect } from 'react'
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { UserForm } from './user-form'
import { UserView } from './user-view'
import Modal from '../../Modal'
import type { User } from '../types/user'
import Swal from 'sweetalert2'
import Button2 from '../../ui/Button2/Button2'
import { CategoriaForm } from '../../CategoriaForm';

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null); 
  const [showCategoriasForm, setShowCategoriasForm] = useState(false) 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = 'http://localhost:8080/usuarios/todos';
        
        if (search.trim() !== '') {
          url = `http://localhost:8080/usuarios/usuario/${search}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (search.trim() === '') {
          const usuariosActivos = data.data.filter((user: User) => user.activado);
          setUsers(usuariosActivos);
        } else if (url.includes('usuario')) {
          if (data.data) {
            setUsers([data.data]);
          } else {
            setUsers([]);
          }
        } else {
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleShowCategoriasForm = () => {
    setShowCategoriasForm(true);
  };

  const handleCloseCategoriasForm = () => {
    setShowCategoriasForm(false);
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'CancelButton', // Clase personalizada para el botón de confirmación
        cancelButton: 'NeutralButton' // Clase personalizada para el botón de cancelar
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
        confirmDelete(user.id);
      }
    });
  }

  const confirmDelete = async (id) => {
    if (id) {
      try {
        Swal.showLoading();
        const response = await fetch(`http://localhost:8080/usuarios/${id}/eliminar`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
          setUsers(prev => prev.filter(user => user.id !== id));
          Swal.fire("Éxito", "Usuario eliminado con éxito", "success");
        } else {
          Swal.fire("Error", await response.text(), "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error de conexión", "error");
      } finally {
        setUserToDelete(null);
        setIsModalOpen(false);
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setShowView(true)
  }

  const handleSave = (user: User) => {
    if (selectedUser) {
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      setUsers([user, ...users]);
    }
    setShowForm(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center z-20 relative">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-800" />
          <Input
            placeholder="Buscar por nombre de usuario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 placeholder:text-gray-800"
          />
        </div>

        <div className="flex gap-2">
          <Button2 
            onClick={handleShowCategoriasForm} 
            title={"+ Categorías y tipos"} 
            className="NeutralButton" 
          />
          <Button2 
            title={"+ Crear usuario"} 
            onClick={() => setShowForm(true)} 
            className="NeutralButton" 
          />
        </div>
      </div>

      {showCategoriasForm && <CategoriaForm onClose={handleCloseCategoriasForm} />}
      
      <div className="rounded-md border border-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center border border-black text-black">Nombre Completo</TableHead>
              <TableHead className="text-center border border-black text-black">Nombre de Usuario</TableHead>
              <TableHead className="text-center border border-black text-black">Cuil</TableHead>
              <TableHead className="text-center border border-black text-black">Email</TableHead>
              <TableHead className="text-center border border-black text-black">Empresa</TableHead>
              <TableHead className="text-center border border-black text-black">Descripción</TableHead>
              <TableHead className="text-center border border-black text-black">Preferencia</TableHead>
              <TableHead className="text-center border border-black text-black">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="h-[56px]">
                  <TableCell className="text-center border border-black">{`${user.nombre} ${user.apellido}`}</TableCell>
                  <TableCell className="text-center border border-black">{user.username}</TableCell>
                  <TableCell className="text-center border border-black">{user.cuil}</TableCell>
                  <TableCell className="text-center border border-black">{user.email}</TableCell>
                  <TableCell className="text-center border border-black">{user.empresa}</TableCell>
                  <TableCell className="text-center border border-black">{user.descripcion}</TableCell>
                  <TableCell className="text-center border border-black">
                    <div className="flex justify-center">
                      <Checkbox 
                        checked={user.preferencia} 
                        disabled
                        className="text-green-800 bg-green-900"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center border border-black">
                    <div className="flex justify-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No se encontraron usuarios</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showForm && (
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setSelectedUser(null)
          }}
        />
      )}

      {showView && selectedUser && (
        <UserView
          user={selectedUser}
          onClose={() => {
            setShowView(false)
            setSelectedUser(null)
          }}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>¿Estás seguro de que deseas eliminar este usuario?</h2>
        <div className="flex justify-center gap-2 mt-4 space-x-16">
          <Button onClick={() => setIsModalOpen(false)} variant="outline">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} variant="destructive">
            Confirmar
          </Button>
        </div>
      </Modal>
    </div>
  )
}