/* global google */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(console.error);
}

let map, marker, watchId;

window.initMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 0, lng: 0 }
  });
  marker = new google.maps.Marker({ map, title: 'You' });

  const status = document.getElementById('status');

  if (!('geolocation' in navigator)) {
    status.textContent = 'Geolocation API not supported 😢';
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    ({ coords }) => {
      const pos = { lat: coords.latitude, lng: coords.longitude };
      marker.setPosition(pos);
      map.setCenter(pos);
      status.textContent =
        `Lat ${coords.latitude.toFixed(5)}  Lng ${coords.longitude.toFixed(5)}  (±${coords.accuracy} m)`;
      // TODO: Upload `pos` to your backend if desired.
    },
    err => { status.textContent = 'Error: ' + err.message; },
    { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
  );
};

window.addEventListener('beforeunload', () => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
});
