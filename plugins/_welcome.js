import { WAMessageStubType } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!isAdmin &&!isOwner) return conn.reply(m.chat, `🎮 𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🤖\n\n🕹️ *Solo admins pueden usar este comando*`, m)
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (/on/i.test(args[0])) {
    chat.bienvenida = true
    await conn.reply(m.chat, `🎮 𓆩 ***𝗦𝗜𝗦𝗧𝗘𝗠𝗔 𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢*** 𓆪 🤖\n\n🟢 *Bienvenida con audios activada*`, m)
  } else if (/off/i.test(args[0])) {
    chat.bienvenida = false
    await conn.reply(m.chat, `🎮 𓆩 ***𝗦𝗜𝗦𝗧𝗘𝗠𝗔 𝗗𝗘𝗦𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢*** 𓆪 🤖\n\n🔴 *Bienvenida desactivada*`, m)
  } else {
    await conn.reply(m.chat, `🎮 𓆩 ***𝗥𝗜𝗖𝗞𝗬 𝗕𝗢𝗧 𝗢𝗙𝗜𝗖𝗜𝗔𝗟*** 𓆪 🤖\n\n📌 *Uso:* ${m.prefix}bienvenida on/off\n> "Activa los mensajes de entrada al lobby" 🕹️`, m)
  }
}

handler.help = ['bienvenida <on/off>']
handler.tags = ['config']
handler.command = /^(bienvenida|welcome|bye)$/i
handler.group = true
handler.admin = true

handler.before = async function (m, { conn, groupMetadata }) {
  try {
    if (!m.messageStubType ||!m.isGroup) return!0
    const chat = global.db?.data?.chats?.[m.chat]
    if (!chat ||!chat.bienvenida) return!0

    const userJid = m.messageStubParameters?.[0] || m.participant
    if (!userJid) return!0

    let pp
    try {
      pp = await conn.profilePictureUrl(userJid, 'image')
    } catch {
      pp = 'https://files.evogb.win/1FbQzR.jpg' // URL RICKY FALLBACK GAMER
    }

    const userTag = `@${userJid.split('@')[0]}`
    const groupName = groupMetadata.subject
    const groupDesc = groupMetadata.desc || 'Sin descripción'
    const membersCount = groupMetadata.participants.length

    let txt = '', audio = null

    switch (m.messageStubType) {
      case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        audio = chat.audiowelcome
        txt = chat.customWelcome? chat.customWelcome.replace(/@user/gi, userTag).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc) :
`🎮 𓆩 ***𝗡𝗨𝗘𝗩𝗢 𝗣𝗟𝗔𝗬𝗘𝗥*** 𓆪 🤖\n\n🕹️ *${userTag}* se unió a *${groupName}*\n👥 *Miembros:* ${membersCount}\n> "Player 1 listo para jugar"`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        audio = chat.audiobye
        txt = chat.customBye? chat.customBye.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🎮 𓆩 ***𝗣𝗟𝗔𝗬𝗘𝗥 𝗗𝗘𝗦𝗖𝗢𝗡𝗘𝗖𝗧𝗔𝗗𝗢*** 𓆪 🤖\n\n💤 *${userTag}* salió de *${groupName}*\n👥 *Quedan:* ${membersCount}`
        break

      case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
        audio = chat.audiokick
        txt = chat.customKick? chat.customKick.replace(/@user/gi, userTag).replace(/@group/gi, groupName) :
`🎮 𓆩 ***𝗕𝗔𝗡𝗘𝗔𝗗𝗢 𝗗𝗘𝗟 𝗦𝗘𝗥𝗩𝗜𝗗𝗢𝗥*** 𓆪 🤖\n\n🥊 *${userTag}* fue expulsado de *${groupName}*`
        break
    }

    if (txt) {
      await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: txt,
        mentions: [userJid]
      })

      if (audio) {
        if (Buffer.isBuffer(audio)) {
          await conn.sendMessage(m.chat, { audio: audio, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
        } else if (typeof audio === 'string' && audio.startsWith('http')) {
          await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m })
        }
      }
    }
  } catch (e) {
    console.error("Error en Bienvenida RickyBot:", e)
  }
  return!0
}

export default handler