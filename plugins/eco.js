let MONEDA = 'R-COINS'

let trabajos = [
    // NIVEL BAJO 1-3
    { name: 'Repartidor', min: 20, max: 50, exp: 5 },
    { name: 'Lava Platos', min: 15, max: 40, exp: 4 },
    { name: 'Vendedor Ambulante', min: 25, max: 60, exp: 5 },
    { name: 'Pintor', min: 30, max: 70, exp: 6 },
    { name: 'Jardinero', min: 25, max: 55, exp: 5 },
    { name: 'Mesero', min: 30, max: 65, exp: 6 },
    { name: 'Taxista', min: 35, max: 80, exp: 7 },

    // NIVEL MEDIO 4-7
    { name: 'Programador', min: 40, max: 100, exp: 8 },
    { name: 'Chef', min: 30, max: 80, exp: 6 },
    { name: 'Diseñador', min: 50, max: 110, exp: 9 },
    { name: 'Fotógrafo', min: 45, max: 100, exp: 8 },
    { name: 'Mecánico', min: 55, max: 120, exp: 10 },
    { name: 'Electricista', min: 60, max: 130, exp: 11 },
    { name: 'Doctor', min: 70, max: 150, exp: 12 },
    { name: 'Abogado', min: 65, max: 140, exp: 11 },
    { name: 'Profesor', min: 50, max: 105, exp: 9 },

    // NIVEL ALTO 8-12
    { name: 'Minero', min: 50, max: 120, exp: 10 },
    { name: 'Streamer', min: 60, max: 150, exp: 12 },
    { name: 'Youtuber', min: 70, max: 170, exp: 13 },
    { name: 'Influencer', min: 80, max: 190, exp: 14 },
    { name: 'Piloto', min: 90, max: 210, exp: 15 },
    { name: 'Arquitecto', min: 85, max: 200, exp: 15 },
    { name: 'Ingeniero', min: 95, max: 220, exp: 16 },

    // NIVEL PRO 13-18
    { name: 'Hacker', min: 150, max: 400, exp: 25 },
    { name: 'Científico', min: 120, max: 300, exp: 20 },
    { name: 'Astronauta', min: 140, max: 350, exp: 22 },
    { name: 'CEO', min: 100, max: 300, exp: 20 },
    { name: 'Inversionista', min: 130, max: 320, exp: 21 },
    { name: 'Cirujano', min: 160, max: 380, exp: 24 },
    { name: 'Director', min: 110, max: 280, exp: 18 },

    // NIVEL ÉPICO 19+
    { name: 'Dueño de Banco', min: 200, max: 500, exp: 30 },
    { name: 'Magnate', min: 250, max: 600, exp: 35 },
    { name: 'Presidente', min: 300, max: 700, exp: 40 },
    { name: 'Rey', min: 350, max: 800, exp: 45 },
    { name: 'Dueño de Meta', min: 400, max: 900, exp: 50 },
    { name: 'Creador de Cripto', min: 450, max: 1000, exp: 55 },
    { name: 'Dios', min: 500, max: 1200, exp: 60 }
]

function getUser(id) {
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let user = global.db.data.users[id]
    // MIGRACION DATOS VIEJOS
    if (user.lasana!== undefined && user.rcoins === undefined) { user.rcoins = user.lasana; delete user.lasana }
    if (user.bank!== undefined && user.rbank === undefined) { user.rbank = user.bank; delete user.bank }
    // VALORES POR DEFECTO
    if (user.rcoins === undefined) user.rcoins = 0
    if (user.rbank === undefined) user.rbank = 0
    if (user.level === undefined) user.level = 1
    if (user.exp === undefined) user.exp = 0
    if (user.hackeados === undefined) user.hackeados = [] // Para guardar a quien ya hackeo
    return user
}

