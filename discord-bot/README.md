# Key Delivery Discord Bot

Bot de Discord que entrega `script.js` con la key del cliente inyectada en lugar del placeholder `AQUI VA LA KEY`.

## Comandos

- `/done key:<TU_KEY>` — Genera y envía `script.js` con la key inyectada (solo usuarios autorizados, respuesta privada).
- `/allow user:@usuario` — (Solo owner) Autoriza a un usuario.
- `/revoke user:@usuario` — (Solo owner) Revoca el acceso.
- `/list` — (Solo owner) Lista los usuarios autorizados.

---

## 1. Crear la app del bot en Discord

1. Ve a https://discord.com/developers/applications → **New Application**.
2. En la pestaña **Bot** → **Reset Token** → copia el token (será `DISCORD_TOKEN`).
3. En **General Information** copia el **Application ID** (será `CLIENT_ID`).
4. En **Bot** activa **Message Content Intent** (no es estrictamente necesario, pero útil).
5. En **OAuth2 → URL Generator**, marca:
   - Scopes: `bot`, `applications.commands`
   - Bot permissions: `Send Messages`, `Attach Files`, `Use Slash Commands`
6. Abre la URL generada e invita el bot a tu servidor.

## 2. Obtener tu User ID

En Discord: Ajustes → Avanzado → activa **Modo desarrollador**. Luego clic derecho en tu nombre → **Copiar ID de usuario**. Ese es `OWNER_ID`.

(Opcional) Clic derecho en el servidor → Copiar ID → será `GUILD_ID` (registra los comandos al instante en ese servidor).

## 3. Configurar localmente

```bash
cd discord-bot
cp .env.example .env
# Edita .env con tus valores
npm install
npm run register   # registra los slash commands
npm start          # arranca el bot
```

## 4. Desplegar en Railway (recomendado)

1. Sube esta carpeta `discord-bot/` a un repo de GitHub (puede ser privado).
2. https://railway.app → **New Project** → **Deploy from GitHub repo**.
3. En **Variables** añade: `DISCORD_TOKEN`, `CLIENT_ID`, `OWNER_ID`, opcionalmente `GUILD_ID`.
4. En **Settings → Start Command**: `npm start`.
5. Después del primer deploy, abre la pestaña de logs y, una sola vez, ejecuta `npm run register` desde tu máquina local (o añade un job temporal). Solo hace falta repetirlo si cambias los comandos.

> ⚠️ **Persistencia de `data/allowed.json`**: en Railway el filesystem es efímero. Para que la lista de usuarios sobreviva a redeploys, monta un **Volume** en `/app/discord-bot/data` (o la ruta que use tu deploy). Alternativas: Render con disco persistente, Fly.io con volumen, o un VPS.

## 5. Cómo usarlo

1. Tú (owner) ejecutas en cualquier canal: `/allow user:@cliente`.
2. El cliente ejecuta `/done key:ABC123`.
3. El bot le responde **en privado** (ephemeral) con un `script.js` que ya tiene `ABC123` en lugar de `AQUI VA LA KEY` (ambas ocurrencias).

## Plantilla

Edita `template/script.js` para cambiar el script base. Asegúrate de mantener el texto exacto `AQUI VA LA KEY` en cada lugar donde quieras que se inyecte la key.
