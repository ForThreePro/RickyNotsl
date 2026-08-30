let handler = async (m, { conn, command }) => {

    let isClose
    let estado
    let icon
    let react

    if (command === 'abrir') {
        isClose = 'not_announcement'
        estado = 'ABIERTO 🔓'
        icon = '🎮'
        react = '🔓'
    } 
    if (command === 'cerrar') {
        isClose = 'announcement'
        estado = 'CERRADO 🔒'
        icon = '🤖'
        react = '🔒'
    }

    await conn.groupSettingUpdate(m.chat, isClose)
    await m.react(react)

    await conn.reply(m.chat, `🎮 𓆩 𝗟𝗢𝗕𝗬 ${estado} 𓆪 🤖

.⃟𖥔 ݁. 𖦹˙— \`\`𝗔𝗖𝗖𝗜𝗢𝗡 𝗥𝗘𝗔𝗟𝗜𝗭𝗔𝗗𝗔\`\` —˙𖦹.🕹️꒷

${icon} *Estado:* El lobby fue ${estado.toLowerCase()}
👑 *Por:* @${m.sender.split('@')[0]}

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮`, m, {
        mentions: [m.sender]
    })
}

handler.help = ['abrir', 'cerrar']
handler.tags = ['grupos']
handler.command = ['abrir', 'cerrar']
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler