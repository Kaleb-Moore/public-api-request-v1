/**
 * Fetch is used to pull information from the random user API
 * and then parse it into data to be used later. Also catches errors
 * and sends them to the console.
 */
fetch('https://randomuser.me/api/?results=12&nat=us')
  .then(res => res.json())
  .then(info => employeeList = info )
  .then(data => generateGallery(data.results))
  .catch(err => console.log(Error('Something went wrong', err)));

/**
 * Creates the search field at the top of the page and sets some basic Values
 */
const searchContainer = document.querySelector('.search-container');
searchContainer.insertAdjacentHTML('beforeend', `
<form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>
`)
const searchButton = document.getElementById('search-submit')
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const card = document.querySelectorAll('.card');
let searchInput = '';
let employeeList = [];

/**
 * Adds a data-index to each person on the page as well as
 * a defualt display of flex. This is used with the modal nav.
 * It is called at the end of this script with a delay to 
 * give the users time to be populated.
 */
function indexAdd() {
  const card = document.querySelectorAll('.card')
  for(let i = 0; i< card.length; i++) {
    card[i].setAttribute('data-index', [i])
    card[i].setAttribute('style', 'display: flex')
  }
}

/**
 * @param {Object Array} data - Iterate over data
 * and use that to create the users on screen. 
 */
function generateGallery(data) {
  const employees = data.map(employee => `
    <div class="card">
      <div class="card-img-container">
        <img class="card-img" src="${employee.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
        <p class="card-text">${employee.email}</p>
        <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
      </div>
    </div>
    `).join('');
  gallery.insertAdjacentHTML('beforeend', employees)
}

/**
 * @param {Number} index - uses the number returned to search
 * through the employeeList array and pull more data on employee
 * based on the index in that array.
 * Formats data returned with regex for cell phone and date of birth.
 */
function displayModal(index) {
  let employee = employeeList.results[index];
  const regexCell = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/
  let cellFormat = (employee.cell).replace(regexCell, '($1) $2-$3');
  const regexDate = /(\d{4})-(\d{2})-(\d{2}).*/
  let dobFormat = (employee.dob.date).replace(regexDate, '$2/$3/$1')

  const modal = `
    <div class="modal-container" data-index="${index}">
      <div class="modal" style="padding-bottom: 0px">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container" style="background: rgba(143, 119, 191, .8); height: 430px">
          <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
          <p class="modal-text">${employee.email}</p>
          <p class="modal-text cap">${employee.location.city}</p>
          <hr>
          <p class="modal-text">${cellFormat}</p>
          <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
          <p class="modal-text">Birthday: ${dobFormat}</p>
        </div>
      </div>
    </div>
    `;
    
  body.insertAdjacentHTML('beforeend', modal);

  if(index === 0) {
    const modalWindow = document.querySelector('.modal-container')
    modalWindow.insertAdjacentHTML('beforeend', `
    <div class="modal-btn-container" style="background: rgba(112, 86, 163, .8)">
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    `)
  } else if(index === 11) {
    const modalWindow = document.querySelector('.modal-container')
    modalWindow.insertAdjacentHTML('beforeend', `
    <div class="modal-btn-container" style="background: rgba(112, 86, 163, .8)">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    </div>
    `)
  } else {
    const modalWindow = document.querySelector('.modal-container')
    modalWindow.insertAdjacentHTML('beforeend', `
    <div class="modal-btn-container" style="background: rgba(112, 86, 163, .8)">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    `)
  }
}

/**
 * Adds and event listener for the button,
 * after text is entered and button is 
 * pressed it is compared to on screen 
 * names and people that don't partially
 * match are hidden.
 */
searchButton.addEventListener('click', e => {
  e.preventDefault();
  searchInput = document.getElementById('search-input').value.toLowerCase();

  for(let i = 0; i < gallery.children.length; i++) {
    let onScreenNames = gallery.children[i].children[1].children[0].textContent.toLowerCase();
    if(onScreenNames.includes(searchInput)) {
      gallery.children[i].setAttribute('style', 'display: flex')
    } else if(!(onScreenNames.includes(searchInput))) {
      gallery.children[i].setAttribute('style', 'display: none')
    }
  
  }
  console.log('button is working')

});

/**
 * Adds an event listener for the search
 * field. When you enter a name it updates
 * the results in real time.
 */
searchContainer.addEventListener('keyup', e => {
  e.preventDefault();
  searchInput = document.getElementById('search-input').value.toLowerCase();

  for(let i = 0; i < gallery.children.length; i++) {
    let onScreenNames = gallery.children[i].children[1].children[0].textContent.toLowerCase();
    if(onScreenNames.includes(searchInput)) {
      gallery.children[i].setAttribute('style', 'display: flex')
    } else if(!(onScreenNames.includes(searchInput))) {
      gallery.children[i].setAttribute('style', 'display: none')
    }
  
  }
});

/**
 * When clicking on any of the employees
 * (picture, name or just their box) it 
 * displays the modal window.
 */
gallery.addEventListener('click', e => {
  e.preventDefault();
  const card = gallery.children;
  let employees = [].slice.call(card, 0);
  
  if(e.target.className === 'card') {
    let index = employees.indexOf(e.target)
    if(e.target !== e.currentTarget) {
      displayModal(index);
    }

  } else if (e.target.parentNode.className === 'card-img-container' || e.target.parentNode.className === 'card-info-container') {
    let index = employees.indexOf(e.target.parentNode.parentNode)
    if(e.target !== e.currentTarget) {
      displayModal(index);
    }

  } else {
    let index = employees.indexOf(e.target.parentNode)
    if(e.target !== e.currentTarget) {
      displayModal(index);
    }

  }

});

/**
 * Handles the changing modal window to the next
 * or prevs as well as closing the modal window.
 * I have made sure that it only displays one
 * window at a time.
 */
document.querySelector('body').addEventListener('click', e => {

  if(document.querySelector('.modal-container') !== null) {

    let index = document.querySelector('.modal-container').getAttribute('data-index')
    const modalWindow = document.querySelector('.modal-container');

      if(e.target.textContent === "X") {
        modalWindow.remove();
      } else if(e.target.textContent === "Prev") {
        modalWindow.remove();
        displayModal(parseInt(index) - 1)
      } else if (e.target.textContent === "Next") {
        modalWindow.remove();
        displayModal(parseInt(index) + 1)
      }
  } 
});


//calls add index after they have loaded.
window.setTimeout(indexAdd, 800);