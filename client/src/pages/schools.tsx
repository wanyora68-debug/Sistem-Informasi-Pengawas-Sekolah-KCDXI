import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, Phone, School as SchoolIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { response } from "express";
import { response } from "express";

type School = {
  id: string;
  name: string;
  address: string;
  contact: string;
  principalName?: string;
  principalNip?: string;
  supervisions?: number;
};

export default function SchoolsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use simple useState instead of React Query
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load schools from localStorage on component mount
  useEffect(() => {
    const loadSchools = () => {
      console.log('🔍 Loading schools from localStorage...');
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const schoolsData = localStorage.getItem('schools_data');
          console.log('📊 Reading schools from localStorage:', schoolsData);
          if (schoolsData) {
            const parsed = JSON.parse(schoolsData);
            const result = Array.isArray(parsed) ? parsed : [];
            console.log('✅ Parsed schools data:', result);
            setSchools(result);
          } else {
            console.log('⚠️ No schools data found, setting empty array');
            setSchools([]);
          }
        }
      } catch (error) {
        console.error('❌ Error reading schools from localStorage:', error);
        setSchools([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSchools();
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: "", address: "", contact: "", principalName: "", principalNip: "" });

  const createSchoolMutation = useMutation({
    mutationFn: async (school: typeof newSchool) => {
      // Direct localStorage save
      const schoolsData = localStorage.getItem('schools_data');
      const currentSchools = schoolsData ? JSON.parse(schoolsData) : [];
      
      const newSchoolData = {
        id: Date.now().toString(),
        ...school,
        supervisions: 0,
        createdAt: new Date().toISOString()
      };
      
      const updatedSchools = [...currentSchools, newSchoolData];
      localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
      
      return newSchoolData;
    },
    onSuccess: (newSchoolData) => {
      console.log('🎉 School saved successfully!');
      console.log('💾 Current localStorage data:', localStorage.getItem('schools_data'));
      
      toast({
        title: "Berhasil",
        description: "Sekolah berhasil ditambahkan",
      });
      setNewSchool({ name: "", address: "", contact: "", principalName: "", principalNip: "" });
      setIsAddDialogOpen(false);
      
      // Force page reload to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal menambahkan sekolah",
        variant: "destructive",
      });
    },
  });

  const deleteSchoolMutation = useMutation({
    mutationFn: async (id: string) => {
      // Direct localStorage delete
      const schoolsData = localStorage.getItem('schools_data');
      const currentSchools = schoolsData ? JSON.parse(schoolsData) : [];
      
      const updatedSchools = currentSchools.filter((school: School) => school.id !== id);
      localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
      
      return { success: true };
      return response.json();
    },
    onSuccess: (_, deletedId) => {
      // Update state directly
      setSchools(prevSchools => prevSchools.filter(school => school.id !== deletedId));
      
      toast({
        title: "Berhasil",
        description: "Sekolah berhasil dihapus",
      });
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal menghapus sekolah",
        variant: "destructive",
      });
    },
  });

  const handleAddSchool = () => {
    createSchoolMutation.mutate(newSchool);
  };

  const handleDeleteSchool = (id: string) => {
    deleteSchoolMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sekolah Binaan</h1>
          <p className="text-muted-foreground mt-1">Kelola data sekolah yang Anda bina</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-school">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Sekolah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Sekolah Binaan</DialogTitle>
              <DialogDescription>Tambahkan sekolah baru ke dalam daftar binaan Anda</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Nama Sekolah</Label>
                <Input
                  id="school-name"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  placeholder="Contoh: SDN 01"
                  data-testid="input-school-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-address">Alamat</Label>
                <Input
                  id="school-address"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                  placeholder="Alamat lengkap sekolah"
                  data-testid="input-school-address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-contact">Kontak</Label>
                <Input
                  id="school-contact"
                  value={newSchool.contact}
                  onChange={(e) => setNewSchool({ ...newSchool, contact: e.target.value })}
                  placeholder="Nomor telepon sekolah"
                  data-testid="input-school-contact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principal-name">Nama Kepala Sekolah</Label>
                <Input
                  id="principal-name"
                  value={newSchool.principalName}
                  onChange={(e) => setNewSchool({ ...newSchool, principalName: e.target.value })}
                  placeholder="Nama lengkap kepala sekolah"
                  data-testid="input-principal-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principal-nip">NIP/NUPTK Kepala Sekolah</Label>
                <Input
                  id="principal-nip"
                  value={newSchool.principalNip}
                  onChange={(e) => setNewSchool({ ...newSchool, principalNip: e.target.value })}
                  placeholder="NIP atau NUPTK"
                  data-testid="input-principal-nip"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel-school">
                  Batal
                </Button>
                <Button onClick={handleAddSchool} disabled={!newSchool.name} data-testid="button-save-school">
                  Simpan Sekolah
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <Card key={school.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                    <SchoolIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{school.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {school.supervisions} supervisi
                    </Badge>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid={`button-delete-school-${school.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Sekolah</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus {school.name}? Data supervisi terkait akan tetap tersimpan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-cancel-delete">Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteSchool(school.id)} data-testid="button-confirm-delete">
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{school.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{school.contact}</span>
              </div>
              {school.principalName && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Kepala Sekolah</p>
                  <p className="text-sm text-muted-foreground">{school.principalName}</p>
                  {school.principalNip && (
                    <p className="text-xs text-muted-foreground">NIP/NUPTK: {school.principalNip}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
