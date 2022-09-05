import '@popperjs/core';
import Modal from 'bootstrap/js/dist/modal';
import IMask from 'imask'; // https://imask.js.org/guide.html

const myModal = new Modal(document.getElementById('success-modal'), {});
const modalInstancePhone = new Modal(document.getElementById('phone-modal'), {});
const modalInstancePc = new Modal(document.getElementById('pc-modal'), {});

const PLAN_LOCAL_STORAGE = 'plan';
const COUNT_DEVICE_LOCAL_STORAGE = 'countDevice';
const PHONE_VALUE_FROM_MASK = 'phone';
const CODE_VALUE_FROM_MASK = 'code';

const settingsMasks = [];

const removeLocalData = () => {
  [PLAN_LOCAL_STORAGE, COUNT_DEVICE_LOCAL_STORAGE, PHONE_VALUE_FROM_MASK, CODE_VALUE_FROM_MASK].forEach(function (item) {
    localStorage.removeItem(item);
  });
}

const removeError = (element, className = 'js-set-error') => {
  const form = element.closest('form');
  const error = form.getElementsByClassName(className)[0];
  error.classList.remove("form-error--show")
  error.innerHTML = '';
}

const setError = (form, text = 'Error', className = 'js-set-error') => {
  const error = form.getElementsByClassName(className)[0];
  error.classList.add("form-error--show")
  error.innerHTML = text;
}

window.addEventListener("load", function () {
  removeLocalData();
});

// Remove local when modal close
const modals = document.getElementsByClassName("js-form-modal");
Array.from(modals).forEach(function (element) {
  element.addEventListener('hide.bs.modal', () => {
    removeLocalData()
    const contract = element.getElementsByClassName("js-get-contract")[0];
    contract.value = '';
    const nextform = element.getElementsByClassName("js-next-form")[0];
    nextform.getElementsByClassName("js-mask-code")[0].setAttribute('disabled', 'disabled')
    nextform.getElementsByClassName("js-fetch-form")[0].setAttribute('disabled', 'disabled')
    settingsMasks.forEach((el) => {
      el.value = ''
    })
  });
});

//Add masks
const optionsPhone = {
  mask: '+{375} (00) 000-00-00',
  lazy: false,
};

const optionsCode = {
  mask: '000000',
  lazy: false,
};

const maskPhone = document.getElementsByClassName("js-mask-phone");
Array.from(maskPhone).forEach(function (element) {
  const maskPhoneValue = IMask(element, optionsPhone);
  settingsMasks.push(maskPhoneValue)
  maskPhoneValue.on("accept", function () {
    removeError(element)

    localStorage.removeItem(PHONE_VALUE_FROM_MASK);
  });

  maskPhoneValue.on("complete", function () {
    removeError(element)

    localStorage.setItem(PHONE_VALUE_FROM_MASK, maskPhoneValue.unmaskedValue);
  });
});

const maskCode = document.getElementsByClassName("js-mask-code");
Array.from(maskCode).forEach(function (element) {
  const maskCodeValue = IMask(element, optionsCode);
  settingsMasks.push(maskCodeValue)
  maskCodeValue.on("accept", function () {
    removeError(element)

    localStorage.removeItem(CODE_VALUE_FROM_MASK);
  });

  maskCodeValue.on("complete", function () {
    removeError(element)

    localStorage.setItem(CODE_VALUE_FROM_MASK, maskCodeValue.unmaskedValue);
  });
});


const elements = document.getElementsByClassName("js-btn-event");
Array.from(elements).forEach(function (element) {
  element.addEventListener('click', choiceSubscribtion);
});

function choiceSubscribtion() {
  const plan = this.getAttribute('data-tariff-plan');
  const countDevice = this.getAttribute('data-count-device');
  localStorage.setItem(PLAN_LOCAL_STORAGE, plan);

  if (countDevice) {
    localStorage.setItem(COUNT_DEVICE_LOCAL_STORAGE, countDevice);
  }
}


const eventsSubmitButton = document.getElementsByClassName("js-fetch-form");
Array.from(eventsSubmitButton).forEach(function (element) {
  element.addEventListener('click', submitForm);
});

async function submitForm() {
  const form = this.closest('form');
  const modal = this.closest('.modal-body');
  const parentContract = modal.getElementsByClassName('js-parent-contract');
  const url = form.getAttribute('data-form-api');
  const contract = modal.getElementsByClassName("js-get-contract")[0];
  const getFieldName = form.getElementsByClassName("js-get-value")[0]
  const getPhoneValue = localStorage.getItem(PHONE_VALUE_FROM_MASK)
  const getCodeValue = localStorage.getItem(CODE_VALUE_FROM_MASK)
  const getPlanValue = localStorage.getItem(PLAN_LOCAL_STORAGE)
  const getDeviceValue = localStorage.getItem(COUNT_DEVICE_LOCAL_STORAGE)

  removeError(this)
  removeError(parentContract[0], 'form-error')


  contract.addEventListener('input', function () {
    if (this.value !== '') {
      removeError(parentContract[0], 'form-error')
    }
  });

  if (contract.value === '') {
    setError(parentContract[0], 'Заполните договор!', 'form-error')
    return;
  }

  if (getFieldName.name === PHONE_VALUE_FROM_MASK && (!getPhoneValue || getPhoneValue.length < 12)) {
    setError(form, 'Заполните телефон!')
    return;
  }

  if (getFieldName.name === CODE_VALUE_FROM_MASK && (!getCodeValue || getCodeValue.length < 6)) {
    setError(form, 'Заполните код!')
    return;
  }

  this.classList.add("btn--load")
  this.setAttribute('disabled', 'disabled');


  const data = {
    plan: getPlanValue,
    contract: contract.value,
    phone: getPhoneValue,
    code: getCodeValue ? getCodeValue : '',
    devices: getDeviceValue ? getDeviceValue : '',
  };

  console.log(data)

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    console.log('Успех:', JSON.stringify(json));
    if (getFieldName.name === CODE_VALUE_FROM_MASK && (getCodeValue || getCodeValue.length === 6)) {
      modalInstancePhone.hide()
      modalInstancePc.hide()
      myModal.show();
    }
  } catch (err) {
    setTimeout(() => {
      this.classList.remove("btn--load");
      this.removeAttribute('disabled');

      setError(form, 'Error')

      console.error('Ошибка:', err);

      const nextform = modal.getElementsByClassName("js-next-form")[0];
      nextform.getElementsByClassName("js-mask-code")[0].removeAttribute('disabled');
      nextform.getElementsByClassName("js-fetch-form")[0].removeAttribute('disabled');

      if (getFieldName.name === CODE_VALUE_FROM_MASK && (getCodeValue || getCodeValue.length === 6)) {
        modalInstancePhone.hide()
        modalInstancePc.hide()
        myModal.show();
      }
    }, 1000);
  }
}