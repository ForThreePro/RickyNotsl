let iconos = ['🍒', '🍋', '⭐', '💎', '7']

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!user.lasana) user.lasana = 0
    if (!user.bank) user.bank = 0

    // 1. COMANDO ROBAR
    if (command === 'robar') {
        let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}robar @usuario`, m)
        if (who === m.sender) return conn.reply(m.chat, `❌ No te puedes robar a ti mismo`, m)

        let target = global.db.data.users[who]
        if (!target) return conn.reply(m.chat, `❌ Ese usuario no existe en la DB`, m)
        if (!target.lasana) target.lasana = 0
        if (!target.bank) target.bank = 0

        let tiempo = 1 * 60 * 60 * 1000 // 1 hora cooldown
        if (user.lastrob && new Date - user.lastrob < tiempo) {
            let falta = msToTime(user.lastrob + tiempo - new Date())
            return conn.reply(m.chat, `⏰ Espera ${falta} para volver a robar`, m)
        }

        let totalTarget = target.lasana + target.bank
        if (totalTarget < 10) return conn.reply(m.chat, `❌ @${who.split('@')[0]} no tiene suficientes monedas`, m, { mentions: [who] })

        let robo = Math.floor(Math.random() * totalTarget * 0.3) + 10 // Roba 10 a 30%
        if (robo > totalTarget) robo = totalTarget

        // Primero roba de billetera, luego del banco
        if (target.lasana >= robo) {
            target.lasana -= robo
        } else {
            let falta = robo - target.lasana
            target.lasana = 0
            target.bank -= falta
        }

        user.lasana += robo
        user.lastrob = new Date * 1

        return conn.reply(m.chat, `🕶️ *ROBASTE CON ÉXITO*\n+${robo} monedas de @${who.split('@')[0]}\n\n💰 Tu billetera: ${user.lasana}\n👛 Billetera de @${who.split('@')[0]}: ${target.lasana}\n🏦 Banco de @${who.split('@')[0]}: ${target.bank}`, m, { mentions: [who] })
    }

    // 2. COMANDO PAY / PAGAR
    if (command === 'pay' || command === 'pagar') {
        let who = m.mentionedJid[0]
        let monto = parseInt(args[0])
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}pay [monto] @usuario\nEjemplo: ${usedPrefix}pay 100 @pepito`, m)
        if (!monto || monto < 1) return conn.reply(m.chat, `❌ Ingresa un monto válido`, m)
        if (user.lasana < monto) return conn.reply(m.chat, `❌ No tienes suficientes monedas en billetera`, m)

        let target = global.db.data.users[who]
        if (!target) return conn.reply(m.chat, `❌ Ese usuario no existe en la DB`, m)
        if (!target.lasana) target.lasana = 0

        user.lasana -= monto
        target.lasana += monto
        return conn.reply(m.chat, `💸 *TRANSFERENCIA EXITOSA*\n\nEnviado: *${monto}* monedas a @${who.split('@')[0]}\n\n💰 Tu billetera: ${user.lasana}`, m, { mentions: [who] })
    }

    // 3. COMANDO SLOTS / TRAGAMONEDAS
    if (command === 'slots' || command === 'slot') {
        let monto = parseInt(args[0])
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 monedas\n*Uso:* ${usedPrefix}slots [monto]`, m)
        if (user.lasana < monto) return conn.reply(m.chat, `❌ No tienes suficientes monedas`, m)

        user.lasana -= monto
        let s1 = iconos[Math.floor(Math.random() * iconos.length)]
        let s2 = iconos[Math.floor(Math.random() * iconos.length)]
        let s3 = iconos[Math.floor(Math.random() * iconos.length)]

        let iguales = s1 === s2 && s2 === s3? 3 : s1 === s2 || s1 === s3 || s2 === s3? 2 : 1
        let multi = iguales === 3? 50 : iguales === 2? 5 : 0
        let gana = monto * multi

        if (gana > 0) user.lasana += gana

        let resultado = iguales === 3? `🎉 JACKPOT x${multi}!` : iguales === 2? `✨ Ganaste x${multi}!` : `😢 Perdiste`

        return conn.reply(m.chat, `🎰 *TRAGAMONEDAS*\n\n[${s1}] [${s2}] [${s3}]\n\n${resultado}\n${gana > 0? `+${gana} monedas` : `-${monto} monedas`}\n\n💰 Total: ${user.lasana}`, m)
    }
}

handler.help = [
    'robar @usuario ( Robar 10% a 30% de sus coins )',
    'pay [monto] @usuario ( Transferir Coins )',
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