let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {}, deuda: 0 }

  // SALDO - SILENCIOSO, NO AVISA EN GRUPO
  if (['saldo', 'bal', 'balance'].includes(command)) {
    let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : m.sender

    // Normalizar JID
    who = who.replace(/@lid$/, '@s.whatsapp.net')

    // Si el usuario no existe en la DB, crearlo
    if (!global.db.data.users[who]) {
      global.db.data.users[who] = { coin: 0, bank: 0, items: {}, deuda: 0 }
    }

    let userTarget = global.db.data.users[who]
    userTarget.coin = Number(userTarget.coin) || 0
    userTarget.bank = Number(userTarget.bank) || 0
    userTarget.deuda = Number(userTarget.deuda) || 0

    let name = 'Usuario'
    try {
      name = await conn.getName(who)
      if (!name || name === 'undefined' || name === '') name = who.split('@')[0]
    } catch {
      name = who.split('@')[0]
    }

    let texto = `💰 *SALDO DE @${who.split('@')[0]}* 💰\n\n🪙 Billetera: ${userTarget.coin} monedas\n🏦 Banco: ${userTarget.bank} monedas\n💵 Total: ${userTarget.coin + userTarget.bank} monedas\n🚔 Deuda Policía: ${userTarget.deuda} monedas`

    // MOSTRAR AVISO SI TIENE DEUDA
    if (userTarget.deuda > 0) {
      texto += `\n\n⚠️ *TIENE DEUDA* ⚠️\nDebe trabajar para pagar`
    }

    // Si menciona a otro, manda al privado SIN AVISAR EN GRUPO
    if (who!== m.sender) {
      try {
        await conn.reply(m.sender, texto, null, { mentions: [who] })
        return // NO RESPONDE NADA EN EL GRUPO
      } catch {
        return // SI FALLA TAMPOCO AVISA
      }
    } else {
      return m.reply(texto, null, { mentions: [who] })
    }
  }

  // DEPOSITAR TODO
  if (command === 'dall') {
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> para pagarla`)
    if (user.coin === 0) return m.reply('No tienes monedas en la billetera')
    let cantidad = user.coin
    user.coin = 0
    user.bank = (Number(user.bank) || 0) + cantidad
    return m.reply(`🏦 Depositaste *${cantidad} monedas* al banco\n\nBilletera: ${user.coin} 🪙\nBanco: ${user.bank} 🏦`)
  }

  // RETIRAR TODO
  if (command === 'rall') {
    user.bank = Number(user.bank) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> para pagarla`)
    if (user.bank === 0) return m.reply('No tienes monedas en el banco')
    let cantidad = user.bank
    user.bank = 0
    user.coin = (Number(user.coin) || 0) + cantidad
    return m.reply(`🏦 Retiraste *${cantidad} monedas* del banco\n\nBilletera: ${user.coin} 🪙\nBanco: ${user.bank} 🏦`)
  }

  // DEPOSITAR MONTO
  if (command === 'd') {
    let monto = parseInt(text)
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> para pagarla`)
    if (isNaN(monto) || monto < 1) return m.reply(`Uso: ${usedPrefix}d <monto>`)
    if (user.coin < monto) return m.reply(`No tienes suficiente. Billetera: ${user.coin} 🪙`)
    user.coin -= monto
    user.bank = (Number(user.bank) || 0) + monto
    return m.reply(`🏦 Depositaste *${monto} monedas*\n\nBilletera: ${user.coin} 🪙\nBanco: ${user.bank} 🏦`)
  }

  // RETIRAR MONTO
  if (command === 'r') {
    let monto = parseInt(text)
    user.bank = Number(user.bank) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> para pagarla`)
    if (isNaN(monto) || monto < 1) return m.reply(`Uso: ${usedPrefix}r <monto>`)
    if (user.bank < monto) return m.reply(`No tienes suficiente. Banco: ${user.bank} 🏦`)
    user.bank -= monto
    user.coin = (Number(user.coin) || 0) + monto
    return m.reply(`🏦 Retiraste *${monto} monedas*\n\nBilletera: ${user.coin} 🪙\nBanco: ${user.bank} 🏦`)
  }

  // PAY
  if (['pay', 'pagar'].includes(command)) {
    let args = text.split(' ')
    if (args.length < 2) return m.reply(`Uso: ${usedPrefix + command} <monto> @user`)
    let monto = parseInt(args[0])
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🚔 Tienes una *deuda con la policía* de ${user.deuda} 🪙\n\nUsa ${usedPrefix}pagardeuda <monto> para pagarla`)
    if (isNaN(monto) || monto < 1) return m.reply('Monto inválido')
    if (user.coin < monto) return m.reply(`No tienes suficiente. Saldo: ${user.coin} 🪙`)
    let who = m.mentionedJid[0]
    if (!who) return m.reply('Menciona a quien le quieres pagar')
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (who === m.sender) return m.reply('No te puedes pagar a ti mismo')
    if (!global.db.data.users[who]) global.db.data.users[who] = { coin: 0, bank: 0, deuda: 0 }
    global.db.data.users[who].coin = Number(global.db.data.users[who].coin) || 0
    user.coin -= monto
    global.db.data.users[who].coin += monto
    return m.reply(`💸 *TRANSFERENCIA* 💸\n\nLe pagaste *${monto} monedas* a @${who.split('@')[0]}\n\nTu saldo: ${user.coin} 🪙`, null, { mentions: [who, m.sender] })
  }

  // LEADERBOARD
  if (['leaderboard', 'lb', 'top'].includes(command)) {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({
      jid: key,
      coin: Number(value.coin) || 0,
      bank: Number(value.bank) || 0,
      deuda: Number(value.deuda) || 0
    })).filter(v => v.coin || v.bank)

    if (users.length === 0) return m.reply('No hay usuarios con monedas aún')
    users.sort((a, b) => (b.coin + b.bank) - (a.coin + a.bank))
    let texto = `🏆 *TOP 10 MILLONARIOS* 🏆\n\n`
    let len = Math.min(10, users.length)
    for (let i = 0; i < len; i++) {
      let user = users[i]
      let total = user.coin + user.bank
      let medalla = i === 0? '🥇' : i === 1? '🥈' : i === 2? '🥉' : `${i + 1}.`
      texto += `${medalla} @${user.jid.split('@')[0]}\n💰 Total: ${total}`
      if (user.deuda > 0) texto += ` 🚔 Deuda: ${user.deuda}`
      texto += `\n\n`
    }
    let posicion = users.findIndex(v => v.jid === m.sender) + 1
    if (posicion > 0) texto += `\n📍 Tu posición: #${posicion}`
    return conn.reply(m.chat, texto, m, { mentions: users.slice(0, len).map(v => v.jid) })
  }
}

handler.help = ['saldo', 'dall', 'rall', 'd', 'r', 'pay', 'lb']
handler.tags = ['economy']
handler.command = ['saldo', 'bal', 'balance', 'dall', 'rall', 'd', 'r', 'pay', 'pagar', 'leaderboard', 'lb', 'top']
handler.group = true
export default handler