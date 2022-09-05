/*

  contact.js

  Retrieves a single record using a unique attribute value from a table column. 
  If there are more than one matching record, then the first record is returned!

  Pulls AIRTABLE_API_KEY and AIRTABLE_BASE_ID from context

  Required Paramaters: 
    * event[0].data.payload.task_attributes

  */

require("dotenv").config()
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const surveyPhoneNumber = process.env.SURVEY_PHONE_NUMBER
const surveyFlowSid = process.env.SURVEY_FLOW_SID
const airtable = require("airtable")
const axios = require("axios").default

// SEND SURVEY FUNCTION
const sendSurvey = async (from, to) => {
  console.log("\x1b[32m SEND SURVEY \x1b[0m")
  const url = `https://studio.twilio.com/v1/Flows/${surveyFlowSid}/Executions`
  const params = new URLSearchParams()
  params.append("From", from)
  params.append("To", to)
  console.log("\x1b[32m params ==>", params, "\x1b[0m")
  const config = {
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }
  try {
    const response = await axios.post(url, params, config)
    console.log("\x1b[32m data ==>", data, "\x1b[0m")
  } catch (err) {
    console.log("ERROR GETTING STUDIO FLOW\n" + err)
  }
}

exports.handler = function (context, event, callback) {
  // Instantiate airtable object
  const base = new airtable({ apiKey: context["AIRTABLE_API_KEY"] }).base(
    context["AIRTABLE_BASE_ID"]
  )

  console.log("\x1b[32m event ==>", event, "\x1b[0m")

  console.log(
    "\x1b[32m event[0].data.payload.task_attributes ==>",
    event[0].data.payload.task_attributes,
    "\x1b[0m"
  )
  const task = JSON.parse(event[0].data.payload.task_attributes)
  console.log("\x1b[32m JSON.parse task ==>", task, "\x1b[0m")
  // sms: channelType == sms, phone = from
  // chat: channelType == web, phone = hard code to john
  // voice: type = inbound, phone = caller
  const channelType = task.channelType
  console.log("\x1b[32m channelType ==>", channelType, "\x1b[0m")
  const customerAddress = task.customerAddress
  console.log("\x1b[32m customerAddress ==>", customerAddress, "\x1b[0m")
  const from = task.from
  console.log("\x1b[32m from ==>", from, "\x1b[0m")
  const caller = task.caller
  console.log("\x1b[32m caller ==>", caller, "\x1b[0m")
  const direction = task.direction
  console.log("\x1b[32m direction ==>", direction, "\x1b[0m")
  let phone
  let activity

  // Set today's date
  let rightNow = new Date()
  let year = rightNow.getFullYear()
  let month = rightNow.getMonth() + 1
  let day = rightNow.getDate()
  let hour = rightNow.getHours()
  let minute = rightNow.getMinutes()
  // Convert UTC Time to Pacific Time
  if (hour >= 7) {
    // Subtract 7 hours from UTC time for US Pacific
    hour = hour - 7
  } else if (hour < 7) {
    // If it's 0-7AM in UTC, that's 5pm-midnight the day before in US Pacific
    hour = hour + 17
    day = rightNow.getDate() - 1
  }
  // Format month, day, hour, minute as 2-digits
  month = ("0" + month).slice(-2)
  day = ("0" + day).slice(-2)
  hour = ("0" + hour).slice(-2)
  minute = ("0" + minute).slice(-2)
  let myDate = `${year}-${month}-${day}`
  console.log("\x1b[32m myDate ==>", myDate, "\x1b[0m")
  let myTime = `${myDate} ${hour}:${minute}`
  console.log("\x1b[32m myTime ==>", myTime, "\x1b[0m")

  if (channelType) {
    if (channelType === "sms") {
      console.log("\x1b[32m SMS TASK COMPLETED \x1b[0m")
      activity = `${myTime}: Completed SMS conversation`
      phone = from
    } else if (channelType === "web") {
      console.log("\x1b[32m CHAT TASK COMPLETED \x1b[0m")
      activity = `${myTime}: Completed Web Chat`
      phone = "+12063996576"
    }
  } else if (direction && direction === "inbound") {
    console.log("\x1b[32m VOICE TASK COMPLETED \x1b[0m")
    activity = `${myTime}: Completed Phone Call`
    phone = caller
  }

  // Call voice completed - call sendSurvey() method to trigger Studio flow
  sendSurvey(surveyPhoneNumber, phone)
    .then(function () {
      console.log("CALLED SEND SURVEY")
    })
    .catch(function (err) {
      console.log(err)
    })
  console.log("\x1b[32m phone ==>", phone, "\x1b[0m")
  console.log(
    "\x1b[32m encodeURIComponent(phone) ==>",
    encodeURIComponent(phone),
    "\x1b[0m"
  )

  base("contacts")
    .select({
      maxRecords: 1,
      filterByFormula: `(phone = "${phone}")`,
    })
    .firstPage(function (err, records) {
      if (err) {
        console.log(err)
        callback("error retrieving record", null)
      }
      // Take only the first record returned
      console.log("\x1b[32m records ==>", records, "\x1b[0m")
      console.log("\x1b[32m records.length ==>", records.length, "\x1b[0m")
      if (records.length > 0) {
        console.log("\x1b[32m records[0].id ==>", records[0].id, "\x1b[0m")
        // let r = records[0].fields;
        // r.id = records[0].id; // ADD Airtable ID

        const id = records[0].id
        let activities = records[0].fields.activities
        const fields = {}
        console.log("\x1b[32m id ==>", id, "\x1b[0m")
        console.log("\x1b[32m activities ==>", activities, "\x1b[0m")
        console.log("\x1b[32m fields ==>", fields, "\x1b[0m")
        if (activities) {
          // append to existing activities
          fields.activities = `${activities}\n${activity}`
        } else {
          fields.activities = `${activity}`
        }

        // Update field
        base("contacts").update(
          [
            {
              id,
              fields,
            },
          ],
          function (err, records) {
            if (err) {
              console.error(err)
              callback("error retrieving record", null)
            }
            records.forEach(function (record) {
              // console.log(record.getId())
              // console.log(record.get("phone"))
              console.log("\x1b[32m record ==>", record, "\x1b[0m")
              callback(null, { record })
            })
          }
        )
      } else {
        console.log("\x1b[32m RECORDS !> 0 \x1b[0m")
        callback(null, "")
      }
    })
}
