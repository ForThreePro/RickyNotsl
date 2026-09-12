let iconos = ['🍒', '🍋', '⭐', '💎', '7']

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!user.lasana) user.lasana = 0

    if (command === 'robar') {
        let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}robar @usuario`, m)
        let target = global.db.data.users[who]
        if (!target.lasana) target.lasana = 0
        let tiempo = 1 * 60 * 60 * 1000
        if (new Date - user.lastrob < tiempo) return conn.reply(m.chat, `⏰ Espera 1 hora para volver a robar`, m)
        let robo = Math.floor(Math.random() * target.lasana * 0.3)
        if (robo < 10) return conn.reply(m.chat, `❌ El usuario no tiene suficientes monedas`, m)
        target.lasana -= robo; user.lasana += robo; user.lastrob = new Date * 1
        return conn.reply(m.chat, `🕶️ *ROBASTE*\n+${robo} monedas de @${who.split('@')[0]}\n💰 Tu billetera: ${user.lasana}`, m, { mentions: [who] })
    }

    if (command === 'pay' || command === 'pagar') {
        let who = m.mentionedJid[0]
        let monto = parseInt(args[0])
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}pay [monto] @usuario`, m)
        if (!monto || monto < 1) return conn.reply(m.chat, `❌ Ingresa un monto válido`, m)
        if (user.lasana < monto) return conn.reply(m.chat, `❌ No tienes suficientes monedas`, m)
        let target = global.db.data.users[who]
        if (!target.lasana) target.lasana = 0
        user.lasana -= monto; target.lasana += monto
        return conn.reply(m.chat, `💸 *TRANSFERENCIA*\nEnviado: ${monto} monedas a @${who.split('@')[0]}\n💰 Tu saldo: ${user.lasana}`, m, { mentions: [who] })
    }

    if (command === 'slots' || command === 'slot') {
        let monto = parseInt(args[0])
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 monedas`, m)
        if (user.lasana < monto) return conn.reply(m.chat, `❌ No tienes suficientes monedas`, m)
        user.lasana -= monto
        let s1 = iconos[Math.floor(Math.random() * iconos.length)]
        let s2 = iconos[Math.floor(Math.random() * iconos.length)]
        let s3 = iconos[Math.floor(Math.random() * iconos.length)]
        let iguales = [s1, s2, s3].filter(v => v === s1).length
        let multi = iguales === 3? 50 : iguales === 2? 5 : 0
        let gana = monto * multi
        if (gana > 0) user.lasana += gana
        let resultado = iguales === 3? `🎉 JACKPOT x${multi}!` : iguales === 2? `✨ Ganaste x${multi}!` : `😢 Perdiste`
        return conn.reply(m.chat, `🎰 *SLOTS*\n[${s1}] [${s2}] [${s3}]\n\n${resultado}\n${gana > 0? `+${gana} monedas` : `-${monto} monedas`}\n💰 Total: ${user.lasana}`, m)
    }
}

handler.help = [
    'robar @usuario ( Robar Coins De La Billetera )',
    'pay [monto] @usuario ( Transferir Coins )',
    'slots [monto] ( Jugar Tragamonedas x2 x5 x50 )'
]
handler.tags = ['economy']
handler.command = ['robar', 'pay', 'pagar', 'slots', 'slot']
export default handler