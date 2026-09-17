import express from "express"
import path from "path"
import http from "http"
import {exec} from "node:child_process"
import { fileURLToPath } from "node:url"

import { loadWebsocket } from "./websocket.js"
import socketRouter from "./websocket.js"


const app = express()
const PORT = 3000

const server = http.createServer(app)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)


app.use(express.static(path.join(dirname,"myapp/dist")))

app.use(socketRouter)



app.get("/{*path}",(req,res)=> {
    res.sendFile(path.join(dirname,"myapp/dist","index.html"))
})


exec("cd myapp && npm run build",(err)=> {
    if (err) {
        throw err
    }

    console.log("react loaded successfully")
})


loadWebsocket(server)







server.listen(PORT,()=> console.log("local host connected"),exec(`start http://localhost:${PORT}`))