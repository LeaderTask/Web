<template>
  <PopMenu
    placement="bottom"
  >
    <div class="mt-3 tags-custom">
      <svg
        style="width: 24px; height: 24px"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
        />
      </svg>
    </div>
    <template #menu>
      <PopMenuHeader
        title="Дата создания:"
      >
        {{ dateCreateText }}
      </PopMenuHeader>
      <PopMenuItem
        @click="selectItem('toggleFiles')"
      >
        {{ onlyFiles ? 'Показать весь чат' : 'Показать только файлы' }}
      </PopMenuItem>
      <PopMenuItem
        @click="selectItem('copyUrl')"
      >
        Копировать как ссылку
      </PopMenuItem>
      <PopMenuItem
        v-if="showDelete"
        @click="selectItem('deleteTask')"
      >
        Удалить
      </PopMenuItem>
    </template>
  </PopMenu>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuHeader from '@/components/Common/PopMenuHeader.vue'

export default {
  components: {
    PopMenu,
    PopMenuItem,
    PopMenuHeader
  },
  props: {
    dateCreate: {
      type: String,
      default: ''
    },
    onlyFiles: Boolean,
    showDelete: Boolean
  },
  emits: ['copyUrl', 'deleteTask', 'toggleFiles'],
  computed: {
    dateCreateText () {
      const date = new Date(this.dateCreate)
      return date.toLocaleString('default', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  },
  methods: {
    selectItem (value) {
      this.$emit(value)
    }
  }
}
</script>

<style scoped>
.tags-custom {
  border-radius: 5px;
  background: #f4f5f7;
  padding: 4px 0px 4px 0px;
  margin: 2px 2px 2px 2px;
  position: relative;
  float: none;
  display: flex;
  cursor: pointer;
}
.tags-custom svg {
  position: relative;
  float: left;
  display: flex;
  margin-right: 5px;
  left: 3px;
  top: 0;
  color: #A6A6A6;
}
</style>
