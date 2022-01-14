/**
 * @param fragmentName {string}
 * @returns {HTMLParagraphElement}
 */
export function createFragmentNameP(fragmentName) {
  const fragmentNameP = document.createElement('p')
  fragmentNameP.classList.add('fragment-name')
  fragmentNameP.innerHTML = fragmentName
  return fragmentNameP
}

/**
 * @param fragmentTotal {string}
 * @returns {HTMLParagraphElement}
 */
export function createFragmentTotalP(fragmentTotal) {
  const fragmentTotalP = document.createElement('p')
  fragmentTotalP.classList.add('fragment-total')
  fragmentTotalP.innerHTML = fragmentTotal
  return fragmentTotalP
}


function HaveAllFragment(items) {
  console.log(items)
  return Object.keys(items).length >= 6
}

/**
 * @param content {Fragment}
 * @param fragmentName {string}
 * @returns {HTMLDivElement}
 */
export function renderFragment(content, fragmentName) {
  if (!content.items) {
    return null
  }

  // will render the category in html
  const category = document.createElement('div')
  category.classList.add('category')

  const categoryTitle = document.createElement('div')
  categoryTitle.classList.add('category-title')
  categoryTitle.classList.add('d-flex')
  const categoryTitleH3 = document.createElement('h3')
  categoryTitleH3.innerHTML = fragmentName

  categoryTitle.appendChild(categoryTitleH3)
  category.appendChild(categoryTitle)

  const categoryContent = document.createElement('div')
  categoryContent.classList.add('category-content')
  categoryContent.classList.add('d-flex')


  // will render the fragments in html
  Object.keys(content.items).forEach((itemName) => {
    const fragment = document.createElement('div')
    fragment.classList.add('zodiac-fragment')

    const fragmentNameP = createFragmentNameP(itemName)
    fragment.appendChild(fragmentNameP)

    const fragmentTotalP = createFragmentTotalP(content.items[itemName].total)
    fragment.appendChild(fragmentTotalP)

    categoryContent.appendChild(fragment)
  })

  // show to user can combine the fragments
  const canCombine = HaveAllFragment(content.items)
  const combineDiv = document.createElement('div')
  combineDiv.classList.add('combine')
  combineDiv.innerHTML = '<span>Combine</span>'

  if (!canCombine) {
    combineDiv.innerHTML = `<span>can't combine</span>`
    combineDiv.classList.add('warning')
  }
  categoryTitle.appendChild(combineDiv)

  category.appendChild(categoryContent)
  return category
}
