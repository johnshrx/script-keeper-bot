import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ACCESS_KEYS, SCRIPT_PLACEHOLDER, SCRIPTS, type ScriptId } from "@/lib/scriptTemplate";
import { Lock, Download, KeyRound, LogOut, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const STORAGE_KEY = "ec_access_granted";

function Index() {
  const [authed, setAuthed] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [scriptId, setScriptId] = useState<ScriptId>("aim_drag");
  const [userKey, setUserKey] = useState("");
  const [fileName, setFileName] = useState("");

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
    setFileName("");
  };

  const handleDownload = () => {
    const trimmedKey = userKey.trim();
    if (!trimmedKey) {
      toast.error("Ingresa tu key de cliente");
      return;
    }
    const script = SCRIPTS.find((s) => s.id === scriptId);
    if (!script) {
      toast.error("Selecciona un script");
      return;
    }
    const rawName = fileName.trim() || script.label.replace(/\s+/g, "_");
    const safeName = rawName.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const finalName = safeName.toLowerCase().endsWith(".json") ? safeName : `${safeName}.json`;

    const content = script.template.split(SCRIPT_PLACEHOLDER).join(trimmedKey);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Descargado: ${finalName}`);
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
          <div className="mb-4 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <span>Solo los aimbots cuello estas disponibles</span>
          </div>
        )}
        {authed && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <CardTitle>Generador Easy Proxy</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scriptType">Tipo de Proxy</Label>
                <Select value={scriptId} onValueChange={(v) => setScriptId(v as ScriptId)}>
                  <SelectTrigger id="scriptType">
                    <SelectValue placeholder="Selecciona un script" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCRIPTS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userKey">Tu key</Label>
                <Input
                  id="userKey"
                  placeholder="Ej: ABC123-XYZ"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileName">Nombre del archivo</Label>
                <Input
                  id="fileName"
                  placeholder="Ej: mi_script (se descargará como .json)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>

              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Descargar .json
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
