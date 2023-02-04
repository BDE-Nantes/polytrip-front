<script setup lang="ts">
import L, { GeoJSON, type MapOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDataStore } from "@/stores/data";
import { onMounted } from "vue";
import type { School } from "@/models/school.item";

const dataStore = useDataStore();

const initialMapOptions: MapOptions = {
  center: [47.32, -1.98],
  zoom: 10,
  preferCanvas: true,
};

onMounted(async () => {
  dataStore.map = L.map("map", initialMapOptions);
  dataStore.map.addLayer(
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    })
  );
  dataStore.map.zoomControl.setPosition("bottomright");
  addSchoolMarkers();
  for (const school of dataStore.schoolRankings) {
    dataStore.updateSchoolLayer(school as School, school.visible);
  }
  dataStore.map.flyToBounds(
    [
      [50.2604, -2.7761],
      [43.2048, 8.0184],
    ],
    { duration: 0.75 }
  );
});

function addSchoolMarkers() {
  for (const school of dataStore.schoolRankings) {
    let icon = new L.Icon({
      iconUrl: new URL(`/src/assets/marker_${school.color.replace("#", "").toLowerCase()}.png`, import.meta.url).href,
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    const marker = L.marker(GeoJSON.coordsToLatLng(school.coordinates.coordinates), { icon }).bindPopup(
      `<b style="font-size: 16px;">${school.name}</b><br/><i>${
        school.trips.length === 0 ? "Aucune" : school.trips.length
      } équipe${school.trips.length > 1 ? "s" : ""}</i>`
    );
    dataStore.map?.addLayer(marker);
  }
}
</script>

<template>
  <div id="map"></div>
</template>

<style>
#map {
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 10;
  position: absolute;
}
</style>
