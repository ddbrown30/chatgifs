import GifSearchBar from "./gif-search-bar.js";
import { CONFIG } from "./module-config.js";


export class HooksManager {
    /**
     * Registers hooks
     */
    static registerHooks() {

        Hooks.on("renderChatLog", async (app, html, options) => {
            if (document.querySelector('[id="gif-search"]')) return;

            //Create the gif search bar element
            const template = document.createElement('template');
            template.innerHTML = await foundry.applications.handlebars.renderTemplate(CONFIG.templates.gifSearchBar);
            const gifSearchBar = template.content.firstChild;

            //Attach the search bar to the chat
            const chatControls = document.querySelector('[id="chat-controls"]');
            chatControls.appendChild(gifSearchBar);

            //Create the button to open the search bar
            const button = document.createElement("button");
            button.title = "Search GIF";
            button.classList.add("ui-control", "icon", "fas", "fa-gif");
            button.type = "button";

            //Add the button before the chat control buttons
            const messageModes = chatControls.querySelector('[id="message-modes"]');
            chatControls.insertBefore(button, messageModes.nextSibling);

            new GifSearchBar(gifSearchBar, button);
        });
    }
}