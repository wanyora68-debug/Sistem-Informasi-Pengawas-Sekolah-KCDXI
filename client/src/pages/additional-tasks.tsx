import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, Users, Image as ImageIcon, X, Printer, Trash2 } from "lucide-react";
import { additionalTasksApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type AdditionalTask = {
  id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
  description: string;
  photo1?: string | null;
  photo2?: string | null;
};

export default function AdditionalTasksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    name: "",
    date: "",
    location: "",
    organizer: "",
    description: "",
  });
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const photo1InputRef = useRef<HTMLInputElement>(null);
  const photo2InputRef = useRef<HTMLInputElement>(null);

  // Fetch tasks from API
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['additional-tasks'],
    queryFn: additionalTasksApi.getAll,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: additionalTasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas tambahan berhasil ditambahkan",
      });
      setNewTask({ name: "", date: "", location: "", organizer: "", description: "" });
      setPhoto1(null);
      setPhoto2(null);
      setPhoto1Preview(null);
      setPhoto2Preview(null);
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: additionalTasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['additional-tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas tambahan berhasil dihapus",
      });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddTask = async () => {
    const formData = new FormData();
    formData.append('name', newTask.name);
    formData.append('date', newTask.date);
    formData.append('location', newTask.location);
    formData.append('organizer', newTask.organizer);
    formData.append('description', newTask.description);
    
    if (photo1) formData.append('photo1', photo1);
    if (photo2) formData.append('photo2', photo2);

    createTaskMutation.mutate(formData);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  const handleDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTaskMutation.mutate(taskToDelete);
    }
  };

  const handlePrintTask = (task: AdditionalTask) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const photos = [];
    if (task.photo1) photos.push({ url: `/uploads/${task.photo1}`, label: 'Foto 1' });
    if (task.photo2) photos.push({ url: `/uploads/${task.photo2}`, label: 'Foto 2' });
    
    const photosHtml = photos.length > 0
      ? `
        <div style="margin-top: 25px;">
          <h3 style="color: #2563eb; margin-bottom: 15px;">Foto Kegiatan:</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            ${photos.map(photo => `
              <div>
                <img src="${photo.url}" alt="${photo.label}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; border: 2px solid #e5e7eb;" />
                <p style="text-align: center; margin-top: 5px; font-size: 12px; color: #666;">${photo.label}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Tugas Tambahan - ${task.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #333;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              margin-bottom: 15px;
              padding: 10px;
              background: #f9fafb;
              border-radius: 5px;
            }
            .info-label {
              font-weight: bold;
              width: 180px;
              color: #555;
            }
            .info-value {
              flex: 1;
              color: #333;
            }
            .icon-text {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .section {
              margin-top: 25px;
              padding: 15px;
              background: #f9fafb;
              border-left: 4px solid #2563eb;
              border-radius: 5px;
            }
            .section-title {
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Detail Tugas Tambahan</h1>
          <div class="info-row">
            <div class="info-label">Nama Kegiatan:</div>
            <div class="info-value">${task.name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tanggal:</div>
            <div class="info-value">${formatDate(task.date)}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tempat:</div>
            <div class="info-value">${task.location}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Penyelenggara:</div>
            <div class="info-value">${task.organizer}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Jumlah Foto:</div>
            <div class="info-value">${[task.photo1, task.photo2].filter(Boolean).length} foto</div>
          </div>
          ${task.description ? `
            <div class="section">
              <div class="section-title">Deskripsi/Hasil Kegiatan:</div>
              <div>${task.description}</div>
            </div>
          ` : ''}
          ${photosHtml}
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

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
          <h1 className="text-3xl font-bold">Tugas Tambahan</h1>
          <p className="text-muted-foreground mt-1">Catat kegiatan dan tugas tambahan di luar supervisi</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-additional-task">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Tambahan</DialogTitle>
              <DialogDescription>Catat kegiatan tambahan yang Anda ikuti</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Nama Kegiatan</Label>
                <Input
                  id="task-name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Contoh: Rapat Koordinasi"
                  data-testid="input-task-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-date">Tanggal Kegiatan</Label>
                <Input
                  id="task-date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  data-testid="input-task-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-location">Tempat Kegiatan</Label>
                <Input
                  id="task-location"
                  value={newTask.location}
                  onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                  placeholder="Lokasi kegiatan"
                  data-testid="input-task-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-organizer">Penyelenggara Kegiatan</Label>
                <Input
                  id="task-organizer"
                  value={newTask.organizer}
                  onChange={(e) => setNewTask({ ...newTask, organizer: e.target.value })}
                  placeholder="Nama penyelenggara"
                  data-testid="input-task-organizer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Deskripsi atau Hasil Kegiatan</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Catatan hasil atau deskripsi kegiatan"
                  rows={4}
                  data-testid="input-task-description"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Foto Kegiatan (Maksimal 2)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      ref={photo1InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto1(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto1Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo1InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo1Preview ? (
                        <>
                          <img src={photo1Preview} alt="Preview 1" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto1(null);
                              setPhoto1Preview(null);
                              if (photo1InputRef.current) photo1InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 1</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      ref={photo2InputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhoto2(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPhoto2Preview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div
                      onClick={() => photo2InputRef.current?.click()}
                      className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer relative"
                    >
                      {photo2Preview ? (
                        <>
                          <img src={photo2Preview} alt="Preview 2" className="w-full h-32 object-cover rounded" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhoto2(null);
                              setPhoto2Preview(null);
                              if (photo2InputRef.current) photo2InputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Foto 2</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel-additional-task">
                  Batal
                </Button>
                <Button onClick={handleAddTask} disabled={!newTask.name || !newTask.date} data-testid="button-save-additional-task">
                  Simpan Kegiatan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tasks.map((task: AdditionalTask) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{task.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(task.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{task.organizer}</span>
                    </div>
                    {(task.photo1 || task.photo2) && (
                      <Badge variant="outline">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        {[task.photo1, task.photo2].filter(Boolean).length} foto
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handlePrintTask(task)} data-testid={`button-print-task-${task.id}`}>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} data-testid={`button-delete-task-${task.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {(task.description || task.photo1 || task.photo2) && (
              <CardContent className="space-y-3">
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
                {(task.photo1 || task.photo2) && (
                  <div>
                    <p className="text-sm font-medium mb-2">Foto Kegiatan:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {task.photo1 && (
                        <img 
                          src={`/uploads/${task.photo1}`} 
                          alt="Foto 1" 
                          className="w-full h-40 object-cover rounded-md border"
                        />
                      )}
                      {task.photo2 && (
                        <img 
                          src={`/uploads/${task.photo2}`} 
                          alt="Foto 2" 
                          className="w-full h-40 object-cover rounded-md border"
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas Tambahan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tugas tambahan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
