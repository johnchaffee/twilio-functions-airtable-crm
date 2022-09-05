require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const workspaceSid = process.env.WORKSPACE_SID
const workflowSid = process.env.WORKFLOW_SID
const client = require("twilio")(accountSid, authToken)

exports.handler = function (context, event, callback) {
  console.log("\x1b[32m context ==>", context, "\x1b[0m")
  console.log("\x1b[32m event ==>", event, "\x1b[0m")

  const mobileNumber = event.Author
  console.log("\x1b[32m mobileNumber ==>", mobileNumber, "\x1b[0m")

  const conversationSid = event.ConversationSid
  console.log("\x1b[32m conversationSid ==>", conversationSid, "\x1b[0m")

  const webhookSid = event.WebhookSid
  console.log("\x1b[32m webhookSid ==>", webhookSid, "\x1b[0m")

  async function createInteraction() {
    await client.flexApi.v1.interaction
      .create({
        channel: {
          type: "sms",
          initiated_by: "customer",
          properties: {
            media_channel_sid: conversationSid,
          },
        },
        routing: {
          properties: {
            workspace_sid: workspaceSid,
            workflow_sid: workflowSid,
            task_channel_unique_name: "sms",
            attributes: {
              from: mobileNumber,
            },
          },
        },
      })
      .then((interaction) =>
        console.log("\x1b[32m createInteraction ==>", interaction.channel, "\x1b[0m")
      )
      .catch((error) => console.log(error))
  }

  async function removeWebhook() {
    await client.conversations.v1
      .conversations(conversationSid)
      .webhooks(webhookSid)
      .remove()
      .then(() =>
        console.log("\x1b[32m remove webhook ==>", webhookSid, "\x1b[0m")
      )
      .catch((error) => console.log(error))
  }

  createInteraction().then(() => {
    removeWebhook().then(() => {
      callback(null)
    })
  })
}
