<template>
  <Popper
    class="popper-color light"
    arrow
    trigger="hover"
    placement="bottom"
    :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,10px' } }
    }"
    :disabled="!canEdit"
    @open:popper="onShowSelectColor"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div
        class="popper"
        @click="close"
      >
        <div class="text-white body-popover-custom">
          <div class="container-color-popover">
            <div
              v-if="!myColors.length"
              class="text-sm text-center max-w-[176px]"
            >
              На данный момент у Вас нет цветов. Их можно добавить на вкладке "Прочее > Цвета"
            </div>
            <div
              v-for="(color, index) in myColors"
              v-else
              :key="index"
              class="list-color-access"
              :class="{ 'list-color-access_active': color.uid === currColor }"
              :title="color.name"
              :style="{
                'background-color': getValidBackColor(color.back_color),
                'border-color':
                  color.uid === currColor
                    ? 'black'
                    : getValidForeColor(color.fore_color)
              }"
              @click="onCheckColor(color.uid)"
            >
              <span
                class="inline-flex justify-center items-center checkcolor"
                :alt="color.name"
                :title="color.name"
              >
                <svg
                  viewBox="0 0 26 20"
                  width="15"
                  height="15"
                  class="inline-block"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299Z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      class="mt-3 tags-custom-color dark:bg-gray-800 dark:text-gray-100 project-hover-close"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <span v-if="selectedColor !== '00000000-0000-0000-0000-000000000000'">
        <svg
          width="24"
          height="24"
          viewBox="0 0 89 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M86.4883 31.2718L82.1334 26.8569C80.6576 25.3607 78.5769 24.8211 76.6656 25.2871C77.1253 23.3249 76.593 21.2155 75.1172 19.7438L65.6574 10.1535C64.7864 9.27053 63.6735 8.7064 62.5122 8.51017C62.3187 7.33285 61.7622 6.20458 60.8912 5.32158L57.9396 2.32921C55.6653 0.0236062 51.9879 0.0236062 49.7378 2.32921L20.0278 32.4492C17.7536 34.7548 17.7536 38.483 20.0278 40.764L26.3666 47.1903C26.9714 47.8035 27.2375 48.6129 27.165 49.4714C27.0682 50.3053 26.6085 51.0657 25.9069 51.5317C7.03567 63.7219 5.26951 65.5124 4.5195 66.2728C-0.706372 71.5708 -0.706372 80.18 4.5195 85.4779C9.74538 90.7759 18.2374 90.7759 23.4633 85.4779C24.2133 84.7176 25.9795 82.9271 38.0038 63.7955C38.4635 63.0842 39.1893 62.6182 40.0361 62.5201C40.8829 62.422 41.7055 62.7163 42.2861 63.3049L48.6249 69.7312C50.8992 72.0368 54.5766 72.0368 56.8266 69.7312L86.5367 39.6112C88.7626 37.2811 88.7626 33.5529 86.4883 31.2718ZM52.6895 65.537L46.3507 59.1107C44.512 57.2466 41.9474 56.3391 39.3587 56.6334C36.7699 56.9278 34.4715 58.3749 33.0683 60.5824C27.7456 69.069 21.0197 79.5177 19.302 81.2592C16.3503 84.2516 11.5357 84.2516 8.58407 81.2592C5.63242 78.2668 5.63242 73.3858 8.58407 70.3934C10.3018 68.652 20.6326 61.8578 28.9795 56.4372C31.157 55.0146 32.6086 52.6845 32.8989 50.06C33.1892 47.4356 32.2699 44.8356 30.4553 42.9715L24.1165 36.5453L28.7376 31.8605L57.2863 60.8031L52.6895 65.537ZM61.3993 56.707L32.8505 27.7644L53.8266 6.49891L56.8025 9.49128L53.4879 16.9477C53.3669 17.193 53.4395 17.5118 53.6331 17.708C53.8266 17.9043 54.1411 17.9533 54.3831 17.8307L61.5686 14.3232L71.0285 23.9135L61.9992 39.3961C61.8299 39.6659 61.8541 40.0092 62.0718 40.23C62.2896 40.4507 62.6525 40.4998 62.9186 40.3036L78.0447 31.002L82.3996 35.417L61.3993 56.707Z"
            :fill="colors[selectedColor]?.back_color ?? '#A998B6'"
            fill-opacity="0.5"
          />
          <path
            d="M18.2858 74.9311C18.2858 76.8442 16.7616 78.3895 14.8745 78.3895C12.9874 78.3895 11.4631 76.8442 11.4631 74.9311C11.4631 73.0179 12.9874 71.4727 14.8745 71.4727C16.7616 71.4727 18.2858 73.0179 18.2858 74.9311Z"
            :fill="colors[selectedColor]?.back_color ?? '#A998B6'"
            fill-opacity="1"
          />
        </svg>
        <span class="rounded"> {{ colors[selectedColor]?.name ?? '???' }}</span>
        <button
          v-if="canEdit"
          class="btn-close-popover"
          @click.stop="removeColor"
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
      </span>
      <span v-else>
        <svg
          width="24"
          height="24"
          viewBox="0 0 89 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M86.4883 31.2718L82.1334 26.8569C80.6576 25.3607 78.5769 24.8211 76.6656 25.2871C77.1253 23.3249 76.593 21.2155 75.1172 19.7438L65.6574 10.1535C64.7864 9.27053 63.6735 8.7064 62.5122 8.51017C62.3187 7.33285 61.7622 6.20458 60.8912 5.32158L57.9396 2.32921C55.6653 0.0236062 51.9879 0.0236062 49.7378 2.32921L20.0278 32.4492C17.7536 34.7548 17.7536 38.483 20.0278 40.764L26.3666 47.1903C26.9714 47.8035 27.2375 48.6129 27.165 49.4714C27.0682 50.3053 26.6085 51.0657 25.9069 51.5317C7.03567 63.7219 5.26951 65.5124 4.5195 66.2728C-0.706372 71.5708 -0.706372 80.18 4.5195 85.4779C9.74538 90.7759 18.2374 90.7759 23.4633 85.4779C24.2133 84.7176 25.9795 82.9271 38.0038 63.7955C38.4635 63.0842 39.1893 62.6182 40.0361 62.5201C40.8829 62.422 41.7055 62.7163 42.2861 63.3049L48.6249 69.7312C50.8992 72.0368 54.5766 72.0368 56.8266 69.7312L86.5367 39.6112C88.7626 37.2811 88.7626 33.5529 86.4883 31.2718ZM52.6895 65.537L46.3507 59.1107C44.512 57.2466 41.9474 56.3391 39.3587 56.6334C36.7699 56.9278 34.4715 58.3749 33.0683 60.5824C27.7456 69.069 21.0197 79.5177 19.302 81.2592C16.3503 84.2516 11.5357 84.2516 8.58407 81.2592C5.63242 78.2668 5.63242 73.3858 8.58407 70.3934C10.3018 68.652 20.6326 61.8578 28.9795 56.4372C31.157 55.0146 32.6086 52.6845 32.8989 50.06C33.1892 47.4356 32.2699 44.8356 30.4553 42.9715L24.1165 36.5453L28.7376 31.8605L57.2863 60.8031L52.6895 65.537ZM61.3993 56.707L32.8505 27.7644L53.8266 6.49891L56.8025 9.49128L53.4879 16.9477C53.3669 17.193 53.4395 17.5118 53.6331 17.708C53.8266 17.9043 54.1411 17.9533 54.3831 17.8307L61.5686 14.3232L71.0285 23.9135L61.9992 39.3961C61.8299 39.6659 61.8541 40.0092 62.0718 40.23C62.2896 40.4507 62.6525 40.4998 62.9186 40.3036L78.0447 31.002L82.3996 35.417L61.3993 56.707Z"
            fill="black"
            fill-opacity="0.5"
          />
          <path
            d="M18.2858 74.9311C18.2858 76.8442 16.7616 78.3895 14.8745 78.3895C12.9874 78.3895 11.4631 76.8442 11.4631 74.9311C11.4631 73.0179 12.9874 71.4727 14.8745 71.4727C16.7616 71.4727 18.2858 73.0179 18.2858 74.9311Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
        <span class="rounded">Цвет</span>
      </span>
    </div>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    selectedColor: {
      type: String,
      default: '00000000-0000-0000-0000-000000000000'
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changeColor'],
  data: () => ({
    currColor: this?.selectedColor
  }),
  computed: {
    colors () {
      return this.$store.state.colors.colors
    },
    myColors () {
      return Object.values(this.$store.state.colors.mycolors)
    },
    currUserUid () {
      return this.$store.state.user.user.current_user_uid
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6' && foreColor !== '#FFFFFF') { return foreColor }
      return '#000000'
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6' && backColor !== '#FFFFFF') { return backColor }
      return 'rgb(229, 231, 235)'
    },
    onShowSelectColor () {
      this.currColor = this.selectedColor
    },
    isCheckedColor (uid) {
      return this.currColor === uid
    },
    onCheckColor (uid) {
      if (this.currColor !== uid) {
        this.currColor = uid
        this.onSave()
      }
    },
    onSave () {
      this.$emit('changeColor', this.currColor)
    },
    removeColor () {
      if (this.currColor !== '00000000-0000-0000-0000-000000000000') {
        this.currColor = '00000000-0000-0000-0000-000000000000'
        this.onSave()
      }
    }
  }
}
</script>

