<template>
  <div>
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить метку"
      :text="`Вы действительно хотите удалить метку ${selectedTagName}?`"
      @cancel="showConfirm = false"
      @yes="removeTag"
    />
    <div class="flex justify-between items-center">
      <PopMenu v-if="isCanDelete">
        <PropsButtonMenu />
        <template #menu>
          <PopMenuItem
            icon="delete"
            @click="showConfirm = true"
          >
            Удалить
          </PopMenuItem>
        </template>
      </PopMenu>
      <div v-else />
      <PropsButtonClose
        @click="closeProperties"
      />
    </div>
    <input
      v-model="currName"
      type="text"
      placeholder="Наименование"
      class="mt-[25px] p-0 font-roboto font-bold text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeTagName"
    >
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Цвет
    </div>
    <div class="w-full mt-[15px] gap-[4px] flex flex-col">
      <div
        v-for="(clrs, index) in defaultColors"
        :key="index"
        class="flex gap-[4px]"
      >
        <PropsColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :color="clr.color"
          :selected="clr.selected"
          @select="changeTagColor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PropsColorBoxItem from '@/components/Common/PropsColorBoxItem.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'

import { UPDATE_TAG_REQUEST, REMOVE_TAG_REQUEST, CREATE_TAG_REQUEST } from '@/store/actions/tasks'
import { NAVIGATOR_REMOVE_TAG } from '@/store/actions/navigator'

export default {
  components: {
    ModalBoxDelete,
    PropsColorBoxItem,
    PopMenu,
    PopMenuItem,
    PropsButtonMenu,
    PropsButtonClose
  },
  data () {
    return {
      showConfirm: false,
      currName: ''
    }
  },
  computed: {
    defaultColors () {
      const allColors = [
        '',
        '#7fc870',
        '#69c494',
        '#dff2e1',
        '#ffaf40',
        '#ffd7a0',
        '#5ba4cf',
        '#9eedff',
        '#b381b3',
        '#e5e5e5',
        '#ddd1c2',
        '#ef7665',
        '#ffc6b5',
        '#ff8ed4',
        '#f5dbf5',
        '#6a7077',
        '#f6dd29',
        '#f5f547'
      ]
      // добавляем в конец выбранный цвет если его тут нет
      const usedColor = this.selectedTagColor.toLowerCase()
      if (!allColors.includes(usedColor)) {
        allColors.splice(allColors.length - 1, 1, usedColor)
      }
      const colors = allColors.map(color => ({ color: color, selected: color === usedColor }))
      // разбираем на ряды по 9
      const rowLength = 9
      const arrColors = []
      while (colors.length) arrColors.push(colors.splice(0, rowLength))
      return arrColors
    },
    selectedTag () {
      return this.$store.state.tasks.selectedTag
    },
    selectedTagUid () {
      return this.selectedTag?.uid || ''
    },
    selectedTagName () {
      return this.selectedTag?.name || ''
    },
    selectedTagColor () {
      const backColor = this.selectedTag?.back_color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      const user = this.$store.state.user.user
      return this.selectedTag.email_creator === user.current_user_email
    },
    isCanEdit () {
      return this.isCanDelete
    }
  },
  watch: {
    selectedTagName: {
      immediate: true,
      handler: function (val) {
        this.currName = val
      }
    }
  },
  methods: {
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    print (msg, param) {
      console.log(msg, param)
    },
    removeTag () {
      this.showConfirm = false

      this.$store.dispatch(REMOVE_TAG_REQUEST, this.selectedTagUid)
        .then((resp) => {
          console.log('removeTag', resp)
          //
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_TAG, this.selectedTag)
          // выходим выше на один уровень навигации (надеемся что эта метка последняя в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeTagName () {
      if (this.selectedTagUid) {
        const title = this.currName.trim()
        if (title && this.selectedTagName !== title) {
          this.selectedTag.name = title
          this.$store.dispatch(UPDATE_TAG_REQUEST, this.selectedTag)
            .then((resp) => {
              console.log('changeColorName', resp)
            })
        }
      } else {
        const data = {
          uid_parent: '00000000-0000-0000-0000-000000000000',
          back_color: this.selectedTag.back_color,
          comment: '',
          collapsed: 0,
          order: 1,
          group: 0,
          show: 0,
          favorite: 0,
          uid: this.uuidv4(),
          name: this.selectedTagName,
          bold: 0
        }
        this.$store.dispatch(CREATE_TAG_REQUEST, data)
      }
    },
    changeTagColor (color) {
      if (this.selectedTagUid) {
        if (this.selectedTagColor.toLowerCase() !== color) {
          this.selectedTag.back_color = color || '#A998B6'
          this.$store.dispatch(UPDATE_TAG_REQUEST, this.selectedTag)
            .then((resp) => {
              console.log('changeTagColor', resp, color)
            })
        }
      } else {
        const data = {
          uid_parent: '00000000-0000-0000-0000-000000000000',
          back_color: this.selectedTag.back_color,
          comment: '',
          collapsed: 0,
          order: 1,
          group: 0,
          show: 0,
          favorite: 0,
          uid: this.uuidv4(),
          name: this.selectedTagName,
          bold: 0
        }
        this.$store.dispatch(CREATE_TAG_REQUEST, data)
        if (this.isCanEdit && this.selectedTagColor.toLowerCase() !== color) {
          this.selectedTag.back_color = color || '#A998B6'
          this.$store.dispatch(UPDATE_TAG_REQUEST, this.selectedTag)
            .then((resp) => {
              console.log('changeTagColor', resp, color)
            })
        }
      }
    }
  }
}
</script>

<style>

</style>
