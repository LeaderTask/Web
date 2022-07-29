<template>
  <div
    class="group bg-white rounded-[10px] border px-[18px] py-[20px] cursor-default"
    :class="{ 'border-[#e5e5e5]': !selected, 'border-[#ff9123]': selected }"
    @click="selectCard"
  >
    <div
      v-if="haveCover"
      class="overflow-hidden rounded-[10px] mb-[20px] flex place-content-center"
      :style="{ background: card.cover_color, height: `${coverHeight}px` }"
    >
      <div
        v-if="card.cover_link"
        class="bg-cover bg-center bg-origin-content bg-clip-content"
        :style="{
          'background-image': `url(${card.cover_link})`,
          height: `${coverSize.y}px`,
          width: `${coverSize.x}px`
        }"
      />
      <div v-else>
&nbsp;
      </div>
    </div>
    <div class="flex items-start justify-between">
      <div class="width100without18">
        <p
          class="text-[#424242] font-['Roboto'] text-[14px] leading-[18px] font-medium tracking-[.02em] break-words"
        >
          {{ card.name }}
        </p>
        <p
          v-if="card.comment"
          class="text-[#4c4c4d] font-['Roboto'] text-[13px] leading-[17px] whitespace-pre-line break-words mt-2"
        >
          {{ card.comment }}
        </p>
      </div>
      <!-- кнопка три точки -->

      <div
        v-if="!readOnly"
        :ref="`card-icon-${card.uid}`"
        class="flex-none h-[18px] w-[18px] overflow-hidden cursor-pointer invisible group-hover:visible"
        @click.stop=""
      >
        <PopMenu
          @openMenu="lockVisibility(card.uid)"
          @closeMenu="unlockVisibility(card.uid)"
        >
          <div
            class="hover:-m-px hover:border hover:rounded-sm border-[#7e7e80]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.35524 16.1055C8.37421 16.1055 7.57892 15.3102 7.57892 14.3291C7.57892 13.3481 8.37421 12.5528 9.35524 12.5528C10.3363 12.5528 11.1316 13.3481 11.1316 14.3291C11.1316 15.3102 10.3363 16.1055 9.35524 16.1055ZM9.35524 10.7765C8.37421 10.7765 7.57892 9.9812 7.57892 9.00016C7.57892 8.01912 8.37421 7.22383 9.35524 7.22383C10.3363 7.22383 11.1316 8.01912 11.1316 9.00016C11.1316 9.9812 10.3363 10.7765 9.35524 10.7765ZM7.57892 3.67118C7.57892 4.65222 8.37421 5.4475 9.35524 5.4475C10.3363 5.4475 11.1316 4.65222 11.1316 3.67118C11.1316 2.69015 10.3363 1.89486 9.35524 1.89486C8.37421 1.89486 7.57892 2.69015 7.57892 3.67118Z"
                fill="#7e7e80"
              />
            </svg>
          </div>
          <template #menu>
            <PopMenuItem
              icon="move"
              @click="clickMove"
            >
              Переместить
            </PopMenuItem>
            <PopMenuDivider v-if="!isArchive" />
            <PopMenuItem
              v-if="!isArchive"
              @click="clickSuccess"
            >
              Архивировать: Успех
            </PopMenuItem>
            <PopMenuItem
              v-if="!isArchive"
              @click="clickReject"
            >
              Архивировать: Отказ
            </PopMenuItem>
            <PopMenuDivider />
            <PopMenuItem
              icon="delete"
              @click="clickDelete"
            >
              Удалить
            </PopMenuItem>
          </template>
        </PopMenu>
      </div>
    </div>
    <div
      v-if="showDate || cost || card.has_files || card.has_msgs"
      class="flex justify-between mt-[20px]"
    >
      <div class="flex flex-wrap">
        <!-- выводим дату -->
        <div
          v-if="showDate"
          class="flex items-center mr-1"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.33328 1.47884C4.33328 1.15668 4.59445 0.895508 4.91662 0.895508C5.23879 0.895508 5.49996 1.15668 5.49996 1.47884V1.89551H10.5V1.47884C10.5 1.15668 10.7612 0.895508 11.0833 0.895508C11.4055 0.895508 11.6667 1.15668 11.6667 1.47884V1.89551H12.6667C13.403 1.89551 14 2.49247 14 3.22885V11.8956C14 12.6319 13.403 13.2289 12.6667 13.2289H3.33328C2.5969 13.2289 1.99994 12.6319 1.99994 11.8956V3.22885C1.99994 2.49247 2.5969 1.89551 3.33328 1.89551H4.33328V1.47884ZM10.5 2.81218V3.47885C10.5 3.80102 10.7612 4.06219 11.0833 4.06219C11.4055 4.06219 11.6667 3.80102 11.6667 3.47886V2.81218H12.6667C12.8968 2.81218 13.0833 2.99873 13.0833 3.22885V11.8956C13.0833 12.1257 12.8968 12.3122 12.6667 12.3122H3.33328C3.10316 12.3122 2.91661 12.1257 2.91661 11.8956V3.22885C2.91661 2.99873 3.10316 2.81218 3.33328 2.81218H4.33328V3.47885C4.33328 3.80102 4.59445 4.06219 4.91662 4.06219C5.23879 4.06219 5.49996 3.80102 5.49996 3.47885V2.81218H10.5ZM4.86981 5.18357C4.4564 5.18357 4.12127 5.52632 4.12127 5.94913C4.12127 6.37193 4.4564 6.71468 4.86981 6.71468C5.28322 6.71468 5.61835 6.37193 5.61835 5.94913C5.61835 5.52632 5.28322 5.18357 4.86981 5.18357ZM8.28586 5.94913C8.28586 5.52632 8.621 5.18357 9.0344 5.18357C9.44781 5.18357 9.78294 5.52632 9.78294 5.94913C9.78294 6.37193 9.44781 6.71468 9.0344 6.71468C8.621 6.71468 8.28586 6.37193 8.28586 5.94913ZM8.28586 8.09267C8.28586 7.66987 8.621 7.32712 9.0344 7.32712C9.44781 7.32712 9.78294 7.66987 9.78294 8.09267C9.78294 8.51547 9.44781 8.85822 9.0344 8.85822C8.621 8.85822 8.28586 8.51547 8.28586 8.09267ZM8.28586 10.2362C8.28586 9.81341 8.621 9.47066 9.0344 9.47066C9.44781 9.47066 9.78294 9.81341 9.78294 10.2362C9.78294 10.659 9.44781 11.0018 9.0344 11.0018C8.621 11.0018 8.28586 10.659 8.28586 10.2362ZM10.3818 5.94913C10.3818 5.52632 10.7169 5.18357 11.1303 5.18357C11.5437 5.18357 11.8789 5.52632 11.8789 5.94913C11.8789 6.37193 11.5437 6.71468 11.1303 6.71468C10.7169 6.71468 10.3818 6.37193 10.3818 5.94913ZM10.3818 8.09267C10.3818 7.66987 10.7169 7.32712 11.1303 7.32712C11.5437 7.32712 11.8789 7.66987 11.8789 8.09267C11.8789 8.51547 11.5437 8.85822 11.1303 8.85822C10.7169 8.85822 10.3818 8.51547 10.3818 8.09267ZM10.3818 10.2362C10.3818 9.81341 10.7169 9.47066 11.1303 9.47066C11.5437 9.47066 11.8789 9.81341 11.8789 10.2362C11.8789 10.659 11.5437 11.0018 11.1303 11.0018C10.7169 11.0018 10.3818 10.659 10.3818 10.2362ZM4.12127 8.09267C4.12127 7.66987 4.4564 7.32712 4.86981 7.32712C5.28322 7.32712 5.61835 7.66987 5.61835 8.09267C5.61835 8.51547 5.28322 8.85822 4.86981 8.85822C4.4564 8.85822 4.12127 8.51547 4.12127 8.09267ZM4.12127 10.2362C4.12127 9.81341 4.4564 9.47066 4.86981 9.47066C5.28322 9.47066 5.61835 9.81341 5.61835 10.2362C5.61835 10.659 5.28322 11.0018 4.86981 11.0018C4.4564 11.0018 4.12127 10.659 4.12127 10.2362ZM6.21718 5.94913C6.21718 5.52632 6.55232 5.18357 6.96572 5.18357C7.37913 5.18357 7.71426 5.52632 7.71426 5.94913C7.71426 6.37193 7.37913 6.71468 6.96572 6.71468C6.55232 6.71468 6.21718 6.37193 6.21718 5.94913ZM6.21718 8.09267C6.21718 7.66987 6.55232 7.32712 6.96572 7.32712C7.37913 7.32712 7.71426 7.66987 7.71426 8.09267C7.71426 8.51547 7.37913 8.85822 6.96572 8.85822C6.55232 8.85822 6.21718 8.51547 6.21718 8.09267ZM6.21718 10.2362C6.21718 9.81341 6.55232 9.47066 6.96572 9.47066C7.37913 9.47066 7.71426 9.81341 7.71426 10.2362C7.71426 10.659 7.37913 11.0018 6.96572 11.0018C6.55232 11.0018 6.21718 10.659 6.21718 10.2362Z"
              fill="#7e7e80"
            />
          </svg>
          <span
            class="text-[10px] leading-[12px] text-[#7e7e80] font-['Roboto'] mx-0.5"
          >
            {{ date }}
          </span>
        </div>
        <!-- выводим бюджет -->
        <div
          v-if="cost"
          class="flex items-center mr-1"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.25924 4.44448C3.10208 4.44448 2.95135 4.50691 2.84021 4.61805C2.72908 4.72918 2.66665 4.87991 2.66665 5.03707V10.963C2.66665 11.1202 2.72908 11.2709 2.84021 11.382C2.95135 11.4932 3.10208 11.5556 3.25924 11.5556H12.7407C12.8979 11.5556 13.0486 11.4932 13.1597 11.382C13.2709 11.2709 13.3333 11.1202 13.3333 10.963V5.03707C13.3333 4.87991 13.2709 4.72918 13.1597 4.61805C13.0486 4.50691 12.8979 4.44448 12.7407 4.44448H3.25924ZM2.00216 3.77999C2.33556 3.4466 2.78774 3.25929 3.25924 3.25929H12.7407C13.2122 3.25929 13.6644 3.4466 13.9978 3.77999C14.3312 4.11339 14.5185 4.56558 14.5185 5.03707V10.963C14.5185 11.4345 14.3312 11.8867 13.9978 12.2201C13.6644 12.5535 13.2122 12.7408 12.7407 12.7408H3.25924C2.78774 12.7408 2.33556 12.5535 2.00216 12.2201C1.66876 11.8867 1.48146 11.4345 1.48146 10.963V5.03707C1.48146 4.56558 1.66876 4.11339 2.00216 3.77999Z"
              fill="#7e7e80"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.99998 6.81485C7.34542 6.81485 6.8148 7.34548 6.8148 8.00004C6.8148 8.6546 7.34542 9.18522 7.99998 9.18522C8.65454 9.18522 9.18517 8.6546 9.18517 8.00004C9.18517 7.34548 8.65454 6.81485 7.99998 6.81485ZM5.62961 8.00004C5.62961 6.69092 6.69086 5.62967 7.99998 5.62967C9.3091 5.62967 10.3704 6.69092 10.3704 8.00004C10.3704 9.30916 9.3091 10.3704 7.99998 10.3704C6.69086 10.3704 5.62961 9.30916 5.62961 8.00004Z"
              fill="#7e7e80"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.6712 3.3044C4.89264 3.39613 5.03702 3.61221 5.03702 3.85189C5.03702 4.63771 4.72485 5.39136 4.16919 5.94702C3.61352 6.50268 2.85988 6.81485 2.07406 6.81485C1.83437 6.81485 1.61829 6.67047 1.52657 6.44903C1.43485 6.2276 1.48555 5.97271 1.65503 5.80323L4.0254 3.43286C4.19488 3.26338 4.44976 3.21268 4.6712 3.3044ZM13.9259 10.3704C13.4544 10.3704 13.0022 10.5577 12.6688 10.8911C12.3354 11.2245 12.1481 11.6767 12.1481 12.1482C12.1481 12.4755 11.8828 12.7408 11.5555 12.7408C11.2283 12.7408 10.9629 12.4755 10.9629 12.1482C10.9629 11.3624 11.2751 10.6087 11.8308 10.0531C12.3864 9.49739 13.1401 9.18522 13.9259 9.18522C14.2532 9.18522 14.5185 9.45053 14.5185 9.77781C14.5185 10.1051 14.2532 10.3704 13.9259 10.3704Z"
              fill="#7e7e80"
            />
          </svg>
          <span
            class="text-[10px] leading-[12px] text-[#7e7e80] font-['Roboto'] mx-0.5"
          >
            {{ cost }}
          </span>
        </div>
      </div>
      <!-- Иконки справа -->
      <div
        v-if="card.has_files || card.has_msgs"
        class="flex items-center"
      >
        <!-- Иконка сообщений -->
        <svg
          v-if="card.has_msgs"
          class="ml-1"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.48726 5.94928H9.51742C9.77013 5.94928 9.98295 5.73671 9.98295 5.4843C9.98295 5.23188 9.77013 5.01932 9.51742 5.01932H5.48726C5.23454 5.01932 5.02173 5.23188 5.02173 5.4843C5.02173 5.73671 5.22124 5.94928 5.48726 5.94928Z"
            fill="#7e7e80"
          />
          <path
            d="M8.17403 7.29106C8.42675 7.29106 8.63956 7.0785 8.63956 6.82609C8.63956 6.57367 8.42675 6.36111 8.17403 6.36111H5.48726C5.23454 6.36111 5.02173 6.57367 5.02173 6.82609C5.02173 7.0785 5.23454 7.29106 5.48726 7.29106H8.17403Z"
            fill="#7e7e80"
          />
          <path
            d="M11.9914 8.5V4.47464C11.9914 3.66425 11.3263 3 10.515 3H4.47639C3.66504 3 3 3.66425 3 4.47464V11.1836C3 11.3696 3.10641 11.529 3.26602 11.6087C3.33252 11.6353 3.39903 11.6486 3.46553 11.6486C3.57194 11.6486 3.67834 11.6087 3.77145 11.5423L5.66017 9.97464H10.5283C11.3263 9.97464 11.9914 9.31039 11.9914 8.5ZM5.18134 9.13768L3.93106 10.1739V4.47464C3.93106 4.18237 4.17048 3.94324 4.46309 3.94324H10.5017C10.7943 3.94324 11.0337 4.18237 11.0337 4.47464V8.5C11.0337 8.79227 10.7943 9.0314 10.5017 9.0314H5.48726C5.36755 9.0314 5.26114 9.07126 5.18134 9.13768Z"
            fill="#7e7e80"
          />
          <path
            d="M12.5367 5.68357C12.284 5.68357 12.0712 5.89614 12.0712 6.14855C12.0712 6.40097 12.284 6.61353 12.5367 6.61353C12.8293 6.61353 13.0687 6.85266 13.0687 7.14493V12.5386L12.151 11.808C12.0712 11.7415 11.9648 11.7017 11.8584 11.7017H7.16317C6.87055 11.7017 6.63113 11.4626 6.63113 11.1703V10.8382C6.63113 10.5857 6.41832 10.3732 6.1656 10.3732C5.91289 10.3732 5.70007 10.5857 5.70007 10.8382V11.1703C5.70007 11.9807 6.36512 12.6449 7.17647 12.6449H11.7121L13.2417 13.8937C13.3215 13.9601 13.4279 14 13.5343 14C13.6008 14 13.6673 13.9867 13.7338 13.9601C13.8934 13.8804 13.9998 13.721 13.9998 13.535V7.15821C14.0131 6.34783 13.3481 5.68357 12.5367 5.68357Z"
            fill="#7e7e80"
          />
        </svg>
        <!-- Иконка файлов -->
        <svg
          v-if="card.has_files"
          class="ml-1"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.93164 12.0197C4.55274 12.6759 5.36698 13 6.18122 13C6.99546 13 7.8097 12.6719 8.43079 12.0157L12.3354 7.89047C13.2215 6.95419 13.2215 5.42973 12.3354 4.49345C11.9074 4.04131 11.3355 3.78924 10.7296 3.78924C10.1237 3.78924 9.55179 4.03731 9.12384 4.49345L5.5374 8.28258C5.0072 8.84275 5.0072 9.75903 5.5374 10.3192C6.0676 10.8794 6.93486 10.8794 7.46506 10.3192L9.82447 7.82645C10.0025 7.63839 10.0025 7.3343 9.82447 7.14624C9.64647 6.95819 9.35864 6.95819 9.18065 7.14624L6.82503 9.64299C6.64704 9.83105 6.35921 9.83105 6.18122 9.64299C6.00322 9.45494 6.00322 9.15085 6.18122 8.96279L9.76387 5.17765C10.0214 4.90557 10.3622 4.75753 10.7296 4.75753C11.0932 4.75753 11.4378 4.90557 11.6953 5.17765C12.2255 5.73782 12.2255 6.6541 11.6953 7.21426L7.78697 11.3395C6.90078 12.2758 5.45787 12.2758 4.57167 11.3395C4.14372 10.8874 3.90892 10.2832 3.90892 9.64299C3.90892 9.0028 4.14372 8.39862 4.57546 7.94648L8.47624 3.82125C8.65423 3.63319 8.65423 3.3291 8.47624 3.14104C8.29824 2.95299 8.01042 2.95299 7.83242 3.14104L3.93164 7.26628C3.32948 7.89847 3 8.74272 3 9.64299C3 10.5393 3.32948 11.3835 3.93164 12.0197Z"
            fill="#7e7e80"
          />
        </svg>
      </div>
    </div>
    <div
      v-if="card.user"
      class="flex items-center"
      :class="{
        'mt-2': showDate || cost || card.has_files || card.has_msgs,
        'mt-[20px]': !showDate && !cost && !card.has_files && !card.has_msgs
      }"
    >
      <img
        v-if="getEmpPhotoByEmail(card.user)"
        class="w-[22px] h-[22px] rounded-[5px] border border-black/10"
        :src="getEmpPhotoByEmail(card.user)"
        alt="Avatar"
      >
      <span
        class="ml-1 text-[12px] leading-[14px] text-[#777777] font-['Roboto']"
      >
        {{ getEmpNameByEmail(card.user) }}
      </span>
    </div>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'

