import { CONFIG } from "./module-config.js";

/*
Class for managing the behaviour of the search bar
*/
export default class GifSearchBar {
    limit = 100;
    visibility = false;

    constructor(element, gifButtonElement) {
        this.element = element;
        this.resultsElement = element.querySelector("#gif-search-results");
        this.attributionImg = this.element.querySelector(".attribution");
        this.activateListeners(gifButtonElement);
        this.setSearchTab("tenor");
    }

    activateListeners(gifButtonElement) {
        gifButtonElement.addEventListener("click", () => {
            this.toggleVisibility();
        });

        this.searchInput = this.element.querySelector("#gif-search-input");
        this.searchInput.addEventListener("input", (ev) => {
            this.search((ev.target).value);
        });

        this.giphyTab = this.element.querySelector("#giphy-tab");
        this.giphyTab.addEventListener("click", () => {
            this.setSearchTab("giphy");
        });

        this.tenorTab = this.element.querySelector("#tenor-tab");
        this.tenorTab.addEventListener("click", () => {
            this.setSearchTab("tenor");
        });

        //Close the popup if we click outside of it
        document.addEventListener("mousedown", this.clickListener = (event) => {
            if (!event.composedPath().includes(this.element) &&
                !event.composedPath().includes(gifButtonElement)) {
                this.toggleVisibility(false);
            }
        }, { passive: true });
    }

    toggleVisibility(visibility) {
        this.visibility = visibility ?? !this.visibility;
        if (this.visibility) {
            this.element.classList.remove("gif-hidden");
            this.element.classList.add("slide-in-bottom");
            this.searchInput.focus();
        } else {
            this.element.classList.remove("slide-in-bottom");
            this.element.classList.add("gif-hidden");
            this.searchInput.value = "";
            this.resultsElement.innerHTML = "";
            this.resultsElement.style.height = "0";
        }
    }

    setSearchTab(tabName) {
        this.apiData = tabName == "giphy" ? CONFIG.giphy : CONFIG.tenor;

        //Update the attribution logo and placeholder string
        this.attributionImg.src = this.apiData.logo;
        this.searchInput.placeholder = this.apiData.placeholderString;

        if (tabName == "giphy") {
            this.giphyTab.classList.add("active");
            this.tenorTab.classList.remove("active");
        } else if (tabName == "tenor") {
            this.tenorTab.classList.add("active");
            this.giphyTab.classList.remove("active");
        }

        if (this.searchInput.value) {
            //If we already have text in the search, run a new search with the new api
            this.search(this.searchInput.value);
        }
    }

    async search(inputText) {
        const url = new URL(this.apiData.url);
        var params = {
            q: inputText,
            api_key: this.apiData.apiKey, //Used by Giphy
            key: this.apiData.apiKey, //Used by Tenor
            limit: this.limit,
        };
        url.search = new URLSearchParams(params).toString();

        try {
            let response = await foundry.utils.fetchWithTimeout(url);
            const result = await response.json();
            this.populateImages(this.apiData.id == "giphy" ? result.data : result.results);
        } catch (error) {
            console.error(error);
        }
    }

    populateImages(images) {
        const searchResults = this.resultsElement;
        searchResults.innerHTML = "";

        const xMargin = 5;
        const yGap = 10;
        const columnWidth = (searchResults.offsetWidth / 2);
        const imageWidth = columnWidth - (xMargin * 2);
        const leftX = 0;
        const rightX = imageWidth + (xMargin * 2);

        let leftColumn = true;
        let leftY = 0;
        let rightY = 0;

        images.forEach((image) => {
            const previewImage = this.apiData.previewGetter(image);

            const gif = document.createElement("img");
            gif.src = previewImage.url;

            gif.style.left = `${leftColumn ? leftX : rightX}px`;
            gif.style.top = `${leftColumn ? leftY : rightY}px`;
            gif.style.width = `${imageWidth}px`;

            //Calculate how much we modified the width of the image and adjust the height to match
            const widthPercent = imageWidth / previewImage.width;
            const height = previewImage.height * widthPercent;
            gif.style.height = `${height}px`;

            //Update the height of the current column
            if (leftColumn) {
                leftY += height + yGap;
            } else {
                rightY += height + yGap;
            }

            //The next column will be whichever one is higher
            leftColumn = leftY <= rightY;

            gif.addEventListener("click", () => {
                this.createChatMessage(this.apiData.gifGetter(image));
                this.toggleVisibility();
            });

            searchResults.appendChild(gif);
        });

        //Update the height to be the actual size of the list
        searchResults.style.height = `${Math.max(leftY, rightY)}px`;
    }

    createChatMessage(content) {
        const messageData = {
            content: `<div class="gif-container"><img src="${content}"></div>`,
            style: CONST.CHAT_MESSAGE_STYLES.OOC || 1,
        };

        return ChatMessage.create(messageData);
    }
}
