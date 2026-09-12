let iconos = ['🍒', '🍋', '⭐', '💎', '7']
let MONEDA = 'R-COINS'

function msToTime(duration) {
    let m = Math.floor((duration%(1000*60*60))/(1000*60))
    let s = Math.floor((duration%(1000*60))/1000)
    return `${m}m ${s}s`
}

function getUser(id) {
    if (!global.db.data.users[id]) global.db.data.users[id] = { rcoins: 0, rbank: 0, lastrob: 0 }
    let user = global.db.data.users[id]
    user.rcoins??= 0
    user.rbank??= 0
    user.lastrob??= 0
    return user
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = getUser(m.sender)

    // SLOTS
    if (command === 'slots') {
        let monto = parseInt(args[0])
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}\n*Tienes:* ${user.rcoins}`, m)

        user.rcoins -= monto
        let r1 = iconos[Math.floor(Math.random() * iconos.length)]
        let r2 = iconos[Math.floor(Math.random() * iconos.length)]
        let r3 = iconos[Math.floor(Math.random() * iconos.length)]

        let multi = 0
        if (r1 === r2 && r2 === r3) multi = 5
        else if (r1 === r2 || r1 === r3 || r2 === r3) multi = 2

        let gana = monto * multi
        if (gana > 0) user.rcoins += gana

        let texto = multi === 5? `✨ Ganaste x5!\n+${gana} ${MONEDA}` : multi === 2? `✨ Ganaste x2!\n+${gana} ${MONEDA}` : `😢 Perdiste\n-${monto} ${MONEDA}`

        return conn.reply(m.chat, `🎰 *TRAGAMONEDAS*\n\n[${r1}][${r2}][${r3}]\n\n${texto}\n\n💰 *TUS ${MONEDA}:* ${user.rcoins}`, m)
    }

    // ROBAR
    if (command === 'robar') {
        let who = m.mentionedJid[0] || m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}robar @usuario`, m)
        if (who === m.sender) return conn.reply(m.chat, `❌ No te puedes robar a ti mismo`, m)

        let target = getUser(who)
        let tiempo = 3600000

        if (user.lastrob && Date.now() - user.lastrob < tiempo) {
            let falta = msToTime(user.lastrob + tiempo - Date.now())
            return conn.reply(m.chat, `⏳ Espera ${falta} para volver a robar`, m)
        }

        let total = target.rcoins + target.rbank
        if (total < 10) return conn.reply(m.chat, `❌ @${who.split('@')[0]} no tiene suficientes ${MONEDA}\n*Tiene:* ${total} ${MONEDA}`, m, { mentions: [who] })

        let robo = Math.floor(Math.random() * (total * 0.3)) + 10
        if (robo > total) robo = total

        // Robar primero de rcoins
        if (target.rcoins >= robo) target.rcoins -= robo
        else {
            let falta = robo - target.rcoins
            target.rcoins = 0
            target.rbank -= falta
        }

        user.rcoins += robo
        user.lastrob = Date.now()

        return conn.reply(m.chat, `🕶️ *ROBASTE CON ÉXITO*\n+${robo} ${MONEDA} de @${who.split('@')[0]}\n\n💰 *TUS ${MONEDA}:* ${user.rcoins}`, m, { mentions: [who] })
    }
}

handler.help = ['slots [monto]', 'robar @usuario']
handler.tags = ['economia']
handler.command = ['slots', 'robar']
export default handler