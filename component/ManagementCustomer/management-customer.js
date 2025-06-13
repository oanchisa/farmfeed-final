// Management Customer Component Script
export function initializeManagementCustomer() {
  const addClientBtn = document.querySelector('#management-customer-container #addClientBtn');
  const clientTableBody = document.querySelector('#management-customer-container #clientTableBody');
  const perPageShowing = document.querySelector('#management-customer-container .showing');
  const mainPage = document.querySelector('#management-customer-container .main');
  const deleteHeaderBtn = document.querySelector('#management-customer-container .delete-header-btn');
  const deleteSelectedModal = document.getElementById('deleteSelectedModal');
  const closeDeleteSelectedModal = document.getElementById('closeDeleteSelectedModal');
  const cancelDeleteModalBtn = document.getElementById('cancelDeleteModalBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const perPageSelect = document.querySelector('#management-customer-container .per-page select');
  const pageControls = document.querySelector('#management-customer-container .page-controls');

  let customers = JSON.parse(localStorage.getItem('customers')) || [];

  let selectedRows = new Set();
  const tableTitle = document.querySelector('#management-customer-container #tableTitle');
  const tableSummary = document.querySelector('#management-customer-container #tableSummary');
  const selectAllCheckbox = document.querySelector('#management-customer-container #selectAllCheckbox');
  let currentPage = 1;
  let itemsPerPage = 12;

  function showModal(modal) {
    modal.classList.add('active');
  }

  function hideModal(modal) {
    modal.classList.remove('active');
  }

  function updateShowing() {
    const totalItems = customers.length;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const displayedItems = endItem - startItem + 1;
    perPageShowing.innerHTML = `<span style=\"color: gray;\">กำลังแสดง</span> ${displayedItems > 0 ? displayedItems : 0} จาก ${totalItems}`;
  }

  function updateSummary() {
    const totalCustomers = customers.length;
    let totalQuantity = 0;
    
    customers.forEach(customer => {
      customer.deliveryRounds.forEach(round => {
        round.orders.forEach(order => {
          order.products.forEach(product => {
            totalQuantity += product.quantity;
          });
        });
      });
    });

    const summaryElement = document.querySelector('#management-customer-container #tableSummary');
    summaryElement.innerHTML = `
      <span>จำนวนลูกค้าทั้งหมด : <b style="color: #20B885;">${totalCustomers}</b></span>
      <span>จำนวนสินค้าที่ต้องการทั้งหมด (กิโลกรัม) : <b style="color: #20B885;">${totalQuantity}</b></span>
    `;
  }

  function updateHeader() {
    if (selectedRows.size > 0) {
      tableTitle.textContent = `รายการที่เลือก : ${selectedRows.size}`;
      // เปลี่ยน checkbox หัวตารางเป็นขีดกลางถ้ามีเลือกบางส่วน
      if (selectedRows.size === customers.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
      } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
      }
      tableSummary.style.display = 'none';
      deleteHeaderBtn.style.display = 'block';
    } else {
      tableTitle.textContent = 'รายการลูกค้า';
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
      tableSummary.style.display = '';
      deleteHeaderBtn.style.display = 'none';
    }
  }

  function updatePagination() {
    const totalItems = customers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    perPageShowing.innerHTML = `<span style=\"color: gray;\">กำลังแสดง</span> ${endItem} จาก ${totalItems}`;
    
    let pageNumbersHTML = '';
    
    pageNumbersHTML += `
      <button class="prev-page ${currentPage === 1 ? 'disabled' : ''}" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="bi bi-chevron-left"></i> ก่อนหน้า
      </button>
    `;
    
    if (totalPages === 0) {
      pageNumbersHTML += `<span class="page-num active-page">1</span>`;
    } else {
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
          pageNumbersHTML += `<span class="page-num ${i === currentPage ? 'active-page' : ''}">${i}</span>`;
        } else if (
          i === currentPage - 3 ||
          i === currentPage + 3
        ) {
          pageNumbersHTML += '<span class="ellipsis">...</span>';
        }
      }
    }
    
    pageNumbersHTML += `
      <button class="next-page ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}" ${(currentPage === totalPages || totalPages === 0) ? 'disabled' : ''}>
        ถัดไป <i class="bi bi-chevron-right"></i>
      </button>
    `;
    
    pageControls.innerHTML = pageNumbersHTML;
    
    const pageNums = pageControls.querySelectorAll('.page-num');
    pageNums.forEach(num => {
      num.addEventListener('click', () => {
        currentPage = parseInt(num.textContent);
        renderCustomerTable();
      });
    });
    
    const prevBtn = pageControls.querySelector('.prev-page');
    const nextBtn = pageControls.querySelector('.next-page');
    
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderCustomerTable();
      }
    });
    
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderCustomerTable();
      }
    });
  }

  perPageSelect.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderCustomerTable();
  });

  function renderCustomerTable() {
    clientTableBody.innerHTML = "";
    if (customers.length === 0) {
      clientTableBody.innerHTML =
        `<tr><td colspan="6" class="empty-row" style="text-align: center; padding: 2rem; width: 100%; display: table-cell;">กรุณาเพิ่มรายการ ลูกค้า เพื่อดำเนินการต่อ</td></tr>`;
      updateShowing();
      updateSummary();
      updatePagination();
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, customers.length);
    const currentPageCustomers = customers.slice(startIndex, endIndex);

    currentPageCustomers.forEach((customer, idx) => {
      let totalQty = 0;
      customer.deliveryRounds.forEach((round) => {
        round.orders.forEach((order) => {
          order.products.forEach((product) => {
            totalQty += product.quantity;
          });
        });
      });
      const nextRound = customer.deliveryRounds[0]?.roundName || "-";
      const isSelected = selectedRows.has(startIndex + idx);
      const row = document.createElement("tr");
      row.className = isSelected ? "row-selected" : "";
      row.innerHTML = `
        <td style="width: 10px; text-align: right; padding-right: 5px;"><input type="checkbox" class="row-checkbox" ${isSelected ? 'checked' : ''}/></td>
        <td style="width: 80px; text-align: left;">${startIndex + idx + 1}</td>
        <td style="width: 200px; text-align: left;">${customer.name}</td>
        <td style="width: 300px; text-align: left;">${totalQty}</td>
        <td style="width: 230px; text-align: left;">${nextRound}</td>
        <td style="width: 80px; text-align: center;">
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <button class="icon-btn" title="รายละเอียด" style="color: #20B885; background: none; border: none; font-size: 1.2rem; padding: 4px;">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <button class="icon-btn" title="แก้ไข" style="color: #20B885; background: none; border: none; font-size: 1.2rem; padding: 4px;">
              <i class="fa-solid fa-pen"></i>
            </button>
          </div>
        </td>
      `;
      row.querySelector('.row-checkbox').addEventListener('change', (e) => {
        if (e.target.checked) {
          selectedRows.add(startIndex + idx);
        } else {
          selectedRows.delete(startIndex + idx);
        }
        renderCustomerTable();
        updateHeader();
      });
      clientTableBody.appendChild(row);
    });
    updateShowing();
    updateSummary();
    updatePagination();
  }

  selectAllCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      customers.forEach((_, idx) => selectedRows.add(idx));
    } else {
      selectedRows.clear();
    }
    renderCustomerTable();
    updateHeader();
  });

  deleteHeaderBtn.addEventListener('click', () => {
    if (selectedRows.size > 0) {
      showModal(deleteSelectedModal);
    }
  });

  confirmDeleteBtn.addEventListener('click', () => {
    const indicesToDelete = Array.from(selectedRows).sort((a, b) => b - a);
    
    indicesToDelete.forEach(index => {
      customers.splice(index, 1);
    });
    
    selectedRows.clear();
    
    renderCustomerTable();
    updateHeader();
    hideModal(deleteSelectedModal);
  });

  cancelDeleteModalBtn.addEventListener('click', () => {
    hideModal(deleteSelectedModal);
  });

  closeDeleteSelectedModal.addEventListener('click', () => {
    hideModal(deleteSelectedModal);
  });

  addClientBtn.addEventListener("click", () => {
    window.location.hash = "#add-customer";
  });

  deleteHeaderBtn.style.display = 'none';
  renderCustomerTable();
  updateHeader();
  
  return {
    customers,
    renderCustomerTable,
    mainPage
  };
} 