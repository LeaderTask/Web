<template>
  <Popper
    v-for="(key, value) in selectedTags"
    :key="value"
    class="popper-tags light"
    arrow
    trigger="hover"
    placement="bottom"
    :options="{
      placement: 'bottom',
      modifiers: { offset: { offset: '0,10px' } }
    }"
    @open:popper="onShowSelectTags"
  >
    <template
      v-if="selectedTags.length"
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          class="title-popover-main"
          @click="close"
        >
          <button
            class="btn-clear-popover"
            @click="close"
          >
            Отменить
          </button>
          <button
            class="btn-save-popover"
            @click="onSave"
          >
            Сохранить
          </button>
        </div>
        <div class="text-white body-popover-custom">
          <div
            v-if="myTags.length"
            class="container-tags-popover"
          >
            <TaskPropsButtonTagsItem
              v-for="(tag, index) in myTags"
              :key="index"
              :check-tags="checkTags"
              :collapsed-tags="collapsedTags"
              :tag="tag"
              @collapseTag="onCollapseTag"
              @checkTag="onCheckTag"
            />
          </div>
          <div
            v-else
            class="text-sm text-center max-w-[176px]"
          >
            На данный момент у Вас нет меток. Их можно добавить на вкладке "Прочее > Метки"
          </div>
        </div>
      </div>
    </template>
    <span
      v-if="selectedTags.length"
    >
      <a
        class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100 project-hover-close"
      >
        <svg
          v-if="tags[key] && tags[key].back_color !== '#A998B6'"
          width="24"
          height="24"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z"
            :fill="tags[key].back_color"
            fill-opacity="1"
          />
          <path
            d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z"
            :fill="tags[key].back_color"
            fill-opacity="1"
          />
        </svg>
        <svg
          v-else
          width="24"
          height="24"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z"
            fill="#6C6C6C"
            fill-opacity="1"
          />
          <path
            d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z"
            fill="#6C6C6C"
            fill-opacity="1"
          />
        </svg>
        <span class="rounded custom-method truncate max-w-[300px]">{{
            tags[key]?.name ?? '???'
          }}</span>
        <button
          class="btn-close-popover"
          @click.stop="removeTag(key)"
        >
          <svg
            width="5"
            height="5"
            viewBox="0 0 16 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
        </button>
      </a>
    </span>
  </Popper>
  <Popper
    v-if="!selectedTags.length"
    class="popper-tags light"
    trigger="clickToOpen"
    force-show
    arrow
    placement="bottom"
    :options="{
      placement: 'bottom',
      modifiers: { offset: { offset: '0,10px' } }
    }"
    @open:popper="onShowSelectTags"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div class="popper">
        <div
          v-if="myTags.length"
          class="title-popover-main"
          @click="close"
        >
          <button
            class="btn-clear-popover"
            @click="close"
          >
            Отменить
          </button>
          <button
            class="btn-save-popover"
            @click="onSave"
          >
            Сохранить
          </button>
        </div>
        <div class="text-white body-popover-custom">
          <div
            class="container-tags-popover"
            v-if="myTags.length"
          >
            <TaskPropsButtonTagsItem
              v-for="(tag, index) in myTags"
              :key="index"
              :check-tags="checkTags"
              :collapsed-tags="collapsedTags"
              :tag="tag"
              @collapseTag="onCollapseTag"
              @checkTag="onCheckTag"
            />
          </div>
          <div
            v-else
            class="text-sm text-center max-w-[176px]"
          >
            На данный момент у Вас нет меток. Их можно добавить на вкладке "Прочее > Метки"
          </div>
        </div>
      </div>
    </template>
    <button class="mt-3 tags-custom dark:bg-gray-800 dark:text-gray-100">
      <svg
        width="24"
        height="24"
        viewBox="0 0 88 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M77.9021 0.800003H45.1156C44.4406 0.800003 43.7994 1.07006 43.3269 1.54265L3.52077 41.3417C-0.107182 44.9705 -0.107182 50.8779 3.52077 54.4899L33.5062 84.4826C35.2611 86.2379 37.5897 87.2 40.0871 87.2C42.5845 87.2 44.9131 86.2379 46.668 84.4826L86.4573 44.6836C86.9298 44.211 87.1998 43.5696 87.1998 42.8945V10.0999C87.1998 4.96894 83.0319 0.800003 77.9021 0.800003ZM79.7414 41.983L43.1413 78.5921C42.3989 79.3347 41.4033 79.7567 40.3402 79.7567C39.2771 79.7567 38.2816 79.3516 37.5391 78.6089L9.42673 50.4897C7.8743 48.9369 7.8743 46.422 9.42673 44.8692L46.0268 8.26021H75.776C77.9696 8.26021 79.7414 10.0493 79.7414 12.2266V41.983Z"
          fill="black"
          fill-opacity="0.5"
        />
        <path
          d="M61.788 19.8588C60.0885 19.8588 58.4969 20.5197 57.2965 21.7202C56.096 22.9206 55.4351 24.5123 55.4351 26.2118C55.4351 27.9113 56.096 29.5029 57.2965 30.7033C58.4969 31.9038 60.0885 32.5647 61.788 32.5647C63.4875 32.5647 65.0792 31.9038 66.2796 30.7033C67.4801 29.5029 68.141 27.9113 68.141 26.2118C68.141 24.5123 67.4801 22.9206 66.2796 21.7202C65.0792 20.5197 63.4875 19.8588 61.788 19.8588Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
      <span class="rounded custom-method">Метки</span>
    </button>
  </Popper>
</template>

<script>
import TaskPropsButtonTagsItem from '@/components/TaskProperties/TaskPropsButtonTagsItem.vue'
import Popper from 'vue3-popper'

export default {
  components: {
    Popper,
    TaskPropsButtonTagsItem
  },
  props: {
    selectedTags: {
      type: Array,
      default: () => []
    }
  },
  emits: ['changeTags'],
  data: () => ({
    checkTags: [],
    collapsedTags: []
  }),
  computed: {
    tags () {
      return this.$store.state.tasks.tags
    },
    myTags () {
      return Object.values(this.$store.state.tasks.tags).filter(
        (tag) => tag.uid_parent === '00000000-0000-0000-0000-000000000000'
      )
    }
  },
  watch: {
    selectedTags (newTags, oldTags) {
      this.checkTags = [...this.selectedTags]
    }
  },
  mounted () {
    this.checkTags = [...this.selectedTags]
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onShowSelectTags () {
      this.collapsedTags = []
    },
    isCheckedTag (tagUid) {
      const index = this.checkTags.findIndex(
        (uid) => uid === tagUid
      )
      return index !== -1
    },
    onCheckTag (tagUid) {
      const index = this.checkTags.findIndex(
        (uid) => uid === tagUid
      )
      if (index === -1) {
        this.checkTags.push(tagUid)
      } else {
        this.checkTags.splice(index, 1)
      }
    },
    onCollapseTag (tagUid) {
      const index = this.collapsedTags.findIndex(
        (uid) => uid === tagUid
      )
      if (index === -1) {
        this.collapsedTags.push(tagUid)
      } else {
        this.collapsedTags.splice(index, 1)
      }
    },
    onSave () {
      this.$emit('changeTags', this.checkTags)
    },
    removeTag (tagUid) {
      this.onCheckTag(tagUid)
      this.onSave()
    }
  }
}
</script>

<style scoped></style>
