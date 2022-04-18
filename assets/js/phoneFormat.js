// PHONE NUMBER FORMATTING
// Remove spaces from phone number string (or any string)
function removeSpaces(str) {
  let noSpaces = str.replace(/\s/g, "");
  return noSpaces;
}

// Pass raw phone number and get back formatted phone number
// Assumes input is either a 10-digit US number or US E164 number
// Example: formatNumber("+1(206) 555.1212");
function formatNumber(str) {
  // split string into an array
  let arr = str.split("");
  let newNumber = "";
  // Loop through each char, if it's a digit add it to the newNumber string
  arr.forEach((char) => {
    let num = parseInt(char);
    if (Number(num) >= 0) {
      newNumber += char;
    }
  });
  // If there are 11 digits and first one is a '1' strip off the '1'
  if (newNumber.length === 11 && newNumber.slice(0, 1) === "1") {
    newNumber = newNumber.slice(1);
  }
  // if there are 10 digits, assume it's a US number and reformat it
  if (newNumber.length === 10) {
    let areacode = newNumber.slice(0, 3);
    let prefix = newNumber.slice(3, 6);
    let suffix = newNumber.slice(6, 10);
    newNumber = "(" + areacode + ") " + prefix + "-" + suffix;
  }
  // return the newNumber string in whatever shape it's in
  return newNumber;
}
// END PHONE NUMBER FORMATTING FUNCTIONS

console.log("Done loading phoneFormat.js");
