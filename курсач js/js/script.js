document.addEventListener('DOMContentLoaded', () => {
    'use strict'; 
    
    const customer = document.getElementById('customer'),
          freelancer = document.getElementById('freelancer'),
          blockCustomer = document.getElementById('block-customer'),
          blockFreelancer = document.getElementById('block-freelancer'),
          blockChoice = document.getElementById('block-choice'),
          btnExit = document.getElementById('btn-exit'),
          formCustomer = document.getElementById('form-customer'),
          ordersTable = document.getElementById('orders'),
          modalOrder = document.getElementById('order_read'),
          modalOrderActive = document.getElementById('order_active');

    const orders = JSON.parse(localStorage.getItem('freeOrders')) || [];

    const toStorage = () => {
        localStorage.setItem('freeOrders', JSON.stringify(orders));
    }

    const renderOrders = () => {
      
         ordersTable.textContent = '';

        orders.forEach((order, i) => {
           console.log(order); 
        ordersTable.innerHTML += `
        <tr class="order ${order.active ? 'taken' : ''}" 
        data-number-order="${i}">
            <td>${i + 1}</td>
            <td>${order.title}</td>
            <td class= ${order.currency}></td>
            <td>${order.deadline}</td>
        </tr>`;
    });
    };

    const handlerModal = (event) => {
        const target = event.target;
        const modal = target.closest('.order-modal');
        const order = orders[modal.id];

        const baseAction = () => {
            modal.style.display = 'none';
            toStorage();
            renderOrders();
        }

        if (target.closest('.close') || target === modal ) {
            modal.style.display = 'none';
        }
        
        if (target.classList.contains('get-order')) {
            order.active = true;
            baseAction();
        }
        if (target.id === 'capitulation') {
            order.active = false;
           baseAction();
        }
        if (target.id === 'ready') {
            orders.splice(orders.indexOf(order), 1);
            baseAction();
        }
    }

    const openModal = (numberOrder) => {
        const order = orders[numberOrder];
        
        const { title, firstName, email, phone, description,
             amount, currency, deadline, active = false } = order;

        const modal = active ? modalOrderActive : modalOrder;

        const firstNameBlock = modal.querySelector('.firstName'),
              titleBlock = modal.querySelector('.modal-title'),
              emailBlock = modal.querySelector('.email'),
              descriptionBlock = modal.querySelector('.description'),
              deadlineBlock = modal.querySelector('.deadline'),
              currencyBlock = modal.querySelector('.currency_img'),
              countBlock = modal.querySelector('.count'),
              phoneBlock = modal.querySelector('.phone');


              modal.id = numberOrder;
              titleBlock.textContent = title;
              firstNameBlock.textContent = firstName;
              emailBlock.textContent = email;
              emailBlock.href = 'mailto:' + email;
              descriptionBlock.textContent = description;
              deadlineBlock.textContent = deadline;
              currencyBlock.className = 'currency_img';
              currencyBlock.classList.add(currency);
              countBlock.textContent = amount;
              phoneBlock ? phoneBlock.href = 'tel:' + phone : ' ';    

        modal.style.display = 'flex';

        modal.addEventListener('click', handlerModal);
    };

    ordersTable.addEventListener('click', event => {
        const target = event.target;

        const targetOrder = target.closest('.order')
        if (targetOrder) {
            openModal(targetOrder.dataset.numberOrder);
        }


    });


    customer.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    freelancer.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        renderOrders();
        blockFreelancer.style.display = 'block';
        btnExit.style.display = 'block';

    });

    btnExit.addEventListener('click', () => {
        blockCustomer.style.display = 'none';
        blockFreelancer.style.display = 'none';
        btnExit.style.display = 'none';
        blockChoice.style.display = 'block';
    })

    formCustomer.addEventListener('submit', (event) => {
        event.preventDefault();

        const obj = {};


        const elements = [...formCustomer.elements]
            .filter((elem) => (elem.tagName === 'INPUT' && elem.type !== 'radio') || 
                (elem.type === 'radio' && elem.checked) ||
                elem.tagName === 'TEXTAREA');

            elements.forEach((elem) => {
                obj[elem.name] = elem.value;
            });
       
        formCustomer.reset();


        orders.push(obj);
        toStorage();
    });


 
})