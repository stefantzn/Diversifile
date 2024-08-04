import AddOnSdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

const IMAGES = new Map([
    ["tsla.png", "images/tsla.png"],
    ["metv.png", "images/metv.png"],
    ["amzn.png", "images/amzn.png"],
    ["air.png", "images/air.png"],
    ["aapl.png", "images/aapl.png"]
]);

let gallery;

// Wait for the SDK to be ready before rendering elements in the DOM.
AddOnSdk.ready.then(async () => {
    gallery = document.getElementById('gallery');

    // Register event handler for "dragstart" event
    AddOnSdk.app.on("dragstart", startDrag);
    // Register event handler for "dragend" event
    AddOnSdk.app.on("dragend", endDrag);

    // Add event listener to the search bar
    document.getElementById('search').addEventListener('input', filterImages);
});

/**
 * Add image to the document.
 */
async function addToDocument(event) {
    const url = event.currentTarget.src;
    const blob = await getBlob(url);
    AddOnSdk.app.document.addImage(blob);
}

/**
 * Handle "dragstart" event
 */
function startDrag(eventData) {
    console.log("The drag event has started for", eventData.element.id);
}

/**
 * Handle "dragend" event
 */
function endDrag(eventData) {
    if (!eventData.dropCancelled) {
        console.log("The drag event has ended for", eventData.element.id);
    } else {
        console.log("The drag event was cancelled for", eventData.element.id);
    }
}

/**
 * Get the binary object for the image.
 */
async function getBlob(url) {
    return await fetch(url).then(response => response.blob());
}

/**
 * Filter images based on the search input.
 */
function filterImages() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    gallery.innerHTML = ''; // Clear gallery before filtering

    // Convert searchTerm to image name format (e.g., "amzn" to "amzn.png")
    const searchId = searchTerm + '.png';
    
    if (IMAGES.has(searchId)) {
        const url = IMAGES.get(searchId);
        const image = document.createElement("img");
        image.id = searchId;
        image.src = url;
        image.style.maxWidth = "300px"; // Set the max-width to 200 pixels
        image.style.height = "auto"; // Maintain aspect ratio
        image.addEventListener("click", addToDocument);

        // Enable drag to document for the image.
        AddOnSdk.app.enableDragToDocument(image, {
            previewCallback: element => {
                return new URL(element.src);
            },
            completionCallback: async (element) => {
                return [{ blob: await getBlob(element.src) }];
            }
        });

        gallery.appendChild(image);
    }
}
