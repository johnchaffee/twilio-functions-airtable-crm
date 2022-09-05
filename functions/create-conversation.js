require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const author = process.env.AUTHOR
const client = require("twilio")(accountSid, authToken)
let conversationSid = ""
let activeConversation = false

exports.handler = function (context, event, callback) {
  console.log("\x1b[32m context ==>", context, "\x1b[0m")
  console.log("\x1b[32m event ==>", event, "\x1b[0m")

  const mobileNumber = event.mobileNumber
  console.log("\x1b[32m mobileNumber ==>", mobileNumber, "\x1b[0m")

  const mobileName = event.mobileName
  console.log("\x1b[32m mobileName ==>", mobileName, "\x1b[0m")

  const body = event.body
  console.log("\x1b[32m body ==>", body, "\x1b[0m")

  // Check to see if an active conversation already exists
  async function getActiveConversations() {
    await client.conversations.v1.participantConversations
      .list({ address: mobileNumber, limit: 20 })
      .then((participantConversations) => {
        participantConversations.forEach((p) => {
          if (p.conversationState === "active") {
            activeConversation = true
            conversationSid = p.conversationSid
            console.log(
              "\x1b[32m conversationSid ==>",
              conversationSid,
              "\x1b[0m"
            )
            return false
          }
          return true
        })
      })
      .catch((error) => console.log(error))
  }

  async function createConversation() {
    await client.conversations.v1.conversations
      .create({ friendlyName: mobileName })
      .then((conversation) => {
        conversationSid = conversation.sid
        console.log("\x1b[32m conversationSid ==>", conversationSid, "\x1b[0m")
      })
      .catch((error) => console.log(error))
  }

  async function createParticipant() {
    await client.conversations.v1
      .conversations(conversationSid)
      .participants.create({
        "messagingBinding.address": mobileNumber,
        "messagingBinding.proxyAddress": twilioPhoneNumber,
      })
      .then((participant) =>
        console.log("\x1b[32m participant.sid ==>", participant.sid, "\x1b[0m")
      )
      .catch((error) => console.log(error))
  }

  async function createWorker() {
    await client.conversations.v1
      .conversations(conversationSid)
      .participants.create({
        identity: author,
      })
      .then((participant) =>
        console.log("\x1b[32m participant.sid ==>", participant.sid, "\x1b[0m")
      )
      .catch((error) => console.log(error))
  }

  async function createMessage() {
    await client.conversations.v1
      .conversations(conversationSid)
      .messages.create({
        author,
        body,
      })
      .then((message) =>
        console.log("\x1b[32m message.sid ==>", message.sid, "\x1b[0m")
      )
      .catch((error) => console.log(error))
  }

  // Run all the functions
  getActiveConversations().then(() => {
    if (activeConversation === false) {
      createConversation().then(() => {
        createParticipant().then(() => {
          createWorker().then(() => {
            createMessage().then(() => {
              callback(null)
            })
          })
        })
      })
    } else {
      createMessage().then(() => callback(null))
    }
  })
}
