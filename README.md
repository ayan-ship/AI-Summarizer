# AI SUMMARIZER

## Project Overview 

This chrome extension extract the content of your webpage and summarizes it for you
using an AI model

The extension follows a message-passing architecture between the content script, background script, and popup interface


## Features

>Extract webpage text automatically
>sends the page to ackground services
>Genartes AI-powerd summaries
>Displays summarized output inside the extension popup

## Tech Stack

>JavaScript
>Chrome Extension APIs
>Vite (build tool)
>Fetch API for AI requests


## How to run this on your device?

### Clone the repository

git clone https://github.com/ayan-ship/AI-Summarizer.git

### Install Dependencies

npm install

### Build the extension

npm run build

### Loading the extension in chrome

1.Open Chrome
2.Go to chrome://extensions
3.Enable Developer Mode
4.Click Load Unpacked
5.Select the dist folder

## Future Improvement

>User would be able to talk to the webpage and ask relevant question to the AI 
>User would not need to generate the your own api-key rather I will use my own api-key and user and directly talk to the AI without much hassel
