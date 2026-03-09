
// contentScript.js

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // If background asks for page text
  if (message.type === "REQUEST_PAGE_TEXT") {

    try {

      // Extract visible text from the webpage
      const pageText = document.body.innerText;

      // Limit size to avoid huge payloads (important)
      const trimmedText = pageText.substring(0, 15000);

      // Send extracted text back to background
      chrome.runtime.sendMessage({
        type: "PAGE_TEXT",
        text: trimmedText
      });

    } catch (error) {

      chrome.runtime.sendMessage({
        type: "ERROR",
        message: "Failed to extract page text."
      });

    }
  }

});


