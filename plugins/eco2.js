let iconos = ['🍒', '🍋', '⭐', '💎', '7']
let MONEDA = 'R-COINS' // <-- AQUI CAMBIAS EL NOMBRE

// Función para asegurar que el usuario existe en DB
function getUser(id) {
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let user = global.db.data.users[id]
    if (user.rcoins === undefined) user.rcoins = 0
    if (user.rbank === undefined) user.rbank = 0
    return user
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = getUser(m.sender)

    // 1. COMANDO ROBAR
    if (command === 'robar') {
        let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}robar @usuario`, m)
        if (who === m.sender) return conn.reply(m.chat, `❌ No te puedes robar a ti mismo`, m)

        let target = getUser(who) // Se crea si no existe

        let tiempo = 1 * 60 * 60 * 1000
        if (user.lastrob && new Date - user.lastrob < tiempo) {
            let falta = msToTime(user.lastrob + tiempo - new Date())
            return conn.reply(m.chat, `⏰ Espera ${falta} para volver a robar`, m)
        }

        let totalTarget = target.rcoins + target.rbank
        if (totalTarget < 10) return conn.reply(m.chat, `❌ @${who.split('@')[0]} no tiene suficientes ${MONEDA}\n*Tiene:* ${totalTarget} ${MONEDA}`, m, { mentions: [who] })

        let robo = Math.floor(Math.random() * totalTarget * 0.3) + 10
        if (robo > totalTarget) robo = totalTarget

        // Primero roba de R-COINS, luego del banco
        if (target.rcoins >= robo) {
            target.rcoins -= robo
        } else {
            let falta = robo - target.rcoins
            target.rcoins = 0
            target.rbank -= falta
        }

        user.rcoins += robo
        user.lastrob = new Date * 1

        return conn.reply(m.chat, `🕶️ *ROBASTE CON ÉXITO*\n+${robo} ${MONEDA} de @${who.split('@')[0]}\n\n💰 *TUS R-COINS:* ${user.rcoins}\n👛 *R-COINS DE @${who.split('@')[0]}:* ${target.rcoins}\n🏦 *BANCO DE @${who.split('@')[0]}:* ${target.rbank} ${MONEDA}`, m, { mentions: [who] })
    }

    // 2. COMANDO PAY / PAGAR
    if (command === 'pay' || command === 'pagar') {
        let who = m.mentionedJid[0]
        let monto = parseInt(args[0])
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}pay [monto] @usuario\nEjemplo: ${usedPrefix}pay 100 @pepito`, m)
        if (!monto || monto < 1) return conn.reply(m.chat, `❌ Ingresa un monto válido`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        let target = getUser(who)

        user.rcoins -= monto
        target.rcoins += monto
        return conn.reply(m.chat, `💸 *TRANSFERENCIA EXITOSA*\n\nEnviado: *${monto}* ${MONEDA} a @${who.split('@')[0]}\n\n💰 *TUS R-COINS:* ${user.rcoins}`, m, { mentions: [who] })
    }

    // 3. COMANDO SLOTS
    if (command === 'slots' || command === 'slot') {
        let monto = parseInt(args[0])
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        user.rcoins -= monto
        let s1 = iconos[Math.floor(Math.random() * iconos.length)]
        let s2 = iconos[Math.floor(Math.random() * iconos.length)]
        let s3 = iconos[Math.floor(Math.random() * iconos.length)]

        let iguales = s1 === s2 && s2 === s3? 3 : s1 === s2 || s1 === s3 || s2 === s3? 2 : 1
        let multi = iguales === 3? 50 : iguales === 2? 5 : 0
        let gana = monto * multi
        if (gana > 0) user.rcoins += gana

        let resultado = iguales === 3? `🎉 JACKPOT x${multi}!` : iguales === 2? `✨ Ganaste x${multi}!` : `😢 Perdiste`
        return conn.reply(m.chat, `🎰 *TRAGAMONEDAS*\n\n[${s1}] [${s2}] [${s3}]\n\n${resultado}\n${gana > 0? `+${gana} ${MONEDA}` : `-${monto} ${MONEDA}`}\n\n💰 *TUS R-COINS:* ${user.rcoins}`, m)
    }
}

handler.help = [
    'robar @usuario ( Robar 10% a 30% de sus R-COINS )',
    'pay [monto] @usuario ( Transferir R-COINS )',
    'slots [monto] ( Jugar Tragamonedas x5 x50 )'
]
handler.tags = ['economy']
handler.command = ['robar', 'pay', 'pagar', 'slots', 'slot']
export default handler

function msToTime(d){
    let m = Math.floor((d%(1000*60*60))/(1000*60))
    let s = Math.floor((d%(1000*60))/1000)
    return m+"m "+s+"s"
}