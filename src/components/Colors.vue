<template>
  <div class="w-full">
    <div>
      <BoardModalBoxRename
        v-if="visibleModal"
        :show="visibleModal"
        title="Добавить цвет"
        @cancel="visibleModal = false"
        @save="createColor"
      />
      <ColorModalBoxColorsLimit
        v-if="showColorsLimit"
        @cancel="showColorsLimit = false"
        @ok="showColorsLimit = false"
      />
      <div class="flex items-center justify-between w-full">
        <p
          class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold"
        >
          Цвета
        </p>
        <div class="flex">
          <Icon
            :path="listView.path"
            :width="listView.width"
            :height="listView.height"
            :box="listView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': !isGridView,
              'text-gray-400': isGridView
            }"
            @click="updateGridView(false)"
          />
          <Icon
            :path="gridView.path"
            :width="gridView.width"
            :height="gridView.height"
            :box="gridView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': isGridView,
              'text-gray-400': !isGridView
            }"
            @click="updateGridView(true)"
          />
        </div>
      </div>
      <div
        class="grid gap-2 mt-3 grid-cols-1"
        :class="{
          'md:grid-cols-2 lg:grid-cols-4': isGridView,
          'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
        }"
      >
        <ListBlocAdd @click.stop="clickAddColor" />
        <template
          v-for="color in colors"
          :key="color.uid"
        >
          <ListBlocItem
            :title="color.name"
            :style="{
              backgroundColor: getValidBackColor(color.back_color),
              color: getValidForeColor(color.fore_color)
            }"
            @click="clickOnGridCard(color)"
          >
            <Icon
              :box="colorIcon.viewBox"
              :path="colorIcon.path"
              height="24"
              width="24"
              w="-mt-[2px]"
              h="-ml-[2px]"
              class="text-[#606061]"
              :style="{ color: getValidForeColor(color.fore_color) }"
            />
          </ListBlocItem>
        </template>
      </div>

      <EmptyTasksListPics v-if="isEmpty" />
    </div>
  </div>
</template>

<script>
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import ColorModalBoxColorsLimit from '@/components/ColorModalBoxColorsLimit.vue'
import Icon from '@/components/Icon.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'

import * as TASK from '@/store/actions/tasks'
import { setLocalStorageItem } from '@/store/helpers/functions'
import { SELECT_COLOR, CREATE_COLOR_REQUEST } from '@/store/actions/colors'
import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

