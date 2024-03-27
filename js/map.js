//Initialise map globally
let map = L.map("map", { zoomControl: false }).setView([0, 0], 13);

//on button click, get inputted IP, put it through API, retrieve data, show the data on screen.
function ipData() {
  let ip = document.getElementById("userInput").value;

  fetch(
    `https://api.ipdata.co/${ip}?api-key=ba1f6c5d8c1a3f43364da6d257d8d0d4414f198dc3eff1e1d1e47c3a`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data received:", data);

      let locData = document.getElementById("locationData");
      let timeData = document.getElementById("timeData");
      let ispData = document.getElementById("ispData");

      ipAdd.innerText = data.ip;
      locData.innerText =
        data.city + `, ` + data.region + `, ` + data.country_code;
      timeData.innerText = data.time_zone.abbr + `, ` + data.time_zone.offset;
      ispData.innerText = data.asn.name;

      console.log(ip);

      //this, coupled with setting map globally, fixes the map already initialised error when trying to search for the next ip address.
      if (map) {
        map.off();
        map.remove();
      }

      map = L.map("map", { zoomControl: false }).setView(
        [data.latitude, data.longitude],
        13
      );

      //add tile layer
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      //get marker icon
      let mapMarker = L.icon({
        iconUrl: "../images/icon-location.svg",
        iconSize: [46, 56],
        //icon anchor first number should always be iconSize width divided by 2
        iconAnchor: [23, 56],
      });

      //add marker at destination
      let marker = L.marker([data.latitude, data.longitude], {
        icon: mapMarker,
      }).addTo(map);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
