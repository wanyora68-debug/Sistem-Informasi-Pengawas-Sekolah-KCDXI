import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Printer, Image as ImageIcon, X } from "lucide-react";
import { tasksApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Task = {
  id: string;
  title: string;
  category: string;
  description: string;
  completed: boolean;
  date: string;
  photo1?: string | null;
  photo2?: string | null;
};

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({ title: "", category: "Perencanaan", description: "", completed: false });
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo1Preview, setPhoto1Preview] = useState<string | null>(null);
  const [photo2Preview, setPhoto2Preview] = useState<string | null>(null);
  const photo1InputRef = useRef<HTMLInputElement>(null);
  const photo2InputRef = useRef<HTMLInputElement>(null);

  // Fetch tasks from API
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getAll,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas berhasil ditambahkan",
      });
      setNewTask({ title: "", category: "Perencanaan", description: "", completed: false });
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
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas berhasil dihapus",
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

  // Toggle complete mutation
  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      // Try API first, fallback to localStorage
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ completed }),
          credentials: 'include',
        });
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.log('Toggle API failed, using localStorage fallback');
      }
      
      // Fallback to localStorage
      const tasksData = localStorage.getItem('tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      const updatedTasks = currentTasks.map((task: any) => 
        task.id === id ? { ...task, completed } : task
      );
      localStorage.setItem('tasks_data', JSON.stringify(updatedTasks));
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Berhasil",
        description: "Status tugas berhasil diupdate",
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

  const handleAddTask = async () => {
    try {
      console.log('Submitting task:', newTask);
      
      // Direct localStorage save (bypass API completely for now)
      const tasksData = localStorage.getItem('tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      // Convert photos to base64 if they exist
      let photo1Base64 = null;
      let photo2Base64 = null;
      
      if (photo1) {
        photo1Base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo1);
        });
      }
      
      if (photo2) {
        photo2Base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(photo2);
        });
      }
      
      const newTaskData = {
        id: Date.now().toString(),
        title: newTask.title,
        category: newTask.category,
        description: newTask.description,
        completed: newTask.completed,
        date: new Date().toISOString().split('T')[0],
        photo1: photo1Base64,
        photo2: photo2Base64,
        createdAt: new Date().toISOString()
      };
      
      const updatedTasks = [...currentTasks, newTaskData];
      localStorage.setItem('tasks_data', JSON.stringify(updatedTasks));
      
      // Trigger success manually
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas berhasil ditambahkan",
      });
      setNewTask({ title: "", category: "Perencanaan", description: "", completed: false });
      setPhoto1(null);
      setPhoto2(null);
      setPhoto1Preview(null);
      setPhoto2Preview(null);
      setIsAddDialogOpen(false);
      
    } catch (error) {
      console.error('Error in handleAddTask:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan tugas",
        variant: "destructive",
      });
    }
  };

  const toggleComplete = (id: string, currentStatus: boolean) => {
    toggleCompleteMutation.mutate({ id, completed: !currentStatus });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      category: task.category,
      description: task.description || "",
      completed: task.completed,
    });
    // Set existing photos as preview
    if (task.photo1) {
      const photoUrl = task.photo1.startsWith('data:') ? task.photo1 : `/uploads/${task.photo1}`;
      setPhoto1Preview(photoUrl);
    }
    if (task.photo2) {
      const photoUrl = task.photo2.startsWith('data:') ? task.photo2 : `/uploads/${task.photo2}`;
      setPhoto2Preview(photoUrl);
    }
    setIsEditDialogOpen(true);
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      // Try API first, fallback to localStorage
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
          credentials: 'include',
        });
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.log('Update API failed, using localStorage fallback');
      }
      
      // Fallback to localStorage
      const tasksData = localStorage.getItem('tasks_data');
      const currentTasks = tasksData ? JSON.parse(tasksData) : [];
      
      // Convert FormData to object with proper async file handling
      const taskData: any = {};
      const filePromises: Promise<void>[] = [];
      
      formData.forEach((value, key) => {
        if (key.startsWith('photo') && value instanceof File) {
          // Convert file to base64 for localStorage
          const promise = new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              taskData[key] = reader.result;
              resolve();
            };
            reader.readAsDataURL(value);
          });
          filePromises.push(promise);
        } else {
          taskData[key] = value;
        }
      });
      
      // Wait for all file conversions to complete
      await Promise.all(filePromises);
      
      const updatedTasks = currentTasks.map((task: any) => 
        task.id === id ? { ...task, ...taskData, completed: taskData.completed === 'true' } : task
      );
      localStorage.setItem('tasks_data', JSON.stringify(updatedTasks));
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Berhasil",
        description: "Tugas berhasil diupdate",
      });
      setEditingTask(null);
      setNewTask({ title: "", category: "Perencanaan", description: "", completed: false });
      setPhoto1(null);
      setPhoto2(null);
      setPhoto1Preview(null);
      setPhoto2Preview(null);
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    
    const formData = new FormData();
    formData.append('title', newTask.title);
    formData.append('category', newTask.category);
    formData.append('description', newTask.description);
    formData.append('completed', newTask.completed.toString());
    // Format date properly
    const dateStr = editingTask.date ? new Date(editingTask.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    formData.append('date', dateStr);
    
    if (photo1) {
      formData.append('photo1', photo1);
    }
    if (photo2) {
      formData.append('photo2', photo2);
    }

    updateTaskMutation.mutate({ id: editingTask.id, formData });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Perencanaan": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Pendampingan": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Pelaporan": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handlePrintTask = (task: Task) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const photos = [];
    if (task.photo1) {
      const photoUrl = task.photo1.startsWith('data:') ? task.photo1 : `/uploads/${task.photo1}`;
      photos.push({ url: photoUrl, label: 'Foto 1' });
    }
    if (task.photo2) {
      const photoUrl = task.photo2.startsWith('data:') ? task.photo2 : `/uploads/${task.photo2}`;
      photos.push({ url: photoUrl, label: 'Foto 2' });
    }
    
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
          <title>Cetak Tugas - ${task.title}</title>
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
              width: 150px;
              color: #555;
            }
            .info-value {
              flex: 1;
              color: #333;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 14px;
              font-weight: 500;
            }
            .status {
              margin-top: 20px;
              padding: 15px;
              border-radius: 8px;
              background: ${task.completed ? '#dcfce7' : '#fef3c7'};
              color: ${task.completed ? '#166534' : '#92400e'};
              font-weight: 600;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Detail Tugas Harian</h1>
          <div class="info-row">
            <div class="info-label">Judul Tugas:</div>
            <div class="info-value">${task.title}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Kategori:</div>
            <div class="info-value"><span class="badge">${task.category}</span></div>
          </div>
          <div class="info-row">
            <div class="info-label">Tanggal:</div>
            <div class="info-value">${new Date(task.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Deskripsi:</div>
            <div class="info-value">${task.description || '-'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Jumlah Foto:</div>
            <div class="info-value">${[task.photo1, task.photo2].filter(Boolean).length} foto</div>
          </div>
          <div class="status">
            Status: ${task.completed ? '✓ Selesai' : '○ Belum Selesai'}
          </div>
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
          <h1 className="text-3xl font-bold">Daftar Tugas Harian</h1>
          <p className="text-muted-foreground mt-1">Kelola tugas harian Anda</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-new-task">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Baru</DialogTitle>
              <DialogDescription>Isi detail tugas yang akan dikerjakan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Judul Tugas</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Masukkan judul tugas"
                  data-testid="input-task-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-category">Kategori</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger id="task-category" data-testid="select-task-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perencanaan">Perencanaan</SelectItem>
                    <SelectItem value="Pendampingan">Pendampingan</SelectItem>
                    <SelectItem value="Pelaporan">Pelaporan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <Select value={newTask.completed ? "true" : "false"} onValueChange={(value) => setNewTask({ ...newTask, completed: value === "true" })}>
                  <SelectTrigger id="task-status" data-testid="select-task-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Belum Selesai</SelectItem>
                    <SelectItem value="true">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Deskripsi</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Deskripsi detail tugas"
                  rows={4}
                  data-testid="input-task-description"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Foto (Maksimal 2)</Label>
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
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel-task">
                  Batal
                </Button>
                <Button 
                  onClick={handleAddTask} 
                  disabled={!newTask.title || createTaskMutation.isPending} 
                  data-testid="button-save-task"
                >
                  {createTaskMutation.isPending ? "Menyimpan..." : "Simpan Tugas"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tugas</DialogTitle>
              <DialogDescription>Update detail tugas</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-title">Judul Tugas</Label>
                <Input
                  id="edit-task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Masukkan judul tugas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-category">Kategori</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger id="edit-task-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perencanaan">Perencanaan</SelectItem>
                    <SelectItem value="Pendampingan">Pendampingan</SelectItem>
                    <SelectItem value="Pelaporan">Pelaporan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-status">Status</Label>
                <Select value={newTask.completed ? "true" : "false"} onValueChange={(value) => setNewTask({ ...newTask, completed: value === "true" })}>
                  <SelectTrigger id="edit-task-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Belum Selesai</SelectItem>
                    <SelectItem value="true">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-description">Deskripsi</Label>
                <Textarea
                  id="edit-task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Deskripsi detail tugas"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Foto (Maksimal 2)</Label>
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
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingTask(null);
                  setPhoto1(null);
                  setPhoto2(null);
                  setPhoto1Preview(null);
                  setPhoto2Preview(null);
                }}>
                  Batal
                </Button>
                <Button 
                  onClick={handleUpdateTask} 
                  disabled={!newTask.title || updateTaskMutation.isPending}
                >
                  {updateTaskMutation.isPending ? "Menyimpan..." : "Update Tugas"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tasks.map((task: Task) => (
          <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleComplete(task.id, task.completed)}
                    className="mt-1"
                    data-testid={`checkbox-task-${task.id}`}
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`text-lg ${task.completed ? "line-through" : ""}`}>
                      {task.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={getCategoryColor(task.category)} variant="secondary">
                        {task.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{task.date}</span>
                      {(task.photo1 || task.photo2) && (
                        <Badge variant="outline" className="text-xs">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          {[task.photo1, task.photo2].filter(Boolean).length} foto
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handlePrintTask(task)} data-testid={`button-print-task-${task.id}`}>
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)} data-testid={`button-edit-task-${task.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} data-testid={`button-delete-task-${task.id}`}>
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
                          src={task.photo1.startsWith('data:') ? task.photo1 : `/uploads/${task.photo1}`} 
                          alt="Foto 1" 
                          className="w-full h-40 object-cover rounded-md border"
                        />
                      )}
                      {task.photo2 && (
                        <img 
                          src={task.photo2.startsWith('data:') ? task.photo2 : `/uploads/${task.photo2}`} 
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
    </div>
  );
}
