import "dotenv/config";
import { Client, GatewayIntentBits, Events, AttachmentBuilder, MessageFlags } from "discord.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isAllowed, addAllowed, removeAllowed, getAllowed } from "./storage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, "..", "template", "script.js");
const PLACEHOLDER = "AQUI VA LA KEY";

const { DISCORD_TOKEN, OWNER_ID } = process.env;
if (!DISCORD_TOKEN) {
  console.error("Falta DISCORD_TOKEN en .env");
  process.exit(1);
}
if (!OWNER_ID) {
  console.warn("⚠️  OWNER_ID no configurado: nadie podrá usar /allow ni /revoke.");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot listo como ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, user } = interaction;

  try {
    if (commandName === "done") {
      if (!(await isAllowed(user.id))) {
        await interaction.reply({
          content: "❌ No estás autorizado para usar este comando. Pídele acceso al owner.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const key = interaction.options.getString("key", true).trim();
      if (!key || key.length > 500) {
        await interaction.reply({
          content: "❌ Key inválida.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const template = await fs.readFile(TEMPLATE_PATH, "utf8");
      const filled = template.split(PLACEHOLDER).join(key);

      const file = new AttachmentBuilder(Buffer.from(filled, "utf8"), {
        name: "script.js",
      });

      await interaction.editReply({
        content: "✅ Aquí tienes tu script con la key inyectada:",
        files: [file],
      });
      return;
    }

    // Comandos de owner
    const isOwner = OWNER_ID && user.id === OWNER_ID;

    if (commandName === "allow") {
      if (!isOwner) {
        await interaction.reply({ content: "❌ Solo el owner puede usar este comando.", flags: MessageFlags.Ephemeral });
        return;
      }
      const target = interaction.options.getUser("user", true);
      const added = await addAllowed(target.id);
      await interaction.reply({
        content: added
          ? `✅ <@${target.id}> ahora puede usar /done.`
          : `ℹ️ <@${target.id}> ya estaba autorizado.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (commandName === "revoke") {
      if (!isOwner) {
        await interaction.reply({ content: "❌ Solo el owner puede usar este comando.", flags: MessageFlags.Ephemeral });
        return;
      }
      const target = interaction.options.getUser("user", true);
      const removed = await removeAllowed(target.id);
      await interaction.reply({
        content: removed
          ? `✅ Acceso revocado a <@${target.id}>.`
          : `ℹ️ <@${target.id}> no estaba autorizado.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (commandName === "list") {
      if (!isOwner) {
        await interaction.reply({ content: "❌ Solo el owner puede usar este comando.", flags: MessageFlags.Ephemeral });
        return;
      }
      const users = await getAllowed();
      await interaction.reply({
        content: users.length
          ? `👥 Autorizados (${users.length}):\n` + users.map((u) => `• <@${u}> (\`${u}\`)`).join("\n")
          : "👥 No hay usuarios autorizados todavía.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  } catch (err) {
    console.error("Error en interacción:", err);
    const msg = "❌ Ocurrió un error procesando el comando.";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: msg }).catch(() => {});
    } else {
      await interaction.reply({ content: msg, flags: MessageFlags.Ephemeral }).catch(() => {});
    }
  }
});

client.login(DISCORD_TOKEN);
