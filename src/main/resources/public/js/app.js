// --- DOM refs ---
const floorUpBtn = document.querySelector("#floorUp");
const floorDownBtn = document.querySelector("#floorDown");
const floorSelect = document.querySelector("#floorSelect");

const floors = document.querySelectorAll(".floor");

const markersEl = document.querySelector("#markers");

const selectedRoomText = document.querySelector("#selectedRoomText");

const roomModal = document.querySelector("#roomModal");

const modalTitle = document.querySelector("#modalTitle");

const dataInput = document.querySelector("#dateInput");

const timeInput = document.querySelector("#timeInput");



// --- State ----
const MIN_FLOOR = 0;
const MAX_FLOOR = 5;

let currentFloor = Number(floorSelect.value);

let rooms = [];

let selectedRoomId = null;

// --- Rendering ---
function render() {
    renderFloors();
    renderMarkers();
}

function renderFloors() {
    floors.forEach(img => {
        const floorNumber = Number(img.dataset.floor);
        img.classList.toggle("is-active", floorNumber === currentFloor);
    });
}

function renderMarkers() {
    document.getElementById("markers").innerHTML = "";
    let roomMarkers = rooms.filter((room) => room.floor === currentFloor);
    roomMarkers.forEach((room) => {
        const marker = createMarker(room);
        markersEl.appendChild(marker);
    });
}




// --- Events ---
floorDownBtn.addEventListener("click", () => {
    currentFloor = Math.max(MIN_FLOOR, currentFloor - 1);
    floorSelect.value = currentFloor;
    render();
});

floorUpBtn.addEventListener("click", () => {
    currentFloor = Math.min(MAX_FLOOR, currentFloor + 1);
    floorSelect.value = currentFloor;
    render();
});

floorSelect.addEventListener("click", () => {
    currentFloor = Number(floorSelect.value);
    render();
});


markersEl.addEventListener("click", () => {
    const marker = event.target.closest(".marker");
    selectedRoomId = marker.dataset.roomId;
    selectedRoomText.innerText = `Room ${selectedRoomId}`;
    modalTitle.innerText = `Book room ${selectedRoomId}`;

    /*let date = document.querySelector("dateInput");
    let time = document.querySelector("timeInput");
    let summary = document.querySelector("summaryText");*/

    roomModal.showModal();

    /*summary.innerText = `Booked ${date} and ${time}`*/
})


// --- functions ---
function createMarker(room) {
    const marker = document.createElement("button");

        marker.type = "button";
        marker.className = "marker";

        marker.style.left = room.xPct + "%";
        marker.style.top = room.yPct + "%";

        marker.dataset.roomId = room.id;
        marker.dataset.label = room.label;

        return marker;

}


function updateSummary(){

}


async function init(){
    try {
        const res = await fetch("/src/main/resources/data/rooms.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        rooms = await res.json();
    } catch (err) {
        console.error("Could not load rooms.json, using fallback.", err);
        rooms = [
            { id: "001", floor: 0, label: "Room 001", xPct: 20, yPct: 60 },
            { id: "301", floor: 3, label: "Room 301", xPct: 62, yPct: 28 },
        ];
    }

    render();
}

init();


