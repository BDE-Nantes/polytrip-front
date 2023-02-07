import axios from "axios";
import { defineStore } from "pinia";
import type { SchoolApi } from "@/models/schoolApi.item";
import type { TripApi } from "@/models/tripApi.item";
import type { School } from "@/models/school.item";
import type { Trip } from "@/models/trip.item";
import { featureGroup, GeoJSON, Layer, Map, polyline } from "leaflet";
import toKm from "@/utils/toKm";

export const useDataStore = defineStore("data", {
  state: () => {
    return {
      schools: [] as SchoolApi[],
      trips: [] as TripApi[],
      schoolRankings: [] as School[],
      startDate: null as Date | null,
      endDate: null as Date | null,
      map: null as Map | null,
    };
  },
  getters: {
    isActive: (state) =>
      state.startDate != null && state.endDate != null && new Date() > state.startDate && new Date() < state.endDate,
  },
  actions: {
    async fetchData() {
      const schoolsResp = await axios.get(`${import.meta.env.VITE_API_URL}/api/schools/`);
      this.schools = schoolsResp.data;
      const tripsResp = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips/`);
      this.trips = tripsResp.data;
      const configResp = await axios.get(`${import.meta.env.VITE_API_URL}/api/siteconfiguration/`);
      this.startDate = new Date(configResp.data["start_date"]);
      this.endDate = new Date(configResp.data["end_date"]);
      this.updateRankings();
    },
    updateRankings() {
      this.schoolRankings = this.schools.map((s) => ({
        ...s,
        totalDistance: 0,
        featureGroup: featureGroup(),
        visible: true,
        trips: [] as Trip[],
      }));

      for (const trip of this.trips) {
        const school = this.schoolRankings.find((s) => s.uuid === trip.school);
        if (school == undefined) {
          continue;
        }
        const tripData = {
          ...trip,
          polyline: polyline(GeoJSON.coordsToLatLngs(trip.trip.coordinates), {
            color: school.color,
            weight: 5,
          }).bindPopup(
            `<b style="font-size: 16px;">${trip.team}</b><br/>${school.name}<br/><i>${toKm(trip.distance)} km</i>`
          ),
          visible: true,
        };

        school.trips.push(tripData);
        school.totalDistance += trip.distance;
        school.featureGroup.addLayer(tripData.polyline);
      }

      this.schoolRankings.sort((a, b) => b.totalDistance - a.totalDistance);
      for (const school of this.schoolRankings) {
        school.trips.sort((a, b) => b.distance - a.distance);
      }
    },
    updateSchoolLayer(school: School, visible: Boolean) {
      if (!visible && this.map?.hasLayer(school.featureGroup)) {
        this.map.removeLayer(school.featureGroup);
        for (const trip of school.trips) {
          trip.visible = false;
          this.updateLayer(school, trip.polyline, trip.visible);
        }
      }
      if (visible && !this.map?.hasLayer(school.featureGroup)) {
        this.map?.addLayer(school.featureGroup);
        for (const trip of school.trips) {
          trip.visible = true;
          this.updateLayer(school, trip.polyline, trip.visible);
        }
      }
    },
    updateLayer(school: School, layer: Layer, visible: boolean) {
      if (!visible && school.featureGroup.hasLayer(layer)) {
        school.featureGroup.removeLayer(layer);
      }
      if (visible && !school.featureGroup.hasLayer(layer)) {
        school.featureGroup.addLayer(layer);
        school.visible = true;
        this.updateSchoolLayer(school, school.visible);
      }
    },
  },
});
