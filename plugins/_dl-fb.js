import fetch from 'node-fetch'

// FUNCION PARA REACCIONES COMPATIBLE
const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { args, conn }) => {
  try {
    if (!args[0]) {
      return conn.reply(
        m.chat,
        `🎮 𓆩 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗗𝗢𝗥 𝗗𝗘 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𓆪 🤖

Uso:.facebook <link de facebook>
Ejemplo:.facebook https://www.facebook.com/watch?v=123 🕹️`,
        m
      )
    }

    if (!args[0].match(/facebook\.com|fb\.watch/)) {
      await react(conn, m, '❌')
      return m.reply('🎮 ⚠️ Link inválido. Solo acepto links de Facebook. 🤖')
    }

    await react(conn, m, '⏳')
    await m.reply('🎮 ⏳ Conectando al servidor... Descargando assets 🕹️')

    const api = `https://yosoyyo-api-ofc.onrender.com/api/facebook?url=${encodeURIComponent(args[0])}&apiKey=yosoyyo_sk_2nbk5m69`
    const res = await fetch(api)
    const json = await res.json()

    const data = json.result || json.data || json

    const info = data.info || {}
    const author = data.author || {}
    const media = data.media || {}

    const videoUrl = media.video_hd || media.video_sd

    if (!videoUrl) {
      await react(conn, m, '❌')
      return conn.reply(
        m.chat,
        '🎮 ❌ Error 404: No se pudo obtener el enlace de descarga. 🤖',
        m
      )
    }

    const titulo = info.title || 'Video de Facebook'
    const duracion = info.duration? `\n⏱️ 𝗗𝗨𝗥𝗔𝗖𝗜𝗢𝗡: ${info.duration}` : ''
    const autorTxt = author.username? `\n👤 𝗔𝗨𝗧𝗢𝗥: ${author.username}` : ''

    let txt = `╭─「 𝗩𝗜𝗗𝗘𝗢 𝗗𝗘 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 」
│
│ 📝 𝗧𝗜𝗧𝗨𝗟𝗢: ${titulo}${duracion}${autorTxt}
│
╰───────────────────────
🎮 Descargando... Render sin marca de agua 🤖`

    await conn.sendFile(
      m.chat,
      videoUrl,
      'RickyBot_facebook.mp4',
      txt,
      m
    )

    await react(conn, m, '✅')

  } catch (error) {
    console.log('Facebook API Error:', error.message)
    await react(conn, m, '❌')
    await m.reply(`🎮 ❌ Game Over: ${error.message} 🕹️`)
  }
}

handler.command = ['facebook', 'fb']
handler.tags = ['descargas']
handler.help = ['facebook <link>']
handler.limit = true

export default handler