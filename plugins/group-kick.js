let handler = async (m, { conn, participants, usedPrefix, command }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : null

    if (!mentionedJid) return conn.reply(m.chat, `🎮 𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🤖

*Uso:*
.${command} @user → Para expulsar del lobby
.${command} → Responde al mensaje del player

> *Solo admins* 🕹️`, m)

    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        let ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        let user = participants.find(p => p.id === mentionedJid)
        let isAdmin = user?.admin

        if (mentionedJid === conn.user.jid) return conn.reply(m.chat, `🎮 *No puedo eliminarme a mí mismo.*`, m)
        if (mentionedJid === ownerGroup) return conn.reply(m.chat, `🤖 *No puedo expulsar al dueño del lobby.*`, m)
        if (mentionedJid === ownerBot) return conn.reply(m.chat, `🕹️ *No puedo expulsar al owner del bot.*`, m)
        if (isAdmin) return conn.reply(m.chat, `🎮 *No puedo expulsar a un admin.*`, m)

        await m.react('👢')
        await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove')

        conn.reply(m.chat, `🎮 𓆩 𝗣𝗟𝗔𝗬𝗘𝗥 𝗘𝗫𝗣𝗨𝗟𝗦𝗔𝗗𝗢 𓆪 🤖

.⃟𖥔 ݁. 𖦹˙— \`\`𝗞𝗜𝗖𝗞\`\` —˙𖦹.🕹️꒷

👢 *Player:* @${mentionedJid.split('@')[0]}
👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮`, m, { mentions: [mentionedJid, m.sender] })
    } catch (e) {
        await m.react('❌')
        conn.reply(m.chat, `🎮 ❌ *Error del sistema.*\n> *Detalle:* ${e.message} 🤖`, m)
    }
}

handler.help = ['kick @user']
handler.tags = ['grupos']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler