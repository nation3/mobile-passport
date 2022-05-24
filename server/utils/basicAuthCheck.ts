import initializeBasicAuth from "nextjs-basic-auth"

const basicAuthUsername = String(process.env.BASIC_AUTH_USERNAME)
const basicAuthPassword = String(process.env.BASIC_AUTH_PASSWORD)
const basicAuthUsers = [
    { user: basicAuthUsername, password: basicAuthPassword }
]
// console.log('basicAuthUsers:', basicAuthUsers)

export default initializeBasicAuth({
    users: basicAuthUsers
})
