let iconos = ['🍒', '🍋', '⭐', '💎', '7', '🔔']
let MONEDA = 'R-COINS'

// Preguntas fáciles para trivia
let preguntas = [
    {p: '¿Cuánto es 2+2?', r: '4'},
    {p: '¿De qué color es el cielo?', r: 'azul'},
    {p: '¿Cuántos días tiene una semana?', r: '7'},
    {p: '¿Cuál es la capital de Perú?', r: 'lima'},
    {p: '¿Cuántas patas tiene un perro?', r: '4'},
    {p: '¿Qué animal dice miau?', r: 'gato'},
]

function getUser(id) {
    if (!global.db.data.users[id]) global.db.data.users[id] = { rcoins: 100, rbank: 0, lastrob: 0, lasttrivia: 0 } // Empiezan con 100
    let user = global.db.data.users[id]
    user.rcoins??= 100
    user.rbank??= 0
    user.lastrob??= 0
    user.lasttrivia??= 0
    return user
}

function msToTime(duration) {
    let m = Math.floor((duration%(1000*60*60))/(1000*60))
    let s = Math.floor((duration%(1000*60))/1000)
    return `${m}m ${s}s`
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = getUser(m.sender)

    // 1. SALDO
    if (command === 'saldo') {
        return conn.reply(m.chat, `💰 *TU SALDO*\n\n👛 *Billetera:* ${user.rcoins} ${MONEDA}\n🏦 *Banco:* ${user.rbank} ${MONEDA}\n\n*Total:* ${user.rcoins + user.rbank} ${MONEDA}`, m)
    }

    // 2. DEPOSITAR / RETIRAR
    if (command === 'd' || command === 'depositar') {
        let monto = args[0] === 'all'? user.rcoins : parseInt(args[0])
        if (!monto || monto < 1) return conn.reply(m.chat, `*Uso:* ${usedPrefix}d [monto] o ${usedPrefix}d all`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA} en billetera`, m)
        user.rcoins -= monto
        user.rbank += monto
        return conn.reply(m.chat, `🏦 Depositaste *${monto} ${MONEDA}* al banco\n\n👛 Billetera: ${user.rcoins}\n🏦 Banco: ${user.rbank}`, m)
    }
    if (command === 'dall') {
        let monto = user.rcoins
        if (monto < 1) return conn.reply(m.chat, `❌ No tienes nada en billetera`, m)
        user.rcoins = 0
        user.rbank += monto
        return conn.reply(m.chat, `🏦 Depositaste *${monto} ${MONEDA}* al banco`, m)
    }
    if (command === 'r' || command === 'retirar') {
        let monto = args[0] === 'all'? user.rbank : parseInt(args[0])
        if (!monto || monto < 1) return conn.reply(m.chat, `*Uso:* ${usedPrefix}r [monto] o ${usedPrefix}r all`, m)
        if (user.rbank < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA} en banco`, m)
        user.rbank -= monto
        user.rcoins += monto
        return conn.reply(m.chat, `👛 Retiraste *${monto} ${MONEDA}* del banco\n\n👛 Billetera: ${user.rcoins}\n🏦 Banco: ${user.rbank}`, m)
    }
    if (command === 'rall') {
        let monto = user.rbank
        if (monto < 1) return conn.reply(m.chat, `❌ No tienes nada en banco`, m)
        user.rbank = 0
        user.rcoins += monto
        return conn.reply(m.chat, `👛 Retiraste *${monto} ${MONEDA}* del banco`, m)
    }

    // 3. TRIVIA
    if (command === 'trivia') {
        let tiempo = 5 * 60 * 1000
        if (user.lasttrivia && Date.now() - user.lasttrivia < tiempo) return conn.reply(m.chat, `⏳ Ya hiciste trivia. Espera ${msToTime(user.lasttrivia + tiempo - Date.now())}`, m)

        let preg = preguntas[Math.floor(Math.random() * preguntas.length)]
        user.lasttrivia = Date.now()
        user.trivia_preg = preg.r.toLowerCase()

        return conn.reply(m.chat, `❓ *TRIVIA* ❓\n\n${preg.p}\n\nTienes 20 segundos. Responde aquí mismo.\nPremio: 50 ${MONEDA}`, m)
    }
    // Respuesta de trivia
    if (user.trivia_preg && m.text.toLowerCase() === user.trivia_preg) {
        user.rcoins += 50
        user.trivia_preg = null
        return conn.reply(m.chat, `✅ *CORRECTO!*\n+50 ${MONEDA}\n\n💰 Total: ${user.rcoins}`, m)
    }

    // 4. RULETA
    if (command === 'ruleta' || command === 'rlt') {
        let color = args[0]?.toLowerCase()
        let monto = parseInt(args[1])
        if (!['red', 'black'].includes(color)) return conn.reply(m.chat, `*Uso:* ${usedPrefix}ruleta red/black [monto]`, m)
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        user.rcoins -= monto
        let resultado = Math.random() < 0.5? 'red' : 'black'
        let gano = resultado === color

        if (gano) {
            let gana = monto * 2
            user.rcoins += gana
            return conn.reply(m.chat, `🎡 *RULETA*\n\nSalió: *${resultado.toUpperCase()}*\n✨ Ganaste x2!\n+${gana} ${MONEDA}\n\n💰 Total: ${user.rcoins}`, m)
        } else {
            return conn.reply(m.chat, `🎡 *RULETA*\n\nSalió: *${resultado.toUpperCase()}*\n😢 Perdiste\n-${monto} ${MONEDA}\n\n💰 Total: ${user.rcoins}`, m)
        }
    }

    // 5. SLOTS CON MULTIPLICADORES
    if (command === 'slots') {
        let monto = parseInt(args[0])
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        user.rcoins -= monto
        let s = [0,0,0].map(() => iconos[Math.floor(Math.random() * iconos.length)])

        // Contar iguales
        let conteo = {}
        s.forEach(i => conteo[i] = (conteo[i] || 0) + 1)
        let max = Math.max(...Object.values(conteo))

        let multi = {1:0, 2:2, 3:5}[max] // Base: 2 iguales x2, 3 iguales x5
        // Si quieres x10 x15 etc, descomenta:
        // if(max === 3 && s[0] === '7') multi = 100
        // if(max === 3 && s[0] === '💎') multi = 75

        let gana = monto * multi
        if (gana > 0) user.rcoins += gana

        let texto = multi > 0? `✨ Ganaste x${multi}!\n+${gana} ${MONEDA}` : `😢 Perdiste\n-${monto} ${MONEDA}`
        return conn.reply(m.chat, `🎰 *TRAGAMONEDAS*\n\n[${s[0]}][${s[1]}][${s[2]}]\n\n${texto}\n\n💰 *TUS ${MONEDA}:* ${user.rcoins}`, m)
    }

    // 6. ROBAR - Solo de billetera, no del banco
    if (command === 'robar') {
        let who = m.mentionedJid[0] || m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}robar @usuario`, m)
        if (who === m.sender) return conn.reply(m.chat, `❌ No te puedes robar a ti mismo`, m)

        let target = getUser(who)
        let tiempo = 3600000
        if (user.lastrob && Date.now() - user.lastrob < tiempo) return conn.reply(m.chat, `⏳ Espera ${msToTime(user.lastrob + tiempo - Date.now())}`, m)
        if (target.rcoins < 50) return conn.reply(m.chat, `❌ @${who.split('@')[0]} no tiene suficientes ${MONEDA} en billetera\n*Tiene:* ${target.rcoins}`, m, { mentions: [who] })

        let robo = Math.floor(Math.random() * 100) + 50
        if (robo > target.rcoins) robo = target.rcoins

        target.rcoins -= robo
        user.rcoins += robo
        user.lastrob = Date.now()

        return conn.reply(m.chat, `🕶️ *ROBASTE CON ÉXITO*\n+${robo} ${MONEDA} de @${who.split('@')[0]}\n\n💰 *TUS ${MONEDA}:* ${user.rcoins}`, m, { mentions: [who] })
    }

    // 7. PAY
    if (command === 'pay' || command === 'pagar') {
        let who = m.mentionedJid[0]
        let monto = parseInt(args[0])
        if (!who ||!monto) return conn.reply(m.chat, `*Uso:* ${usedPrefix}pay [monto] @usuario`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        let target = getUser(who)
        user.rcoins -= monto
        target.rcoins += monto
        return conn.reply(m.chat, `💸 Transferiste *${monto} ${MONEDA}* a @${who.split('@')[0]}`, m, { mentions: [who] })
    }
}

handler.help = ['saldo', 'd/r [monto/all]', 'trivia', 'ruleta red/black [monto]', 'slots [monto]', 'robar @user', 'pay [monto] @user']
handler.tags = ['economia']
handler.command = ['saldo', 'd', 'depositar', 'dall', 'r', 'retirar', 'rall', 'trivia', 'ruleta', 'rlt', 'slots', 'robar', 'pay', 'pagar']
export default handler