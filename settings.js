document.addEventListener('DOMContentLoaded', () => {
  const apiKeysBody = document.getElementById('api-keys-body');
  const apiKeysTable = document.getElementById('api-keys-table');
  const newApiKeyBtn = document.getElementById('new-api-key-btn');
  const modal = document.getElementById('modal');
  const span = document.getElementsByClassName('close')[0];
  const saveApiKeyBtn = document.getElementById('save-api-key-btn');

  // Function to render the API keys table
  function renderApiKeys() {
    chrome.storage.sync.get(['apiKey'], (result) => {
      const apiKeys = result.apiKey ? [result.apiKey] : [];
      apiKeysBody.innerHTML = '';

      if (apiKeys.length > 0) {
        apiKeysTable.classList.remove('hidden');
        newApiKeyBtn.classList.add('hidden');
      } else {
        apiKeysTable.classList.add('hidden');
        newApiKeyBtn.classList.remove('hidden');
      }

      apiKeys.forEach((apiKey, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <button class="delete-btn" data-index="${index}">Delete</button>
          </td>
          <td>${apiKey.secretKey}</td>
          <td>${apiKey.created}</td>
        `;
        apiKeysBody.appendChild(row);

        row.querySelector('.delete-btn').addEventListener('click', () => {
          deleteApiKey(index);
        });
      });
    });
  }

  // Function to add or replace an API key
  function addOrReplaceApiKey() {
    const newApiKey = document.getElementById('new-api-key').value;
    if (newApiKey) {
      const newApiKeyObj = {
        secretKey: `sk-...${newApiKey.slice(-4)}`,
        created: new Date().toLocaleDateString(),
        fullKey: newApiKey
      };

      chrome.storage.sync.set({ apiKey: newApiKeyObj }, () => {
        renderApiKeys();
        modal.style.display = 'none';
      });
    }
  }

  // Function to delete an API key
  function deleteApiKey() {
    chrome.storage.sync.remove('apiKey', () => {
      renderApiKeys();
    });
  }

  // Event listeners
  newApiKeyBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.getElementById('new-api-key').value = '';
    document.querySelector('.modal-content h2').innerText = 'Add API Key';
  });

  saveApiKeyBtn.addEventListener('click', addOrReplaceApiKey);

  span.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  // Initial render
  renderApiKeys();
});
