const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('navLinks');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');
const attachmentInput = document.getElementById('attachment');
const selectedFiles = document.getElementById('selectedFiles');
let chosenFiles = [];

function syncFileInput() {
  if (!attachmentInput) return;
  const transfer = new DataTransfer();
  chosenFiles.forEach((file) => transfer.items.add(file));
  attachmentInput.files = transfer.files;
}

function renderSelectedFiles() {
  if (!selectedFiles) return;
  selectedFiles.innerHTML = '';

  chosenFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'file-tag';

    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = file.name;
    name.title = file.name;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'file-remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Remove ${file.name}`);
    remove.addEventListener('click', () => {
      chosenFiles.splice(index, 1);
      syncFileInput();
      renderSelectedFiles();
    });

    item.append(name, remove);
    selectedFiles.appendChild(item);
  });
}

if (attachmentInput) {
  attachmentInput.addEventListener('change', () => {
    const incoming = Array.from(attachmentInput.files);
    incoming.forEach((file) => {
      const duplicate = chosenFiles.some((saved) =>
        saved.name === file.name && saved.size === file.size && saved.lastModified === file.lastModified
      );
      if (!duplicate) chosenFiles.push(file);
    });
    syncFileInput();
    renderSelectedFiles();
  });
}

if (quoteForm) {
  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = quoteForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : 'Request My Free Estimate';

    if (formStatus) {
      formStatus.textContent = 'Sending your estimate request...';
      formStatus.classList.remove('success', 'error');
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        let message = 'Form submission failed.';
        try {
          const data = await response.json();
          if (Array.isArray(data.errors) && data.errors.length) {
            message = data.errors.map((error) => error.message).join(' ');
          }
        } catch (_) {}
        throw new Error(message);
      }

      quoteForm.reset();
      chosenFiles = [];
      renderSelectedFiles();

      if (formStatus) {
        formStatus.textContent = 'Thank you! Your estimate request was sent successfully. TWilliams will contact you soon.';
        formStatus.classList.add('success');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (formStatus) {
        formStatus.textContent = `Your request could not be sent. ${error.message || 'Please try again'} or call TWilliams at (606) 309-0535.`;
        formStatus.classList.add('error');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
