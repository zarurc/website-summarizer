document.getElementById('summarize-btn').addEventListener('click', async () => {
  const apiKeyObj = await getApiKey();
  if (!apiKeyObj || !apiKeyObj.fullKey) {
    document.getElementById('summary').innerText = 'Error: API Key not found. Please set it in the settings.';
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getSelectedText,
      },
      async (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          document.getElementById('summary').innerText = 'Error: Unable to retrieve selected text.';
          return;
        }

        const selectedText = results[0].result;
        const textToSummarize = selectedText || await getFullPageContent(tabs[0].id);
        const summary = await getSummary(textToSummarize, apiKeyObj.fullKey);
        document.getElementById('summary').innerHTML = formatText(summary);
        await saveToHistory(summary);
        displayHistory();
      }
    );
  });
});

document.getElementById('preview-btn').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getSelectedText,
      },
      async (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          document.getElementById('preview').innerText = 'Error: Unable to retrieve selected text.';
          return;
        }

        const selectedText = results[0].result;
        const textToPreview = selectedText || await getFullPageContent(tabs[0].id);
        document.getElementById('preview').innerText = textToPreview;
      }
    );
  });
});

document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('summary').innerText = '';
  document.getElementById('preview').innerText = '';
});

// Function to get selected text on the page
function getSelectedText() {
  return window.getSelection().toString();
}

// Function to get the full page content if no text is selected
async function getFullPageContent(tabId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => document.body.innerText
  });
  if (chrome.runtime.lastError || !result) {
    return '';
  }
  return result.result;
}

// Function to get the summary from OpenAI API
async function getSummary(text, apiKey) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `Summarize the following text in bullet points:\n\n${text}` }],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    return `Error fetching summary. Please try again. (${error.message})`;
  }
}

// Function to get the API key from storage
async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiKey'], (result) => {
      resolve(result.apiKey);
    });
  });
}

// Function to format text into paragraphs
function formatText(text) {
  const bulletPoints = text.split('\n').map(line => `<li>${line.trim()}</li>`).join('');
  return `<ul>${bulletPoints}</ul>`;
}

// Function to save summary to history
async function saveToHistory(summary) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['history'], (result) => {
      const history = result.history || [];
      history.unshift(summary);
      if (history.length > 10) history.pop();
      chrome.storage.sync.set({ history: history }, () => {
        resolve();
      });
    });
  });
}

// Function to display history
function displayHistory() {
  chrome.storage.sync.get(['history'], (result) => {
    const history = result.history || [];
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';
    history.forEach((item, index) => {
      const truncated = item.split(' ').slice(0, 3).join(' ') + '...';
      const historyItem = document.createElement('div');
      historyItem.classList.add('history-item');
      historyItem.innerHTML = `<span class="summary">${truncated}</span> <button class="delete-btn" data-index="${index}">Delete</button>`;
      historyItem.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) return;
        const isExpanded = historyItem.classList.toggle('expanded');
        historyItem.querySelector('.summary').innerText = isExpanded ? item : truncated;
      });
      historyItem.querySelector('.delete-btn').addEventListener('click', async (event) => {
        event.stopPropagation();
        await deleteFromHistory(index);
        displayHistory();
      });
      historyDiv.appendChild(historyItem);
    });
  });
}

// Function to delete an item from history
async function deleteFromHistory(index) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['history'], (result) => {
      const history = result.history || [];
      history.splice(index, 1);
      chrome.storage.sync.set({ history: history }, () => {
        resolve();
      });
    });
  });
}

// Function to update button text based on whether text is selected
function updateButtonText() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getSelectedText,
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0]) {
          document.getElementById('summarize-btn').innerText = 'Summarize Page';
          document.getElementById('preview-btn').innerText = 'Preview Page';
          return;
        }

        const selectedText = results[0].result;
        document.getElementById('summarize-btn').innerText = selectedText ? 'Summarize Selected Text' : 'Summarize Page';
        document.getElementById('preview-btn').innerText = selectedText ? 'Preview Selected Text' : 'Preview Page';
      }
    );
  });
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  displayHistory();
  updateButtonText();
});
