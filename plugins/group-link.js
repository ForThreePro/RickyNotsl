let handler = async (m, { conn }) => {
    try {
        await m.react('🔗')
        let link = await conn.groupInviteCode(m.chat)

        let texto = `🎮 𓆩 𝗟𝗜𝗡𝗞 𝗗𝗘𝗟 𝗟𝗢𝗕𝗕𝗬 𓆪 🤖

.⃟𖥔 ݁. 𖦹˙— \`\`𝗜𝗡𝗩𝗜𝗧𝗔𝗖𝗜𝗢𝗡\`\` —˙𖦹.🕹️꒷

──🎮 *𝗟𝗜𝗡𝗞* ╏ 💚
https://chat.whatsapp.com/${link}

──🤖 *𝗡𝗢𝗧𝗔* ╏ 🕹️
🎮 *Solo admins pueden resetear el link*
🎮 *No lo compartas con desconocidos*

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮`

        await conn.reply(m.chat, texto, m)
    } catch (e) {
        await m.react('❌')
        m.reply(`🎮 ❌ *Error:* No pude obtener el link. ¿Soy admin? 🤖`)
    }
}

handler.help = ['link']
handler.tags = ['grupos']
handler.command = ['link', 'linkgroup', 'grouplink']
handler.group = true
handler.admin = true

export default handler