function subirNivel(user) {
    let expNecesaria = user.level * 500
    if (user.exp >= expNecesaria) {
        user.level += 1
        user.exp = user.exp - expNecesaria
        return true
    }
    return false
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = getUser(m.sender)
    if (subirNivel(user)) conn.reply(m.chat, `🎉 *¡SUBISTE A NIVEL ${user.level}!* 🎉\n+${user.level * 100} ${MONEDA} de bono`, m)

    // 1. SALDO
    if (command === 'saldo' || command === 'balance') {
        let expNecesaria = user.level * 500
        let texto = `💰 *TU PERFIL*\n\n` +
                    `📊 *Nivel*: ${user.level}\n` +
                    `✨ *Exp*: ${user.exp}/${expNecesaria}\n` +
                    `💻 *Hackeos*: ${user.hackeados.length}\n\n` +
                    `👛 *BILLETERA*: ${user.rcoins} ${MONEDA}\n` +
                    `🏦 *BANCO*: ${user.rbank} ${MONEDA}\n` +
                    `💵 *TOTAL*: ${user.rcoins + user.rbank} ${MONEDA}`
        return conn.reply(m.chat, texto, m)
    }

    // 2. WORK
    if (command === 'work' || command === 'trabajar') {
        let tiempo = (Math.floor(Math.random() * 10) + 1) * 60 * 1000 // 1 a 10 minutos
        if (user.lastwork && new Date - user.lastwork < tiempo) {
            let falta = msToTime(user.lastwork + tiempo - new Date())
            return conn.reply(m.chat, `⏰ Ya trabajaste. Vuelve en ${falta}`, m)
        }

        let trabajosDisponibles = trabajos.slice(0, user.level + 2)
        if (trabajosDisponibles.length > trabajos.length) trabajosDisponibles = trabajos

        let trabajo = trabajosDisponibles[Math.floor(Math.random() * trabajosDisponibles.length)]
        let bonoNivel = user.level * 5
        let paga = Math.floor(Math.random() * (trabajo.max - trabajo.min)) + trabajo.min + bonoNivel

        user.rcoins += paga
        user.exp += trabajo.exp
        user.lastwork = new Date * 1

        return conn.reply(m.chat, `💼 *FUISTE A TRABAJAR*\n\n*Trabajo:* ${trabajo.name}\n*Ganaste:* ${paga} ${MONEDA}\n*+${trabajo.exp} Exp*\n\n⏰ Vuelve en 1-10 min\n👛 Billetera: ${user.rcoins} ${MONEDA}`, m)
    }

    // 3. HACKEAR - ROBAR 15% DEL BANCO 1 VEZ POR USUARIO
    if (command === 'hackear') {
        let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}hackear @usuario`, m)
        if (who === m.sender) return conn.reply(m.chat, `❌ No te puedes hackear a ti mismo`, m)

        let target = getUser(who)
        let tiempo = 10 * 60 * 1000 // 10 min de cooldown global
        if (user.lasthack && new Date - user.lasthack < tiempo) {
            let falta = msToTime(user.lasthack + tiempo - new Date())
            return conn.reply(m.chat, `⏰ Espera ${falta} para hackear a alguien más`, m)
        }
        if (user.hackeados.includes(who)) return conn.reply(m.chat, `❌ Ya hackeaste a @${who.split('@')[0]} antes. Solo se puede 1 vez por usuario`, m, { mentions: [who] })
        if (target.rbank < 100) return conn.reply(m.chat, `❌ @${who.split('@')[0]} no tiene suficiente en el banco. Mínimo 100 ${MONEDA}`, m, { mentions: [who] })

        let robo = Math.floor(target.rbank * 0.15) // 15% del banco
        if (robo < 10) robo = 10

        target.rbank -= robo
        user.rcoins += robo // Va a billetera
        user.hackeados.push(who) // Lo marcas como hackeado
        user.lasthack = new Date * 1
        user.exp += 30 // Da buena exp

        // AVISO A LA VICTIMA
        try {
            await conn.sendMessage(who, {
                text: `💻 *¡TE HACKEARON EL BANCO!* 💻\n\n@${m.sender.split('@')[0]} [Nv.${user.level}] hackeó tu banco y robó *${robo}* ${MONEDA}\n\n🏦 Te quedan: ${target.rbank} ${MONEDA}\n\n⚠️ Guarda menos en el banco o sube de nivel para protegerte`
            }, { mentions: [m.sender] })
        } catch(e){}

        return conn.reply(m.chat, `💻 *HACKEO EXITOSO*\n+${robo} ${MONEDA} de @${who.split('@')[0]}\n+30 Exp\n🏦 Banco de @${who.split('@')[0]}: ${target.rbank} ${MONEDA}\n👛 Tu Billetera: ${user.rcoins} ${MONEDA}`, m, { mentions: [who] })
    }

    // 4. DEPOSITAR
    if (command === 'd' || command === 'dall') {
        let amount = command === 'dall'? user.rcoins : parseInt(args[0])
        if (!amount || amount < 1) return conn.reply(m.chat, `*Uso:* ${usedPrefix}d [monto] | ${usedPrefix}dall`, m)
        if (user.rcoins < amount) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)
        user.rcoins -= amount; user.rbank += amount
        return conn.reply(m.chat, `✅ Depositaste *${amount}* ${MONEDA}`, m)
    }

    // 5. RETIRAR
    if (command === 'r' || command === 'rall') {
        let amount = command === 'rall'? user.rbank : parseInt(args[0])
        if (!amount || amount < 1) return conn.reply(m.chat, `*Uso:* ${usedPrefix}r [monto] | ${usedPrefix}rall`, m)
        if (user.rbank < amount) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA} en el banco`, m)
        user.rbank -= amount; user.rcoins += amount
        return conn.reply(m.chat, `✅ Retiraste *${amount}* ${MONEDA}`, m)
    }

    // 6. ROBAR
    if (command === 'robar') {
        let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted?.sender
        if (!who) return conn.reply(m.chat, `*Uso:* ${usedPrefix}robar @usuario`, m)
        if (who === m.sender) return conn.reply(m.chat, `❌ No te puedes robar a ti mismo`, m)

        let target = getUser(who)
        let tiempo = 3 * 60 * 1000 // 3 min
        if (user.lastrob && new Date - user.lastrob < tiempo) {
            let falta = msToTime(user.lastrob + tiempo - new Date())
            return conn.reply(m.chat, `⏰ Espera ${falta} para volver a robar`, m)
        }
        if (target.rcoins < 10) return conn.reply(m.chat, `❌ @${who.split('@')[0]} no tiene ${MONEDA} en la billetera\n*Tiene:* ${target.rcoins} ${MONEDA}`, m, { mentions: [who] })

        let porcentajeRobo = 0.10 + (user.level * 0.01)
        if (porcentajeRobo > 0.30) porcentajeRobo = 0.30

        let robo = Math.floor(target.rcoins * porcentajeRobo) + 10
        if (robo > target.rcoins) robo = target.rcoins

        target.rcoins -= robo
        user.rcoins += robo
        user.lastrob = new Date * 1

        try {
            await conn.sendMessage(who, {
                text: `🚨 *¡TE ESTÁN ROBANDO!* 🚨\n\n@${m.sender.split('@')[0]} [Nv.${user.level}] te robó *${robo}* ${MONEDA}\n\n👛 Te quedan: ${target.rcoins} ${MONEDA}`
            }, { mentions: [m.sender] })
        } catch(e){}

        return conn.reply(m.chat, `🕶️ *ROBASTE*\n+${robo} ${MONEDA} de @${who.split('@')[0]}`, m, { mentions: [who] })
    }

    // 7. PAY
    if (command === 'pay' || command === 'pagar') {
        let who = m.mentionedJid[0]
        let monto = parseInt(args[0])
        if (!who ||!monto) return conn.reply(m.chat, `*Uso:* ${usedPrefix}pay [monto] @usuario`, m)
        if (monto < 1) return conn.reply(m.chat, `❌ Ingresa un monto válido`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        let target = getUser(who)
        user.rcoins -= monto
        target.rcoins += monto
        return conn.reply(m.chat, `💸 Enviado: *${monto}* ${MONEDA} a @${who.split('@')[0]}`, m, { mentions: [who] })
    }
}

handler.help = [
    'saldo ( Ver Perfil )',
    'work ( Trabajar Cada 1-10min )',
    'hackear @user ( Robar 15% del banco 1 vez )',
    'd [monto] ( Depositar )',
    'dall ( Depositar Todo )',
    'r [monto] ( Retirar )',
    'rall ( Retirar Todo )',
    'robar @user ( Robar Cada 3min )',
    'pay [monto] @user ( Transferir )'
]
handler.tags = ['economy']
handler.command = ['saldo', 'balance', 'work', 'trabajar', 'hackear', 'd', 'r', 'dall', 'rall', 'robar', 'pay', 'pagar']
export default handler

function msToTime(d){let m=Math.floor((d%(1000*60*60))/(1000*60)),s=Math.floor((d%(1000*60))/1000);return m+"m "+s+"s"}