
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  const giftMobile = document.getElementById('gift-mobile');
  const navBar = document.getElementById('nav-bar');

  menuIcon.addEventListener('click', () => {
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    giftMobile.classList.add('active');
    navBar.classList.add('shadow');
  });

  closeIcon.addEventListener('click', () => {
    closeIcon.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    giftMobile.classList.remove('active');
    navBar.classList.remove('shadow');
  });
