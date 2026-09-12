let MONEDA = 'R-COINS'
let iconos = ['🍒', '🍋', '⭐', '💎', '7', '🍀']

let preguntas = [
    // FACIL - +50 a +100 coins, +3 exp
    { q: '¿Cuánto es 2 + 2?', a: '4', dif: 'facil' },
    { q: '¿De qué color es el cielo?', a: 'azul', dif: 'facil' },
    { q: '¿Cuántos días tiene una semana?', a: '7', dif: 'facil' },
    { q: '¿Capital de Peru?', a: 'lima', dif: 'facil' },
    { q: '¿Cuántas patas tiene un perro?', a: '4', dif: 'facil' },
    { q: '¿Cuánto es 9 - 3?', a: '6', dif: 'facil' },
    { q: '¿Qué animal dice miau?', a: 'gato', dif: 'facil' },
    { q: '¿De qué color es la nieve?', a: 'blanca', dif: 'facil' },
    { q: '¿Cuántas horas tiene un día?', a: '24', dif: 'facil' },
    { q: '¿Cuánto es 1 docena?', a: '12', dif: 'facil' },

    // MEDIA - +100 a +200 coins, +6 exp
    { q: '¿Cuánto es 7 x 7?', a: '49', dif: 'media' },
    { q: '¿Capital de Brasil?', a: 'brasilia', dif: 'media' },
    { q: '¿Cuántos planetas hay en el sistema solar?', a: '8', dif: 'media' },
    { q: '¿Quién creó Facebook?', a: 'mark zuckerberg', dif: 'media' },
    { q: '¿De qué color es la bandera de Francia?', a: 'azul blanco rojo', dif: 'media' },
    { q: '¿Cuál es el río más largo del mundo?', a: 'amazonas', dif: 'media' },
    { q: '¿En qué año llegó el hombre a la luna?', a: '1969', dif: 'media' },
    { q: '¿Cuántos huesos tiene el cuerpo humano?', a: '206', dif: 'media' },
    { q: '¿Cuál es el metal más caro?', a: 'oro', dif: 'media' },
    { q: '¿Qué país tiene forma de bota?', a: 'italia', dif: 'media' },

    // DIFICIL - +200 a +400 coins, +12 exp
    { q: '¿Cuál es la raíz cuadrada de 144?', a: '12', dif: 'dificil' },
    { q: '¿Quién pintó la Mona Lisa?', a: 'leonardo da vinci', dif: 'dificil' },
    { q: '¿Cuál es el elemento químico con símbolo Au?', a: 'oro', dif: 'dificil' },
    { q: '¿En qué año empezó la segunda guerra mundial?', a: '1939', dif: 'dificil' },
    { q: '¿Cuál es la capital de Australia?', a: 'canberra', dif: 'dificil' },
    { q: '¿Quién escribió Don Quijote de la Mancha?', a: 'miguel de cervantes', dif: 'dificil' },
    { q: '¿Cuál es el océano más profundo?', a: 'pacifico', dif: 'dificil' },
    { q: '¿Cuántos cromosomas tiene el ser humano?', a: '46', dif: 'dificil' },
    { q: '¿Cuál es la moneda de Japón?', a: 'yen', dif: 'dificil' },
    { q: '¿Qué significa CPU?', a: 'unidad central de procesamiento', dif: 'dificil' }
]

