fetch('https://randomuser.me/api/?results=12&nat=us')
  .then(res => res.json())
  .then(info => employeeList = info )
  .then(data => generateGallery(data.results))


const searchContainer = document.querySelector('.search-container');
searchContainer.insertAdjacentHTML('beforeend', `
<form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>
`)
let searchButton = document.getElementById('search-submit')
let searchInput = '';

let employeeList = [];
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const card = document.querySelectorAll('.card');

function indexAdd() {
  const card = document.querySelectorAll('.card')
  for(let i = 0; i< card.length; i++) {
    card[i].setAttribute('data-index', [i])
    card[i].setAttribute('style', 'display: flex')
  }
}

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

window.setTimeout(indexAdd, 500);

