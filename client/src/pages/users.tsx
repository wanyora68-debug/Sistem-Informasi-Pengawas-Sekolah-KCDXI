import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Shield, User as UserIcon, Edit, Eye, EyeOff, Search, Filter, Key, Users, Calendar, Phone, IdCard, Award, MoreHorizontal, RefreshCw, Download, Upload, Activity } from "lucide-react";
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
  email?: string;
  department?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
};

export default function UsersPage() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isActivitiesDialogOpen, setIsActivitiesDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentTab, setCurrentTab] = useState("list");
  const [newUser, setNewUser] = useState<{
    username: string;
    password: string;
    fullName: string;
    role: string;
    nip: string;
    rank: string;
    phone: string;
    email: string;
    department: string;
    status: 'active' | 'inactive';
  }>({
    username: "",
    password: "",
    fullName: "",
    role: "pengawas",
    nip: "",
    rank: "",
    phone: "",
    email: "",
    department: "",
    status: "active",
  });

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      try {
        const usersData = localStorage.getItem('app_users');
        if (usersData) {
          const parsedUsers = JSON.parse(usersData);
          
          // Check if Wawan exists, if not add him
          const wawanExists = parsedUsers.find((u: User) => u.username === 'wawan');
          if (!wawanExists) {
            console.log('🔧 Wawan not found in users, adding him');
            const wawanUser: User = {
              id: 'wawan-123',
              username: 'wawan',
              fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
              role: 'pengawas',
              nip: '196805301994121001',
              rank: 'Pembina Utama Muda, IV/c',
              phone: '087733438282',
              email: 'wawan.yogaswara@disdik.jabar.go.id',
              department: 'Cabang Dinas Pendidikan Wilayah XI',
              status: 'active',
              lastLogin: new Date().toISOString(),
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: new Date().toISOString()
            };
            
            const updatedUsers = [...parsedUsers, wawanUser];
            setUsers(updatedUsers);
            localStorage.setItem('app_users', JSON.stringify(updatedUsers));
            localStorage.setItem('users', JSON.stringify(updatedUsers));
          } else {
            setUsers(parsedUsers);
          }
        } else {
          // Default users if none exist
          const defaultUsers: User[] = [
            {
              id: 'admin-1',
              username: 'admin',
              fullName: 'Administrator',
              role: 'admin',
              nip: '',
              rank: '',
              phone: '',
              email: 'admin@disdik.jabar.go.id',
              department: 'Cabang Dinas Pendidikan Wilayah XI',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 'wawan-123',
              username: 'wawan',
              fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
              role: 'pengawas',
              nip: '196805301994121001',
              rank: 'Pembina Utama Muda, IV/c',
              phone: '087733438282',
              email: 'wawan.yogaswara@disdik.jabar.go.id',
              department: 'Cabang Dinas Pendidikan Wilayah XI',
              status: 'active',
              lastLogin: new Date().toISOString(),
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: new Date().toISOString()
            }
          ];
          setUsers(defaultUsers);
          localStorage.setItem('app_users', JSON.stringify(defaultUsers));
          localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
      } catch (error) {
        console.error('Error loading users:', error);
        // Fallback users on error
        const fallbackUsers: User[] = [
          {
            id: 'admin-1',
            username: 'admin',
            fullName: 'Administrator',
            role: 'admin',
            nip: '',
            rank: '',
            phone: '',
            email: 'admin@disdik.jabar.go.id',
            department: 'Cabang Dinas Pendidikan Wilayah XI',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'wawan-123',
            username: 'wawan',
            fullName: 'H. Wawan Yogaswara, S.Pd, M.Pd',
            role: 'pengawas',
            nip: '196805301994121001',
            rank: 'Pembina Utama Muda, IV/c',
            phone: '087733438282',
            email: 'wawan.yogaswara@disdik.jabar.go.id',
            department: 'Cabang Dinas Pendidikan Wilayah XI',
            status: 'active',
            lastLogin: new Date().toISOString(),
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: new Date().toISOString()
          }
        ];
        setUsers(fallbackUsers);
        localStorage.setItem('app_users', JSON.stringify(fallbackUsers));
      }
    };

    loadUsers();
  }, []);

  // Save users to localStorage
  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.fullName) {
      toast({
        title: "Error",
        description: "Username, password, dan nama lengkap wajib diisi",
        variant: "destructive",
      });
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === newUser.username)) {
      toast({
        title: "Error",
        description: "Username sudah digunakan",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      fullName: newUser.fullName,
      role: newUser.role,
      nip: newUser.nip,
      rank: newUser.rank,
      phone: newUser.phone,
      email: newUser.email,
      department: newUser.department,
      status: newUser.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedUsers = [...users, user];
    saveUsers(updatedUsers);

    toast({
      title: "Berhasil",
      description: "User berhasil ditambahkan",
    });

    setNewUser({
      username: "",
      password: "",
      fullName: "",
      role: "pengawas",
      nip: "",
      rank: "",
      phone: "",
      email: "",
      department: "",
      status: "active",
    });
    setIsAddDialogOpen(false);
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

    const updatedUsers = users.filter(user => user.id !== userId);
    saveUsers(updatedUsers);

    toast({
      title: "Berhasil",
      description: "User berhasil dihapus",
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { 
        ...selectedUser, 
        updatedAt: new Date().toISOString() 
      } : user
    );
    saveUsers(updatedUsers);

    toast({
      title: "Berhasil",
      description: "Data user berhasil diperbarui",
    });

    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;

    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok atau kosong",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    // In real app, this would call API to reset password
    toast({
      title: "Berhasil",
      description: `Password user ${selectedUser.fullName} berhasil direset`,
    });

    setNewPassword("");
    setConfirmPassword("");
    setIsResetPasswordDialogOpen(false);
    setSelectedUser(null);
  };

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { 
        ...user, 
        status: (user.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive',
        updatedAt: new Date().toISOString()
      } : user
    );
    saveUsers(updatedUsers);

    const user = users.find(u => u.id === userId);
    toast({
      title: "Berhasil",
      description: `User ${user?.fullName} ${user?.status === 'active' ? 'dinonaktifkan' : 'diaktifkan'}`,
    });
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;

    // Prevent deleting admin
    const adminUsers = selectedUsers.filter(id => {
      const user = users.find(u => u.id === id);
      return user?.username === 'admin';
    });

    if (adminUsers.length > 0) {
      toast({
        title: "Error",
        description: "User admin tidak dapat dihapus",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
    saveUsers(updatedUsers);

    toast({
      title: "Berhasil",
      description: `${selectedUsers.length} user berhasil dihapus`,
    });

    setSelectedUsers([]);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.nip && user.nip.includes(searchTerm)) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admin: users.filter(u => u.role === 'admin').length,
    pengawas: users.filter(u => u.role === 'pengawas').length,
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
        <div className="flex gap-2">
          {selectedUsers.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus ({selectedUsers.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus User Terpilih?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus {selectedUsers.length} user yang dipilih?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleBulkDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Password minimal 6 karakter"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
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
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newUser.status} onValueChange={(value: 'active' | 'inactive') => setNewUser({ ...newUser, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@disdik.jabar.go.id"
                  />
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
                <div className="space-y-2">
                  <Label htmlFor="department">Unit Kerja</Label>
                  <Input
                    id="department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    placeholder="Cabang Dinas Pendidikan Wilayah XI"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleAddUser}>
                    Simpan User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Total User</p>
                <p className="text-2xl font-bold">{userStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <div>
                <p className="text-sm font-medium leading-none">Aktif</p>
                <p className="text-2xl font-bold">{userStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <div>
                <p className="text-sm font-medium leading-none">Tidak Aktif</p>
                <p className="text-2xl font-bold">{userStats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-2xl font-bold">{userStats.admin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Pengawas</p>
                <p className="text-2xl font-bold">{userStats.pengawas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari user (nama, username, NIP, email)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="pengawas">Pengawas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list">Daftar User</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {/* Bulk Actions */}
          {filteredUsers.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedUsers.length > 0 
                        ? `${selectedUsers.length} dari ${filteredUsers.length} user dipilih`
                        : `Pilih semua ${filteredUsers.length} user`
                      }
                    </span>
                  </div>
                  {selectedUsers.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className={user.status === 'inactive' ? 'opacity-60' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                      />
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield className="w-6 h-6 text-primary" />
                        ) : (
                          <UserIcon className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.fullName}</h3>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Administrator' : 'Pengawas'}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {user.nip && (
                            <div className="flex items-center gap-1">
                              <IdCard className="w-4 h-4 text-muted-foreground" />
                              <span>{user.nip}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          {user.email && (
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">@</span>
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user.lastLogin && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>Login: {new Date(user.lastLogin).toLocaleDateString('id-ID')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsActivitiesDialogOpen(true);
                        }}
                        title="Kelola Aktivitas"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsResetPasswordDialogOpen(true);
                        }}
                        title="Reset Password"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id)}
                        disabled={user.username === 'admin'}
                        title={user.username === 'admin' ? 'User admin tidak dapat dinonaktifkan' : ''}
                      >
                        {user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={user.username === 'admin'}
                            title={user.username === 'admin' ? 'User admin tidak dapat dihapus' : ''}
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className={user.status === 'inactive' ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-primary" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">{user.fullName}</CardTitle>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex gap-2">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'Pengawas'}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                    {user.nip && (
                      <p className="text-sm text-muted-foreground">NIP: {user.nip}</p>
                    )}
                    {user.phone && (
                      <p className="text-sm text-muted-foreground">Tel: {user.phone}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsActivitiesDialogOpen(true);
                      }}
                      title="Kelola Aktivitas"
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsResetPasswordDialogOpen(true);
                      }}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <UserIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Tidak ada user yang ditemukan</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Ubah informasi user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                    disabled={selectedUser.username === 'admin'}
                    title={selectedUser.username === 'admin' ? 'Username admin tidak dapat diubah' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedUser.status} 
                    onValueChange={(value: 'active' | 'inactive') => 
                      setSelectedUser({ ...selectedUser, status: value })
                    }
                    disabled={selectedUser.username === 'admin'}
                  >
                    <SelectTrigger id="edit-status" title={selectedUser.username === 'admin' ? 'Status admin tidak dapat diubah' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Nama Lengkap</Label>
                <Input
                  id="edit-fullName"
                  value={selectedUser.fullName}
                  onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                    disabled={selectedUser.username === 'admin'}
                  >
                    <SelectTrigger id="edit-role" title={selectedUser.username === 'admin' ? 'Role admin tidak dapat diubah' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pengawas">Pengawas</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-nip">NIP</Label>
                  <Input
                    id="edit-nip"
                    value={selectedUser.nip || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, nip: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Nomor Telepon</Label>
                  <Input
                    id="edit-phone"
                    value={selectedUser.phone || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedUser.email || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rank">Pangkat/Golongan/Ruang</Label>
                <Input
                  id="edit-rank"
                  value={selectedUser.rank || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, rank: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Unit Kerja</Label>
                <Input
                  id="edit-department"
                  value={selectedUser.department || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleUpdateUser}>
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail User</DialogTitle>
            <DialogDescription>Informasi lengkap user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedUser.role === 'admin' ? (
                    <Shield className="w-8 h-8 text-primary" />
                  ) : (
                    <UserIcon className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedUser.role === 'admin' ? 'Administrator' : 'Pengawas'}
                    </Badge>
                    <Badge variant={selectedUser.status === 'active' ? 'default' : 'destructive'}>
                      {selectedUser.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Informasi Personal</h4>
                  {selectedUser.nip && (
                    <div className="flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">NIP</p>
                        <p className="font-medium">{selectedUser.nip}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.rank && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pangkat</p>
                        <p className="font-medium">{selectedUser.rank}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.department && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Unit Kerja</p>
                        <p className="font-medium">{selectedUser.department}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Kontak</h4>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telepon</p>
                        <p className="font-medium">{selectedUser.phone}</p>
                      </div>
                    </div>
                  )}
                  {selectedUser.email && (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-muted-foreground">@</span>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Terdaftar</p>
                  <p className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {selectedUser.lastLogin && (
                  <div>
                    <p className="text-muted-foreground">Login Terakhir</p>
                    <p className="font-medium">
                      {new Date(selectedUser.lastLogin).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Tutup
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditUser(selectedUser);
                }}>
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password untuk user: <strong>{selectedUser?.fullName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password baru minimal 6 karakter"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setIsResetPasswordDialogOpen(false);
                setNewPassword("");
                setConfirmPassword("");
              }}>
                Batal
              </Button>
              <Button onClick={handleResetPassword}>
                Reset Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Activities Dialog */}
      {selectedUser && (
        <UserActivitiesDialog
          userId={selectedUser.id}
          userName={selectedUser.username}
          open={isActivitiesDialogOpen}
          onOpenChange={setIsActivitiesDialogOpen}
        />
      )}
    </div>
  );
}