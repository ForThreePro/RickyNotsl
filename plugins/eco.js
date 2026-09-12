let MONEDA = 'R-COINS' // Nombre de la moneda

let preguntas = [
    { q: '¿Cuánto es 2 + 2?', a: '4' },
    { q: '¿Cuánto es 5 + 3?', a: '8' },
    { q: '¿Cuánto es 10 - 4?', a: '6' },
    { q: '¿Cuánto es 3 x 3?', a: '9' },
    { q: '¿Cuánto es 20 / 4?', a: '5' },
    { q: '¿Cuánto es 7 + 6?', a: '13' },
    { q: '¿Cuánto es 9 - 5?', a: '4' },
    { q: '¿Cuánto es 4 x 2?', a: '8' },
    { q: '¿Cuánto es 15 / 3?', a: '5' },
    { q: '¿Cuánto es 1 + 1?', a: '2' },

    { q: '¿De qué color es el cielo?', a: 'azul' },
    { q: '¿De qué color es la nieve?', a: 'blanco' },
    { q: '¿De qué color es un plátano?', a: 'amarillo' },
    { q: '¿De qué color es la sangre?', a: 'rojo' },
    { q: '¿De qué color son las hojas?', a: 'verde' },
    { q: '¿De qué color es el carbón?', a: 'negro' },
    { q: '¿De qué color es una naranja?', a: 'naranja' },
    { q: '¿De qué color es el mar?', a: 'azul' },
    { q: '¿De qué color son las nubes?', a: 'blanco' },
    { q: '¿De qué color es el sol?', a: 'amarillo' },

    { q: '¿Cuántos días tiene una semana?', a: '7' },
    { q: '¿Cuántos meses tiene un año?', a: '12' },
    { q: '¿Cuántas horas tiene un día?', a: '24' },
    { q: '¿Cuántos minutos tiene una hora?', a: '60' },
    { q: '¿Cuántos segundos tiene un minuto?', a: '60' },

    { q: '¿Qué animal dice miau?', a: 'gato' },
    { q: '¿Qué animal dice guau?', a: 'perro' },
    { q: '¿Qué animal da leche?', a: 'vaca' },
    { q: '¿Qué animal vuela?', a: 'pajaro' },
    { q: '¿Qué animal vive en el agua?', a: 'pez' },
    { q: '¿Qué animal es el rey de la selva?', a: 'leon' },
    { q: '¿Qué animal tiene rayas blancas y negras?', a: 'cebra' },
    { q: '¿Qué animal tiene trompa larga?', a: 'elefante' },
    { q: '¿Qué animal salta mucho?', a: 'rana' },
    { q: '¿Qué animal pone huevos?', a: 'gallina' },

    { q: '¿Capital de Perú?', a: 'lima' },
    { q: '¿Capital de México?', a: 'cdmx' },
    { q: '¿Capital de Colombia?', a: 'bogota' },
    { q: '¿Capital de Argentina?', a: 'buenos aires' },
    { q: '¿Capital de España?', a: 'madrid' },
    { q: '¿Capital de Brasil?', a: 'brasilia' },
    { q: '¿Capital de Chile?', a: 'santiago' },
    { q: '¿Capital de Ecuador?', a: 'quito' },
    { q: '¿Capital de Venezuela?', a: 'caracas' },
    { q: '¿Capital de Bolivia?', a: 'lapaz' },

    { q: '¿Cuántos ojos tenemos?', a: '2' },
    { q: '¿Cuántos dedos tiene una mano?', a: '5' },
    { q: '¿Qué usamos para ver?', a: 'ojos' },
    { q: '¿Qué usamos para escuchar?', a: 'oidos' },
    { q: '¿Qué usamos para oler?', a: 'nariz' }
]

