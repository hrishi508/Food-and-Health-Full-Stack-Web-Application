// client-side js, loaded by index.html

// any console.log in this file will appear the browser console
console.log("Hello from script.js!")

// get Handlebars and axios from the window object. We added these to the window from a CDN link in index.html
const handlebars = window.Handlebars
const axios = window.axios

// get elements from the DOM 
const output = document.getElementById("recommendation-output");
const button = document.getElementById("submitButton");

// this helper function that gets called on form submission
const submitForm = async (event) => {
  try {
    // This line prevents the page from reshing on form submit. By default, a form submission event refreshes the page
    event.preventDefault()  
    disableButton()
    
    // get form values 
    const { elements } = event.target
    const artist1 = elements.artist1.value
    const artist2 = elements.artist2.value
    const artist3 = elements.artist3.value

    // send a POST request to the backend /recommendations path to get song recommendations
    let result
    try {
      result = await axios.post("/recommendations", { artist1,artist2,artist3 })
    }catch (err) {
      let errMsg = "Something went wrong"
      // overwrite generic error message with server error if present
      if(err.response.data.message) {
        errMsg = err.response.data.message 
      } 
      return alert(errMsg)
    }
    
    const recommendations = result.data.tracks

    // get top 3 recommendations
    const topFiveRecs = recommendations.slice(0,5)

    const template = handlebars.compile(templateRaw)
    const recommendationsHtml = template({ artist1,artist2,artist3,topFiveRecs })

    // set the recommendation output's inner html do the resolved temple
    output.innerHTML = recommendationsHtml
  } catch(err) {
    // show a pop up error message if something goes wrong
    alert("Something went wrong. " + err.message)
  } finally {
    // regardless of outcome, re-enable button
    enableButton()
  }
}

const disableButton = () => {
  button.value = "Searching..."
  button.disabled = true
}

const enableButton = () => {
  button.value = "Get recommendations"
  button.disabled = false
}

const templateRaw = `
<p>If you like {{artist1}}, {{artist2}} and {{artist3}}, you'll love these tracks:</p>
<ul>
  {{#each topFiveRecs}}
  <li>{{name}} - <a href="{{external_urls.spotify}}">Play</a></li>
  {{/each}}
</ul>
`
