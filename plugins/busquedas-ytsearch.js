import axios from 'axios'

let handler = async (m, { conn, text }) => {
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    if (!text) return m.reply(`🎮 𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🤖\n\n⚡ *¿Qué deseas buscar en YouTube?*\n📌 *Ejemplo:* ${m.prefix}ytsearch minecraft pvp`)

    await m.react('🔍')
    try {
        let { data } = await axios.get(`https://api.delirius.store/search/ytsearch?q=${encodeURIComponent(text)}`)
        if (!data.data || data.data.length === 0) {
            await m.react('❌')
            return m.reply(`🎮 *No se encontraron resultados para:* ${text} 🤖`)
        }

        let res = data.data.slice(0, 5).map((v, i) => 
`*${i+1}.* *${v.title}*
⏳ *Duración:* ${v.duration} | 👁️ *Vistas:* ${v.views}
👤 *Canal:* ${v.author}
🔗 ${v.url}`).join('\n\n')

        let caption = `🎮 𓆩 𝗬𝗢𝗨𝗧𝗨𝗕𝗘 𝗦𝗘𝗔𝗥𝗖𝗛 𓆪 🤖

.⃟𖥔 ݁. 𖦹˙— \`\`𝗧𝗢𝗣 𝟱 𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦\`\` —˙𖦹.🕹️꒷

${res}

👤 *Solicitado por:* ${user}
🏷 *Lobby:* ${groupName}

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
*Tip:* Usa .ytmp4 o .ytmp3 con el link para descargar`

        m.reply(caption, m.chat, { mentions: [m.sender] })
        await m.react('✅')
    } catch { 
        await m.react('❌')
        m.reply(`🎮 ❌ *Error del sistema al buscar en YouTube* 🕹️`)
    }
}

handler.help = ['yts <busqueda>']
handler.tags = ['search']
handler.command = /^(yts|ytsearch)$/i

export default handler