<script>
import Icon from '@/components/Icon.vue'
import PopMenu from '@/components/modals/PopMenu.vue'
import PopMenuItem from '@/components/modals/PopMenuItem.vue'

// Statuses icons
import readyStatus from '@/icons/ready-status.js'
import note from '@/icons/note.js'
import inwork from '@/icons/inwork.js'
import pause from '@/icons/pause.js'
import canceled from '@/icons/canceled.js'
import improve from '@/icons/improve.js'
import repeat from '@/icons/repeat.js'

export default {
  components: {
    Icon,
    PopMenu,
    PopMenuItem
  },

  props: {
    task: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['changeStatus'],

  data () {
    return {
      readyStatus,
      note,
      inwork,
      pause,
      canceled,
      improve,
      repeat,

      statusesLabels: [
        'Не началось',
        'Задача выполнена',
        'Задача по ссылке',
        'Заметка',
        'В работе',
        'Готово к сдаче',
        'Отложено',
        'Отменено',
        'Отклонено',
        'На доработку'
      ],

      statusColor: {
        4: 'text-green-600',
        5: 'text-red-600',
        8: 'text-red-600',
        9: 'text-blue-500'
      },

      statuses: [
        undefined, // we don't have 0 status
        readyStatus,
        readyStatus,
        note,
        inwork,
        readyStatus,
        pause,
        canceled,
        canceled,
        improve
      ]
    }
  },

  methods: {
    showStatusOrNot (type, status) {
      if (type === 1 && [0, 1, 3, 4, 6, 7].includes(status)) {
        return true
      } else if (type === 2 && [0, 1, 3, 4, 6, 7, 9].includes(status)) {
        return true
      } else if (type === 3 && [0, 4, 5, 6, 8].includes(status)) {
        return true
      } else {
        return false
      }
    },

    changeTaskStatus (uid, status) {
      this.$emit('changeStatus', status)
    }
  }
}
</script>

<template>
  <PopMenu
    :disabled="task.type === 4 || task.type === 5"
    placement="left"
  >
    <template #menu>
      <template
        v-for="taskStatus in 10"
        :key="taskStatus"
      >
        <PopMenuItem
          v-if="showStatusOrNot(task.type, taskStatus - 1) && task.status !== (taskStatus - 1)"
          @click="changeTaskStatus(task.uid, taskStatus - 1)"
        >
          <div
            class="border-2 border-gray-300 rounded-md flex items-center justify-center"
            style="min-width:20px; min-height: 20px;"
          >
            <Icon
              v-if="statuses[taskStatus - 1]"
              :path="statuses[taskStatus - 1].path"
              :class="statusColor[taskStatus - 1] ? statusColor[taskStatus - 1] : 'text-gray-500 dark:text-gray-100'"
              :box="statuses[taskStatus - 1].viewBox"
              :width="statuses[taskStatus - 1].width"
              :height="statuses[taskStatus - 1].height"
            />
          </div>
          {{ statusesLabels[taskStatus - 1] }}
        </PopMenuItem>
      </template>
    </template>
    <div
      class="border-2 relative border-gray-300 rounded-md bg-white flex items-center justify-center"
      :class="{ 'cursor-pointer': [1, 2, 3].includes(task.type), 'cursor-not-allowed': task.type == 4 }"
      style="min-width:20px; min-height: 20px;"
    >
      <Icon
        v-if="statuses[task.status]"
        :path="statuses[task.status].path"
        :class="statusColor[task.status] ? statusColor[task.status] : 'text-gray-500 dark:text-gray-100'"
        :box="statuses[task.status].viewBox"
        :width="statuses[task.status].width"
        :height="statuses[task.status].height"
      />
      <Icon
        v-if="task.SeriesType !== 0"
        :path="repeat.path"
        class="text-blue-500 bg-white absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full"
        :box="repeat.viewBox"
        :width="repeat.width"
        :height="repeat.height"
      />
    </div>
  </PopMenu>
</template>
