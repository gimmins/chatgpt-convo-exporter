"use strict";
function scrapeChat() {
    const turnNodes = document.querySelectorAll('article[data-testid^="conversation-turn"]');
    const chat = [];
    turnNodes.forEach(turn => {
        if (turn.querySelector(".bg-token-message-surface")) {
            chat.push({
                sender: "user",
                content: turn.innerText.trim(),
            });
        }
        else if (turn.querySelector(".markdown.prose")) {
            chat.push({
                sender: "assistant",
                content: turn.innerText.trim(),
            });
        }
    });
    return chat;
}
function exportChatAsText(chat, filename) {
    const text = chat
        .map(msg => `----- ${msg.sender.toUpperCase()} -----\n${msg.content}`)
        .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
function createAndInjectExportButton() {
    if (document.querySelector(".chat-export-button")) {
        return; // Already exists
    }
    // Create the button container
    const button = document.createElement("div");
    button.className = "chat-export-button";
    // Create icon
    const icon = document.createElement("img");
    const isNightMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    icon.src = chrome.runtime.getURL(isNightMode
        ? "assets/openai-export-icon-white.svg"
        : "assets/openai-export-icon.svg");
    icon.alt = "OpenAI Icon";
    icon.className = "chat-export-icon";
    // Apply night mode styles if needed
    if (isNightMode) {
        button.classList.add("night-mode");
    }
    // Create text
    const text = document.createElement("span");
    text.className = "chat-export-text";
    text.textContent = "Export to Text";
    // Build structure
    button.appendChild(icon);
    button.appendChild(text);
    document.body.appendChild(button);
    // Event handlers
    button.addEventListener("mouseenter", () => {
        button.classList.add("expanded");
    });
    button.addEventListener("mouseleave", () => {
        button.classList.remove("expanded");
    });
    button.addEventListener("click", () => {
        const chat = scrapeChat();
        // Try to find the thread title
        let title = document.title || "chat_export";
        // Fallback: use date/time if no usable title
        if (!title || title.trim() === "") {
            const now = new Date();
            title = `chat_export_${now.toISOString().replace(/[:.]/g, "-")}`;
        }
        // Sanitize title for filename safety
        const safeTitle = title
            .replace(/[^a-z0-9_\- ]/gi, "") // remove illegal filename characters
            .replace(/\s+/g, "_") // replace spaces with underscores
            .toLowerCase();
        exportChatAsText(chat, safeTitle);
    });
    // Add styles
    if (!document.getElementById("chat-export-styles")) {
        const style = document.createElement("style");
        style.id = "chat-export-styles";
        style.textContent = `
      .chat-export-button {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        border: 1px solid black;
        border-radius: 8px;
        background: white;
        box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        overflow: hidden;
        cursor: pointer;
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, "Helvetica Neue", Arial, sans-serif;
        transition: width 0.3s ease;
      }
      .chat-export-button.night-mode {
        background: #333;
        border-color: white;
        box-shadow: 2px 2px 4px rgba(255,255,255,0.2);
      }
      .chat-export-button.expanded {
        width: 150px;
      }
      .chat-export-icon {
        position: absolute;
        width: 25px;
        height: 25px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: spin 4s linear infinite;
        opacity: 1;
        transition: opacity 0.3s ease;
      }
      .chat-export-button.expanded .chat-export-icon {
        opacity: 0;
      }
      .chat-export-text {
        position: absolute;
        width: 150px;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .chat-export-button.expanded .chat-export-text {
        opacity: 1;
      }
      @keyframes spin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
        document.head.appendChild(style);
    }
}
// Set up MutationObserver to keep button alive
const observer = new MutationObserver(() => {
    console.log("Content script is running!");
    createAndInjectExportButton();
});
observer.observe(document.body, { childList: true, subtree: true });
// Initial injection
createAndInjectExportButton();
