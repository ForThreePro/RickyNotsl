let cooldowns = { trivia: {}, work: {}, robar: {} }

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {}, deuda: 0 }

  // TRIVIA - COOLDOWN 30 SEG
  if (command === 'trivia') {
    if (cooldowns.trivia[m.sender] && Date.now() - cooldowns.trivia[m.sender] < 30000)
      return m.reply(`Espera ${Math.ceil((30000 - (Date.now() - cooldowns.trivia[m.sender])) / 1000)}s`)
    const preguntas = [
      { q: '¿Cuántos días tiene una semana?', a: '7' },
      { q: '¿De qué color es el cielo despejado?', a: 'azul' },
      { q: '¿Cuánto es 5 + 5?', a: '10' },
      { q: '¿Qué animal dice miau?', a: 'gato' },
      { q: '¿Cuántas patas tiene un perro?', a: '4' },
      { q: '¿Cuánto es 3 x 3?', a: '9' },
      { q: '¿Qué sale de día y da luz?', a: 'sol' },
      { q: '¿Cuál es la primera letra?', a: 'a' }
    ]
    let trivia = preguntas[Math.floor(Math.random() * preguntas.length)]
    cooldowns.trivia[m.sender] = Date.now()
    await conn.reply(m.chat, `🎮 *TRIVIA* 🎮\n\n${trivia.q}\n\nTienes 15 segundos`, m)
    global.db.data.trivia = global.db.data.trivia || {}
    global.db.data.trivia[m.sender] = { answer: trivia.a.toLowerCase(), chat: m.chat, timeout: setTimeout(() => delete global.db.data.trivia[m.sender], 15000) }
    return
  }

  // RULETA
  if (['ruleta', 'rlt'].includes(command)) {
    let args = text.split(' ')
    if (args.length < 2) return m.reply(`Uso: ${usedPrefix + command} <red/black> <monto>`)
    let color = args[0].toLowerCase()
    let monto = parseInt(args[1])
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> o ${usedPrefix}work para pagarla`)
    if (!['red', 'black', 'rojo', 'negro'].includes(color)) return m.reply('Usa: red/rojo o black/negro')
    if (isNaN(monto) || monto < 10) return m.reply('Apuesta mínima: 10 monedas')
    if (user.coin < monto) return m.reply(`No tienes suficiente. Saldo: ${user.coin} 🪙`)
    user.coin -= monto
    let resultado = Math.random() < 0.5? 'red' : 'black'
    let colorElegido = color === 'rojo'? 'red' : color === 'negro'? 'black' : color
    await m.reply(`🎰 *RULETA* 🎰\n\nApostaste: ${monto} 🪙 a ${colorElegido === 'red'? '🔴' : '⚫'}\n\nGirando...`)
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (resultado === colorElegido) {
      let ganancia = monto * 2
      user.coin += ganancia
      return m.reply(`🎰 *GANASTE* 🎰\n\nSalió: ${resultado === 'red'? '🔴' : '⚫'}\nGanaste: ${ganancia} 🪙\n\nSaldo: ${user.coin} 🪙`)
    } else {
      return m.reply(`🎰 *PERDISTE* 🎰\n\nSalió: ${resultado === 'red'? '🔴' : '⚫'}\nPerdiste: ${monto} 🪙\n\nSaldo: ${user.coin} 🪙`)
    }
  }

  // SLOTS
  if (['slots', 'slot'].includes(command)) {
    let monto = parseInt(text)
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> o ${usedPrefix}work para pagarla`)
    if (isNaN(monto) || monto < 10) return m.reply(`Apuesta mínima: 10\nUso: ${usedPrefix + command} <monto>`)
    if (user.coin < monto) return m.reply(`No tienes suficiente. Saldo: ${user.coin} 🪙`)
    user.coin -= monto
    const emojis = ['🍒', '🍋', '🍊', '🍉', '🍇', '💎', '7️⃣', '⭐']
    let a = emojis[Math.floor(Math.random() * emojis.length)]
    let b = emojis[Math.floor(Math.random() * emojis.length)]
    let c = emojis[Math.floor(Math.random() * emojis.length)]
    let multiplicador = 0
    if (a === b && b === c) {
      if (a === '7️⃣') multiplicador = 100
      else if (a === '💎') multiplicador = 75
      else if (a === '⭐') multiplicador = 50
      else if (a === '🍇') multiplicador = 25
      else if (a === '🍉') multiplicador = 15
      else if (a === '🍊') multiplicador = 10
      else if (a === '🍋') multiplicador = 5
      else multiplicador = 2
    } else if (a === b || b === c || a === c) multiplicador = 2
    if (multiplicador > 0) {
      let ganancia = monto * multiplicador
      user.coin += ganancia
      return m.reply(`🎰 *SLOTS* 🎰\n\n${a} | ${b} | ${c}\n\n🎉 *x${multiplicador}* 🎉\nGanaste: ${ganancia} 🪙\n\nSaldo: ${user.coin} 🪙`)
    } else {
      return m.reply(`🎰 *SLOTS* 🎰\n\n${a} | ${b} | ${c}\n\n💔 *PERDISTE* 💔\nPerdiste: ${monto} 🪙\n\nSaldo: ${user.coin} 🪙`)
    }
  }

  // WORK - SI TIENES DEUDA, TODO SE VA A PAGARLA
  if (['work', 'trabajar'].includes(command)) {
    user.deuda = Number(user.deuda) || 0
    let tiempoEspera = Math.floor(Math.random() * 240000) + 60000 // 1-5 min
    if (cooldowns.work[m.sender] && Date.now() - cooldowns.work[m.sender] < tiempoEspera)
      return m.reply(`Ya trabajaste. Espera ${Math.ceil((tiempoEspera - (Date.now() - cooldowns.work[m.sender])) / 60000)} min`)

    cooldowns.work[m.sender] = Date.now()
    const trabajos = [
      { texto: 'Hiciste trabajo comunitario y ganaste', min: 80, max: 200 },
      { texto: 'Limpiando calles ganaste', min: 50, max: 120 },
      { texto: 'Servicio social y ganaste', min: 30, max: 150 },
      { texto: 'Pintando paredes ganaste', min: 40, max: 100 },
      { texto: 'Recogiendo basura ganaste', min: 60, max: 180 }
    ]
    let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)]
    let ganancia = Math.floor(Math.random() * (trabajo.max - trabajo.min + 1)) + trabajo.min

    // SI TIENE DEUDA, TODO SE VA A LA DEUDA
    if (user.deuda > 0) {
      let pagoDeuda = Math.min(ganancia, user.deuda)
      user.deuda -= pagoDeuda
      let sobrante = ganancia - pagoDeuda

      if (sobrante > 0) {
        user.coin = (Number(user.coin) || 0) + sobrante
        return m.reply(`💼 *TRABAJO COMUNITARIO* 💼\n\n${trabajo.texto} *${ganancia} monedas* 🪙\n\n💸 Pagaste ${pagoDeuda} a tu deuda\n💰 Te quedaron ${sobrante} monedas\n\n🚔 *DEUDA RESTANTE*: ${user.deuda} monedas\n\nSaldo: ${user.coin} 🪙`)
      } else {
        return m.reply(`💼 *TRABAJO COMUNITARIO* 💼\n\n${trabajo.texto} *${ganancia} monedas* 🪙\n\n💸 *TODO SE FUE A PAGAR TU DEUDA*\n\n🚔 *DEUDA RESTANTE*: ${user.deuda} monedas\n\nSaldo: ${user.coin} 🪙`)
      }
    } else {
      user.coin = (Number(user.coin) || 0) + ganancia
      return m.reply(`💼 *TRABAJO* 💼\n\n${trabajo.texto} *${ganancia} monedas* 🪙\n\nSaldo: ${user.coin} 🪙`)
    }
  }

  // ROBAR - NO PUEDES CON DEUDA
  if (['robar', 'rob'].includes(command)) {
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> o ${usedPrefix}work para pagarla. No puedes robar con deudas`)

    let tiempoEspera = Math.floor(Math.random() * 240000) + 60000 // 1-5 min
    if (cooldowns.robar[m.sender] && Date.now() - cooldowns.robar[m.sender] < tiempoEspera)
      return m.reply(`Espera ${Math.ceil((tiempoEspera - (Date.now() - cooldowns.robar[m.sender])) / 60000)} min para robar de nuevo`)

    let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false
    if (!who) return m.reply(`Menciona a quien quieres robar`)
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (who === m.sender) return m.reply('No te puedes robar a ti mismo')

    if (!global.db.data.users[who]) global.db.data.users[who] = { coin: 0, bank: 0, deuda: 0 }
    let target = global.db.data.users[who]
    target.coin = Number(target.coin) || 0

    if (target.coin < 1) return m.reply(`@${who.split('@')[0]} no tiene nada en la billetera`, null, { mentions: [who] })

    cooldowns.robar[m.sender] = Date.now()
    let exito = Math.random() < 0.6

    if (exito) {
      let robado = target.coin <= 5? target.coin : Math.min(Math.floor(Math.random() * target.coin * 0.5) + 1, target.coin)
      target.coin -= robado
      user.coin = (Number(user.coin) || 0) + robado

      try {
        await conn.reply(who, `🚨 *TE ROBARON* 🚨\n\n@${m.sender.split('@')[0]} te robó *${robado} monedas* 🪙 de tu billetera\n\nTu saldo: ${target.coin} 🪙`, null, { mentions: [m.sender] })
      } catch {}

      return m.reply(`🦹 *ROBO EXITOSO* 🦹\n\nLe robaste *${robado} monedas* a @${who.split('@')[0]}\n\nTu saldo: ${user.coin} 🪙`, null, { mentions: [who, m.sender] })
    } else {
      let multa = Math.floor(Math.random() * 50) + 20
      user.coin = Number(user.coin) || 0

      if (user.coin < multa) {
        let deudaNueva = multa - user.coin
        user.deuda = (Number(user.deuda) || 0) + deudaNueva
        user.coin = 0

        try {
          await conn.reply(who, `🚔 *INTENTO DE ROBO* 🚔\n\n@${m.sender.split('@')[0]} intentó robarte pero falló y ahora tiene una *deuda con la policía* de ${deudaNueva} monedas`, null, { mentions: [m.sender] })
        } catch {}

        return m.reply(`🚔 *TE ATRAPARON Y NO TENÍAS SUFICIENTE* 🚔\n\nMulta: ${multa} monedas\nPagaste: ${user.coin} monedas\n\n💸 *DEUDA CON LA POLICÍA*: ${user.deuda} monedas\n\nUsa ${usedPrefix}pagardeuda <monto> o ${usedPrefix}work para pagar\n\nTu saldo: 0 🪙`)
      } else {
        user.coin -= multa

        try {
          await conn.reply(who, `🚔 *INTENTO DE ROBO* 🚔\n\n@${m.sender.split('@')[0]} intentó robarte pero falló y pagó *${multa} monedas* de multa`, null, { mentions: [m.sender] })
        } catch {}

        return m.reply(`🚔 *TE ATRAPARON* 🚔\n\nPagaste *${multa} monedas* de multa\n\nTu saldo: ${user.coin} 🪙`)
      }
    }
  }

  // PAGAR DEUDA
  if (['pagardeuda', 'deuda'].includes(command)) {
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda === 0) return m.reply('✅ No tienes deudas con la policía')

    let monto = parseInt(text)
    if (isNaN(monto) || monto < 1) return m.reply(`💸 *DEUDA ACTUAL*: ${user.deuda} monedas\n\nUso: ${usedPrefix}pagardeuda <monto>\n\nO usa ${usedPrefix}work para pagar trabajando`)
    if (user.coin < monto) return m.reply(`No tienes suficiente. Saldo: ${user.coin} 🪙\nDeuda: ${user.deuda} 🪙\n\nUsa ${usedPrefix}work para ganar monedas`)

    let aPagar = Math.min(monto, user.deuda)
    user.coin -= aPagar
    user.deuda -= aPagar

    if (user.deuda === 0) {
      return m.reply(`✅ *DEUDA PAGADA* ✅\n\nPagaste ${aPagar} monedas\nYa no tienes deudas con la policía\n\nTu saldo: ${user.coin} 🪙`)
    } else {
      return m.reply(`💸 Pagaste ${aPagar} monedas\n\n*DEUDA RESTANTE*: ${user.deuda} monedas\n\nTu saldo: ${user.coin} 🪙`)
    }
  }
}

handler.before = async (m, { conn }) => {
  if (!global.db.data.trivia ||!global.db.data.trivia[m.sender]) return
  let triviaData = global.db.data.trivia[m.sender]
  if (m.chat!== triviaData.chat) return
  if (m.text.toLowerCase().trim() === triviaData.answer) {
    clearTimeout(triviaData.timeout)
    let ganancia = Math.floor(Math.random() * 50) + 20
    if (!global.db.data.users[m.sender].deuda || global.db.data.users[m.sender].deuda === 0) {
      global.db.data.users[m.sender].coin = (Number(global.db.data.users[m.sender].coin) || 0) + ganancia
      await conn.reply(m.chat, `✅ ¡Correcto! Ganaste *${ganancia} monedas* 🪙\n\nSaldo: ${global.db.data.users[m.sender].coin} 🪙`, m)
    } else {
      await conn.reply(m.chat, `✅ ¡Correcto! Pero tienes una deuda de ${global.db.data.users[m.sender].deuda} 🪙\n\nUsa.work para pagarla trabajando`, m)
    }
    delete global.db.data.trivia[m.sender]
  }
}

handler.help = ['trivia', 'ruleta', 'slots', 'work', 'robar', 'pagardeuda']
handler.tags = ['economy']
handler.command = ['trivia', 'ruleta', 'rlt', 'slots', 'slot', 'work', 'trabajar', 'robar', 'rob', 'pagardeuda', 'deuda']
handler.group = true
export default handler