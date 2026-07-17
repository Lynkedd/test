const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('navLinks');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));
}

const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Replace this with the real TWilliams destination email before launch.
    const destinationEmail = 'lynked5m@gmail.com';
    const data = new FormData(quoteForm);
    const subject = `TWilliams estimate request — ${data.get('projectType') || 'Custom project'}`;
    const body = [
      `Name: ${data.get('firstName')} ${data.get('lastName')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone')}`,
      `Project type: ${data.get('projectType')}`,
      `Project address: ${data.get('address') || 'Not provided'}`,
      `City / location: ${data.get('location')}`,
      `Preferred timeline: ${data.get('timeline') || 'Not provided'}`,
      `Approximate budget: ${data.get('budget') || 'Not provided'}`,
      '',
      'Project description:',
      data.get('details'),
      '',
      'Note: Photos selected in the browser are not attached by the email fallback. Connect a hosted form service to support uploads.'
    ].join('\n');

    if (formStatus) formStatus.textContent = 'Opening your email application…';
    window.location.href = `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
