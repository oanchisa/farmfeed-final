// Import component modules
import { initializeSidebar } from './component/Sidebar/sidebar.js';
import { initializeManagementCustomer } from './component/ManagementCustomer/management-customer.js';
import { initializeAddCustomer } from './component/AddCustomer/add-customer.js';

// Wait for both DOM content and components to load
async function initializeApp() {
  // Wait for components to load
  await Promise.all([
    new Promise(resolve => {
      const checkSidebar = setInterval(() => {
        if (document.querySelector('#sidebar-container .sidebar')) {
          clearInterval(checkSidebar);
          resolve();
        }
      }, 100);
    }),
    new Promise(resolve => {
      const checkManagement = setInterval(() => {
        if (document.querySelector('#management-customer-container .main')) {
          clearInterval(checkManagement);
          resolve();
        }
      }, 100);
    }),
    new Promise(resolve => {
      const checkAddCustomer = setInterval(() => {
        if (document.querySelector('#add-customer-container .add-customer-page')) {
          clearInterval(checkAddCustomer);
          resolve();
        }
      }, 100);
    })
  ]);

  // Initialize components
  initializeSidebar();
  const managementCustomer = initializeManagementCustomer();
  initializeAddCustomer(managementCustomer);
}

// Start the app
document.addEventListener("DOMContentLoaded", initializeApp);
