const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

// enable cross-origin resource sharing
app.use(cors())
// parse incoming request with JSON
app.use(express.json())
// log request info
app.use(morgan("tiny"))

// Environment variable or the port we are accustomed to
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`)
})