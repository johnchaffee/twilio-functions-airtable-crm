/*

  Twilio function to send Appointment Notifications
  
*/

require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const from = process.env.PHONE_NUMBER
const client = require("twilio")(accountSid, authToken)

exports.handler = function (context, event, callback) {
  console.log("event is ==> ", event)
  console.log("context is ==> ", context)

  async function sendMessage(to, body) {
    console.log("ENTER SEND MESSAGE FUNCTION")
    await client.messages
      .create({
        body: event.body,
        to: event.to,
        from: from,
      })
      .then((message) => {
        console.log("MESSAGE SENT")
        console.log("END SEND MESSAGE FUNCTION")
        // callback(null, data)
        callback(null, "");
      })
      .catch(function (err) {
        console.log("SEND MESSAGE FUNCTION ERROR",err)
        callback("error retrieving record", null)
      })
  }

  sendMessage(event.to, event.body)
    .then(() => {
      console.log("CALL SEND MESSAGE FUNCTION")
      console.log("FROM:", from)
      console.log("TO:", event.to)
      console.log("BODY:", event.body)
    })
    .catch(function (err) {
      console.log("SEND MESSAGE CATCH:", err)
    })
}
