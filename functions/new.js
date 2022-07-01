/*

  index.js

  Retrieves multiple records from a table. Optional to add number of records to
  return plus, sort field and direction.

  Pulls AIRTABLE_API_KEY and AIRTABLE_BASE_ID from context

  Required Paramaters: 
    * event.table
    * event.phone
  
  Optional Parameters: 
    * event.first
    * event.last
    * event.company
    * event.email
    * event.image
    * event.notes
    * event.status

*/

const airtable = require("airtable")

exports.handler = function (context, event, callback) {
  console.log("event is ==> ", event)
  console.log("context is ==> ", context)

  // Instantiate airtable object
  const base = new airtable({ apiKey: context["AIRTABLE_API_KEY"] }).base(
    context["AIRTABLE_BASE_ID"]
  )

  base(event.table).create(
    [
      {
        fields: {
          first: event.fields.first,
          last: event.fields.last,
          company: event.fields.company,
          phone: event.fields.phone,
          email: event.fields.email,
          notes: event.fields.notes,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err)
        callback("error retrieving record", null)
      }
      records.forEach(function (record) {
        console.log(record.getId())
        console.log("record is ==> ", record)
        callback(null, { record })
      })
    }
  )
}