export default {
  components: {
    Icon,
    ListBlocAdd,
    ListBlocItem,
    BoardModalBoxRename,
    ColorModalBoxColorsLimit,
    EmptyTasksListPics
  },
  props: {
    colors: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showColorsLimit: false,
      gridView,
      listView,
      visibleModal: false,
      colorIcon: {
        path: [
          'M24.6092 11.9041L23.6149 10.9103C23.278 10.5735 22.8029 10.452 22.3666 10.5569C22.4715 10.1153 22.35 9.64044 22.013 9.30918L19.8533 7.15045C19.6544 6.95169 19.4003 6.82471 19.1352 6.78054C19.091 6.51553 18.964 6.26156 18.7651 6.0628L18.0912 5.38923C17.572 4.87026 16.7324 4.87026 16.2187 5.38923L9.43554 12.1691C8.91631 12.6881 8.91631 13.5273 9.43554 14.0407L10.8828 15.4872C11.0208 15.6253 11.0816 15.8075 11.065 16.0007C11.0429 16.1884 10.938 16.3596 10.7778 16.4645C6.46931 19.2084 6.06608 19.6115 5.89484 19.7826C4.70172 20.9752 4.70172 22.913 5.89484 24.1056C7.08796 25.2981 9.02679 25.2981 10.2199 24.1056C10.3911 23.9344 10.7944 23.5314 13.5397 19.225C13.6446 19.0649 13.8103 18.96 14.0037 18.9379C14.197 18.9158 14.3848 18.9821 14.5174 19.1146L15.9646 20.5611C16.4838 21.0801 17.3234 21.0801 17.8371 20.5611L24.6202 13.7812C25.1284 13.2567 25.1284 12.4175 24.6092 11.9041ZM16.8926 19.617L15.4453 18.1705C15.0255 17.7509 14.44 17.5466 13.849 17.6128C13.258 17.6791 12.7332 18.0048 12.4128 18.5017C11.1976 20.412 9.66202 22.764 9.26983 23.156C8.59594 23.8295 7.49672 23.8295 6.82283 23.156C6.14893 22.4824 6.14893 21.3837 6.82283 20.7101C7.21501 20.3182 9.57364 18.7888 11.4793 17.5687C11.9765 17.2484 12.3079 16.7239 12.3742 16.1332C12.4404 15.5424 12.2305 14.9572 11.8163 14.5376L10.3691 13.0911L11.4241 12.0366L17.9421 18.5514L16.8926 19.617ZM18.8811 17.6294L12.3631 11.1146L17.1522 6.32781L17.8316 7.00138L17.0748 8.67978C17.0472 8.73499 17.0638 8.80676 17.108 8.85093C17.1522 8.8951 17.224 8.90614 17.2792 8.87854L18.9198 8.08903L21.0795 10.2478L19.0181 13.7328C18.9794 13.7935 18.9849 13.8708 19.0346 13.9205C19.0844 13.9702 19.1672 13.9812 19.228 13.9371L22.6814 11.8433L23.6757 12.8371L18.8811 17.6294Z',
          'M9.03784 21.7315C9.03784 22.1622 8.68984 22.51 8.25899 22.51C7.82814 22.51 7.48015 22.1622 7.48015 21.7315C7.48015 21.3009 7.82814 20.9531 8.25899 20.9531C8.68984 20.9531 9.03784 21.3009 9.03784 21.7315Z'
        ],
        viewBox: '0 0 30 30',
        width: 30,
        height: 30
      }
    }
  },
  computed: {
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isGridView () {
      return this.$store.state.isGridView
    },
    user () {
      return this.$store.state.user.user
    },
    greed () {
      return this.$store.state.greedSource
    },
    isEmpty () {
      return !this.colors.length
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
    clickAddColor () {
      const user = this.$store.state.user.user
      // если лицензия истекла
      if (Object.keys(this.$store.state.colors.mycolors).length >= 3 && user.days_left <= 0) {
        this.showColorsLimit = true
        return
      }
      this.visibleModal = true
    },
    createColor (name) {
      const randomColors = [
        '#F5F5DC',
        '#FFE5B4',
        '#FFC0CB',
        '#D0F0C0',
        '#C9A0DC',
        '#D8BFD8',
        '#FFCC00',
        '#F4A460',
        '#FFDB58',
        '#E6E6FA'
      ]
      const color = {
        back_color: randomColors[Math.floor(Math.random() * randomColors.length - 1)],
        fore_color: '',
        uppercase: 0,
        order: 0,
        default: 0,
        email_creator: this.user.current_user_email,
        uid: this.uuidv4(),
        name: name,
        bold: 0,
        parentID: 'ed8039ae-f3de-4369-8f32-829d401056e9'
      }
      this.$store.dispatch(CREATE_COLOR_REQUEST, color).then(() => {
        this.visibleModal = false
        this.$store.state.greedSource.unshift(color)
        this.clickOnGridCard(color)
      })
    },
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    openProperties (color) {
      if (!this.isPropertiesMobileExpanded.value) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'color' })
      this.$store.commit(SELECT_COLOR, color)
    },
    clickOnGridCard (value) {
      this.$store.dispatch(TASK.COLOR_TASKS_REQUEST, value.uid)
      const navElem = {
        name: value.name,
        key: 'taskListSource',
        value: { uid: value.parentID, param: value.uid },
        typeVal: value.uid,
        type: 'color'
      }
      this.$store.commit('pushIntoNavStack', navElem)
      this.$store.commit('basic', {
        key: 'taskListSource',
        value: { uid: value.parentID, param: value.uid }
      })
      this.$store.commit('basic', { key: 'mainSectionState', value: 'tasks' })
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    },
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    }
  }
}
</script>
