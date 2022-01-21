const limitRaces = 10; // Max number of races per day
const raceTime = 1000 * 30 // 30 seconds
const tryTimeAfterRace = 1000 // 1 second

function getCars() {
  const elementsList = Array.from(document.querySelectorAll('.ms-2 '))
  return elementsList.map(element => {
    const innerElement = element.firstChild.innerHTML;
    const carID = innerElement.split(' ')[1]

    return {
      element: element,
      carId: carID,
      races: 0,
      results: []
    }
  });
}

/**
 *
 * @return {{ id: string, racesLeft: number }[]}
 */
function GenerateCarData() {

  return [{
    id: '',
    racesLeft: 0
  }]
}

function getCarsRaces() {
  // Click in cars by they content (id) in the document
  let cars = getCars()

  return cars.map((car) => {
    car.element.click()
    const selectedCarDocument = document.querySelector('.selected')
    const selectedCarInnerHTML = selectedCarDocument.innerHTML
    const splitedRaces = selectedCarInnerHTML.split('Racing:')
    car.races = splitedRaces[1].split('/')[0]
    return car;
  })

}

function FindCarElement(car) {
  const carList = document.querySelector('.car-list')
  const cars = Array.from(carList.querySelectorAll('.ms-2'))
  return cars.find((carElement) => {
    const carID = carElement.firstChild.innerHTML.split(' ')[1]
    if (carID === car.carId) {
      return true
    }
  });
}

function CarCanRun(car) {
  return car.races < limitRaces
}


async function CheckResult() {


  let isCheckResultRendered = false;
  while (!isCheckResultRendered) {
    const selected = document.querySelector('.selected')
    const checkButton = selected.querySelector('.btn-yellow')
    if (checkButton && checkButton.innerHTML === 'Check Result') {
      isCheckResultRendered = true
      checkButton.click()
    }
    await Sleep(500)
  }


  return false
}

function GetResult() {
  const successModal = document.querySelector('.result')
  const resultElement = successModal.querySelector('.text-orange')
  return resultElement.innerHTML
}

function Claim() {
  const modals = Array.from(document.querySelectorAll('.ant-modal-body'))
  const claimSuccessModal = modals.find(modal => modal.innerHTML.includes('Claim'))
  if (!claimSuccessModal) {
    alert('Result Modal error')
  }
  const claimButton = claimSuccessModal.querySelector('.ant-btn-success')
  claimButton.click()
}

function Sleep(time) {
  return new Promise((callback) => {
    setTimeout(callback, time)
  })
}


function ClickCar(car) {
  const carElement = FindCarElement(car)

  carElement.click()
  Sleep(100)
}

async function StartRace(car) {
  if (!CarCanRun(car))
    return false

  const selectedCar = document.querySelector('.selected')
  const startRaceButton = selectedCar.querySelector('.btn-green')
  startRaceButton.click()

  await Sleep(raceTime)
  await CheckResult()

  return true
}

async function main() {
  let result = 0
  const cars = getCarsRaces()
  for (car of cars) {
    for (let i = car.races; i < limitRaces; i++) {

      ClickCar(car)
      const runned = await StartRace(car)

      if (!runned)
        return


      let isRunning = true;
      while (isRunning) {
        isRunning = await CheckResult()
        await Sleep(tryTimeAfterRace)
      }
      await Sleep(1000)
      const raceReward = GetResult()
      try {
        cars[cars.indexOf(car)].result.push(raceReward)
      } catch (err) {
        console.log(err)
      }
      result += raceReward
      Claim()
      await Sleep(200)
    }
  }

  console.log(result)
}


main()
