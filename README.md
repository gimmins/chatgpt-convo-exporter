# ChatGPT Conversation Exporter

A simple widget/tool (written in TypeScript) that helps you export entire ChatGPT conversations into a plain text file for easy archiving, sharing, or reference.

## 🚀 What it does

This tool:

- Collects all visible messages from a ChatGPT thread
- Formats them cleanly into a text format
- Lets you download the conversation as a `.txt` file

✅ No more manual copy-pasting block by block  
✅ Great for saving study sessions, code reviews, brainstorms, or interview prep logs

---

## ⚙️ How to use

👉 **Option 1: Browser Console**

1. Open your ChatGPT conversation in the browser.
2. Open DevTools (`Ctrl+Shift+I` or `Cmd+Option+I` → go to Console tab).
3. Paste the compiled JavaScript code (see build instructions below) and run it.
4. The tool will collect messages and trigger a download of the `.txt` file.

👉 **Option 2: (Coming Soon)**  
📌 Userscript / browser extension version (if you decide to package it)

---

## 🛠 How to build (TypeScript)

1️⃣ Clone this repository:

```bash
git clone https://github.com/YOUR_USERNAME/chatgpt-convo-exporter.git
cd chatgpt-convo-exporter

2️⃣ Install dependencies:
npm install

3️⃣ Compile the TypeScript:
npm run build
✅ The compiled JavaScript will appear in the dist/ (or your configured output) folder.

4️⃣ Open the generated JavaScript file, copy its contents, and paste it into your browser console to use.

📦 Example build command (in package.json)
"scripts": {
  "build": "tsc"
}

📝 Notes
	•	This is an early version — works with the current ChatGPT DOM structure as of June 2025.
	•	If OpenAI updates their interface, the selectors may need to be updated.
	•	Feedback, contributions, and improvements are welcome!

💡 Why I built this
I often found it frustrating to save long ChatGPT conversations, especially when the UI made copying tricky. This tool solves that pain point for myself and others who want to archive or review their AI interactions.

📄 License
MIT — free to use, modify, and share.
```
