export const ID = "chatgifs";

export const PATH = "modules/chatgifs";

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
    klipy: {
        id: "klipy",
        apiKey: "2Aj4P6cpuZVq91UFvJ7shctlEcfLS8Q3Iube7H1hDyN9k199wkmPSbGhdOMuIQX1",
        logo: `${PATH}/assets/klipy.png`,
        watermark: `${PATH}/assets/klipy_watermark.png`,
        url: "https://api.klipy.com/v2/search",
        placeholderString: "Search KLIPY",
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
