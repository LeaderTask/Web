<script setup>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import ready from '@/icons/ready.js'

const store = useStore()
const navStack = computed(() => store.state.navbar.navStack)

const DATE_UID = '901841d9-0016-491d-ad66-8ee42d2b496b'
const TAG_UID = '00a5b3de-9474-404d-b3ba-83f488ac6d30'
const COLOR_UID = 'ed8039ae-f3de-4369-8f32-829d401056e9'
const PRIVATE_PROJECT_UID = '7af232ff-0e29-4c27-a33b-866b5fd6eade'
const currentImageIndex = ref(0)

setInterval(() => {
  if (currentImageIndex.value === 2) {
    currentImageIndex.value = 0
    return
  }
  currentImageIndex.value++
}, 15000)

</script>

<template>
  <!-- DATE -->
  <div v-if="navStack[navStack.length - 1].value.uid == DATE_UID">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        v-show="currentImageIndex === 0"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask.png"
        alt="Empty task image"
      >
      <img
        v-show="currentImageIndex === 1"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask1.png"
        alt="Empty task image"
      >
      <img
        v-show="currentImageIndex === 2"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask2.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-10">
        Create tasks for today or go to another day to stay up to date
      </p>
    </div>
  </div>

  <!-- PROJECT -->
  <div v-if="navStack[navStack.length - 1].value.uid == PRIVATE_PROJECT_UID">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptyproject.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold">
        What for do you need projects?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Set goals and plans for the future
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Work on tasks with teammates
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Keep personal files, meetings, trips etc.
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Collect lists of your favorite books, movies etc.
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Start working with the project by creating a task
        </p>
      </div>
    </div>
  </div>

  <!-- TAG -->
  <div v-if="navStack[navStack.length - 1].value.uid == TAG_UID">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytag.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold">
        What for do you need tags?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Group similar tasks in to-do lists
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Focus your team's work on the main things
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Sort work and personal to-do lists
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Visualise the order of performing tasks
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Start working with the tag by creating a task
        </p>
      </div>
    </div>
  </div>

  <!-- COLOR  -->
  <div v-if="navStack[navStack.length - 1].value.uid == COLOR_UID">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptycolor.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-5">
        What for do you need colors?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Highlight main tasks in a large to-do list
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Focus the team's attention on what is important
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Sort personal affairs, meetings, trips etc.
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Enliven boring to-do lists
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Start working with the tag by creating a task
        </p>
      </div>
    </div>
  </div>
</template>
