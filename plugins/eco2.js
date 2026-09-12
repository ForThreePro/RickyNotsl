let iconos = ['💎', '🍋', '⭐'] // Los 3 de la foto
let MONEDA = 'R-COINS'

function msToTime(duration) {
    let minutes = Math.floor((duration / (1000 * 60)) % 60)
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m`
}

function getUser(id) {
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let user = global.db.data.users[id]
    if (user.rcoins === undefined) user.rcoins = 0
    if (user.rbank === undefined) user.rbank = 0
    if (user.lastrob === undefined) user.lastrob = 0
    return user
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = getUser(m.sender)

    if (command === 'robar') {
        let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}robar @usuario`, m)
        if (who === m.sender) return conn.reply(m.chat, `❌ No te puedes robar a ti mismo`, m)

        let target = getUser(who)

        let tiempo = 1 * 60 * 60 * 1000
        if (user.lastrob && new Date - user.lastrob < tiempo) {
            let falta = msToTime(user.lastrob + tiempo - new Date())
            return conn.reply(m.chat, `⏳ Ya robaste recientemente\nVuelve en: ${falta}`, m)
        }

        let totalTarget = target.rcoins + target.rbank
        if (totalTarget < 10) return conn.reply(m.chat, `❌ @${who.split('@')[0]} no tiene suficientes ${MONEDA}\n*Tiene:* ${totalTarget} ${MONEDA}`, m, { mentions: [who] })

        let robo = Math.floor(Math.random() * (totalTarget * 0.2)) + 10 // 10 a 30%
        if (robo > totalTarget) robo = totalTarget

        if (target.rcoins >= robo) target.rcoins -= robo
        else {
            let falta = robo - target.rcoins
            target.rcoins = 0
            target.rbank -= falta
        }

        user.rcoins += robo
        user.lastrob = new Date * 1

        return conn.reply(m.chat, `🕶️ *ROBASTE CON ÉXITO*\n+${robo} ${MONEDA} de @${who.split('@')[0]}\n\n💰 *TUS ${MONEDA}:* ${user.rcoins}`, m, { mentions: [who] })
    }

    if (command === 'pay' || command === 'pagar') {
        let who = m.mentionedJid[0]
        let monto = parseInt(args[1]) || parseInt(args[0]) // Acepta.pay 100 @user o.pay @user 100
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}pay [monto] @usuario`, m)
        if (!monto || monto < 1) return conn.reply(m.chat, `❌ Ingresa un monto válido`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        let target = getUser(who)
        user.rcoins -= monto
        target.rcoins += monto
        return conn.reply(m.chat, `💸 *TRANSFERENCIA EXITOSA*\n\nEnviado: *${monto}* ${MONEDA} a @${who.split('@')[0]}\n\n💰 *TUS ${MONEDA}:* ${user.rcoins}`, m, { mentions: [who] })
    }

    if (command === 'slots' || command === 'slot') {
        let monto = parseInt(args[0])
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        user.rcoins -= monto
        let s1 = iconos[Math.floor(Math.random() * iconos.length)]
        let s2 = iconos[Math.floor(Math.random() * iconos.length)]
        let s3 = iconos[Math.floor(Math.random() * iconos.length)]

        let iguales = s1 === s2 && s2 === s3? 3 : s1 === s2 || s1 === s3 || s2 === s3? 2 : 0
        let multi = iguales === 3? 5 : iguales === 2? 2 : 0 // En la foto x5 y x2, no x50
        let gana = monto * multi
        if (gana > 0) user.rcoins += gana

        let resultado = iguales === 3? `✨ Ganaste x${multi}!` : iguales === 2? `✨ Ganaste x${multi}!` : `😢 Perdiste`
        let perdida = iguales === 0? `-${monto} ${MONEDA}` : `+${gana} ${MONEDA}`

        return conn.reply(m.chat, `🎰 *TRAGAMONEDAS*\n\n[${s1}][${s2}][${s3}]\n\n${resultado}\n${perdida}\n\n💰 *TUS ${MONEDA}:* ${user.rcoins}`, m)
    }
}

handler.help = ['robar @usuario', 'pay [monto] @usuario', 'slots [monto]']
handler.tags = ['economia']
handler.command = ['robar', 'pay', 'pagar', 'slots', 'slot']
export default handler