// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const nav_list = document.querySelectorAll('.nav-list');
    // const mainContent = document.querySelector('.main-content');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        // nav_list.classList.toggle('collapsed');
        nav_list.forEach((child) => {
            console.log(child);
            child.classList.toggle('collapsed')
        })
        // mainContent.classList.toggle('collapsed');
    });
});
