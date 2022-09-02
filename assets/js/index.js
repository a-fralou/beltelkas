import '@popperjs/core';
import 'bootstrap/js/dist/modal';
import IMask from 'imask';

const exampleModal = document.getElementById('exampleModal')
exampleModal.addEventListener('show.bs.modal', event => {

  const button = event.relatedTarget

  const recipient = button.getAttribute('data-bs-whatever')

  const modalTitle = exampleModal.querySelector('.modal-title')
  const modalBodyInput = exampleModal.querySelector('.modal-body input')

  modalTitle.textContent = `New message to ${recipient}`

});

var element = document.getElementById('recipient-name');

var maskOptions = {
  mask: '+{375} (00) 000-00-00',
  lazy: false,
};

IMask(element, maskOptions);

// https://imask.js.org/guide.html