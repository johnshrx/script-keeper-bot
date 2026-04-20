import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ACCESS_KEYS, SCRIPT_PLACEHOLDER, SCRIPT_TEMPLATE } from "@/lib/scriptTemplate";
import { Lock, Download, KeyRound, LogOut } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const STORAGE_KEY = "ec_access_granted";

function Index() {
  const [authed, setAuthed] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [userKey, setUserKey] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (ACCESS_KEYS.includes(accessKey.trim())) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      toast.success("Acceso concedido");
    } else {
      toast.error("Llave de acceso inválida");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setAccessKey("");
    setUserKey("");
  };

  const handleDownload = () => {
    const trimmed = userKey.trim();
    if (!trimmed) {
      toast.error("Ingresa tu key de cliente");
      return;
    }
    const content = SCRIPT_TEMPLATE.split(SCRIPT_PLACEHOLDER).join(trimmed);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "script.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Script descargado");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            EasyCheats Generator
          </h1>
        </div>

        {!authed ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Acceso restringido</CardTitle>
              </div>
              <CardDescription>
                Ingresa la llave de acceso para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access">Llave de acceso</Label>
                  <Input
                    id="access"
                    type="password"
                    autoFocus
                    placeholder="Ingresa la llave"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <CardTitle>Generar script</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Pega tu key de cliente. Se inyectará en el script y podrás descargarlo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userKey">Tu key</Label>
                <Input
                  id="userKey"
                  placeholder="Ej: ABC123-XYZ"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                />
              </div>
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Descargar script.json
              </Button>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} EasyCheats
        </p>
      </div>
    </div>
  );
}
