import "./popup.css";

document.addEventListener("DOMContentLoaded", () => {
  const apiKeySection = document.getElementById("apiKeySection");
  const summarizeSection = document.getElementById("summarizeSection");

  const apiKeyInput = document.getElementById("apiKeyInput");
  const saveKeyBtn = document.getElementById("saveKeyBtn");

  const submitBtn = document.getElementById("submitBtn");
  const summaryEl = document.getElementById("summary");

  // 🔹 1. Check if API key exists on load
  chrome.storage.local.get(["openaiKey"], (result) => {
    if (result.openaiKey) {
      showSummarizeUI(apiKeySection, summarizeSection);
    } else {
      showApiKeyUI(apiKeySection, summarizeSection);
    }
  });

  // 🔹 2. Save API key
  saveKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    console.log(saveKeyBtn);

    if (!key || !key.startsWith("sk-")) {
      alert("Please enter a valid OpenAI API key.");
      return;
    }

    chrome.storage.local.set({ openaiKey: key }, () => {
      apiKeyInput.value = "";
      showSummarizeUI(apiKeySection, summarizeSection);
    });
  });

  // 🔹 3. Handle Summarize button click
  submitBtn.addEventListener("click", () => {
    showLoading(summaryEl);

    chrome.runtime.sendMessage({
      type: "SUMMARIZE"
    });
  });

  // 🔹 4. Listen for background responses
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SUMMARY_RESULT") {
      renderSummary(summaryEl, msg.summary);
    }

    if (msg.type === "ERROR") {
      renderError(summaryEl, msg.message);
    }
  });
});


// ---------------- UI HELPERS ----------------

function showApiKeyUI(apiKeySection, summarizeSection) {
  apiKeySection.style.display = "block";
  summarizeSection.style.display = "none";
}

function showSummarizeUI(apiKeySection, summarizeSection) {
  apiKeySection.style.display = "none";
  summarizeSection.style.display = "block";
}

function showLoading(element) {
  element.textContent = "Loading...";
}

function renderSummary(element, text) {
  element.textContent = text;
}

function renderError(element, message) {
  element.textContent = "Error: " + message;
}