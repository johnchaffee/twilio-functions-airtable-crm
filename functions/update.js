/*

  index.js

  Retrieves multiple records from a table. Optional to add number of records to
  return plus, sort field and direction.

  Pulls AIRTABLE_API_KEY and AIRTABLE_BASE_ID from context

  Required Paramaters: 
    * event.table
    * event.id
  
  Optional Parameters: 
    * event.notes
    * event.appointments

*/

const airtable = require("airtable")

exports.handler = function (context, event, callback) {
  console.log("event is ==> ", event)
  // console.log("context is ==> ", context)

  // Instantiate airtable object
  const base = new airtable({ apiKey: context["AIRTABLE_API_KEY"] }).base(
    context["AIRTABLE_BASE_ID"]
  )

  const id = event.id
  let notes = ""
  let appointments = ""
  const fields = {}
  console.log("TOP id:", id)
  console.log("TOP notes:", notes)
  console.log("TOP appointments:", appointments)
  console.log("TOP fields:", fields)

  // Fetch record first
  base(event.table).find(event.id, function (err, record) {
    if (err) {
      console.error(err)
      return
    }
    console.log("Retrieved", record.id)
    notes = record.fields.notes
    console.log("RETRIEVED > NOTES:", notes)
    appointments = record.fields.appointments
    console.log("RETRIEVED > APPOINTMENTS:", appointments)
    console.log("EVENT.FIELD:", event.field)
    if (event.field == "notes") {
      fields.notes = `${notes}\n${event.value}`
    } else {
      // If event.field != notes, it must equal appointments
      fields.appointments = `${appointments}\n${event.value}`
    }
    console.log("FIELDS AFTER:", fields)

    base(event.table).update(
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
          console.log(record.getId())
          console.log(record.get("phone"))
          console.log("record is ==> ", record)
          callback(null, { record })
        })
      }
    )
  })
}
