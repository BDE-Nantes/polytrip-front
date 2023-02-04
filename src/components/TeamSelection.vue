<script setup lang="ts">
import { useDataStore } from "@/stores/data";
import toKm from "../utils/toKm";
import { ref } from "vue";
import type { Polyline } from "leaflet";
import type { School } from "@/models/school.item";

const opened = ref([]);
const { schoolRankings, updateSchoolLayer, updateLayer } = useDataStore();
</script>

<template>
  <v-list v-model:opened="opened">
    <v-list-item>
      <template #prepend>
        <v-btn
          rounded="lg"
          icon="mdi-checkbox-marked-outline"
          @click="() => {schoolRankings.forEach((school) => {school.visible = true; updateSchoolLayer(school as School, school.visible)})}"
        ></v-btn>
      </template>
      <template #append>
        <v-btn
          rounded="lg"
          icon="mdi-checkbox-blank-off-outline"
          @click="() => {schoolRankings.forEach((school) => {school.visible = false; updateSchoolLayer(school as School, school.visible)})}"
        ></v-btn>
      </template>
    </v-list-item>
    <v-list-group v-for="(school, i) of schoolRankings" :key="i">
      <template #activator="{ props }">
        <v-list-item v-bind="props" :title="school.name.split('Polytech ')[1]">
          <template #prepend>
            <v-list-item-action start>
              <v-checkbox-btn
                v-model="school.visible"
                @click.native="$event.stopPropagation()"
                @update:model-value="(val: boolean) => updateSchoolLayer(school as School, val)"
                :color="school.color"
              ></v-checkbox-btn>
            </v-list-item-action>
          </template>
          <v-list-item-subtitle> {{ toKm(school.totalDistance) }} km </v-list-item-subtitle>
        </v-list-item>
      </template>
      <v-list-item v-for="(trip, j) of school.trips" :key="j" :title="trip.team">
        <template #prepend>
          <v-list-item-action start>
            <v-checkbox-btn
              v-model="trip.visible"
              @update:model-value="(val: boolean) => updateLayer(school as School, trip.polyline as Polyline, val)"
              :color="school.color"
            ></v-checkbox-btn>
          </v-list-item-action>
        </template>
        <v-list-item-subtitle> {{ toKm(trip.distance) }} km </v-list-item-subtitle>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<style scoped></style>
