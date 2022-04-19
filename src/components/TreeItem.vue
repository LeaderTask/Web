<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import * as TASK from '@/store/actions/tasks'
export default {
  name: 'TreeItem', // necessary for self-reference
  props: {
    model: Object
  },
  data () {
    const store = useStore()
    const selectedTask = computed(() => store.state.tasks.selectedTask)
    const changeProject = (uid, uidproject) => {
      store.dispatch(TASK.CHANGE_TASK_PROJECT, { uid: uid, value: uidproject }).then(
        resp => {
          selectedTask.value.uid_project = uidproject
        }
      )
    }
    return {
      checked: null,
      selecteProject: [],
      selectedTask: selectedTask,
      changeProject,
      isOpen: false
    }
  },
  computed: {
    isFolder () {
      return this.model.children && this.model.children.length
    }
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    changeType () {
      if (!this.isFolder) {
        this.addChild()
        this.isOpen = true
      }
    },
    addChild () {
    }
  }
}
</script>
<template>
  <li
    @click="changeProject(selectedTask.uid, model.uid)"
  >
    <div
      :class="{ bold: isFolder }"
      class="list-project-access"
      @click="toggle"
      @dblclick="changeType"
    >
      <span
        v-if="isFolder"
        class="svg-control-tree"
      ><span v-if="isOpen"><svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M4.77011 6.87133C4.40803 7.4288 3.59197 7.42879 3.22989 6.87133L0.149702 2.12908C-0.247103 1.51816 0.191341 0.71057 0.919818 0.71057L7.08018 0.71057C7.80866 0.71057 8.2471 1.51816 7.8503 2.12908L4.77011 6.87133Z"
        fill="#222222"
      /></svg></span><span v-else><svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.87133 3.22989C7.4288 3.59197 7.42879 4.40803 6.87133 4.77011L2.12908 7.8503C1.51816 8.2471 0.71057 7.80866 0.71057 7.08018V0.919817C0.71057 0.191341 1.51816 -0.247102 2.12908 0.149703L6.87133 3.22989Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
      </span></span>
      <svg
        v-if="model.color!==11114678 && model.color!==-4056036 && model.color!==-2679009"
        width="24"
        height="22"
        viewBox="0 0 30 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.2999 6.3778V4.71425C27.2999 3.17114 26.0386 1.91406 24.4902 1.91406H12.9116L12.5642 1.34198C12.3527 1.01078 11.9826 0.800011 11.5898 0.800011H3.00969C1.46134 0.800011 0.199997 2.05708 0.199997 3.6002V24.722C0.199997 26.2652 1.46134 27.5222 3.00969 27.5222H26.9903C28.5386 27.5222 29.8 26.2652 29.8 24.722V9.16294C29.8075 7.71768 28.7048 6.52835 27.2999 6.3778ZM2.48098 3.6002C2.48098 3.30663 2.72268 3.06575 3.01724 3.06575H10.9554L14.037 8.07899C14.2409 8.4102 14.611 8.62097 15.0113 8.62097H27.0054C27.2999 8.62097 27.5416 8.86184 27.5416 9.15541V24.722C27.5416 25.0156 27.2999 25.2565 27.0054 25.2565H3.00969C2.71512 25.2565 2.47343 25.0156 2.47343 24.722V3.6002H2.48098ZM25.0189 6.35522H15.6382L14.3013 4.17981H24.4827C24.7773 4.17981 25.0189 4.42068 25.0189 4.71425V6.35522Z"
          :fill="model.color"
          fill-opacity="1"
        />
      </svg>
      <svg
        v-else
        width="24"
        height="22"
        viewBox="0 0 30 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27.2999 6.3778V4.71425C27.2999 3.17114 26.0386 1.91406 24.4902 1.91406H12.9116L12.5642 1.34198C12.3527 1.01078 11.9826 0.800011 11.5898 0.800011H3.00969C1.46134 0.800011 0.199997 2.05708 0.199997 3.6002V24.722C0.199997 26.2652 1.46134 27.5222 3.00969 27.5222H26.9903C28.5386 27.5222 29.8 26.2652 29.8 24.722V9.16294C29.8075 7.71768 28.7048 6.52835 27.2999 6.3778ZM2.48098 3.6002C2.48098 3.30663 2.72268 3.06575 3.01724 3.06575H10.9554L14.037 8.07899C14.2409 8.4102 14.611 8.62097 15.0113 8.62097H27.0054C27.2999 8.62097 27.5416 8.86184 27.5416 9.15541V24.722C27.5416 25.0156 27.2999 25.2565 27.0054 25.2565H3.00969C2.71512 25.2565 2.47343 25.0156 2.47343 24.722V3.6002H2.48098ZM25.0189 6.35522H15.6382L14.3013 4.17981H24.4827C24.7773 4.17981 25.0189 4.42068 25.0189 4.71425V6.35522Z"
          fill="#A998B6"
          fill-opacity="1"
        />
      </svg>
      <label class="break-words">{{ model.name.substring(0, 15) }}</label>
      <span
        v-if="selectedTask.uid_project === model.uid"
        class="inline-flex justify-center items-center"
        data-v-5784ed69-s=""
      >
        <svg
          viewBox="0 0 26 20"
          width="10"
          height="10"
          class="inline-block"
          data-v-5784ed69-s=""
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299Z"
            data-v-5784ed69-s=""
          />
        </svg><!--v-if-->
      </span>
      <input
        v-model="selecteProject[model.uid]"
        type="radio"
        :value="model.uid"
        name="check_projects"
        class="check-custom-project"
        :checked="selectedTask.uid_project === model.uid"
        style="display:none;"
        @click="changeProject(selectedTask.uid, model.uid)"
      >
    </div>
    <ul
      v-show="isOpen"
      v-if="isFolder"
    >
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem
        v-for="model in model.children"
        :key="model"
        class="item-child"
        :model="model"
      />
    </ul>
  </li>
</template>
