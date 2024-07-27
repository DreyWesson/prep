// script.js
document.addEventListener('DOMContentLoaded', function () {
    const addItemForm = document.getElementById('add-item-form');
    const inventoryBody = document.getElementById('inventory-body');
    let inventory = [];
  
    function renderInventory() {
      inventoryBody.innerHTML = '';
      inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>
            <button class="edit" data-index="${index}">Edit</button>
            <button class="delete" data-index="${index}">Delete</button>
          </td>
        `;
        inventoryBody.appendChild(row);
      });
  
      // Attach event listeners for edit and delete buttons
      document.querySelectorAll('.edit').forEach(button =>
        button.addEventListener('click', handleEditItem)
      );
      document.querySelectorAll('.delete').forEach(button =>
        button.addEventListener('click', handleDeleteItem)
      );
    }
  
    function handleAddItem(event) {
      event.preventDefault();
      const itemName = document.getElementById('item-name').value.trim();
      const itemQuantity = parseInt(document.getElementById('item-quantity').value.trim(), 10);
  
      if (itemName && itemQuantity) {
        inventory.push({ name: itemName, quantity: itemQuantity });
        renderInventory();
        addItemForm.reset();
      }
    }
  
    function handleEditItem(event) {
      const index = event.target.dataset.index;
      const item = inventory[index];
      const newItemName = prompt('Enter new name:', item.name);
      const newItemQuantity = parseInt(prompt('Enter new quantity:', item.quantity), 10);
  
      if (newItemName && newItemQuantity) {
        inventory[index] = { name: newItemName, quantity: newItemQuantity };
        renderInventory();
      }
    }
  
    function handleDeleteItem(event) {
      const index = event.target.dataset.index;
      inventory.splice(index, 1);
      renderInventory();
    }
  
    addItemForm.addEventListener('submit', handleAddItem);
  });
  