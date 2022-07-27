<script>
export default {
  props: {
    cardName: String,
    canEdit: Boolean
  },
  emits: ['changeName']
}
</script>
<template>
  <div
    v-linkified:options="{ className: 'text-blue-600', tagName: 'a' }"
    class="text-[18px] font-[700] my-[25px] text-[#424242] min-h-[24px]"
    :contenteditable="canEdit"
    @blur="$emit('changeName', $event)"
    v-html="cardName?.replaceAll('\n','<br/>')"
  />
</template>
