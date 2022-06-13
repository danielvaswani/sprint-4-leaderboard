<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { ref, computed } from "vue";
import axios from "axios";

// Values moved to mongoDB
const students = ref([]);

getLeaderboard();

const studentsWithPlace = computed(() =>
  [...students.value]
    .sort((s1, s2) => s2.points > s1.points)
    .map((student, index) => ({
      id: student._id,
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

const name = ref("");
const points = ref(0);

const currentId = ref("");

const toggleSelection = (id, currentName, currentPoints) => {
  currentId.value = currentId.value === id ? "" : id;
  name.value = currentId.value !== id ? "" : currentName;
  points.value = currentId.value !== id ? 0 : currentPoints;
};

function alertAndClearText(text) {
  alert(text);
  name.value = "";
  points.value = 0;
  currentId.value = "";
}

async function addRecord() {
  if (name.value === "" || points.value === "") {
    points.value = 0;
    return;
  }
  axios
    .post(import.meta.env.VITE_API + "/api/leaderboard/record", {
      name: name.value,
      points: points.value,
    })
    .then(
      async () =>
        await getLeaderboard().then(() =>
          alertAndClearText(
            name.value + " with points " + points.value + " added"
          )
        )
    );
}

async function updateRecord() {
  const currentStudent = students.value.filter(
    (student) => student._id === currentId.value
  )[0];
  if (
    name.value === "" ||
    points.value === "" ||
    (name.value === currentStudent.name &&
      points.value === currentStudent.points)
  ) {
    points.value = 0;
    return;
  }

  await axios
    .put(
      import.meta.env.VITE_API + "/api/leaderboard/record/" + currentId.value,
      {
        name: name.value,
        points: points.value,
      }
    )
    .then(
      async () =>
        await getLeaderboard().then(() =>
          alertAndClearText(
            name.value + " with points " + points.value + " updated"
          )
        )
    );
}

async function deleteRecord() {
  await axios
    .delete(
      import.meta.env.VITE_API + "/api/leaderboard/record/" + currentId.value
    )
    .then(
      async () =>
        await getLeaderboard().then(() =>
          alertAndClearText(name.value + " deleted")
        )
    );
}

// Calling my vercel hosted Mongo/Express API (MEVN)
async function getLeaderboard() {
  return await axios
    .get(import.meta.env.VITE_API + "/api/leaderboard")
    .then((response) => (students.value = [...response.data]));
}
</script>

<template>
  <div
    class="flex flex-col rounded-xl shadow-orange-700 shadow-2xl mx-auto w-10/12 py-4 text-center bg-orange-600 text-white"
  >
    <div class="flex flex-row gap-3 py-2 justify-center w-full">
      <input
        type="text"
        placeholder="Name"
        class="px-2 w-48 rounded shadow text-black select-text"
        v-model="name"
      />

      <input
        type="number"
        placeholder="Points"
        class="px-2 w-24 rounded shadow text-black select-text"
        v-model="points"
      />

      <div v-if="currentId === ''">
        <div class="flex flex-row gap-3 w-20 justify-start">
          <input
            type="button"
            value="Add"
            class="cursor-pointer text-white px-2 py-1 rounded-md bg-blue-500 shadow-blue-600 shadow-sm"
            @click="addRecord()"
          />
        </div>
      </div>
      <div v-else>
        <div class="flex flex-row gap-3 w-20 justify-start">
          <input
            type="button"
            value="Edit"
            class="cursor-pointer"
            @click="updateRecord()"
          />
          <input
            type="button"
            value="Delete"
            class="cursor-pointer text-white px-2 py-1 rounded-md bg-red-600"
            @click="deleteRecord()"
          />
        </div>
      </div>
    </div>
    <h6
      class="font-extralight py-1 mt-2 text-xs"
      :class="
        currentId === ''
          ? 'opacity-80'
          : 'text-blue-500 shadow-white drop-shadow bg-blue-200 w-48 mx-auto rounded'
      "
    >
      {{
        currentId === ""
          ? "Select a record to edit"
          : "Deselect record to abort"
      }}
    </h6>
    <h1 class="text-4xl my-3">Leaderboard</h1>
    <div class="flex flex-row justify-around divide-blue-700 my-2 text-2xl">
      <h3
        class="flex-1 w-10 hover:text-orange-300 hover:cursor-pointer"
        @click="(currentSortCategory = 'place'), (reversed = !reversed)"
      >
        PLACE ⌄
      </h3>
      <h3
        class="flex-2 w-72 hover:text-orange-300 hover:cursor-pointer text-ellipsis"
        @click="(currentSortCategory = 'name'), (reversed = !reversed)"
      >
        NAME ⌄
      </h3>
      <h3
        class="flex-1 w-10 hover:text-orange-300 hover:cursor-pointer"
        @click="(currentSortCategory = 'points'), (reversed = !reversed)"
      >
        POINTS ⌄
      </h3>
    </div>
    <div v-for="student in sortedByCategory" :key="student.name">
      <div
        class="flex flex-row justify-around mt-3 divide-x-2 divide-orange-200 cursor-pointer"
        :class="currentId === student.id ? 'bg-white bg-opacity-50' : ''"
        @click="toggleSelection(student.id, student.name, student.points)"
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
  </div>
</template>

<style>
#app {
  font-family: Fira Code, monospace, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  padding: 0;
  padding-top: 60px;
  padding-bottom: 30px;
  margin: 0;
  background-image: url(./assets/7130416.jpg);
  background-size: 200vh;
  min-height: 100vh;
}

* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@font-face {
  font-family: Fira Code;
  src: local("./assets/FiraCode-VF.ttf");
}
</style>
