const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('navLinks');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
