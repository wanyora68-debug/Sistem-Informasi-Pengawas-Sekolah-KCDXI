import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Save, Building2, Home, Phone, IdCard, Award, Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserProfile = {
  id: string;
  username: string;
  fullName: string;
  role: string;
  nip?: string;
  rank?: string;
  officeName?: string;
  officeAddress?: string;
  homeAddress?: string;
  phone?: string;
  photoUrl?: string;
};

export default function ProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
  });

  const [formData, setFormData] = useState({
    fullName: "",
    nip: "",
    rank: "",
    officeName: "",
    officeAddress: "",
    homeAddress: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        nip: user.nip || "",
        rank: user.rank || "",
        officeName: user.officeName || "",
        officeAddress: user.officeAddress || "",
        homeAddress: user.homeAddress || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Berhasil",
        description: "Profil berhasil diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/auth/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        if (response.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload photo');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Berhasil",
        description: "Foto profil berhasil diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "File harus berupa gambar",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        });
        return;
      }

      uploadPhotoMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="w-8 h-8" />
          Profil Pengawas
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola informasi profil dan data kepegawaian Anda
        </p>
      </div>

      {/* Photo Upload Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user?.photoUrl || undefined} alt={user?.fullName} />
                <AvatarFallback className="text-2xl">
                  {user?.fullName ? getInitials(user.fullName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={uploadPhotoMutation.isPending}
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-muted-foreground">{user?.role === 'admin' ? 'Administrator' : 'Pengawas'}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePhotoClick}
              disabled={uploadPhotoMutation.isPending}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploadPhotoMutation.isPending ? "Mengupload..." : "Upload Foto Profil"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Format: JPG, PNG (Maksimal 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Akun */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Akun
            </CardTitle>
            <CardDescription>
              Informasi dasar akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={user?.username || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Username tidak dapat diubah</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={user?.role === 'admin' ? 'Administrator' : 'Pengawas'}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Kepegawaian */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="w-5 h-5" />
              Data Kepegawaian
            </CardTitle>
            <CardDescription>
              Informasi kepegawaian dan pangkat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  placeholder="Nomor Induk Pegawai"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Pangkat/Golongan/Ruang
                </Label>
                <Input
                  id="rank"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  placeholder="Contoh: Pembina, IV/a"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Nomor Telepon
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: 0812-3456-7890"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informasi Kantor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informasi Kantor
            </CardTitle>
            <CardDescription>
              Data kantor tempat bertugas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="officeName">Nama Kantor</Label>
              <Input
                id="officeName"
                name="officeName"
                value={formData.officeName}
                onChange={handleChange}
                placeholder="Contoh: Dinas Pendidikan Kabupaten Garut"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeAddress">Alamat Kantor</Label>
              <Textarea
                id="officeAddress"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                placeholder="Alamat lengkap kantor"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alamat Rumah */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Alamat Rumah
            </CardTitle>
            <CardDescription>
              Alamat tempat tinggal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="homeAddress">Alamat Lengkap</Label>
              <Textarea
                id="homeAddress"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                placeholder="Alamat lengkap tempat tinggal"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="min-w-[150px]"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateProfileMutation.isPending ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
