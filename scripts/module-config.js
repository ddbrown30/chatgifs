export const ID = "chat-gifs";

export const PATH = "modules/chat-gifs";

export const CONFIG = {
    templates: {
        gifSearchBar: `${PATH}/templates/gif-search-bar.hbs`,
    },
    giphy: {
        id: "giphy",
        apiKey: "GBrSvBAfBq4GsBxbtuqwJXhR8OQC3365",
        logo: `${PATH}/assets/giphy.png`,
        url: "https://api.giphy.com/v1/gifs/search",
        placeholderString: "Search Giphy",
        previewGetter: (image) => image.images.preview_gif,
        gifGetter: (image) => image.images.downsized.url,
    },
    tenor: {
        id: "tenor",
        apiKey: "AIzaSyD1io2aYO6UBx3ewSdz674Ks36ASidZy0E",
        logo: `${PATH}/assets/tenor.png`,
        url: "https://tenor.googleapis.com/v2/search",
        placeholderString: "Search Tenor",
        previewGetter: (image) => {
            return {
                url: image.media_formats.nanogif.url,
                width: image.media_formats.nanogif.dims[0],
                height: image.media_formats.nanogif.dims[1],
            };
        },
        gifGetter: (image) => image.media_formats.mediumgif.url,
    },
}
