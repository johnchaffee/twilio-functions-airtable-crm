/*

  index.js

  Retrieves multiple records from a table. Optional to add number of records to
  return plus, sort field and direction.

  Pulls AIRTABLE_API_KEY and AIRTABLE_BASE_ID from context

  Required Paramaters: 
    * event.table

  Optional Parameters: 
    * event.numberRecords  
    * event.sortField
    * event.sortDirection

*/

const airtable = require("airtable");

exports.handler = function (context, event, callback) {

  console.log("event is ==> ", event);
  console.log("context is ==> ", context);

  // Instantiate airtable object
  const base = new airtable({apiKey: context['AIRTABLE_API_KEY']}).base(context['AIRTABLE_BASE_ID']);
  // const base = new airtable({apiKey: event.request.cookies.airtableApiKey}).base(event.request.cookies.airtableBaseId);
  
  // Number of records to return set to 5 if no value passed in event
  let numberRecords = event.numberRecords ? parseInt(event.numberRecords) : 25;
  
  // boolean to sort the results by the field
  let doSort =  event.sortField ? true : false; 
  
  // direction to return if sort is true
  let sortDirection =  event.sortDirection ? event.sortDirection : 'asc'; 

  console.log("doSort is ==> ", doSort);
  console.log("sortDirection is ==> ", sortDirection);
  console.log("numberRecords is ==> ", numberRecords);

  // Return a set of records with optional limit and sorting
  base(event.table).select({       
      maxRecords: numberRecords,
      ...( doSort && { sort: [ {field: event.sortField, direction: sortDirection} ] } )      
  }).firstPage(function (err, records)
      {
        if(err) {
            console.log(err);
            callback("error retrieving record",null);
        }
        console.log("records is ==> ", records);
        callback(null, {records});         
      }
  );
  
};
