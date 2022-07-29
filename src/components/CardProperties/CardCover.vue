<template>
  <CardModalBoxColor
    v-if="showColorCard"
    :color="coverColor"
    @cancel="showColorCard = false"
    @changeColor="onChangeCardColor"
  />
  <div
    class="border-[1px] border-[rgba(0, 0, 0, 0.1) rounded-[8px] min-h-[93px] max-h-[93px] flex items-center justify-center relative"
    :style="{ 'background-color': coverColor ? coverColor : '#F4F5F7' }"
  >
    <img
      :src="coverLink"
      class="max-h-[91px]"
    >
    <div
      v-if="canEdit"
      class="absolute bottom-[10px] right-[10px]"
    >
      <PopMenu>
        <div
          style="border: 1px solid rgba(0, 0, 0, 0.1); background: rgba(255, 255, 255, 0.9);"
          class="px-[12px] py-[7px] font-[400] text-[12px] leading-[14px] text-[#4C4C4D] rounded-[6px] cursor-pointer"
        >
          Обложка
        </div>
        <template #menu>
          <PopMenuItem @click="showColorCard = true">
            Цвет
          </PopMenuItem>
          <PopMenuItem
            style="padding-left: 0px; padding-right: 0px; padding-top: 0px; padding-bottom: 0px;"
          >
            <label
              ref="coverInputLabel"
              class="cursor-pointer w-full h-full flex items-center"
              for="cover-input"
            >
              <p class="mx-[10px]">
                Файл
              </p>
            </label>
            <input
              id="cover-input"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              style="display: none;"
              @change="onChangeCardCover"
            >
          </PopMenuItem>
          <PopMenuItem @click="onChangeCardClearCover">
            Сбросить
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import CardModalBoxColor from '@/components/CardProperties/CardModalBoxColor.vue'

export default {
  components: {
    CardModalBoxColor,
    PopMenu,
    PopMenuItem
  },
  props: {
    coverColor: String,
    coverLink: String,
    canEdit: Boolean
  },
  emits: ['onChangeCardColor', 'onChangeCardClearCover', 'onChangeCardCover'],
  data () {
    return {
      showColorCard: false
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onChangeCardColor (color) {
      this.$emit('onChangeCardColor', color)
    },
    onChangeCardClearCover (e) {
      this.$emit('onChangeCardClearCover', e)
    },
    onChangeCardCover (e) {
      this.$emit('onChangeCardCover', e)
    }
  }
}
</script>

<style scoped>

</style>
