let employeeList = [];

fetch('https://randomuser.me/api/?results=12&nat=us')
  .then(res => res.json())
  .then(info => employeeList = info )
  .then(data => generateGallery(data.results))

const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

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
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
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
}

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

  if(document.getElementById('modal-close-btn') !== null) {
    document.getElementById('modal-close-btn').addEventListener('click', () => {
      const modalWindow = document.querySelector('.modal-container');
      modalWindow.remove();
    })
  } 
});
