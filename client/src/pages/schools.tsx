import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, Phone, School as SchoolIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
  
  // Fetch schools from localStorage with AUTO-RECOVERY
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          let schoolsData = localStorage.getItem('schools_data');
          
          // AUTO-RECOVERY: If main data is missing, try backup
          if (!schoolsData) {
            const backup = localStorage.getItem('schools_data_backup');
            if (backup) {
              localStorage.setItem('schools_data', backup);
              schoolsData = backup;
              console.log('🔄 Schools auto-recovered from backup');
            }
          }
          
          if (schoolsData) {
            const parsed = JSON.parse(schoolsData);
            
            // Create backup every time we successfully read data
            localStorage.setItem('schools_data_backup', schoolsData);
            localStorage.setItem('schools_data_timestamp', Date.now().toString());
            
            return Array.isArray(parsed) ? parsed : [];
          }
        }
        return [];
      } catch (error) {
        console.warn('Error reading schools from localStorage:', error);
        return [];
      }
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds to detect changes
    refetchIntervalInBackground: true,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ 
    name: "", 
    address: "", 
    contact: "", 
    principalName: "", 
    principalNip: "" 
  });

  // EXACT COPY FROM WORKING TASKS.TSX PATTERN
  const handleAddSchool = async () => {
    try {
      console.log('Submitting school:', newSchool);
      
      // Direct localStorage save
      const schoolsData = localStorage.getItem('schools_data');
      const currentSchools = schoolsData ? JSON.parse(schoolsData) : [];
      
      const newSchoolData = {
        id: Date.now().toString(),
        name: newSchool.name,
        address: newSchool.address,
        contact: newSchool.contact,
        principalName: newSchool.principalName,
        principalNip: newSchool.principalNip,
        supervisions: 0,
        createdAt: new Date().toISOString()
      };
      
      const updatedSchools = [...currentSchools, newSchoolData];
      
      // PROTECTED SAVE: Save to multiple locations
      localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
      localStorage.setItem('schools_data_backup', JSON.stringify(updatedSchools));
      localStorage.setItem('schools_data_timestamp', Date.now().toString());
      
      // Trigger success manually
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({
        title: "Berhasil",
        description: "Sekolah berhasil ditambahkan",
      });
      setNewSchool({ name: "", address: "", contact: "", principalName: "", principalNip: "" });
      setIsAddDialogOpen(false);
      
    } catch (error) {
      console.error('Error in handleAddSchool:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan sekolah",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchool = async (id: string) => {
    try {
      console.log('🗑️ DELETE SCHOOL - Starting delete for ID:', id);
      
      // SAFETY CHECK: Validate ID
      if (!id || id.trim() === '') {
        console.error('❌ DELETE SCHOOL - Invalid ID provided:', id);
        toast({
          title: "Error",
          description: "ID sekolah tidak valid",
          variant: "destructive",
        });
        return;
      }
      
      // Direct localStorage delete with safety checks
      const schoolsData = localStorage.getItem('schools_data');
      const currentSchools = schoolsData ? JSON.parse(schoolsData) : [];
      
      console.log('📊 DELETE SCHOOL - Current schools count:', currentSchools.length);
      console.log('🎯 DELETE SCHOOL - School to delete:', currentSchools.find((s: School) => s.id === id));
      
      // SAFETY CHECK: Ensure school exists
      const schoolExists = currentSchools.some((school: School) => school.id === id);
      if (!schoolExists) {
        console.warn('⚠️ DELETE SCHOOL - School not found with ID:', id);
        toast({
          title: "Error",
          description: "Sekolah tidak ditemukan",
          variant: "destructive",
        });
        return;
      }
      
      // SAFE FILTER: Remove only the specific school
      const updatedSchools = currentSchools.filter((school: School) => {
        const shouldKeep = school.id !== id;
        console.log('🔍 DELETE SCHOOL - Comparing:', school.id, 'vs', id, '→ keep:', shouldKeep);
        return shouldKeep;
      });
      
      console.log('📊 DELETE SCHOOL - Schools after filter:', updatedSchools.length);
      console.log('✅ DELETE SCHOOL - Deleted count:', currentSchools.length - updatedSchools.length);
      
      // SAFETY CHECK: Ensure only one school was deleted
      if (updatedSchools.length !== currentSchools.length - 1) {
        console.error('❌ DELETE SCHOOL - Unexpected delete count. Before:', currentSchools.length, 'After:', updatedSchools.length);
        toast({
          title: "Error",
          description: "Operasi delete tidak aman, dibatalkan",
          variant: "destructive",
        });
        return;
      }
      
      // PROTECTED SAVE: Save to multiple locations
      localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
      localStorage.setItem('schools_data_backup', JSON.stringify(updatedSchools));
      localStorage.setItem('schools_data_timestamp', Date.now().toString());
      
      console.log('💾 DELETE SCHOOL - Data saved successfully');
      
      // Trigger success manually
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast({
        title: "Berhasil",
        description: "Sekolah berhasil dihapus",
      });
      
    } catch (error) {
      console.error('💥 DELETE SCHOOL - Error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus sekolah",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data sekolah...</p>
      </div>
    );
  }

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

      {schools.length === 0 ? (
        <div className="text-center py-12">
          <SchoolIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Belum ada sekolah binaan</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tambahkan sekolah pertama Anda untuk memulai
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Sekolah Pertama
          </Button>
        </div>
      ) : (
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
                        {school.supervisions || 0} supervisi
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
      )}
    </div>
  );
}