export default {
  components: {
    PopMenu,
    PopMenuItem,
    PopMenuDivider
  },
  props: {
    card: {
      type: Object,
      default: () => ({})
    },
    showDate: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'moveSuccess', 'moveReject', 'moveColumn', 'delete'],
  computed: {
    isArchive () {
      return (
        this.card.uid_stage === 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67' ||
        this.card.uid_stage === 'e70af5e2-6108-4c02-9a7d-f4efee78d28c'
      )
    },
    employees () {
      return this.$store.state.employees.employees
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    // делаем картинки маленькими - ограничиваем по высоте и ширине
    coverSize () {
      if (this.card.cover_size_x > 0 && this.card.cover_size_y > 0) {
        const size = { x: this.card.cover_size_x, y: this.card.cover_size_y }
        const maxWidth = 220
        const maxHeight = 220
        const ratio = size.x / size.y
        if (size.x < size.y) {
          if (size.y > maxHeight) {
            size.y = maxHeight
            size.x = Math.ceil(size.y * ratio)
          }
        } else {
          if (size.x > maxWidth) {
            size.x = maxWidth
            size.y = Math.ceil(size.x / ratio)
          }
        }
        return size
      }
      return { x: 0, y: 0 }
    },
    coverHeight () {
      if (
        this.card.uid_cover_file !== '00000000-0000-0000-0000-000000000000' &&
        this.card.cover_size_x > 0 &&
        this.card.cover_size_y > 0
      ) {
        const minCoverHeight = 40
        return minCoverHeight < this.coverSize.y
          ? this.coverSize.y
          : minCoverHeight
      } else if (this.card.cover_color && this.card.cover_color !== '#A998B6') {
        const colorHeight = 11
        return colorHeight
      }
      return 0
    },
    haveCover () {
      return this.coverHeight > 0
    },
    cost () {
      if (this.card.cost > 0) {
        const fractional = this.card.cost % 100
        const value = Math.floor(this.card.cost / 100)
        let valString = ''
        let valueString = value.toString()
        while (valueString) {
          valString = valueString.slice(-3) + ' ' + valString
          valueString = valueString.slice(0, -3)
        }
        valString = valString.trim()
        if (fractional > 0) {
          const frString = (fractional < 10 ? '0' : '') + fractional
          return `${valString}.${frString}`
        }
        return valString
      }
      return ''
    },
    date () {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      let dateMoveString = this.card.date_move
      if (dateMoveString[dateMoveString.length - 1] !== 'Z') {
        dateMoveString = dateMoveString + 'Z'
      }
      const dateMove = new Date(dateMoveString)
      const dateMoveTime = dateMove.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
      dateMove.setHours(0, 0, 0, 0)

      const oneDay = 1000 * 60 * 60 * 24
      const diffInTime = today.getTime() - dateMove.getTime()
      const diffInDays = Math.round(diffInTime / oneDay)

      if (diffInDays === 0) {
        // сегодня
        return dateMoveTime
      }
      if (diffInDays === 1) {
        // вчера
        return 'Вчера'
      }
      if (diffInDays > 1 && diffInDays < 8) {
        // на неделе
        const dateMoveWeekday = dateMove.toLocaleString('default', {
          weekday: 'short'
        })
        return (
          dateMoveWeekday.slice(0, 1).toUpperCase() + dateMoveWeekday.slice(1)
        )
      }
      const month = dateMove
        .toLocaleString('default', { month: 'short' })
        .slice(0, 3)
      const dayNum = dateMove.getDate()
      const day = (dayNum < 10 ? '0' : '') + dayNum
      if (today.getFullYear() !== dateMove.getFullYear()) {
        return `${day} ${month} ${dateMove.getFullYear()}`
      }
      return `${day} ${month}`
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    selectCard () {
      this.$emit('select')
    },
    getEmpPhotoByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.fotolink ?? ''
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name || userEmail
    },
    lockVisibility (cardUid) {
      const icon = this.$refs[`card-icon-${cardUid}`]
      icon.style.visibility = 'visible'
    },
    unlockVisibility (cardUid) {
      const icon = this.$refs[`card-icon-${cardUid}`]
      icon.style.visibility = null
    },
    clickSuccess () {
      this.$emit('moveSuccess')
    },
    clickReject () {
      this.$emit('moveReject')
    },
    clickDelete () {
      this.$emit('delete')
    },
    clickMove () {
      this.$emit('moveColumn')
    }
  }
}
</script>

<style scoped>
.width100without18 {
  width: calc(100% - 18px);
}
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgba(0, 0, 0, 0.12);
  --popper-theme-border-radius: 10px;
  --popper-theme-padding: 17px 15px;
  --popper-theme-box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
}
</style>
