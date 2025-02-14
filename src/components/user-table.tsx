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
import Modal from './Modal'
import type { User } from '../types/user'

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showView, setShowView] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/usuarios/todos')
        const data = await response.json()

        if (data.message === "Usuarios") {
          setUsers(data.data)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  // Filtrado de usuarios
  const filteredUsers = users.filter(user => {
    if (search.trim() === '') return true; // Si no hay búsqueda, mostrar todos los usuarios
    
    const searchTerm = search.toLowerCase();
    if (searchTerm === 'true') {
      return user.preferencia === true;
    } else if (searchTerm === 'false') {
      return user.preferencia === false;
    }
    const fullName = `${user.nombre ?? ''} ${user.apellido ?? ''}`.toLowerCase();
    const email = user.email?.toLowerCase() ?? '';
    const cuil = (user.cuil ? String(user.cuil) : '').toLowerCase();
    const empresa = user.empresa?.toLowerCase() ?? '';
    const descripcion = user.descripcion?.toLowerCase() ?? '';

    return (
      fullName.includes(searchTerm) || 
      email.includes(searchTerm) ||
      cuil.includes(searchTerm) ||
      empresa.includes(searchTerm) ||
      descripcion.includes(searchTerm)
    );
  });

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete))
      setUserToDelete(null); 
      setIsModalOpen(false); 
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleView = (user: User) => {
    setSelectedUser(user)
    setShowView(true)
  }

  const handleSave = (user: User) => {
    console.log("Usuario recibido en handleSave:", user); // Depuración
  
    if (!user || !user.id) {
      console.error("Usuario no válido:", user);
      return;
    }
  
    if (selectedUser) {
      // Actualizar usuario existente
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      // Crear nuevo usuario
      setUsers([user, ...users]); // Usar el usuario devuelto por el backend
    }
  
    setShowForm(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-800" />
          <Input
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 placeholder:text-gray-800"
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear usuario
        </Button>
      </div>

      <div className="rounded-md border border-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center border border-black text-black">Nombre</TableHead>
              <TableHead className="text-center border border-black text-black">Cuil</TableHead>
              <TableHead className="text-center border border-black text-black">Email</TableHead>
              <TableHead className="text-center border border-black text-black">Empresa</TableHead>
              <TableHead className="text-center border border-black text-black">Descripción</TableHead>
              <TableHead className="text-center border border-black text-black">Preferencia</TableHead>
              <TableHead className="text-center border border-black text-black">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="h-[56px]">
                  <TableCell className="text-center border border-black"> {`${user.nombre} ${user.apellido}`}</TableCell>
                  <TableCell className="text-center border border-black">{user.cuil}</TableCell>
                  <TableCell className="text-center border border-black">{user.email}</TableCell>
                  <TableCell className="text-center border border-black">{user.empresa}</TableCell>
                  <TableCell className="text-center border border-black">{user.descripcion}</TableCell>
                  <TableCell className="text-center border border-black align-middle">
                    <div className="flex items-center justify-center">
                      <Checkbox checked={user.preferencia} disabled/>
                    </div>
                  </TableCell>
                  <TableCell className="text-center border border-black">
                    <div className="flex items-center justify-center">
                      <Button variant="ghost" size="icon" onClick={() => handleView(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
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
