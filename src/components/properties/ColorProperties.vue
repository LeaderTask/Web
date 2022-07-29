<template>
  <div>
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить цвет"
      :text="`Вы действительно хотите удалить цвет ${selectedColorName}?`"
      @cancel="showConfirm = false"
      @yes="removeColor"
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
      v-if="isCanEdit"
      v-model="currName"
      type="text"
      placeholder="Наименование"
      class="mt-[25px] p-0 font-roboto font-bold text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeColorName"
    >
    <div
      v-else
      class="mt-[25px] w-full font-roboto font-bold text-[18px] leading-[21px] text-[#424242] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ currName }}
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Цвет фона
    </div>
    <div class="w-full mt-[15px] gap-[4px] flex flex-col">
      <div
        v-for="(clrs, index) in defaultBackColors"
        :key="index"
        class="flex gap-[4px]"
      >
        <PropsColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :class="{'cursor-pointer': isCanEdit}"
          :color="clr.color"
          :selected="clr.selected"
          @select="changeColorBack"
        />
      </div>
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Цвет букв
    </div>
    <div class="w-full mt-[15px] gap-[4px] flex flex-col">
      <div
        v-for="(clrs, index) in defaultTextColors"
        :key="index"
        class="flex gap-[4px]"
      >
        <PropsColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :class="{'cursor-pointer': isCanEdit}"
          :color="clr.color"
          :selected="clr.selected"
          @select="changeColorText"
        />
      </div>
    </div>
    <div
      class="mt-[45px] flex gap-[10px] items-center"
      :class="{'cursor-pointer': isCanEdit}"
      @click="changeColorUppercase"
    >
      <svg
        v-if="selectedColorUppercase"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 5C0 2.23858 2.23858 0 5 0H15C17.7614 0 20 2.23858 20 5V15C20 17.7614 17.7614 20 15 20H5C2.23858 20 0 17.7614 0 15V5Z"
          fill="#FF9123"
        />
        <path
          d="M9.02899 14.1663C8.80147 14.1663 8.57397 14.0661 8.34645 13.9659L4.59245 11.46C4.13742 11.1593 4.02366 10.4577 4.36494 10.0567C4.70621 9.65579 5.50251 9.55555 5.95754 9.85626L8.91524 11.7607L14.7169 6.14759C15.1719 5.74665 15.8545 5.74665 16.3095 6.04735C16.7645 6.44829 16.7645 7.0497 16.4232 7.45064L9.93905 13.6652C9.71154 14.0661 9.37026 14.1663 9.02899 14.1663Z"
          fill="white"
        />
      </svg>
      <svg
        v-else
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="20"
          height="20"
          rx="4"
          fill="#EEEFF1"
        />
        <rect
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="3.5"
          stroke="black"
          stroke-opacity="0.1"
        />
      </svg>

      <div class="font-roboto text-[16px] leading-[20px] text-[#4c4c4d]">
        Все буквы прописные
      </div>
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Предпросмотр
    </div>
    <div
      class="mt-[15px] w-full"
    >
      <div
        class="w-full flex items-center justify-center h-[40px] rounded-[8px]"
        :class="{ 'border border-black/10': !selectedColorBack}"
        :style="{ 'background-color': selectedColorBack || 'white'}"
      >
        <div
          class="font-roboto text-[#606061] text-[15px]"
          :class="{ 'uppercase': selectedColorUppercase }"
          :style="{ color: selectedColorText || 'black' }"
        >
          Текст
        </div>
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

import { UPDATE_COLOR_REQUEST, REMOVE_COLOR_REQUEST } from '@/store/actions/colors'
import { NAVIGATOR_REMOVE_COLOR } from '@/store/actions/navigator'

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
    defaultBackColors () {
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
      const usedColor = this.selectedColorBack.toLowerCase()
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
    defaultTextColors () {
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
      const usedColor = this.selectedColorText.toLowerCase()
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
    user () {
      return this.$store.state.user.user
    },
    selectedColor () {
      return this.$store.state.colors.selectedColor
    },
    selectedColorUid () {
      return this.selectedColor?.uid || ''
    },
    selectedColorName () {
      return this.selectedColor?.name || ''
    },
    selectedColorUppercase () {
      return !!this.selectedColor?.uppercase
    },
    selectedColorText () {
      const textColor = this.selectedColor?.fore_color
      if (textColor && textColor !== '#A998B6') return textColor
      return ''
    },
    selectedColorBack () {
      const backColor = this.selectedColor?.back_color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      return this.user.current_user_email === this.selectedColor.email_creator
    },
    isCanEdit () {
      return this.isCanDelete
    }
  },
  watch: {
    selectedColorName: {
      immediate: true,
      handler: function (val) {
        this.currName = val
      }
    }
  },
  methods: {
    print (msg, param) {
      console.log(msg, param)
    },
    removeColor () {
      this.showConfirm = false
      this.$store.dispatch(REMOVE_COLOR_REQUEST, this.selectedColorUid)
        .then((resp) => {
          console.log('removeColor', resp)
          //
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_COLOR, this.selectedColor)
          // выходим выше на один уровень навигации (надеемся что этот цвет последний в стеке)
          this.$store.dispatch('popNavStack')
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeColorName () {
      const title = this.currName.trim()
      if (this.isCanEdit && title && this.selectedColorName !== title) {
        this.selectedColor.name = title
        this.$store.dispatch(UPDATE_COLOR_REQUEST, this.selectedColor)
          .then((resp) => {
            console.log('changeColorName', resp)
          })
      }
    },
    changeColorUppercase () {
      if (this.isCanEdit) {
        this.selectedColor.uppercase = this.selectedColorUppercase ? 0 : 1
        this.$store.dispatch(UPDATE_COLOR_REQUEST, this.selectedColor)
          .then((resp) => {
            console.log('changeColorUppercase', resp)
          })
      }
    },
    changeColorText (color) {
      if (this.isCanEdit && this.selectedColorText.toLowerCase() !== color) {
        this.selectedColor.fore_color = color || '#A998B6'
        this.$store.dispatch(UPDATE_COLOR_REQUEST, this.selectedColor)
          .then((resp) => {
            console.log('changeColorText', resp, color)
          })
      }
    },
    changeColorBack (color) {
      if (this.isCanEdit && this.selectedColorBack.toLowerCase() !== color) {
        this.selectedColor.back_color = color || '#A998B6'
        this.$store.dispatch(UPDATE_COLOR_REQUEST, this.selectedColor)
          .then((resp) => {
            console.log('changeColorText', resp, color)
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
