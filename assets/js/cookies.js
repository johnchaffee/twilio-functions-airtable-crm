let airtableApiKey = getCookie("airtableApiKey")
let airtableBaseId = getCookie("airtableBaseId")

function getCookie(cname) {
  console.log(`getCoookie(${cname})`)
  let name = cname + "="
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == " ") {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      console.log(`${cname}: ` + c.substring(name.length, c.length))
      return c.substring(name.length, c.length)
    }
  }
  return ""
}

function setCookie(cname, cvalue, exdays) {
  console.log("setCookie")
  let d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  let expires = "expires=" + d.toGMTString()
  // If testing on localhost, use SameSite=Lax
  if (location.protocol == "https:") {
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/; SameSite=None; Secure`
  } else {
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/; SameSite=Lax`
  }
  console.log("setCookie: " + `${cname}=${cvalue};`)
}

function deleteCookie(cname) {
  console.log("deleteCookie")
  // If testing on localhost, use SameSite=Lax
  if (location.protocol == "https:") {
    document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`
  } else {
    document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
  }
}

function checkCookie() {
  console.log("checkCookie")
  if (
    airtableBaseId != "" &&
    airtableBaseId != null &&
    airtableApiKey != "" &&
    airtableApiKey != null
  ) {
    console.log("Airtable API Key: " + airtableApiKey)
    console.log("Airtable Base ID: " + airtableBaseId)
    return true
  } else {
    console.log("Airtable API Key or Base ID cookie not found")
    return false
  }
}

// function updateAirtableBaseIdField() {
//   console.log("updateAirtableBaseIdField")
//   checkCookie()
//   // Set airtableBaseId field from cookie
//   $("#airtableBaseId").val(airtableBaseId)
//   // $('#swagger-ui [data-property-name="airtableBaseId"] input[type="text"]').val(airtableBaseId);
//   console.log("set airtableBaseId value")
//   // Set airtableApiKey field from cookie
//   $("#airtableApiKey").val(airtableApiKey)
//   console.log("set airtableApiKey value")
// }

// // Get airtableBaseId key from cookie and store it in airtableBaseId field
// $(document).ready(function () {
//   $("#airtableBaseId").ready(function () {
//     console.log("#airtableBaseId.ready")
//     updateAirtableBaseIdField()
//   })
// })
// END COOOKIES

console.log("Done loading cookies.js");
