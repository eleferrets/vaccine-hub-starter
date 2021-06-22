// Import client and the database uri
// The postgres package is the best
// You can also use the Pool package to get several calls
const {Client} = require("pg")
const { getDatabaseUri} = require("./config")
require("colors")
// Pass the database
const db = new Client({ connectionString: getDatabaseUri() })

db.connect((err) => {
    if (err) {
        console.error("connection error", red, err.stack)

    }
    else {
        console.log("Successfully connected to postgres db!".blue)
    }
})

module.exports = db