<style scoped>
.tags-custom-color {
  padding: 4px 6px 4px 4px;
  border-radius: 5px;
  margin: 2px 2px 2px 2px;
  font-size: 12px;
  float: left;
  position: relative;
  display: flex;
  background: #f4f5f7;
}
.tags-custom-color svg {
  position: relative;
  top: 3px;
  float: left;
  display: flex;
  font-size: 18px;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: #9e9e9e;
}
.btn-close-popover {
  margin-right: 5px;
  margin-left: 5px;
  font-size: 11px;
  display: none;
  position: absolute;
  left: -2px;
  width: 16px;
  height: 20px;
  top: 5px;
  color: #3F3F4O;
  -webkit-transition: all 0.2s ease-in;
  -moz-transition: all 0.2s ease-in;
  -o-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  background: #F4F5F7;
  animation-delay: -2s;
  opacity: 0;
  z-index: 9999;
  animation: ani 2.5s forwards;
}
.btn-close-popover svg {
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
}
.list-color-access {
  display: table-cell;
  margin-bottom: 2px;
  padding: 2px 5px 5px 5px;
  margin-right: 5px;
  line-height: 25px;
  width: 30px;
  border-radius: 7px;
  height: 30px;
  float: left;
}
.checkcolor {
  display: none;
}
.list-color-access:hover {
  border-width: 2px;
  border-style: solid;
  cursor: pointer;
  padding: 2px;
}
.list-color-access_active {
  border: 2px solid black;
  cursor: pointer;
  padding: 2px;
}
.list-color-access_active .checkcolor {
  display: table;
  margin: 3px auto;
}
</style>