// Función para crear usuario si no existe
function getUser(id) {
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let user = global.db.data.users[id]
    if (user.rcoins === undefined) user.rcoins = 0
    if (user.rbank === undefined) user.rbank = 0
    return user
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = getUser(m.sender)

    if (command === 'saldo' || command === 'balance') {
        let texto = `💰 *TU SALDO*\n\n` +
                    `👛 *R-COINS*: ${user.rcoins} ${MONEDA}\n` +
                    `🏦 *BANCO*: ${user.rbank} ${MONEDA}\n` +
                    `💵 *TOTAL*: ${user.rcoins + user.rbank} ${MONEDA}`
        return conn.reply(m.chat, texto, m)
    }

    if (command === 'd' || command === 'dall' || command === 'r' || command === 'rall') {
        let amount = args[0] === 'all' || args[0] === 'todo'?
            (command === 'd' || command === 'dall'? user.rcoins : user.rbank)
            : parseInt(args[0])
        if (!amount || amount < 1) return conn.reply(m.chat, `*Uso:* \n${usedPrefix}d [monto] | ${usedPrefix}dall\n${usedPrefix}r [monto] | ${usedPrefix}rall`, m)

        if (command === 'd' || command === 'dall') {
            if (user.rcoins < amount) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)
            user.rcoins -= amount; user.rbank += amount
            return conn.reply(m.chat, `✅ Depositaste *${amount}* ${MONEDA} al banco\n👛 R-COINS: ${user.rcoins}\n🏦 BANCO: ${user.rbank}`, m)
        }
        if (command === 'r' || command === 'rall') {
            if (user.rbank < amount) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA} en el banco`, m)
            user.rbank -= amount; user.rcoins += amount
            return conn.reply(m.chat, `✅ Retiraste *${amount}* ${MONEDA} del banco\n👛 R-COINS: ${user.rcoins}\n🏦 BANCO: ${user.rbank}`, m)
        }
    }

    if (command === 'trivia') {
        let tiempo = 10 * 60 * 1000
        if (user.lasttrivia && new Date - user.lasttrivia < tiempo) return conn.reply(m.chat, `⏰ Espera ${msToTime(user.lasttrivia + tiempo - new Date())} para otra trivia`, m)
        let preg = preguntas[Math.floor(Math.random() * preguntas.length)]
        user.trivia = preg.a.toLowerCase()
        user.triviatime = new Date * 1
        return conn.reply(m.chat, `❓ *TRIVIA*\n\n${preg.q}\n\n*Premio:* 50 ${MONEDA}\nResponde en 30 segundos`, m)
    }

    if (command === 'ruleta' || command === 'rlt') {
        let color = args[0]?.toLowerCase()
        let monto = parseInt(args[1])
        if (!['red', 'black', 'rojo', 'negro'].includes(color)) return conn.reply(m.chat, `*Uso:* ${usedPrefix}ruleta [red/black] [monto]\nEjemplo: ${usedPrefix}ruleta red 100`, m)
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)
        user.rcoins -= monto
        let resultado = Math.random() < 0.5? 'red' : 'black'
        let colorTxt = resultado === 'red'? '🔴 ROJO' : '⚫ NEGRO'
        if (((color === 'red' || color === 'rojo') && resultado === 'red') || ((color === 'black' || color === 'negro') && resultado === 'black')) {
            user.rcoins += monto * 2
            return conn.reply(m.chat, `🎉 Salió ${colorTxt}\n*GANASTE x2:* +${monto * 2} ${MONEDA}\n💰 Total: ${user.rcoins} ${MONEDA}`, m)
        } else {
            return conn.reply(m.chat, `😢 Salió ${colorTxt}\n*PERDISTE:* -${monto} ${MONEDA}\n💰 Total: ${user.rcoins} ${MONEDA}`, m)
        }
    }
}

handler.before = async (m) => {
    let user = getUser(m.sender)
    if (user.trivia && m.text.toLowerCase() === user.trivia) {
        if (new Date - user.triviatime > 30000) return delete user.trivia // 30 seg
        user.rcoins += 50; user.lasttrivia = new Date * 1; delete user.trivia; delete user.triviatime
        m.reply(`✅ *CORRECTO!* +50 ${MONEDA}\n💰 Total: ${user.rcoins} ${MONEDA}`)
    }
}

handler.help = [
    `saldo ( Ver Tus ${MONEDA} )`,
    'd [monto] ( Depositar Al Banco )',
    'dall ( Depositar Todo Al Banco )',
    'r [monto] ( Retirar Del Banco )',
    'rall ( Retirar Todo Del Banco )',
    `trivia ( Responder Preguntas Y Ganar 50 ${MONEDA} )`,
    `ruleta [color] [monto] ( Apostar Rojo o Negro x2 )`
]
handler.tags = ['economy']
handler.command = ['saldo', 'balance', 'd', 'r', 'dall', 'rall', 'trivia', 'ruleta', 'rlt']
export default handler

function msToTime(d){var m=Math.floor((d%(1000*60*60))/(1000*60)),s=Math.floor((d%(1000*60))/1000);return m+"m "+s+"s"}