import {renderFragment} from './fragments/fragments-render.js'

const searchCarsButton = document.getElementById("fragment-count-button");
const runCarsButton = document.getElementById("run-cars-button");
const content = document.getElementById('fragment-content')

searchCarsButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: FindFragments,
  });
});

function FindFragments() {
  const elements = Array.from(document.querySelectorAll(".text-white"))
  const fragments = elements.map((element) => element.innerHTML)

  const CarsCategories = ["dragon",
    "buffalo",
    "snake",
    "goat",
    "chicken",
    "mouse",
    "horse",
    "pig",
    "dog",
    "tiger",
    "rabbit",
    "monkey"
  ]

  /**
   * @type CategoryTotal
   */
  const categoryTotal = {}

  function IncrementsCarCategoryFragment(category, fragment) {
    if (!categoryTotal[category]) {
      categoryTotal[category] = {
        items: {}
      }
    }
    if (!categoryTotal[category].items[fragment]) {
      categoryTotal[category].items[fragment] = {
        name: fragment,
        total: 0
      }
    }
    categoryTotal[category].items[fragment].total += 1
  }

  CarsCategories.forEach((category) => {
    fragments.filter((fragment) => fragment.includes(category)).forEach((fragment) => {
      IncrementsCarCategoryFragment(category, fragment)
    })
  });


  chrome.runtime.sendMessage({
    fragments: {
      content: categoryTotal,
      status: 'needs_render'
    }
  }, function (response) {
    console.log(response.farewell);
  });
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    if (request.fragments.status === "needs_render") {

      Object.keys(request.fragments.content).forEach((keyName) => {
        content.appendChild(renderFragment(request.fragments.content[keyName], keyName))
      })
    }

    sendResponse({farewell: "rendered"});
  }
);

runCarsButton.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['./src/RunCars/runCars.js']
  });
});
