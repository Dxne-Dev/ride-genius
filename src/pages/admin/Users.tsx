
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';
import { Check, Search, Trash, UserCog, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminUsers = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  useEffect(() => {
    if (!isAdmin()) {
      return;
    }
    
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setUsers(data as UserProfile[]);
        setFilteredUsers(data as UserProfile[]);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAdmin]);
  
  useEffect(() => {
    let result = users;
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(user => 
        (user.first_name?.toLowerCase().includes(searchLower) || false) ||
        (user.last_name?.toLowerCase().includes(searchLower) || false) ||
        (user.phone?.includes(search) || false) ||
        user.id.includes(search)
      );
    }
    
    // Filter by role
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [search, roleFilter, users]);
  
  const handleUpdateUserRole = async (userId: string, newRole: 'passager' | 'conducteur' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      toast.success('Rôle mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };
  
  if (!isAdmin()) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Accès non autorisé</h1>
            <p>Vous n'avez pas les droits pour accéder à cette page.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
              <CardDescription>
                Rechercher et filtrer les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Rechercher par nom, prénom, téléphone..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="passager">Passagers</SelectItem>
                      <SelectItem value="conducteur">Conducteurs</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Liste de tous les utilisateurs enregistrés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8">Chargement...</p>
              ) : filteredUsers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {profile.first_name} {profile.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{profile.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>{profile.phone || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Select
                              value={profile.role}
                              onValueChange={(value) => 
                                handleUpdateUserRole(
                                  profile.id, 
                                  value as 'passager' | 'conducteur' | 'admin'
                                )
                              }
                              disabled={profile.id === user?.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="passager">Passager</SelectItem>
                                <SelectItem value="conducteur">Conducteur</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          {profile.created_at 
                            ? new Date(profile.created_at).toLocaleDateString() 
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={profile.id === user?.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              // Implement user deletion if needed
                              toast.error("La suppression d'utilisateurs n'est pas encore implémentée");
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Aucun utilisateur trouvé
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
