let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {} }

  const items = {
    'pico': { nombre: 'Pico ⛏️', precio: 500, desc: 'Para minar más monedas' },
    'escudo': { nombre: 'Escudo 🛡️', precio: 1000, desc: 'Protege contra robos' },
    'vip': { nombre: 'VIP 👑', precio: 5000, desc: 'Ganancias x2' },
    'cofre': { nombre: 'Cofre 🎁', precio: 300, desc: 'Premio 100-1000 monedas' },
    'pocion': { nombre: 'Poción 🍀', precio: 800, desc: '+20% suerte' }
  }

  if (!text || ['shop', 'tienda'].includes(command)) {
    let texto = `🛒 *TIENDA* 🛒\n\nTu saldo: ${user.coin} 🪙\n\n`
    for (let [id, item] of Object.entries(items)) {
      texto += `*${item.nombre}*\nPrecio: ${item.precio} 🪙\n${item.desc}\nComprar: ${usedPrefix}buy ${id}\n\n`
    }
    return m.reply(texto)
  }

  if (['buy', 'comprar'].includes(command)) {
    let item = items[text.toLowerCase()]
    if (!item) return m.reply(`Item no encontrado. Usa ${usedPrefix}shop`)
    if (user.coin < item.precio) return m.reply(`No tienes suficiente. Te faltan ${item.precio - user.coin} 🪙`)
    user.coin -= item.precio
    user.items = user.items || {}
    user.items[text.toLowerCase()] = (user.items[text.toLowerCase()] || 0) + 1
    if (text.toLowerCase() === 'cofre') {
      let premio = Math.floor(Math.random() * 901) + 100
      user.coin += premio
      return m.reply(`🎁 Abriste un *Cofre* y ganaste *${premio} monedas* 🪙\n\nSaldo: ${user.coin} 🪙`)
    }
    return m.reply(`✅ Compraste *${item.nombre}* por ${item.precio} 🪙\n\nSaldo: ${user.coin} 🪙`)
  }
}

handler.help = ['shop', 'buy']
handler.tags = ['economy']
handler.command = ['shop', 'tienda', 'buy', 'comprar']
handler.group = true
handler.register = false
export default handler