import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Clear any old tokens on mount
  useEffect(() => {
    localStorage.removeItem('auth_token');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting Supabase login...');
      
      // Use new Supabase direct API
      const result = await authApi.login(loginUsername, loginPassword);
      
      console.log('Supabase login successful:', result.user);
      
      toast({
        title: "Berhasil",
        description: `Selamat datang, ${result.user.full_name}!`,
      });
      
      setLocation('/');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Gagal",
        description: error.message || "Username atau password salah",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: regUsername, 
          password: regPassword, 
          fullName: regFullName 
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if database setup is required
        if (data.requiresDbSetup) {
          toast({
            title: "Informasi",
            description: "Database belum dikonfigurasi. Silakan login dengan akun admin (admin/admin)",
            variant: "default",
          });
          // Switch to login tab with admin credentials
          setLoginUsername("admin");
          setLoginPassword("admin");
          setActiveTab("login");
        } else {
          toast({
            title: "Berhasil",
            description: "Registrasi berhasil! Silakan login.",
          });
          // Switch to login tab and fill credentials
          setLoginUsername(regUsername);
          setLoginPassword(regPassword);
          setActiveTab("login");
        }
        
        // Clear registration form
        setRegUsername("");
        setRegPassword("");
        setRegFullName("");
      } else {
        const error = await response.json();
        toast({
          title: "Gagal",
          description: error.error || "Registrasi gagal",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo Disdik Jabar - Di atas menu login */}
        <div className="mb-6">
          <div className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 shadow-xl">
            {/* Logo Disdik Jabar dengan background gradient biru-indigo */}
            <div className="w-full flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Text "cadisdik XI" */}
                <div className="text-center mb-2">
                  <span className="text-green-300 text-2xl font-bold tracking-wider drop-shadow-md">cadisdik XI</span>
                </div>
                
                {/* Text "disdik jabar" dengan logo */}
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white text-4xl font-bold tracking-wide drop-shadow-md">disdik</span>
                  
                  {/* Logo colorful */}
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* Green section */}
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-400 rounded-tr-lg transform rotate-45 origin-bottom-left shadow-lg"></div>
                        {/* Yellow section */}
                        <div className="absolute top-0 left-0 w-1/2 h-full bg-yellow-300 rounded-tl-lg shadow-lg"></div>
                        {/* Blue sections */}
                        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-300 rounded-br-lg shadow-lg"></div>
                        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-200 rounded-bl-lg shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-white text-4xl font-bold tracking-wide drop-shadow-md">jabar</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center space-y-2">
            <h2 className="text-lg font-bold text-gray-800">
              Dinas Pendidikan Provinsi Jawa Barat
            </h2>
            <p className="text-gray-700 text-sm font-semibold">
              Cabang Dinas Pendidikan Wilayah XI
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Sistem Informasi Pengawas Sekolah
            </p>
          </div>
        </div>

        {/* Login/Register Form */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" data-testid="tab-login">Masuk</TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register">Daftar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Masuk</CardTitle>
                <CardDescription>Masukkan username dan password Anda</CardDescription>
              </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="admin atau username anda"
                    data-testid="input-login-username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      data-testid="input-login-password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm transition-colors"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      tabIndex={-1}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-login-submit">
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
                

              </form>
            </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Daftar Akun Baru</CardTitle>
                <CardDescription>Buat akun pengawas baru</CardDescription>
              </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-fullname">Nama Lengkap</Label>
                  <Input
                    id="reg-fullname"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Nama lengkap anda"
                    data-testid="input-register-fullname"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Pilih username"
                    data-testid="input-register-username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Pilih password"
                      data-testid="input-register-password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm transition-colors"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      tabIndex={-1}
                    >
                      {showRegPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-register-submit">
                  {isLoading ? "Memproses..." : "Daftar"}
                </Button>
              </form>
            </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Credit Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            designed by @w.yogaswara kcdxi 2025
          </p>
        </div>
      </div>
    </div>
  );
}
