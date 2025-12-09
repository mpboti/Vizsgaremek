import express from 'express'
import bodyParser from 'body-parser'
import router from '../router/routes'

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(router)

export default app