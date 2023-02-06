<script setup lang="ts">
import { useDataStore } from "../stores/data";

let dateAvailable = false;
let dateTimeFormat: Intl.DateTimeFormat;

try {
  // dateStyle/timeStyle not available on Safari < 14.1
  dateTimeFormat = new Intl.DateTimeFormat("fr", { dateStyle: "full", timeStyle: "short" });
  dateAvailable = true;
} catch {}

const dataStore = useDataStore();
</script>

<template>
  <p class="text-h6" v-if="dateAvailable && dataStore.startDate && new Date() < dataStore.startDate">
    Départ le {{ dateTimeFormat.format(dataStore.startDate) }}
  </p>
  <p class="text-h6" v-else-if="dateAvailable && dataStore.endDate && new Date() < dataStore.endDate">
    Arrivée le {{ dateTimeFormat.format(dataStore.endDate) }}
  </p>
</template>

<style scoped></style>
