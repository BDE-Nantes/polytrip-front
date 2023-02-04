<script setup lang="ts">
import Map from "../components/Map.vue";
import TeamSelection from "../components/TeamSelection.vue";
import { useDataStore } from "../stores/data";
import { useThemeStore } from "../stores/theme";
import { ref } from "vue";

const drawer = ref(false);
const themeStore = useThemeStore();

const dataStore = useDataStore();
await dataStore.fetchData();
</script>

<template>
  <v-app :theme="themeStore.theme">
    <v-app-bar>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn
        :icon="themeStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="themeStore.toggleTheme"
      />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <TeamSelection></TeamSelection>
    </v-navigation-drawer>
  </v-app>
  <Map />
</template>

<style></style>
