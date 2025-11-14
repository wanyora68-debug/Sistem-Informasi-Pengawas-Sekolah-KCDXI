import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground">
          Halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Link href="/">
          <Button data-testid="button-back-home">
            <Home className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
