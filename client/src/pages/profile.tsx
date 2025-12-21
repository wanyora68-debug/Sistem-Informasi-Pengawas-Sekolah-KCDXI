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
      console.log('🔄 Loading user profile data...');
      
      // Get user data from localStorage with auto-recovery
      let userData = localStorage.getItem('user_data');
      
      // AUTO-RECOVERY: If main data is missing, try backup
      if (!userData) {
        const backup = localStorage.getItem('user_data_backup');
        if (backup) {
          localStorage.setItem('user_data', backup);
          userData = backup;
          console.log('🔄 User data auto-recovered from backup');
        }
      }
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // Get additional profile data from localStorage with auto-recovery
        let profileData = localStorage.getItem('profile_data');
        
        // AUTO-RECOVERY: If main profile data is missing, try backup
        if (!profileData) {
          const profileBackup = localStorage.getItem('profile_data_backup');
          if (profileBackup) {
            localStorage.setItem('profile_data', profileBackup);
            profileData = profileBackup;
            console.log('🔄 Profile data auto-recovered from backup');
          }
        }
        
        const parsedProfile = profileData ? JSON.parse(profileData) : {};
        
        // Create backup every time we successfully read data
        localStorage.setItem('user_data_backup', userData);
        localStorage.setItem('profile_data_backup', JSON.stringify(parsedProfile));
        localStorage.setItem('profile_data_timestamp', Date.now().toString());
        
        const userProfile = {
          id: parsedUser.username,
          username: parsedUser.username,
          fullName: parsedUser.fullName,
          role: parsedUser.role,
          ...parsedProfile
        };
        
        console.log('✅ User profile loaded:', userProfile);
        return userProfile;
      }
      
      throw new Error('No user data found');
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds to detect changes
    refetchIntervalInBackground: true,
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
      console.log('🔄 Updating profile data:', data);
      
      // Save profile data to localStorage with backup system
      const currentProfileData = localStorage.getItem('profile_data');
      const currentProfile = currentProfileData ? JSON.parse(currentProfileData) : {};
      
      const updatedProfile = {
        ...currentProfile,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // PROTECTED SAVE: Save to multiple locations
      localStorage.setItem('profile_data', JSON.stringify(updatedProfile));
      localStorage.setItem('profile_data_backup', JSON.stringify(updatedProfile));
      localStorage.setItem('profile_data_timestamp', Date.now().toString());
      
      // ENHANCED: Also save to user_profile for PDF compatibility
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('current_user', JSON.stringify({
        ...updatedProfile,
        name: data.fullName,
        fullName: data.fullName
      }));
      
      console.log('✅ Profile data saved to localStorage (multiple locations for PDF compatibility)');
      
      // Also update user_data with fullName if changed
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        parsedUserData.fullName = data.fullName;
        localStorage.setItem('user_data', JSON.stringify(parsedUserData));
        localStorage.setItem('user_data_backup', JSON.stringify(parsedUserData));
        console.log('✅ User data updated');
      }
      
      return updatedProfile;
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
      console.log('🔄 Starting photo upload:', file.name, file.size, file.type);
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const base64 = e.target?.result as string;
            console.log('✅ File converted to base64, length:', base64.length);
            
            // Save photo to localStorage
            const currentProfileData = localStorage.getItem('profile_data');
            const currentProfile = currentProfileData ? JSON.parse(currentProfileData) : {};
            
            const updatedProfile = {
              ...currentProfile,
              photoUrl: base64,
              updatedAt: new Date().toISOString()
            };
            
            // PROTECTED SAVE: Save to multiple locations
            localStorage.setItem('profile_data', JSON.stringify(updatedProfile));
            localStorage.setItem('profile_data_backup', JSON.stringify(updatedProfile));
            localStorage.setItem('profile_data_timestamp', Date.now().toString());
            localStorage.setItem('photo_upload_time', new Date().toISOString());
            
            // ENHANCED: Also save to user_profile for PDF compatibility
            localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
            
            // ENHANCED: Save photo to uploaded_photos array for PDF gallery
            const uploadedPhotos = JSON.parse(localStorage.getItem('uploaded_photos') || '[]');
            uploadedPhotos.unshift({
              url: base64,
              caption: 'Foto Profil Pengawas',
              date: new Date().toISOString(),
              type: 'profile'
            });
            // Keep only last 10 photos
            if (uploadedPhotos.length > 10) {
              uploadedPhotos.splice(10);
            }
            localStorage.setItem('uploaded_photos', JSON.stringify(uploadedPhotos));
            
            console.log('✅ Photo saved to localStorage with backup and PDF compatibility');
            
            resolve(updatedProfile);
          } catch (error) {
            console.error('❌ Error saving photo:', error);
            reject(error);
          }
        };
        reader.onerror = (error) => {
          console.error('❌ FileReader error:', error);
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
      });
    },
    onSuccess: () => {
      console.log('✅ Photo upload mutation successful');
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Berhasil",
        description: "Foto profil berhasil diperbarui",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Photo upload mutation error:', error);
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
    console.log('📷 Photo file selected:', file);
    
    if (file) {
      console.log('📊 File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeInMB: (file.size / 1024 / 1024).toFixed(2)
      });
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('❌ Invalid file type:', file.type);
        toast({
          title: "Error",
          description: "File harus berupa gambar (JPG, PNG)",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('❌ File too large:', file.size);
        toast({
          title: "Error",
          description: `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(2)}MB). Maksimal 5MB`,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ File validation passed, starting upload...');
      uploadPhotoMutation.mutate(file);
    } else {
      console.log('❌ No file selected');
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
