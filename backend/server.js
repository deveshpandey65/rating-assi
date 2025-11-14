const express = require("express")
const cors = require("cors")
require("dotenv").config()
const pool = require("./connections/db")
const app = express()
pool.getConnection().then(conn => conn.release()).catch(err => {
    console.error("Database connection failed:", err)
    process.exit(1)
})
app.use(cors())
app.use(express.json())

app.use("/api", require("./src/routes/index"))
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
