const handler = async (m, { conn, command }) => {
  if (!m.mentionedJid[0] &&!m.quoted) {
    let texto = `🎮 𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🤖

*Uso:*
.${command} @user → Para ${command === 'promote' || command === 'promover' || command === 'daradmin'? 'dar admin' : 'quitar admin'}
.${command} → Responde al mensaje del player

> *Solo admins del lobby* 🕹️`
    return m.reply(texto, m.chat)
  }

  let user = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted.sender
  let action = command === 'promote' || command === 'promover' || command === 'daradmin'? 'promote' : 'demote'

  let msgAccion = action === 'promote'
? `🎮 𓆩 𝗣𝗟𝗔𝗬𝗘𝗥 𝗣𝗥𝗢𝗠𝗢𝗩𝗜𝗗𝗢 𓆪 🤖

.⃟𖥔 ݁. 𖦹˙— \`\`𝗔𝗗𝗠𝗜𝗡\`\` —˙𖦹.🕹️꒷

👑 *Nuevo Admin:* @${user.split('@')[0]}
⚡ *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮`
    : `🎮 𓆩 𝗣𝗟𝗔𝗬𝗘𝗥 𝗗𝗘𝗚𝗥𝗔𝗗𝗔𝗗𝗢 𓆪 🤖

.⃟𖥔 ݁. 𖦹˙— \`\`𝗗𝗘𝗠𝗢𝗧𝗘\`\` —˙𖦹.🕹️꒷

📉 *Ya no es Admin:* @${user.split('@')[0]}
🎮 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮`

  await m.react(action === 'promote'? '👑' : '📉')
  await conn.groupParticipantsUpdate(m.chat, [user], action)
  m.reply(msgAccion, m.chat, { mentions: [user, m.sender] })
}

handler.help = ['promote @user', 'demote @user']
handler.tags = ['grupos']
handler.command = /^(promote|promover|daradmin|demote|degradar|quitaradmin)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler