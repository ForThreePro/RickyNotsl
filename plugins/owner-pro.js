import { exec } from "child_process"

let handler = async (m, { conn, command }) => {
    const owner = "@whois.yallico"

    // 1. RESET
    if (command === 'reset') {
        await m.react('🔄')
        await m.reply(`🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗥𝗘𝗦𝗘𝗧* 🤖

*━━━━━━━━━━*
*🔄 𝗥𝗘𝗜𝗡𝗜𝗖𝗜𝗔𝗡𝗗𝗢 𝗦𝗜𝗦𝗧𝗘𝗠𝗔*

> _Reiniciando el lobby... espera unos segundos_

*━━━━━━━━━━*`)
        process.send('reset')
    }

    // 2. AUTOADMIN
    if (command === 'autoadmin') {
        try {
            await m.react('👑')
            await conn.groupParticipantsUpdate(m.chat, [conn.user.jid], 'promote')
            await m.reply(`🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗔𝗗𝗠𝗜𝗡* 🤖

*━━━━━━━━━━*
*✅ 𝗔𝗗𝗠𝗜𝗡 𝗔𝗦𝗜𝗚𝗡𝗔𝗗𝗢*

*➤* Ya tengo poderes de *admin* en este lobby

*━━━━━━━━━━*`)
        } catch (e) {
            await m.react('❌')
            m.reply(`🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🤖

*━━━━━━━━━━*
*❌ 𝗘𝗥𝗥𝗢𝗥*

*➤* No pude asignarme *admin*
*➤* Revisa que ya no sea admin o que tengas permisos

*━━━━━━━━━━*`)
        }
    }

    // 3. UPDATE / ACTUALIZAR / FIX
    if (command === 'update' || command === 'actualizar' || command === 'fix') {
        if (m.react) await m.react('🌀')

        await conn.reply(m.chat, `🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟 - 𝗨𝗣𝗗𝗔𝗧𝗘* 🤖

*━━━━━━━━━━*
*🌀 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗡𝗗𝗢 𝗠𝗢𝗗𝗨𝗟𝗢𝗦*

> _Obteniendo parches del repositorio..._

*━━━━━━━━━━*`, m)

        exec('git pull', async (err, stdout, stderr) => {
            if (err) {
                if (m.react) await m.react('❌')
                return conn.reply(m.chat, `🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🤖

*━━━━━━━━━━*
*❌ 𝗘𝗥𝗥𝗢𝗥 𝗘𝗡 𝗟𝗔 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗖𝗜𝗢𝗡*

*➤* Detalle: 
\`\`${err.message}\`\`

*━━━━━━━━━━*
*Owner:* ${owner}`, m)
            }

            if (stdout.includes('Already up to date.')) {
                if (m.react) await m.react('✅')
                return conn.reply(m.chat, `🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🤖

*━━━━━━━━━━*
*✅ 𝗦𝗜𝗦𝗧𝗘𝗠𝗔 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢*

*➤* El sistema ya está en su *versión más reciente*

*━━━━━━━━━━*
*Owner:* ${owner}`, m)
            }

            if (m.react) await m.react('✅')
            return conn.reply(m.chat, `🎮 *𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟* 🤖

*━━━━━━━━━━*
*✅ 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗖𝗜𝗢𝗡 𝗔𝗣𝗟𝗜𝗖𝗔𝗗𝗔*

*📋 Parches:*
\`\`${stdout}\`\`

*━━━━━━━━━━*
*Owner:* ${owner}`, m)
        })
    }
}

handler.help = ['reset', 'autoadmin', 'update']
handler.tags = ['owner']
handler.command = ['reset', 'autoadmin', 'update', 'actualizar', 'fix']
handler.rowner = true

export default handler