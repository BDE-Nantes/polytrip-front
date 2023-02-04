<script setup lang="ts">
import Polytrip from "./views/Polytrip.vue";
import Loading from "./components/Loading.vue";
</script>

<template>
  <Suspense>
    <Polytrip />
    <template #fallback>
      <div class="d-flex justify-center align-center" style="height: 100vh">
        <Loading style="width: 15vw" />
      </div>
    </template>
  </Suspense>
</template>

<style></style>
