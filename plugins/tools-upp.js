import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"

let handler = async (m, { conn }) => {
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, `🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🤖

*━━━━━━━━━━*
*⚠️ 𝗘𝗥𝗢𝗥 𝗗𝗘 𝗨𝗦𝗢 ⚠️*

*𝗜𝗻𝘀𝘁𝗿𝘂𝗰𝗶𝗼𝗻𝗲𝘀:*
*➤* Responde a una *imagen, video, audio o documento*
*➤* Formatos: *Imagen | Video | Audio | Doc*

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`, m)

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    let media = await q.download()
    let link = await myCloud(media)
    if (!link.url) throw new Error()

    let txt = `🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🤖

*━━━━━━━━━━━━━━━━━━*
*✅ 𝗔𝗥𝗖𝗛𝗜𝗩𝗢 𝗦𝗨𝗕𝗜𝗗𝗢 𝗖𝗢𝗥𝗥𝗘𝗖𝗧𝗔𝗠𝗘𝗡𝗧𝗘*

*📊 𝗗𝗔𝗧𝗢𝗦 𝗗𝗘𝗟 𝗔𝗥𝗖𝗛𝗜𝗩𝗢*
*➤ Enlace:* ${link.url}
*➤ ID:* ${link.id || 'N/A'}
*➤ Peso:* ${formatBytes(media.length)}
*➤ Servidor:* *evogb.win*
*➤ Bot:* ***Ricky Bot Oficial***

*━━━━━━━━━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369
> _"Subido a la nube por Ricky Bot"_ ☁️⚡`

    await conn.sendFile(m.chat, media, 'ricky.' + link.url.split('.').pop(), txt, m)
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    await conn.reply(m.chat, `🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🤖

*━━━━━━━━━━*
*❌ 𝗘𝗥𝗢𝗥 𝗗𝗘 𝗦𝗨𝗕𝗜𝗗𝗔 ❌*

*𝗔𝘃𝗶𝘀𝗼:*
*➤* No se pudo subir el archivo
*➤* Intenta con otro archivo

*━━━━━━━━━━*
*Owner:* @whois.yallico 
*WhatsApp:* +51 927 174 369`, m)
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function myCloud(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType? fileType.ext : 'bin'
  const mime = fileType? fileType.mime : 'application/octet-stream'
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const response = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  if (!response.ok) throw new Error()
  return await response.json()
}

handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = ['upp', 'tourl'];
export default handler