import '@popperjs/core';
import 'bootstrap/js/dist/modal';
import IMask from 'imask';

// const exampleModal = document.getElementById('exampleModal')
// exampleModal.addEventListener('show.bs.modal', event => {

//   const button = event.relatedTarget

//   const recipient = button.getAttribute('data-bs-whatever')

//   const modalTitle = exampleModal.querySelector('.modal-title')
//   const modalBodyInput = exampleModal.querySelector('.modal-body input')

//   modalTitle.textContent = `New message to ${recipient}`

// });

var phoneField = document.getElementById('phone-field');

var phoneFieldOptions = {
  mask: '+{375} (00) 000-00-00',
  lazy: false,
};

IMask(phoneField, phoneFieldOptions);


var codeField = document.getElementById('code-field');

var codeFieldOptions = {
  mask: '000000',
  lazy: false,
};

IMask(codeField, codeFieldOptions);



var phoneField1 = document.getElementById('phone-field1');

var phoneField1Options = {
  mask: '+{375} (00) 000-00-00',
  lazy: false,
};

IMask(phoneField1, phoneField1Options);


var codeField1 = document.getElementById('code-field1');

var codeField1Options = {
  mask: '000000',
  lazy: false,
};

IMask(codeField1, codeField1Options);

// https://imask.js.org/guide.html