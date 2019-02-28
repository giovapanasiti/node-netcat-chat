const server = require('net').createServer()
let counter = 0
let sockets = {}

function timestamp() {
  const now = new Date()
  return `${now.getHours()}:${now.getMinutes()}`
}

server.on('connection', socket => {
  socket.id = counter++
  
  socket.address = socket.remoteAddress + ":" + socket.remotePort;//save  the address in socket object
  console.log(socket.remoteAddress + ":" + socket.remotePort);

  // Messaggio di benvenuto
  socket.write('Benvenuto collega!!\n')
  socket.write(`  , ; ,   .-'"""'-.   , ; ,\n`)
  socket.write(`  \\|/  .'         '.  \|//\n`)
  socket.write(`   \-;-/   ()   ()   \-;-/\n`)
  socket.write(`   // ;               ; \\\n`)
  socket.write(`   /__; :.         .; ;__\ \n`)
  socket.write(` '-----\'.'-.....-'.'/-----\n`)
  socket.write(`        '.'.-.-,_.'.'\n`)
  socket.write(`          '(  (..-'\n`)
  socket.write(`            '-'\n`)
  socket.write('Scrivi qui di seguito il tuo nome: ')

  

  // Cosi tutti leggono i messaggi
  socket.on('data', data => {

    // Chiedi il nome se non e' registrato
    if (!sockets[socket.id]) {
      socket.name = data.toString().trim()
      socket.write('Ciao  ' + socket.name + '!\n')
      
      // Se gia e' connesso qualcuno mostra chi e' connesso
      if (Object.keys(sockets).length > 0) {
        socket.write('Al momento sono online:\n')
        Object.entries(sockets).forEach(([key, cs]) => {
          if (socket.id == key) return
          socket.write(`- ${cs.name}\n`)
        })
      } else {
        socket.write('Al momento non risulta essere online nessuno\n')
      }

      // registra la persona nell'oggetto sockets
      sockets[socket.id] = socket

      // Manda un messaggio a tutti avvisando che si e' connesso qualcuno
      Object.entries(sockets).forEach(([key, cs]) => {
        if (socket.id == key) return
        cs.write('###################\n')
        cs.write('###################\n')
        cs.write(`Connesso ${socket.name}\n`)
        cs.write('IP: ' +  socket.address + '\n')
        cs.write('###################\n')
        cs.write('###################\n')
      })
      return
    }

    // Manad un messaggio a tutti ogni volta che si ricevono dei dati
    Object.entries(sockets).forEach(([key, cs]) => {
      if (socket.id == key) return // non mandare niente a chi ha inviato il messaggio
      cs.write('== ' + timestamp() + ' ' + socket.name + ' :    ')
      cs.write(data)
    })
  })

  socket.on('end', () => {
    // manda a tutti un messaggio se qualcuno si disconnette
    Object.entries(sockets).forEach(([key, cs]) => {
      if (socket.id == key) return
      cs.write('###################\n')
      cs.write('###################\n')
      cs.write(`Disconnesso ${socket.name}\n`)
      cs.write('###################\n')
      cs.write('###################\n')
    })
    delete sockets[socket.id]
    console.log('Client Disconnected')
  })

  socket.setEncoding('utf8')
})

server.listen(9900, () => console.log('server bound'))

// to allow people to connect use telnet or netcat: nc localhost 9900