function getUser(id) {
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let user = global.db.data.users[id]
    if (user.rcoins === undefined) user.rcoins = 0
    if (user.level === undefined) user.level = 1
    if (user.exp === undefined) user.exp = 0
    return user
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let user = getUser(m.sender)

    // 1. TRIVIA CON DIFICULTAD POR NIVEL
    if (command === 'trivia') {
        let tiempo = 30 * 1000 // 30 segundos
        if (user.lasttrivia && new Date - user.lasttrivia < tiempo) {
            let falta = msToTime(user.lasttrivia + tiempo - new Date())
            return conn.reply(m.chat, `⏰ Espera ${falta} para otra trivia`, m)
        }

        // Filtra preguntas según nivel
        let preguntasDisponibles = preguntas
        if (user.level < 5) preguntasDisponibles = preguntas.filter(p => p.dif === 'facil')
        else if (user.level < 10) preguntasDisponibles = preguntas.filter(p => p.dif === 'facil' || p.dif === 'media')

        let preg = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)]
        user.trivia = preg.a.toLowerCase()
        user.trivadif = preg.dif // Guardamos dificultad
        user.triviatime = new Date * 1

        let emoji = preg.dif === 'facil'? '🟢' : preg.dif === 'media'? '🟡' : '🔴'
        return conn.reply(m.chat, `${emoji} *TRIVIA ${preg.dif.toUpperCase()} Nv.${user.level}*\n\n${preg.q}\n\nResponde en 30s`, m)
    }

    // 2. RULETA
    if (command === 'ruleta' || command === 'rlt') {
        let color = args[0]?.toLowerCase()
        let monto = parseInt(args[1])
        if (!['red', 'black', 'rojo', 'negro'].includes(color)) return conn.reply(m.chat, `*Uso:* ${usedPrefix}ruleta [red/black] [monto]`, m)

        let apuestaMax = 100 + (user.level * 50)
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (monto > apuestaMax) return conn.reply(m.chat, `❌ Con tu Nv.${user.level} max puedes apostar ${apuestaMax} ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        user.rcoins -= monto
        let resultado = Math.random() < 0.5? 'red' : 'black'
        let gano = ((color === 'red' || color === 'rojo') && resultado === 'red') || ((color === 'black' || color === 'negro') && resultado === 'black')
        let multi = 2 + (user.level * 0.1)

        if (gano) {
            let gana = Math.floor(monto * multi)
            user.rcoins += gana
            return conn.reply(m.chat, `🎉 Salió ${resultado === 'red'? '🔴' : '⚫'}\n*GANASTE x${multi.toFixed(1)}:* +${gana} ${MONEDA}`, m)
        } else {
            return conn.reply(m.chat, `😢 Salió ${resultado === 'red'? '🔴' : '⚫'}\n*PERDISTE:* -${monto} ${MONEDA}`, m)
        }
    }

    // 3. SLOTS
    if (command === 'slots' || command === 'slot') {
        let monto = parseInt(args[0])
        let apuestaMax = 200 + (user.level * 100)
        if (!monto || monto < 10) return conn.reply(m.chat, `❌ Apuesta mínima: 10 ${MONEDA}`, m)
        if (monto > apuestaMax) return conn.reply(m.chat, `❌ Con tu Nv.${user.level} max puedes apostar ${apuestaMax} ${MONEDA}`, m)
        if (user.rcoins < monto) return conn.reply(m.chat, `❌ No tienes suficientes ${MONEDA}`, m)

        user.rcoins -= monto
        let s1 = iconos[Math.floor(Math.random() * iconos.length)]
        let s2 = iconos[Math.floor(Math.random() * iconos.length)]
        let s3 = iconos[Math.floor(Math.random() * iconos.length)]

        let iguales = s1 === s2 && s2 === s3? 3 : s1 === s2 || s1 === s3 || s2 === s3? 2 : 1
        let baseMulti = iguales === 3? [10,15,25,50,75,100][Math.floor(Math.random()*6)] : iguales === 2? [2,5][Math.floor(Math.random()*2)] : 0
        let multi = baseMulti + (user.level * 0.5)
        let gana = Math.floor(monto * multi)
        if (gana > 0) user.rcoins += gana

        let resultado = iguales === 3? `🎉 JACKPOT x${multi.toFixed(1)}!` : iguales === 2? `✨ Ganaste x${multi.toFixed(1)}!` : `😢 Perdiste`
        return conn.reply(m.chat, `🎰 *TRAGAMONEDAS Nv.${user.level}*\n\n[${s1}] [${s2}] [${s3}]\n\n${resultado}\n${gana > 0? `+${gana} ${MONEDA}` : `-${monto} ${MONEDA}`}`, m)
    }
}

// RESPONDER TRIVIA
handler.before = async (m) => {
    let user = getUser(m.sender)
    if (user.trivia && m.text.toLowerCase() === user.trivia) {
        if (new Date - user.triviatime > 30000) return delete user.trivia
        let dif = user.trivadif

        // PREMIO SEGÚN DIFICULTAD
        let premio = dif === 'facil'? 50 + (user.level * 5) : dif === 'media'? 100 + (user.level * 10) : 200 + (user.level * 20)
        let expGanada = dif === 'facil'? 3 : dif === 'media'? 6 : 12

        user.rcoins += premio
        user.exp += expGanada
        user.lasttrivia = new Date * 1
        delete user.trivia; delete user.trivadif; delete user.triviatime

        let emoji = dif === 'facil'? '🟢' : dif === 'media'? '🟡' : '🔴'
        m.reply(`${emoji} *CORRECTO!* [${dif}]\n+${premio} ${MONEDA}\n+${expGanada} Exp\n💰 Total: ${user.rcoins} ${MONEDA}`)
    }
}

handler.help = ['trivia','ruleta [color] [monto]','slots [monto]']
handler.tags = ['economy']
handler.command = ['trivia', 'ruleta', 'rlt', 'slots', 'slot']
export default handler

function msToTime(d){let m=Math.floor((d%(1000*60*60))/(1000*60)),s=Math.floor((d%(1000*60))/1000);return m+"m "+s+"s"}