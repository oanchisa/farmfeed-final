document.addEventListener('DOMContentLoaded', () => {
  const productListContainer = document.getElementById('product-list-container');

  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Fetch response received', response);
      return response.json();
    })
    .then(products => {
      console.log('Products data received:', products);
      products.forEach(product => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #eee';

        const nameCell = document.createElement('td');
        nameCell.style.padding = '8px';
        nameCell.style.textAlign = 'left';
        nameCell.style.width = '50%';
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        const quantityCell = document.createElement('td');
        quantityCell.style.padding = '8px';
        quantityCell.style.textAlign = 'left';
        quantityCell.style.width = '50%';
        quantityCell.style.display = 'flex';
        quantityCell.style.alignItems = 'center';
        quantityCell.style.gap = '5px';

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'โปรดระบุจำนวนที่สั่งซื้อ';
        if (product.quantity !== null) {
          input.value = product.quantity;
        }
        input.style.flexGrow = '1';
        input.style.padding = '5px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #ccc';
        input.style.boxSizing = 'border-box';
        quantityCell.appendChild(input);

        const unitSpan = document.createElement('span');
        unitSpan.style.color = '#888';
        unitSpan.style.whiteSpace = 'nowrap';
        unitSpan.textContent = product.unit;
        quantityCell.appendChild(unitSpan);

        row.appendChild(quantityCell);
        productListContainer.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching products:', error));
}); 