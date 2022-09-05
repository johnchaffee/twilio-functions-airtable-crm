/*

  survey.js

  Receives a phone number and survey rating.
  Retrieves a single record using a unique attribute value from a table column. 
  If there are more than one matching record, then the first record is returned!

  Pulls AIRTABLE_API_KEY and AIRTABLE_BASE_ID from context

  Required Paramaters: 
    * event.phone
    * event.rating

  */

require("dotenv").config()
const airtable = require("airtable")

exports.handler = function (context, event, callback) {
  // Instantiate airtable object
  const base = new airtable({ apiKey: context["AIRTABLE_API_KEY"] }).base(
    context["AIRTABLE_BASE_ID"]
  )

  console.log("\x1b[32m event ==>", event, "\x1b[0m")
  console.log("\x1b[32m event.phone ==>", event.phone, "\x1b[0m")
  console.log("\x1b[32m event.rating ==>", event.rating, "\x1b[0m")

  const phone = event.phone
  const rating = event.rating

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
        const id = records[0].id
        const activities = records[0].fields.activities
        const thisRating = `${myTime}: Received customer rating: ${rating}`
        const fields = {}
        console.log("\x1b[32m id ==>", id, "\x1b[0m")
        console.log("\x1b[32m activities ==>", activities, "\x1b[0m")
        console.log("\x1b[32m thisRating ==>", thisRating, "\x1b[0m")
        if (activities) {
          // append to existing activities
          fields.activities = `${activities}\n${thisRating}`
        } else {
          fields.activities = `${thisRating}`
        }
        console.log("\x1b[32m fields ==>", fields, "\x1b[0m")

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
