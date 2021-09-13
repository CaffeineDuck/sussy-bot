import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("whois")
  .setDescription("Returns info about a user")
  .addUserOption((option) =>
    option.setName("user").setDescription("User to get info").setRequired(false)
  );

export const execute = async (interaction: CommandInteraction) => {
  const user = interaction.options.getUser("user") || interaction.user;

  if (!interaction.guild) {
    interaction.reply({
      content: "This command can only be run in a guild",
      ephemeral: true,
    });
  }
  const member = await interaction.guild!.members.fetch(user.id);

  const roles = member.roles.cache.each((_, role) => {
    return role.toString();
  });

  const permissions = member.permissions.toArray().map((permission, _, __) => {
    return `${permission.charAt(0).toUpperCase()}${permission
      .slice(1)
      .toLowerCase()
      .replaceAll("_", " ")}`;
  });

  let acknowledgement: "Member" | "Server Owner" | "Administrator" = "Member";
  
  if (member.permissions.has("ADMINISTRATOR")) {
    acknowledgement = "Administrator";
  } else if (interaction.guild?.ownerId === member.id) {
    acknowledgement = "Server Owner";
  }

  const userEmbed = new MessageEmbed()
    .setColor(member.displayHexColor)
    .setAuthor(
      `Userinfo of ${user.tag}`,
      user.avatarURL({ dynamic: true }) || user.defaultAvatarURL
    )
    .setFooter(`User ID: ${user.id}`)
    .setTimestamp()
    .setThumbnail(user.avatarURL({ dynamic: true })!)
    .addFields(
      {
        name: "Joined Server at",
        value: `<t:${Math.floor(member.joinedAt!.getTime() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Created at",
        value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>`,
        inline: true,
      },
      {
        name: "Nickname",
        value: `${member.nickname || member.user.username}`,
        inline: true,
      },
      {
        name: "Roles",
        value: new Array(...roles.values()).join(" "),
      },
      {
        name: "Permissions",
        value: permissions.join(", "),
      },
      {
        name: "Acknowledgement",
        value: acknowledgement,
      }
    );
  await interaction.reply({ embeds: [userEmbed] });
};
