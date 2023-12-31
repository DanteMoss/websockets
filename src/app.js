import express from 'express'
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'

const app = express()
const PORT = 8080

const httpServer = app.listen(PORT, () =>  console.log(`Server Express Puerto ${PORT}`))
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
app.use(express.static('./src/public'))

app.use((req, res, next) => {
    req.io = io
    next()
})

app.use(express.json())

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

app.use('/', viewsRouter)

io.on("connection", socket => {
    console.log('A new client has connected to the Server')
    // comentando para que luego al llegar a la parte de websocket, pueda usarlo.
    socket.on('productList', data => {
        io.emit('updatedProducts', data)
    })
})