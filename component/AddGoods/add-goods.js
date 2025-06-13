export function initializeAddGoods() {
    const addOrderItemBtn = document.getElementById('addOrderItem');
    const editOrderItemBtn = document.getElementById('editOrderItem');
    const orderItemsContainer = document.getElementById('order-items-container');
    const orderItemCountSpan = document.getElementById('order-item-count');
    const backToAddCustomerBtn = document.getElementById('backToAddCustomer');

    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];

    function renderOrderItems() {
        if (!orderItemsContainer) {
            console.error('orderItemsContainer not found');
            return;
        }
        orderItemsContainer.innerHTML = ''; // Clear existing items
        if (orderItems.length === 0) {
            if (orderItemCountSpan) {
                orderItemCountSpan.textContent = '0';
            }
            return;
        }

        if (orderItemCountSpan) {
            orderItemCountSpan.textContent = orderItems.length;
        }

        orderItems.forEach((item, index) => {
            const orderItemDiv = document.createElement('div');
            orderItemDiv.className = 'order-item-card';
            orderItemDiv.style = `background: #F5F7F7; border-radius: 8px; padding: 16px; margin-bottom: 12px; display: flex; flex-direction: column;`;

            orderItemDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 8px; font-weight: 500;">
                    <div>ชื่อสินค้า <i class="bi bi-arrow-down"></i></div>
                    <div>จำนวน</div>
                    <div></div>
                </div>
                ${item.products.map(product => `
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px; padding-top: 8px; padding-bottom: 4px;">
                        <div>${product.name}</div>
                        <div>${product.quantity}</div>
                        <div>${product.unit}</div>
                    </div>
                `).join('')}
            `;
            orderItemsContainer.appendChild(orderItemDiv);
        });

        document.querySelectorAll('.delete-order-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.currentTarget.dataset.index);
                deleteOrderItem(index);
            });
        });
    }

    function addOrderItem() {
        // For now, add a placeholder order item to demonstrate
        const newOrderItem = {
            date: '20 ก.พ. 2567',
            startDate: '4 เม.ย. 2567',
            products: [
                { name: 'กวางตุ้ง', quantity: 2, unit: 'กิโลกรัม' },
                { name: 'กะเพรา', quantity: 5, unit: 'กิโลกรัม' },
                { name: 'สลัดโอ๊คเขียว', quantity: 10, unit: 'กิโลกรัม' }
            ]
        };
        orderItems.push(newOrderItem);
        renderOrderItems();
    }

    function deleteOrderItem(index) {
        orderItems.splice(index, 1);
        renderOrderItems();
    }

    if (addOrderItemBtn) {
        addOrderItemBtn.addEventListener('click', () => {
            window.location.hash = '#add-order-item';
        });
    }

    const cancelAddItemBtn = document.getElementById('cancelAddItem');
    if (cancelAddItemBtn) {
        cancelAddItemBtn.addEventListener('click', () => {
            window.location.hash = '#add-customer'; // Go back to add-customer page
        });
    }

    const saveAddItemBtn = document.getElementById('saveAddItem');
    if (saveAddItemBtn) {
        saveAddItemBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission

            const orderDateInput = document.getElementById('orderDate');
            const deliveryStartDateInput = document.getElementById('deliveryStartDate');
            const productListContainer = document.getElementById('product-list-container');

            const orderDate = orderDateInput ? orderDateInput.value : '';
            const deliveryStartDate = deliveryStartDateInput ? deliveryStartDateInput.value : '';

            const products = [];
            if (productListContainer) {
                const productRows = productListContainer.querySelectorAll('tr');
                productRows.forEach(row => {
                    const nameCell = row.querySelector('td:nth-child(1)');
                    const quantityInput = row.querySelector('td:nth-child(2) input');
                    const unitSpan = row.querySelector('td:nth-child(2) span');

                    if (nameCell && quantityInput && unitSpan) {
                        products.push({
                            name: nameCell.textContent,
                            quantity: parseFloat(quantityInput.value) || 0,
                            unit: unitSpan.textContent
                        });
                    }
                });
            }

            const newOrderItem = {
                date: orderDate,
                startDate: deliveryStartDate,
                products: products
            };

            orderItems.push(newOrderItem);
            localStorage.setItem('orderItems', JSON.stringify(orderItems));

            alert('รายการสั่งซื้อถูกบันทึกแล้ว!'); // Confirmation message
            window.location.hash = '#add-customer'; // Go back to add-customer page after saving
        });
    }

    if (editOrderItemBtn) {
        editOrderItemBtn.addEventListener('click', () => {
            console.log('Edit Order Item button clicked');
            // Implement edit logic here later
        });
    }

    // Add back button functionality
    if (backToAddCustomerBtn) {
        backToAddCustomerBtn.addEventListener('click', () => {
            window.location.href = '#add-customer';
        });
    }

    // Initial render in case there are pre-existing items (e.g., from a loaded customer data)
    renderOrderItems();

    // Add an initial placeholder order item when the page loads
    addOrderItem();
} 