const bcrypt = require("bcrypt")

const pw = "supersecretpassword"

// Hash the password and get the hashed password
// It uses a unique salt, which is an additional string added each time
//$2b$ is the identifier of the version number of bcrypt
//$06s is where the salt plays into the encryption
// The salt is the string, and the output is after the .
// The encryption value makes brute-forcing magnitudes slower
bcrypt.hash(pw, 6, (err, hashedPw) => {
    console.log(`Password is ${pw}`)
    console.log(`Hased Password is ${hashedPw}`)
})