const socket = io();

if (navigator.geolocation) {
	navigator.geolocation.watchPosition(
		(position) => {
			const { latitude, longitude } = position.coords;
			socket.emit("send-location", { latitude, longitude });
		},
		(error) => {
			console.error(error);
		},
		{
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		}
	);
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution: "CodingSchool",
 maxZoom: 19,
}).addTo(map);

const markers = L.marker([22.55137, 88.37019])
	.addTo(map)
	.bindPopup("Marker 1: Kolkata")
	.openPopup();

 var isConnected = false; // Set this based on actual logic to determine connection status

 if (isConnected) {
     // User is connected, show one marker
     L.marker([22.55137, 88.37019]).addTo(map)
         .bindPopup('User is connected!')
         .openPopup();
 } else {
     // User is disconnected, show two markers
     L.marker([22.55137, 88.37019]).addTo(map)
         .bindPopup('User is disconnected at location 1!').openPopup();

     L.marker([22.55155, 88.37005]).addTo(map)
         .bindPopup('User is disconnected at location 2!');
 }

socket.on("receive-location", (data) => {
	const { id, latitude, longitude } = data;
	map.setView([latitude, longitude], 19);
	if (markers[id]) {
		markers[id].setLatLng([latitude, longitude]);
	} else {
		markers[id] = L.marker([latitude, longitude]).addTo(map);
	}
});

socket.on("user-disconnected", () => {
 if(markers[id]) {
  map.removeLayer(markers[id]);
  delete markers[id];
 }
});

