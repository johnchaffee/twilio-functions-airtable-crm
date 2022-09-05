/* 

  This script deletes all conversations. Convenient for quick clean up.
  Run the following command in console to execute it:
  $ node ./delete-conversations.sh

*/

require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const client = require("twilio")(accountSid, authToken)

client.conversations.v1.conversations
  .list({ limit: 20 })
  .then((conversations) => {
    conversations.forEach((c) => {
      console.log(c.sid)
      c.remove()
    })
  })
