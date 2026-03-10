// background.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // ------------------------------
  // 1️⃣ Popup requested summarization
  // ------------------------------
  if (message.type === "SUMMARIZE") {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

      if (!tabs || tabs.length === 0) {
        chrome.runtime.sendMessage({
          type: "ERROR",
          message: "No active tab found."
        });
        return;
      }

      const tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, {
        type: "REQUEST_PAGE_TEXT"
      });

    });
  }

  // ------------------------------
  // 2️⃣ Content script returned page text
  // ------------------------------
  if (message.type === "PAGE_TEXT") {

    const extractedText = message.text;

    if (!extractedText || extractedText.length === 0) {
      chrome.runtime.sendMessage({
        type: "ERROR",
        message: "No readable content found."
      });
      return;
    }

    // 🔹 Call OpenAI
    generateSummary(extractedText);
  }

  // ------------------------------
  // 3️⃣ Forward errors
  // ------------------------------
  if (message.type === "ERROR") {
    chrome.runtime.sendMessage({
      type: "ERROR",
      message: message.message
    });
  }

});


// ------------------------------
// OpenAI API CALL
// ------------------------------

async function generateSummary(text) {

  try {

    // Get API key from storage
    const result = await chrome.storage.local.get(["openaiKey"]);
    const apiKey = result.openaiKey;

    if (!apiKey) {
      chrome.runtime.sendMessage({
        type: "ERROR",
        message: "OpenAI API key not found."
      });
      return;
    }

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },

      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You summarize webpages clearly and concisely."
          },
          {
            role: "user",
            content: `Summarize the following webpage in under 400 words:\n\n${text}. This may also conatin some random words which are not related to the main content of the page and rather those words are associated with the buttons on webpage you need to recognize them and ignore them`
          }
        ],
        temperature: 0.3
      })

    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("Invalid response from OpenAI");
    }

    const summary = data.choices[0].message.content;

    chrome.runtime.sendMessage({
      type: "SUMMARY_RESULT",
      summary: summary
    });

  } catch (error) {

    chrome.runtime.sendMessage({
      type: "ERROR",
      message: "Failed to generate summary."
    });

  }

}