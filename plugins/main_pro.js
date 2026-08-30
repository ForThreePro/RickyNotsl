import fs from 'fs'
import os from 'os'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    await m.react('⏳')

    // OWNER
    if (command === 'owner' || command === 'creator') {
        let owner = '51927174369@s.whatsapp.net'
        let texto = `
🎮 *𓆩 𝗗𝗨𝗘𝗡̃𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗢𝗪𝗡𝗘𝗥\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜𝗢𝗡* ：✿ 。

──🎮 *𝗖𝗢𝗡𝗧𝗔𝗖𝗧𝗢* ╏ 💚
💚 ➛ *Owner:* @${owner.split('@')[0]}
💚 ➛ *Numero:* +51 927 174 369

──🤖 *𝗡𝗢𝗧𝗔* ╏ 🕹️
🕹️ ➛ *Contacta solo para cosas importantes*

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Ricky está disponible para jugar"* ⚡`

        // Rota las 2 fotos
        const images = [
           'https://files.evogb.win/1FbQzR.jpg'
        ]
        let img = { url: images[Math.floor(Math.random() * images.length)] }

        await m.react('✅')
        return conn.sendMessage(m.chat, {
            image: img,
            caption: texto,
            mentions: [owner]
        })
    }

    // PING
    if (command === 'ping' || command === 'p') {
        let start = new Date * 1
        await conn.reply(m.chat, '🎮 *Calculando...*', m)
        let end = new Date * 1
        let speed = end - start
        let texto = `
🎮 *𓆩 PING DE RICKY 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗩𝗘𝗟𝗢𝗖𝗜𝗗𝗔𝗗\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗘𝗦𝗧𝗔𝗗𝗢* ：✿ 。

──🎮 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 💚
💚 ➛ *Velocidad:* ${speed}ms
💚 ➛ *Estado:* Activo en el lobby

──🤖 *𝗡𝗢𝗧𝗔* ╏ 🕹️
🕹️ ➛ *Servidor estable*

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Respondo más rápido que un headshot"* ⚡`

        const images = [
            'https://files.evogb.win/1FbQzR.jpg'
        ]
        let img = { url: images[Math.floor(Math.random() * images.length)] }

        await m.react('✅')
        return conn.sendMessage(m.chat, {
            image: img,
            caption: texto
        }, { quoted: m })
    }

    if (command === 'cleartmp') {
        const tmpPath = './tmp'
        if (fs.existsSync(tmpPath)) {
            fs.readdirSync(tmpPath).forEach(file => fs.unlinkSync(`${tmpPath}/${file}`))
        }
        let texto = `
🎮 *𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗟𝗜𝗠𝗣𝗜𝗘𝗭𝗔\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗖𝗔𝗖𝗛𝗘 𝗣𝗨𝗥𝗜𝗙𝗜𝗖𝗔𝗗𝗢* ：✿ 。

──🎮 *𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢* ╏ 💚
💚 ➛ *Caché temporal eliminado*
💚 ➛ *Memoria liberada con éxito*

──🤖 *𝗡𝗢𝗧𝗔* ╏ 🕹️
🕹️ ➛ *El bot está más ligero*

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Sistema optimizado para jugar"* 🕹️`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'cpu') {
        let cpu = os.loadavg()[0].toFixed(2)
        let texto = `
🎮 *𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗖𝗣𝗨\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗣𝗥𝗢𝗖𝗘𝗦𝗔𝗗𝗢𝗥* ：✿ 。

──🎮 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 💚
💚 ➛ *Carga CPU:* ${cpu}%

──🤖 *𝗡𝗢𝗧𝗔* ╏ 🕹️
🕹️ ➛ *Si supera 90% el bot va lento*

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Mi energía está al ${cpu}% para el juego"* ⚡`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'ram') {
        const used = process.memoryUsage()
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)
        let texto = `
🎮 *𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗥𝗔𝗠\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗠𝗘𝗠𝗢𝗥𝗜𝗔 𝗘𝗡 𝗨𝗦𝗢* ：✿ 。

──🎮 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 💚
💚 ➛ *Consumo RAM:* ${ram} MB

──🤖 *𝗡𝗢𝗧𝗔* ╏ 🕹️
🕹️ ➛ *Memoria usada por el proceso*

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Tengo suficiente RAM para seguir jugando"* 🚀`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'uptime') {
        let _uptime = process.uptime() * 1000
        let uptime = clockString(_uptime)
        let texto = `
🎮 *𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗨𝗣𝗧𝗜𝗠𝗘\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗧𝗜𝗘𝗠𝗣𝗢 𝗔𝗖𝗧𝗜𝗩𝗢* ：✿ 。

──🎮 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 💚
💚 ➛ *Tiempo activo:* ${uptime}

──🤖 *𝗡𝗢𝗧𝗔* ╏ 🕹️
🕹️ ➛ *Desde que se inició el bot*

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Llevo ${uptime} online sin lag"* ⚡`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'info') {
        let _muptime = process.uptime() * 1000
        let muptime = clockString(_muptime)
        const used = process.memoryUsage()
        let cpu = os.loadavg()[0].toFixed(2)
        let ram = (used.heapUsed / 1024 / 1024).toFixed(2)

        let texto = `
🎮 *𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗥𝗘𝗣𝗢𝗥𝗧𝗘 𝗗𝗘 𝗦𝗜𝗦𝗧𝗘𝗠𝗔\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗘𝗦𝗧𝗔𝗗𝗢 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧* ：✿ 。

──🎮 *𝗘𝗦𝗧𝗔𝗗𝗜𝗦𝗧𝗜𝗖𝗔𝗦* ╏ 💚
💚 ➛ *Uptime:* ${muptime}
💚 ➛ *Memoria RAM:* ${ram} MB
💚 ➛ *Carga CPU:* ${cpu}%

──🤖 *𝗗𝗘𝗧𝗔𝗟𝗟𝗘𝗦* ╏ 🕹️
🕹️ ➛ *Estado:* Operativo

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Todos mis sistemas están al 100% para jugar"* 🎯`
        await m.react('✅')
        return m.reply(texto)
    }

    if (command === 'tts' || command === 'gtts' || command === 'ttss') {
        let q = m.quoted? m.quoted : m
        let txt = text || q.text || q.caption || q.body || ''

        if (!txt) {
            let texto = `
🎮 *𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪* 🤖

.⃟𖥔 ݁. 𖦹˙— *\`\`𝗘𝗥𝗥𝗢𝗥\`\`* —˙𖦹.🕹️꒷

 *⤷ ┇ 𝗙𝗔𝗟𝗧𝗔 𝗧𝗘𝗫𝗧𝗢* ：✿ 。

──🎮 *𝗨𝗦𝗢* ╏ 💚
💚 ➛ *Escribe el texto que deseas convertir a audio*
💚 ➛ *O responde a un mensaje*

──🤖 *𝗘𝗝𝗘𝗠𝗣𝗟𝗢* ╏ 🕹️
🕹️ ➛ ${usedPrefix}tts Hola, ¿cómo estás?

━━━━━━━━━━━
*Powered by*: ***Ricky Bot Oficial*** 🎮
> *"Dime qué quieres que diga"* 🎙️`
            await m.react('❌')
            return m.reply(texto)
        }

        await m.react('🎙️')

        let lang = 'es'
        let url = googleTTS.getAudioUrl(txt, {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        })

        let tmpFilePath = path.join(tmpdir(), `ricky-${Date.now()}.opus`)

        await new Promise((resolve, reject) => {
            ffmpeg(url)
          .audioCodec('libopus')
          .toFormat('opus')
          .outputOptions([
                    '-avoid_negative_ts make_zero',
                    '-ac 1',
                    '-b:a 64k'
                ])
          .on('end', () => resolve(true))
          .on('error', (err) => reject(err))
          .save(tmpFilePath)
        })

        let audioBuffer = fs.readFileSync(tmpFilePath)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: m })

        if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath)
        await m.react('✅')
    }
}

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['owner', 'ping', 'cleartmp', 'cpu', 'ram', 'uptime', 'info', 'tts <texto>']
handler.tags = ['main', 'tools', 'info']
handler.command = /^(owner|creator|ping|p|cleartmp|cpu|ram|uptime|info|g?tts|ttss)$/i
handler.rowner = false

export default handler