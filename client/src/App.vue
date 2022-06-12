<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { ref, computed } from "vue";

const studentsWithPlace = computed(() =>
  [...students]
    .sort((s1, s2) => s2.points > s1.points)
    .map((student, index) => ({
      place: index + 1,
      name: student.name,
      points: student.points,
    }))
);

const sortedByCategory = computed(() =>
  [...studentsWithPlace.value].sort((s1, s2) => {
    let order = s2[currentSortCategory.value] > s1[currentSortCategory.value];
    return reversed.value ? order : !order;
    // return currentSortCategory.value === "name" ||
    //   currentSortCategory.value === "place"
    //   ? !startAscendingOrder
    //   : startAscendingOrder;
  })
);

const currentSortCategory = ref("place");
const reversed = ref(false);

const students = [
  {
    name: "Mickey Mouse",
    points: 10,
  },
  {
    name: "Donald Duck",
    points: 34,
  },
  {
    name: "Rick Roll",
    points: 15,
  },
  {
    name: "Winnie the Pooh",
    points: 32,
  },
  {
    name: "Harley Quinn",
    points: 13,
  },
  {
    name: "Johnny Bravo",
    points: 7,
  },
  {
    name: "Cristiano Ronaldo",
    points: 64,
  },
  {
    name: "Weighted Companion Cube",
    points: 115,
  },
  {
    name: "The Huddle",
    points: 34,
  },
  {
    name: "Peter Pan",
    points: 29,
  },
  {
    name: "Dirk Gentley",
    points: 28,
  },
  {
    name: "Arthur Ford",
    points: 61,
  },
  {
    name: "Towelie",
    points: 111,
  },
  {
    name: "Eric Cartman",
    points: 35,
  },
  {
    name: "Peter Griffith",
    points: 89,
  },
  {
    name: "Stewie Griffith",
    points: 5,
  },
  {
    name: "Invader Zim",
    points: 39,
  },
  {
    name: "Girrrrr",
    points: 48,
  },
  {
    name: "Woody",
    points: 44,
  },
  {
    name: "Todd Sweeney",
    points: 26,
  },
];
</script>

<template>
  <div
    class="rounded-xl shadow-orange-700 shadow-2xl my-10 w-10/12 p-12 text-center mx-auto bg-orange-600 text-white"
  >
    <h1 class="text-4xl">Leaderboard</h1>
    <div class="flex flex-row justify-around divide-blue-700 my-2 text-2xl">
      <div
        class="flex-1 w-10 hover:text-orange-300 hover:cursor-pointer"
        @click="
          (currentSortCategory = 'place'),
            (reversed = currentSortCategory === 'place' ? !reversed : reversed)
        "
      >
        PLACE ⌄
      </div>
      <div
        class="flex-2 w-72 hover:text-orange-300 hover:cursor-pointer text-ellipsis"
        @click="
          (currentSortCategory = 'name'),
            (reversed = currentSortCategory === 'name' ? !reversed : reversed)
        "
      >
        NAME ⌄
      </div>
      <div
        class="flex-1 w-10 hover:text-orange-300 hover:cursor-pointer"
        @click="
          (currentSortCategory = 'points'),
            (reversed = currentSortCategory === 'points' ? !reversed : reversed)
        "
      >
        POINTS ⌄
      </div>
    </div>
    <div
      class="flex flex-row justify-around mt-3 divide-x-2 divide-orange-200"
      v-for="student in sortedByCategory"
      :key="student.name"
    >
      <div
        class="flex-1 w-10"
        :class="student.place < 4 ? 'text-green-500 font-extrabold' : ''"
      >
        {{ student.place }}
      </div>
      <div class="flex-2 w-72 px-10 text-ellipsis">{{ student.name }}</div>
      <div class="flex-1 w-10">{{ student.points }}</div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Fira Code, monospace, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

@font-face {
  font-family: Fira Code;
  src: local("./assets/FiraCode-VF.ttf");
}
</style>
