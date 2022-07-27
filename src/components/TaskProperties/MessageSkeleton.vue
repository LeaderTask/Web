<template>
  <div :class="container">
    <div>
      <hr
        :class="nick"
        class="ml-[55%]"
      >
      <div :class="messageOut">
        <div class="m-2">
          <hr
            :class="text"
            class="w-full"
          >
          <hr
            :class="text"
            class="mr-[15%]"
          >
          <hr
            :class="text"
            class="mr-[65%]"
          >
          <hr
            :class="[text, 'bg-[#a8afca]']"
            class="ml-[80%]"
          >
        </div>
      </div>
    </div>
    <div>
      <hr
        :class="nick"
        class="mr-[75%]"
      >
      <div :class="messageIn">
        <div class="m-2">
          <hr
            :class="text"
            class="w-full"
          >
          <hr
            :class="text"
            class="w-full"
          >
          <hr
            :class="text"
            class="w-full"
          >
          <hr
            :class="text"
            class="mr-[10%]"
          >
          <hr
            :class="text"
            class="mr-[80%]"
          >
          <hr
            :class="[text, 'bg-[#a8afca]']"
            class="ml-[80%]"
          >
        </div>
      </div>
    </div>
    <div>
      <hr
        :class="nick"
        class="ml-[55%]"
      >
      <div :class="messageOut">
        <div class="m-2">
          <hr
            :class="text"
            class="mr-[10%]"
          >
          <hr
            :class="text"
            class="mr-[45%]"
          >
          <hr
            :class="[text, 'bg-[#a8afca]']"
            class="ml-[80%]"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    text: 'block h-[10px] bg-neutral-300  mt-1 mb-1.5 rounded-[10px]',
    nick: 'block h-[10px] bg-neutral-300  mt-4  rounded-[10px]',
    tags: 'mt-2 rounded-[4px] mr-1 h-[30px] bg-gray-100',
    container: 'animate-pulse grid',
    messageOut: 'min-w-[70%] max-w-[70%] mt-2 flex flex-col bg-[#F4F5F7] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[0px] float-right',
    messageIn: 'min-w-[70%] max-w-[70%] mt-2 flex flex-col bg-[#FCEBEB] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[0px] float-left'
  })
}
</script>
