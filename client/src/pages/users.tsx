import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Shield, User as UserIcon, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserActivitiesDialog } from "@/components/user-activities-dialog";

type User = {
  id: string;
  username: string;
  fullName: string;
  role: string;
  nip?: string;
  rank?: string;
  phone?: string;
  createdAt: string;
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUserForActivities, setSelectedUserForActivities] = useState<{ id: string; name: string } | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "pengawas",
    nip: "",
    rank: "",
    phone: "",
  });

  // Fetch current user to check if admin
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });

  // Fetch all users (admin only)
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: currentUser?.role === 'admin',
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Berhasil", description: "User berhasil ditambahkan" });
      setNewUser({ username: "", password: "", fullName: "", role: "pengawas", nip: "", rank: "", phone: "" });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Berhasil", description: "User berhasil dihapus" });
    },
    onError: (error: Error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
  });

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.fullName) {
      toast({
        title: "Error",
        description: "Username, password, dan nama lengkap wajib diisi",
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(newUser);
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (username === 'admin') {
      toast({
        title: "Error",
        description: "User admin tidak dapat dihapus",
        variant: "destructive",
      });
      return;
    }
    deleteUserMutation.mutate(userId);
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
              <p className="text-muted-foreground">
                Halaman ini hanya dapat diakses oleh Administrator
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Manajemen User
          </h1>
          <p className="text-muted-foreground mt-1">Kelola user dan hak akses sistem</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
              <DialogDescription>Buat akun user baru untuk sistem</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Username untuk login"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="Nama lengkap user"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pengawas">Pengawas</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    value={newUser.nip}
                    onChange={(e) => setNewUser({ ...newUser, nip: e.target.value })}
                    placeholder="Nomor Induk Pegawai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="08xx-xxxx-xxxx"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">Pangkat/Golongan/Ruang</Label>
                <Input
                  id="rank"
                  value={newUser.rank}
                  onChange={(e) => setNewUser({ ...newUser, rank: e.target.value })}
                  placeholder="Contoh: Pembina, IV/a"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddUser} disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? "Menyimpan..." : "Simpan User"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <Shield className="w-6 h-6 text-primary" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.fullName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrator' : 'Pengawas'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">@{user.username}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUserForActivities({ id: user.id, name: user.fullName })}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Aktivitas
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={user.username === 'admin'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus user <strong>{user.fullName}</strong>?
                          Semua data terkait user ini akan ikut terhapus.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {user.nip && (
                  <div>
                    <p className="text-muted-foreground">NIP</p>
                    <p className="font-medium">{user.nip}</p>
                  </div>
                )}
                {user.rank && (
                  <div>
                    <p className="text-muted-foreground">Pangkat</p>
                    <p className="font-medium">{user.rank}</p>
                  </div>
                )}
                {user.phone && (
                  <div>
                    <p className="text-muted-foreground">Telepon</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Terdaftar</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <UserIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada user terdaftar</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Activities Dialog */}
      {selectedUserForActivities && (
        <UserActivitiesDialog
          userId={selectedUserForActivities.id}
          userName={selectedUserForActivities.name}
          open={!!selectedUserForActivities}
          onOpenChange={(open) => !open && setSelectedUserForActivities(null)}
        />
      )}
    </div>
  );
}
