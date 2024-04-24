<template>
  <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
    <q-list padding>
      <q-item
        v-for="item in items"
        :key="item.name"
        clickable
        v-ripple
        @click="flagActiveItem(item.name)"
        :to="'/' + item.name.toLowerCase()"
      >
        <q-item-section avatar>
          <q-icon
            :class="
              item.isActive ? item.activeIconColor : item.defaultIconColor
            "
            :name="item.icon"
          />
        </q-item-section>
        <q-item-section
          :class="item.isActive ? item.activeTextColor : item.defaultTextColor"
        >
          {{ item.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { ref } from "vue";

const items = ref([
  {
    name: "Home",
    isActive: true,
    icon: "home",
    defaultTextColor: "text-dark",
    activeTextColor: "text-secondary",
    defaultIconColor: "text-grey",
    activeIconColor: "text-secondary",
  },
  {
    name: "Workloads",
    isActive: false,
    icon: "auto_awesome_motion",
    defaultTextColor: "text-dark",
    activeTextColor: "text-secondary",
    defaultIconColor: "text-grey",
    activeIconColor: "text-secondary",
  },
  {
    name: "Debug",
    isActive: false,
    icon: "bug_report",
    defaultTextColor: "text-dark",
    activeTextColor: "text-secondary",
    defaultIconColor: "text-grey",
    activeIconColor: "text-secondary",
  },
  {
    name: "About",
    isActive: false,
    icon: "info",
    defaultTextColor: "text-dark",
    activeTextColor: "text-secondary",
    defaultIconColor: "text-grey",
    activeIconColor: "text-secondary",
  },
]);

function flagActiveItem(itemName) {
  const n = items.value.length;
  for (let i = 0; i < n; i++) {
    if (items.value[i].name == itemName) {
      items.value[i].isActive = true;
    } else {
      items.value[i].isActive = false;
    }
  }
}
</script>
