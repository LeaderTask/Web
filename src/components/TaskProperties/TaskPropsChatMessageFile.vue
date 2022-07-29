<template>
  <div>
    <div
      v-if="showCreator"
      class="flex"
      :class="{ 'flex-row-reverse': isMyFile }"
    >
      <p
        class="text-[13px] text-[#7E7E80] font-medium dark:text-gray-100"
      >
        {{ creatorName }}
      </p>
    </div>
    <div class="w-full inline-block">
      <div
        class="mt-1 text-sm dark:bg-gray-800 dark:text-gray-100"
        :class="{ 'bg-[#FCEBEB] msg-custom-chat-left': !isMyFile, 'bg-[#F4F5F7] msg-custom-chat-right mr-2': isMyFile }"
      >
        <div
          v-if="!pics.includes(fileName.split('.').pop())"
          :class="{'flex-col': isAudio}"
          class="mt-2 text-right font-medium mb-2 flex relative"
        >
          <div class="float-left">
            <FileMessage
              :file="file"
              @setLink="setLink"
            />
          </div>
          <div
            :class="{'ml-[11.67px]': !isAudio, 'mt-[11.67px]': isAudio}"
            class="float-right"
          >
            <a
              v-if="movies.includes(file.file_name.split('.').pop())"
              :href="currentlocation + 'taskfile/' + file.uid + '?type=video&format=' + file.file_name.split('.').pop()"
              target="_blank"
              class="table font-bold text-[#4C4C4D] text-[13px] leading-[15px]"
            >
              {{ fileName }}
            </a>
            <a
              v-else
              :href="!isAudio ? fileUrl : null"
              :src="isAudio ? fileUrl : null"
              :download="fileName"
              class="table font-bold text-[#4C4C4D] text-[13px] leading-[15px]"
            >
              {{ fileName }}
            </a>
            <div
              v-if="time && size"
              class="group flex justify-between w-full text-[#7E7E80] dark:text-gray-300 "
            >
              <p class="text-[12px] leading-[15px] h-1[px font-normal">
                {{ size }}
              </p>
              <div
                class="absolute pt-1 right-0 flex flex-row-reverse pr-0 pb-1.5 text-[12px] leading-[16px] text-[#a8afca] dark:text-gray-300"
              >
                <PopMenu
                  placement="auto"
                  @click.stop="toggleTaskHoverPopper(true)"
                  @openMenu="toggleTaskHoverPopper(true)"
                  @closeMenu="toggleTaskHoverPopper(false)"
                >
                  <div class="pl-0 hidden group-hover:block cursor-pointer">
                    <svg
                      class="h-[14px]"
                      width="14"
                      height="4"
                      viewBox="0 0 14 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.2004 2.0001C10.2004 1.11644 10.9167 0.400098 11.8004 0.400098C12.684 0.400098 13.4004 1.11644 13.4004 2.0001C13.4004 2.88375 12.684 3.6001 11.8004 3.6001C10.9167 3.6001 10.2004 2.88375 10.2004 2.0001Z"
                        fill="black"
                        fill-opacity="0.5"
                      />
                      <path
                        d="M5.40039 2.0001C5.40039 1.11644 6.11673 0.400098 7.00039 0.400098C7.88405 0.400098 8.60039 1.11644 8.60039 2.0001C8.60039 2.88375 7.88405 3.6001 7.00039 3.6001C6.11673 3.6001 5.40039 2.88375 5.40039 2.0001Z"
                        fill="black"
                        fill-opacity="0.5"
                      />
                      <path
                        d="M0.60039 2.0001C0.60039 1.11644 1.31674 0.400098 2.20039 0.400098C3.08405 0.400098 3.80039 1.11644 3.80039 2.0001C3.80039 2.88375 3.08405 3.6001 2.20039 3.6001C1.31674 3.6001 0.60039 2.88375 0.60039 2.0001Z"
                        fill="black"
                        fill-opacity="0.5"
                      />
                    </svg>
                  </div>
                  <template #menu>
                    <PopMenuItem @click="onAnswerClick">
                      <div class="flex">
                        <svg
                          class="mt-0.5 mr-2"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2.0505 1.27988C1.84423 1.27988 1.64639 1.36228 1.50053 1.50896C1.35467 1.65564 1.27273 1.85458 1.27273 2.06201V11.8873L2.54347 10.2898C2.73556 10.0486 2.97929 9.85362 3.25631 9.71978C3.53333 9.58594 3.83672 9.51642 4.14406 9.51639H11.4495C11.6558 9.51639 11.8536 9.43398 11.9995 9.2873C12.1453 9.14062 12.2273 8.94169 12.2273 8.73425V2.06201C12.2273 1.85458 12.1453 1.65564 11.9995 1.50896C11.8536 1.36228 11.6558 1.27988 11.4495 1.27988H2.0505ZM0 12.4956V2.06201C0 1.51514 0.216035 0.990666 0.600579 0.603969C0.985123 0.217272 1.50668 2.86102e-05 2.0505 2.86102e-05H11.4495C11.9933 2.86102e-05 12.5149 0.217273 12.8994 0.603969C13.284 0.990666 13.5 1.51514 13.5 2.06201V8.73425C13.5 9.28113 13.284 9.8056 12.8994 10.1923C12.5149 10.579 11.9933 10.7962 11.4495 10.7962H4.14422C4.02767 10.7963 3.91254 10.8226 3.80749 10.8734C3.70241 10.9242 3.61002 10.998 3.53717 11.0895L1.88965 13.1606C1.75257 13.3331 1.56513 13.4592 1.35411 13.5203C1.14284 13.5815 0.91788 13.5752 0.71036 13.5021C0.502837 13.4291 0.323006 13.2931 0.195744 13.1128C0.0684829 12.9325 7.97799e-05 12.7167 0 12.4956Z"
                            fill="#7E7E80"
                          />
                        </svg>
                        Ответить
                      </div>
                    </PopMenuItem>
                    <PopMenuItem
                      v-if="isMyFile"
                      @click="DeleteFile"
                    >
                      <div class="flex">
                        <svg
                          class="mt-0.5 mr-2"
                          width="12"
                          height="14"
                          viewBox="0 0 12 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.59059 4.96916L7.39143 4.9258L7.16897 10.9265L8.36813 10.9699L8.59059 4.96916Z"
                            fill="#7E7E80"
                          />
                          <path
                            d="M11.52 2.49639H8.64V1.46923C8.64 0.995159 8.24 0.600098 7.76 0.600098H4.4C3.92 0.600098 3.52 0.995159 3.52 1.46923V2.49639H0.56C0.24 2.49639 0 2.73343 0 3.04948C0 3.36553 0.24 3.60257 0.56 3.60257H1.04L1.84 12.847C1.84 13.1631 2.08 13.4001 2.4 13.4001H9.6C9.92 13.4001 10.16 13.1631 10.16 12.847L10.96 3.60257H11.44C11.76 3.60257 12 3.36553 12 3.04948C12 2.73343 11.84 2.49639 11.52 2.49639ZM4.64 1.78528H7.44V2.49639H4.64V1.78528ZM9.12 12.2149H2.96L2.16 3.60257H9.76L9.12 12.2149Z"
                            fill="#7E7E80"
                          />
                          <path
                            d="M6.64 4.94578H5.44V10.9507H6.64V4.94578Z"
                            fill="#7E7E80"
                          />
                          <path
                            d="M4.88358 10.9515L4.66105 4.95076L3.46189 4.99413L3.68442 10.9949L4.88358 10.9515Z"
                            fill="#7E7E80"
                          />
                        </svg>
                        Удалить
                      </div>
                    </PopMenuItem>
                  </template>
                </PopMenu>
                <p
                  class="group-hover:hidden block font-bold text-[12px] leading-[13px] top-1 h-[13px]"
                >
                  {{ time }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="mt-2 text-right text-[#7E7E80] font-medium mb-2 relative"
        >
          <FileMessage
            :file="file"
            @setLink="setLink"
          />

          <span>{{ fileName }}</span>
          <div
            v-if="time && size"
            class="group flex justify-between w-full text-[#7E7E80] dark:text-gray-300 "
          >
            <p class="text-[12px] leading-[15px] h-1[px font-normal">
              {{ size }}
            </p>
            <div
              class="absolute pt-1 right-0 flex flex-row-reverse pr-0 pb-1.5 text-[12px] leading-[16px] text-[#a8afca] dark:text-gray-300"
            >
              <PopMenu
                placement="auto"
                @click.stop="toggleTaskHoverPopper(true)"
                @openMenu="toggleTaskHoverPopper(true)"
                @closeMenu="toggleTaskHoverPopper(false)"
              >
                <div class="pl-0 hidden group-hover:block cursor-pointer">
                  <svg
                    class="h-[14px]"
                    width="14"
                    height="4"
                    viewBox="0 0 14 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.2004 2.0001C10.2004 1.11644 10.9167 0.400098 11.8004 0.400098C12.684 0.400098 13.4004 1.11644 13.4004 2.0001C13.4004 2.88375 12.684 3.6001 11.8004 3.6001C10.9167 3.6001 10.2004 2.88375 10.2004 2.0001Z"
                      fill="black"
                      fill-opacity="0.5"
                    />
                    <path
                      d="M5.40039 2.0001C5.40039 1.11644 6.11673 0.400098 7.00039 0.400098C7.88405 0.400098 8.60039 1.11644 8.60039 2.0001C8.60039 2.88375 7.88405 3.6001 7.00039 3.6001C6.11673 3.6001 5.40039 2.88375 5.40039 2.0001Z"
                      fill="black"
                      fill-opacity="0.5"
                    />
                    <path
                      d="M0.60039 2.0001C0.60039 1.11644 1.31674 0.400098 2.20039 0.400098C3.08405 0.400098 3.80039 1.11644 3.80039 2.0001C3.80039 2.88375 3.08405 3.6001 2.20039 3.6001C1.31674 3.6001 0.60039 2.88375 0.60039 2.0001Z"
                      fill="black"
                      fill-opacity="0.5"
                    />
                  </svg>
                </div>
                <template #menu>
                  <PopMenuItem @click="onAnswerClick">
                    <div class="flex">
                      <svg
                        class="mt-0.5 mr-2"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M2.0505 1.27988C1.84423 1.27988 1.64639 1.36228 1.50053 1.50896C1.35467 1.65564 1.27273 1.85458 1.27273 2.06201V11.8873L2.54347 10.2898C2.73556 10.0486 2.97929 9.85362 3.25631 9.71978C3.53333 9.58594 3.83672 9.51642 4.14406 9.51639H11.4495C11.6558 9.51639 11.8536 9.43398 11.9995 9.2873C12.1453 9.14062 12.2273 8.94169 12.2273 8.73425V2.06201C12.2273 1.85458 12.1453 1.65564 11.9995 1.50896C11.8536 1.36228 11.6558 1.27988 11.4495 1.27988H2.0505ZM0 12.4956V2.06201C0 1.51514 0.216035 0.990666 0.600579 0.603969C0.985123 0.217272 1.50668 2.86102e-05 2.0505 2.86102e-05H11.4495C11.9933 2.86102e-05 12.5149 0.217273 12.8994 0.603969C13.284 0.990666 13.5 1.51514 13.5 2.06201V8.73425C13.5 9.28113 13.284 9.8056 12.8994 10.1923C12.5149 10.579 11.9933 10.7962 11.4495 10.7962H4.14422C4.02767 10.7963 3.91254 10.8226 3.80749 10.8734C3.70241 10.9242 3.61002 10.998 3.53717 11.0895L1.88965 13.1606C1.75257 13.3331 1.56513 13.4592 1.35411 13.5203C1.14284 13.5815 0.91788 13.5752 0.71036 13.5021C0.502837 13.4291 0.323006 13.2931 0.195744 13.1128C0.0684829 12.9325 7.97799e-05 12.7167 0 12.4956Z"
                          fill="#7E7E80"
                        />
                      </svg>
                      Ответить
                    </div>
                  </PopMenuItem>
                  <PopMenuItem
                    v-if="isMyFile"
                    @click="DeleteFile"
                  >
                    <div class="flex">
                      <svg
                        class="mt-0.5 mr-2"
                        width="12"
                        height="14"
                        viewBox="0 0 12 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.59059 4.96916L7.39143 4.9258L7.16897 10.9265L8.36813 10.9699L8.59059 4.96916Z"
                          fill="#7E7E80"
                        />
                        <path
                          d="M11.52 2.49639H8.64V1.46923C8.64 0.995159 8.24 0.600098 7.76 0.600098H4.4C3.92 0.600098 3.52 0.995159 3.52 1.46923V2.49639H0.56C0.24 2.49639 0 2.73343 0 3.04948C0 3.36553 0.24 3.60257 0.56 3.60257H1.04L1.84 12.847C1.84 13.1631 2.08 13.4001 2.4 13.4001H9.6C9.92 13.4001 10.16 13.1631 10.16 12.847L10.96 3.60257H11.44C11.76 3.60257 12 3.36553 12 3.04948C12 2.73343 11.84 2.49639 11.52 2.49639ZM4.64 1.78528H7.44V2.49639H4.64V1.78528ZM9.12 12.2149H2.96L2.16 3.60257H9.76L9.12 12.2149Z"
                          fill="#7E7E80"
                        />
                        <path
                          d="M6.64 4.94578H5.44V10.9507H6.64V4.94578Z"
                          fill="#7E7E80"
                        />
                        <path
                          d="M4.88358 10.9515L4.66105 4.95076L3.46189 4.99413L3.68442 10.9949L4.88358 10.9515Z"
                          fill="#7E7E80"
                        />
                      </svg>
                      Удалить
                    </div>
                  </PopMenuItem>
                </template>
              </PopMenu>
              <p
                class="group-hover:hidden block font-bold text-[12px] leading-[13px] top-1 h-[13px]"
              >
                {{ time }}
              </p>
            </div>
          </div>
        </div>
        {{ quote }}
        <div
          v-if="quote"
          class="py-2 px-2.5 flex flex-row mt-2"
          :class="{ 'rounded-tr-[14px]': !isMyFile, 'rounded-tl-[14px]': isMyFile }"
        >
          <svg
            width="14"
            height="11"
            viewBox="0 0 14 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.33343 4.66677C3.18476 4.66677 3.0421 4.68943 2.9001 4.7101C2.9461 4.55543 2.99343 4.3981 3.06943 4.25677C3.14543 4.05143 3.2641 3.87343 3.3821 3.6941C3.48076 3.5001 3.65476 3.36877 3.78276 3.20277C3.91676 3.04143 4.09943 2.9341 4.2441 2.8001C4.3861 2.6601 4.5721 2.5901 4.7201 2.49143C4.87476 2.40277 5.00943 2.30477 5.15343 2.2581L5.51276 2.1101L5.82876 1.97877L5.50543 0.686768L5.10743 0.782767C4.9801 0.814767 4.82476 0.852101 4.6481 0.896767C4.46743 0.930101 4.27476 1.02143 4.0601 1.10477C3.8481 1.19943 3.60276 1.26343 3.37476 1.41543C3.14543 1.56077 2.88076 1.6821 2.64743 1.87677C2.42143 2.07743 2.14876 2.25143 1.94743 2.50677C1.72743 2.74543 1.5101 2.9961 1.34143 3.28143C1.1461 3.55343 1.01343 3.8521 0.87343 4.14743C0.746763 4.44277 0.644764 4.74477 0.56143 5.0381C0.40343 5.6261 0.332763 6.18477 0.30543 6.66277C0.282763 7.14143 0.296097 7.53943 0.324097 7.82743C0.334097 7.96343 0.352764 8.09543 0.366097 8.18677L0.382763 8.29877L0.400097 8.29477C0.518671 8.84865 0.791633 9.35765 1.18741 9.76289C1.58318 10.1681 2.08559 10.453 2.63652 10.5847C3.18746 10.7163 3.76439 10.6892 4.3006 10.5067C4.83681 10.3241 5.31037 9.99343 5.6665 9.55296C6.02264 9.11248 6.24679 8.58018 6.31304 8.01763C6.37929 7.45508 6.28492 6.88527 6.04085 6.37411C5.79678 5.86296 5.41299 5.43134 4.93387 5.1292C4.45474 4.82706 3.89987 4.66673 3.33343 4.66677ZM10.6668 4.66677C10.5181 4.66677 10.3754 4.68943 10.2334 4.7101C10.2794 4.55543 10.3268 4.3981 10.4028 4.25677C10.4788 4.05143 10.5974 3.87343 10.7154 3.6941C10.8141 3.5001 10.9881 3.36877 11.1161 3.20277C11.2501 3.04143 11.4328 2.9341 11.5774 2.8001C11.7194 2.6601 11.9054 2.5901 12.0534 2.49143C12.2081 2.40277 12.3428 2.30477 12.4868 2.2581L12.8461 2.1101L13.1621 1.97877L12.8388 0.686768L12.4408 0.782767C12.3134 0.814767 12.1581 0.852101 11.9814 0.896767C11.8008 0.930101 11.6081 1.02143 11.3934 1.10477C11.1821 1.2001 10.9361 1.26343 10.7081 1.4161C10.4788 1.56143 10.2141 1.68277 9.98076 1.87743C9.75476 2.0781 9.4821 2.2521 9.28076 2.50677C9.06076 2.74543 8.84343 2.9961 8.67476 3.28143C8.47943 3.55343 8.34676 3.8521 8.20676 4.14743C8.0801 4.44277 7.9781 4.74477 7.89476 5.0381C7.73676 5.6261 7.6661 6.18477 7.63876 6.66277C7.6161 7.14143 7.62943 7.53943 7.65743 7.82743C7.66743 7.96343 7.6861 8.09543 7.69943 8.18677L7.7161 8.29877L7.73343 8.29477C7.852 8.84865 8.12497 9.35765 8.52074 9.76289C8.91651 10.1681 9.41892 10.453 9.96986 10.5847C10.5208 10.7163 11.0977 10.6892 11.6339 10.5067C12.1701 10.3241 12.6437 9.99343 12.9998 9.55296C13.356 9.11248 13.5801 8.58018 13.6464 8.01763C13.7126 7.45508 13.6183 6.88527 13.3742 6.37411C13.1301 5.86296 12.7463 5.43134 12.2672 5.1292C11.7881 4.82706 11.2332 4.66673 10.6668 4.66677Z"
              fill="black"
              fill-opacity="0.2"
            />
          </svg>

          <div class="width100without16 ml-2">
            <p class="text-[13px] leading-[16px] overflow-hidden mb-1 text-[#7E7E80] font-medium text-ellipsis whitespace-nowrap">
              {{ quoteUser }}
            </p>
            <p class="text-[12px] leading-[16px] font-normal overflow-hidden text-[#7E7E80] text-ellipsis whitespace-nowrap">
              {{ quote }}
              <FileMessage :file="quote" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileMessage from '@/components/TaskProperties/FileMessage.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import { ref } from 'vue'
import { copyText } from 'vue3-clipboard'

export default {
  components: {
    FileMessage,
    PopMenu,
    PopMenuItem
  },
  props: {
    isMyFile: {
      type: Boolean,
      default: true
    },
    showCreator: {
      type: Boolean,
      default: true
    },
    creatorName: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    file: {
      type: Object,
      default: () => ({})
    },
    quoteUser: {
      type: String,
      default: ''
    },
    quote: {
      type: Object,
      default: () => ({})
    },
    time: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  emits: ['answer', 'deleteFiles', 'PasteEvent'],
  setup () {
    const isTaskHoverPopperActive = ref(false)
    const fileUrl = ref('')
    const isAudio = ref(false)
    const pics = ['jpg', 'png', 'jpeg', 'git', 'bmp', 'gif', 'PNG', 'JPG', 'JPEG', 'BMP', 'GIF']
    const toggleTaskHoverPopper = (val) => {
      isTaskHoverPopperActive.value = val
    }
    return {
      toggleTaskHoverPopper,
      pics,
      fileUrl,
      isAudio
    }
  },
  data () {
    return {
      movies: ['mov', 'mp4', 'wmv', 'avi', 'avchd', 'mkv', 'webm', 'mpeg-2'],
      currentlocation: window.location.href
    }
  },
  computed: {
    messageText () {
      let text = this.message.trim()
      text = text.replaceAll('&amp;', '&')
      text = text.replaceAll('&lt;', '<')
      text = text.replaceAll('&gt;', '>')
      return text
    }
  },
  methods: {
    copyFile (file) {
      copyText(file, undefined, (error, event) => {
        // copyText('lt://planning?{' + selectedTask.value.uid.toUpperCase() + '}', undefined, (error, event) => {
        if (error) {
          console.log(error)
        } else {
          console.log(event)
        }
      })
    },
    setLink (payload) {
      const [url, isAudio] = payload
      this.fileUrl = url
      this.isAudio = isAudio
    },
    onAnswerClick () {
      this.$emit('answer')
    },
    DeleteFile () {
      this.$emit('deleteFiles')
    },
    PasteEvent () {
      this.$emit('PasteEvent')
    }
  }
}
</script>

<style>
.msg-custom-chat-left {
  float: left;
  padding: 8px 10px;
  width: 80%;
  min-height: 40px;
  display: table-cell;
  max-width: 80%;
  min-width: 70%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.msg-custom-chat-right {
  float: right;
  padding: 8px 10px;
  min-height: 40px;
  display: table-cell;
  max-width: 80%;
  min-width: 70%;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
