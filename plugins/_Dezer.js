import fetch from "node-fetch"
import yts from 'yt-search'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'
import { spawn } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'

const SONGFINDER_API = 'https://songfinder.gg/api/recognize/url'
const UGUU_UPLOAD = 'https://uguu.se/upload'
const CLIP_SECONDS = 30

const handler = async (m, { conn, command }) => {
    try {
        let q = m.quoted? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime || !/audio|video/.test(mime)) return m.reply(`╭─── ⋆｡°✩ ───╮
😎🤖 𓆩 𝗘𝗟 𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𓆪 😎🤖

.⃟𖥔 ݁. 𖦹˙— \`\`𝐑𝐈𝐂𝐊𝐘 𝐌𝐔𝐒𝐈𝐂\`\` —˙𖦹.💭꒷

 ⤷ ┇ 𝗕𝗨𝗦𝗖𝗔𝗗𝗢𝗥 𝗗𝗘 𝗠𝗨𝗦𝗜𝗖𝗔
💭 ➛ .song = Info + Audio
💭 ➛ .letra = Letra + Audio

╰─── ⋆｡°✩ ───╯
> "Código y café. Nada más" ☕`)

        await m.react('🔍')
        let buffer = await q.download()
        if (!buffer) throw 'Error al descargar'

        await m.reply(`╭─── ⋆｡°✩ ───╮
😎🤖 𓆩 𝗘𝗟 𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𓆪 😎🤖
 ⤷ ┇ ⚡ ESCANEANDO
💭 ➛ Analizando ${CLIP_SECONDS}s...
╰─── ⋆｡°✩ ───╯`)

        let clip = await prepareClip(buffer, CLIP_SECONDS)
        let url = await uploadUguu(clip)
        let song = await recognizeUrl(url)
        let searchQuery = `${song.title} ${song.artist}`.replace(/\[.*?\]|\(feat.*?\)/gi, '').trim()

        await m.react('📥')
        let search = await yts(searchQuery)
        let result = search.videos[0]
        if (!result) throw 'No se encontró la canción'

        const { title, thumbnail, timestamp, views, videoId, author } = result
        const shortUrl = `https://youtu.be/${videoId}`
        const thumb = (await conn.getFile(thumbnail)).data
        const vistas = formatViews(views)
        const mediaUrl = await getMediaUrl(shortUrl)
        if (!mediaUrl) throw 'No se pudo obtener el audio'

        if(command === 'song'){
            await conn.sendMessage(m.chat, {
                image: thumb,
                caption: `╭─── ⋆｡°✩ ───╮
😎🤖 𓆩 𝗘𝗟 𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𓆪 😎🤖
 ⤷ ┇ ✅ OBJETIVO ENCONTRADO
📌 ➛ ${title}
👤 ➛ ${author.name}
👁️ ➛ ${vistas} | ⏱️ ${timestamp}
🔗 ➛ ${shortUrl}
╰─── ⋆｡°✩ ───╯
> "Código y café. Nada más" ☕`
            }, { quoted: m })
            await conn.sendMessage(m.chat, { audio: { url: mediaUrl }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
        }

        if(command === 'letra'){
            await m.react('📝')
            const lyricsRes = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.title)}`).then(r => r.json())
            let lyrics = lyricsRes.lyrics || 'No encontré la letra'
            if(lyrics.length > 1500) lyrics = lyrics.slice(0, 1500) + '\n\n...'
            await conn.sendMessage(m.chat, { text: `╭─── ⋆｡°✩ ───╮
😎🤖 𓆩 𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 - LETRA 𓆪 😎🤖
📌 *${title}* - *${author.name}*
\`\`${lyrics}\`\`\`
╰─── ⋆｡°✩ ───╯` }, { quoted: m })
            await conn.sendMessage(m.chat, { audio: { url: mediaUrl }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
        }
        await m.react('✅')
    } catch(e) {
        await m.react('❌')
        m.reply(`╭─── ⋆｡°✩ ───╮
😎🤖 ERROR 404
⚠️ ➛ ${e.message}
╰─── ⋆｡°✩ ───╯`)
    }
}

async function recognizeUrl(audioUrl) { const res = await fetch(SONGFINDER_API, { method: 'POST', headers: {'content-type': 'application/json', 'origin': 'https://songfinder.gg'}, body: JSON.stringify({ url: audioUrl, startTime: 0, recaptchaToken: crypto.randomBytes(24).toString('base64url') }) }); const json = await res.json(); if (!json?.success ||!json?.track) throw new Error('No se encontró'); return json.track }
async function uploadUguu(buffer) { const { ext, mime } = (await fileTypeFromBuffer(buffer)) || { ext: 'mp3', mime: 'audio/mpeg' }; const blob = new Blob([buffer], { type: mime }); const form = new FormData(); form.append('files[]', blob, crypto.randomBytes(5).toString('hex') + '.' + ext); const res = await fetch(UGUU_UPLOAD, { method: 'POST', body: form }); return (await res.json())?.files?.[0]?.url }
function prepareClip(buffer, seconds = CLIP_SECONDS) { return new Promise(resolve => { const tmpIn = path.join(os.tmpdir(), `sf_${Date.now()}`); fs.writeFileSync(tmpIn, buffer); const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', tmpIn, '-t', String(seconds), '-vn', '-acodec', 'libmp3lame', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-f', 'mp3', 'pipe:1']); const chunks = []; ff.stdout.on('data', c => chunks.push(c)); ff.on('close', () => { try{fs.unlinkSync(tmpIn)}catch{}; resolve(chunks.length? Buffer.concat(chunks) : buffer) }) }
async function getMediaUrl(url) { try { const res = await fetch(`https://api.sventy.store/api/ytdl?url=${encodeURIComponent(url)}`).then(r => r.json()); return res.data?.download || null } catch { return null } }
function formatViews(views) { if (views === undefined) return "No disponible"; if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`; if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`; if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`; return views.toString() }
handler.help = ['song', 'letra']; handler.tags = ['buscador']; handler.command = ['song', 'letra']; export default handler