const socket = io();

if (!navigator.geolocation) {
  alert("Geolocation is not supported by your browser");
}

navigator.geolocation.watchPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("send-location", { latitude, longitude });
  },
  (error) => {
    console.log("💥 ERROR while getting coordinates", error);
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000, // miliseconds
  }
);

const map = L.map("map").setView([0, 0], 20);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Maverick",
}).addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`User ${id}`);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
  console.log("Disconnected from server");
});
