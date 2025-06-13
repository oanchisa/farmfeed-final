// Sidebar Component Script
export function initializeSidebar() {
  const sidebarButtons = document.querySelectorAll('#sidebar-container .sidebar-btn');
  
  sidebarButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      sidebarButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      // Handle page navigation if needed
      const page = button.getAttribute('data-page');
      if (page) {
        window.location.hash = page;
      }
    });
  });
} 
 