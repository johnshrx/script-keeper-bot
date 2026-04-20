import "dotenv/config";
import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error("Faltan DISCORD_TOKEN o CLIENT_ID en .env");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("done")
    .setDescription("Genera el script con tu key inyectada")
    .addStringOption((o) =>
      o.setName("key").setDescription("Tu key de licencia").setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("allow")
    .setDescription("(Owner) Autoriza a un usuario a usar /done")
    .addUserOption((o) =>
      o.setName("user").setDescription("Usuario a autorizar").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
    .setName("revoke")
    .setDescription("(Owner) Revoca acceso a un usuario")
    .addUserOption((o) =>
      o.setName("user").setDescription("Usuario a revocar").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  new SlashCommandBuilder()
    .setName("list")
    .setDescription("(Owner) Lista los usuarios autorizados")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
].map((c) => c.toJSON());

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

try {
  if (GUILD_ID) {
    console.log(`Registrando comandos en el servidor ${GUILD_ID}...`);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Comandos registrados en el servidor (instantáneo).");
  } else {
    console.log("Registrando comandos globalmente...");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("✅ Comandos globales registrados (puede tardar hasta 1 hora).");
  }
} catch (err) {
  console.error("Error registrando comandos:", err);
  process.exit(1);
}
