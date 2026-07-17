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
const attachmentInput = document.getElementById('attachment');
const selectedFiles = document.getElementById('selectedFiles');
const uploadSummary = document.getElementById('uploadSummary');
const photoNote = document.getElementById('photoNote');
let chosenFiles = [];

function syncFileInput() {
  if (!attachmentInput || typeof DataTransfer === 'undefined') return;
  const transfer = new DataTransfer();
  chosenFiles.forEach((file) => transfer.items.add(file));
  attachmentInput.files = transfer.files;
}

function updatePhotoNote() {
  if (!photoNote) return;
  photoNote.value = chosenFiles.length
    ? `${chosenFiles.length} project photo(s) were selected on the website but are not attached to this submission. Please contact the customer to request them by email.`
    : 'No project photos were selected.';
}

function renderSelectedFiles() {
  if (!selectedFiles) return;
  selectedFiles.innerHTML = '';

  if (uploadSummary) {
    uploadSummary.textContent = chosenFiles.length
      ? `${chosenFiles.length} file${chosenFiles.length === 1 ? '' : 's'} selected`
      : 'No files selected';
  }

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
      updatePhotoNote();
    });

    item.append(name, remove);
    selectedFiles.appendChild(item);
  });
}

if (attachmentInput) {
  attachmentInput.addEventListener('change', () => {
    const incoming = Array.from(attachmentInput.files || []);
    incoming.forEach((file) => {
      const duplicate = chosenFiles.some((saved) =>
        saved.name === file.name &&
        saved.size === file.size &&
        saved.lastModified === file.lastModified
      );
      if (!duplicate) chosenFiles.push(file);
    });
    syncFileInput();
    renderSelectedFiles();
    updatePhotoNote();
  });
}

// Do not intercept submission. The browser sends a normal POST directly to
// Formspree, which is the most reliable setup for a static GitHub Pages site.
if (quoteForm) {
  quoteForm.addEventListener('submit', () => {
    updatePhotoNote();
    const submitButton = quoteForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
  });
}
