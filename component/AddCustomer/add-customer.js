import { initializeAddGoods } from "../AddGoods/add-goods.js";

// Add Customer Component Script
export function initializeAddCustomer(managementCustomer) {
  const addCustomerPage = document.querySelector('#add-customer-container .add-customer-page');
  const addCustomerForm = document.querySelector('#add-customer-container #addCustomerForm');
  const addOrderItemPage = document.getElementById('add-order-item-page');
  const confirmAddModal = document.getElementById('confirmAddModal');
  const cancelAddModal = document.getElementById('cancelAddModal');
  const confirmAddBtn = document.getElementById('confirmAddBtn');
  const cancelAddModalBtn = document.getElementById('cancelAddModalBtn');
  const confirmCancelBtn = document.getElementById('confirmCancelBtn');
  const cancelCancelModalBtn = document.getElementById('cancelCancelModalBtn');
  const cancelAddCustomerBtn = document.getElementById('cancelAddCustomer');
  const closeConfirmAddModal = document.getElementById('closeConfirmAddModal');
  const closeCancelAddModal = document.getElementById('closeCancelAddModal');
  let pendingAdd = false;

  function renderOrderItemsDisplay() {
    const orderItemsDisplay = document.getElementById('orderItemsDisplay');
    const orderItemCountSpan = document.getElementById('orderItemCount');
    const storedOrderItemsJson = localStorage.getItem('orderItems');
    const storedOrderItems = storedOrderItemsJson ? JSON.parse(storedOrderItemsJson) : [];

    console.log('Stored Order Items on Add Customer Page:', storedOrderItems); // Debugging line

    if (orderItemsDisplay) {
      orderItemsDisplay.innerHTML = ''; // Clear previous content
      if (storedOrderItems.length === 0) {
        orderItemsDisplay.innerHTML = '<p style="color: #666; text-align: center; margin-top: 10px;">ยังไม่มีรายการสั่งซื้อ</p>';
        if (orderItemCountSpan) orderItemCountSpan.textContent = '0';
      } else {
        if (orderItemCountSpan) orderItemCountSpan.textContent = storedOrderItems.length.toString();

        let allProductsHtml = '';
        storedOrderItems.forEach(item => {
          allProductsHtml += item.products.map(product => `
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; padding-top: 8px; padding-bottom: 4px;">
                  <div>${product.name}</div>
                  <div>${product.quantity}</div>
                  <div>${product.unit}</div>
              </div>
          `).join('');
        });

        orderItemsDisplay.innerHTML = `
            <div style="background: #F5F7F7; border-radius: 8px; padding: 16px; margin-bottom: 12px; display: flex; flex-direction: column;">
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 8px; font-weight: 500;">
                    <div>ชื่อสินค้า</div>
                    <div>จำนวน</div>
                    <div>หน่วย</div>
                </div>
                ${allProductsHtml}
            </div>
        `;

        // Add the edit button here
        const editButtonContainer = document.createElement('div');
        editButtonContainer.style = `display: flex; justify-content: center; margin-top: 15px;`;
        editButtonContainer.innerHTML = `
            <button type="button" id="editOrderItemBtn" style="background: none; border: none; color: #888; cursor: pointer; font-family: 'Prompt', sans-serif; font-size: 0.9rem; display: flex; align-items: center; gap: 5px;">
                <i class="bi bi-pencil"></i> แก้ไขรายการสั่งซื้อ
            </button>
        `;
        orderItemsDisplay.appendChild(editButtonContainer);
        
        // Attach event listener to the dynamically created edit button
        const dynamicallyCreatedEditBtn = orderItemsDisplay.querySelector('#editOrderItemBtn');
        if (dynamicallyCreatedEditBtn) {
            dynamicallyCreatedEditBtn.addEventListener('click', function() {
                window.location.hash = '#add-order-item';
            });
        }
      }
    }
  }

  function showPageByPath() {
    const hash = window.location.hash;
    if (hash === "#add-customer") {
      managementCustomer.mainPage.style.display = "none";
      addCustomerPage.style.display = "";
      addOrderItemPage.style.display = "none";
      renderOrderItemsDisplay();
    } else if (hash === "#add-order-item") {
      managementCustomer.mainPage.style.display = "none";
      addCustomerPage.style.display = "none";
      addOrderItemPage.style.display = "";
    } else {
      managementCustomer.mainPage.style.display = "";
      addCustomerPage.style.display = "none";
      addOrderItemPage.style.display = "none";
      // Reset form when leaving the page
      addCustomerForm.reset();
    }
  }

  function showModal(modal) {
    modal.classList.add('active');
  }
  function hideModal(modal) {
    modal.classList.remove('active');
  }

  function getSelectedDeliveryDays() {
    const checkboxes = document.querySelectorAll('#add-customer-container input[name="delivery"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
  }

  addCustomerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    showModal(confirmAddModal);
  });

  confirmAddBtn.addEventListener('click', function() {
    const name = document.querySelector('#add-customer-container #customerName').value;
    const deliveryDays = getSelectedDeliveryDays();

    // Retrieve pending order items from localStorage
    const pendingOrderItemsJson = localStorage.getItem('orderItems');
    const pendingOrderItems = pendingOrderItemsJson ? JSON.parse(pendingOrderItemsJson) : [];

    if (name && deliveryDays.length > 0) {
      // Create a new customer object
      const newCustomer = {
        name,
        startDeliveryDate: new Date().toISOString().split("T")[0],
        deliveryRounds: deliveryDays.map(day => ({
          roundName: day,
          orders: pendingOrderItems // Assign the pending order items here
        }))
      };

      managementCustomer.customers.push(newCustomer);
      localStorage.setItem('customers', JSON.stringify(managementCustomer.customers)); // Save customers to localStorage
      managementCustomer.renderCustomerTable();
      hideModal(confirmAddModal);
      window.location.hash = "";
      showPageByPath();
      addCustomerForm.reset();

      // Clear the order items from localStorage after they've been associated with a customer
      localStorage.removeItem('orderItems');
    }
  });

  cancelAddModalBtn.addEventListener('click', function() {
    hideModal(confirmAddModal);
  });

  closeConfirmAddModal.addEventListener('click', function() {
    hideModal(confirmAddModal);
  });

  cancelAddCustomerBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showModal(cancelAddModal);
  });

  confirmCancelBtn.addEventListener('click', function() {
    hideModal(cancelAddModal);
    window.location.hash = "";
    showPageByPath();
    addCustomerForm.reset();
  });

  cancelCancelModalBtn.addEventListener('click', function() {
    hideModal(cancelAddModal);
  });

  closeCancelAddModal.addEventListener('click', function() {
    hideModal(cancelAddModal);
  });

  // Listen for hash changes
  window.addEventListener("hashchange", showPageByPath);
  
  // Initial page state
  showPageByPath();

  // Dynamically load add-order-item.html content
  fetch('component/AddGoods/add-order-item.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('add-order-item-page').innerHTML = html;
      initializeAddGoods();
      // ผูก event ปุ่ม back
      const backBtn = document.getElementById('backToOrderList');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          window.location.hash = '#add-customer';
        });
      }
    });

  // Add event listener for addOrderItemBtn
  const addOrderItemBtn = document.getElementById('addOrderItemBtn');
  if (addOrderItemBtn) {
    addOrderItemBtn.addEventListener('click', function() {
      window.location.hash = '#add-order-item';
    });
  }

  // Add event listener for editOrderItemBtn
  const editOrderItemBtn = document.getElementById('editOrderItemBtn');
  if (editOrderItemBtn) {
    editOrderItemBtn.addEventListener('click', function() {
      window.location.hash = '#add-order-item';
    });
  }
} 