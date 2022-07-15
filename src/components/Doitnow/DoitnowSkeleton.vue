<template>
  <div class="flex items-center mb-5 justify-between" >
    <div class="flex items-center">
      <div class=" font-medium bg-gray-200 px-2.5 py-2 rounded-lg flex mt-1 w-[155px] h-[35px]" />
      <div class="bg-[#FF912380] px-2 rounded-[8px] h-[35px] ml-2 mt-1  w-[75px] h-[35px]"/>
    </div>
    <hr :class="placeholder" class="w-[150px] mr-9">
  </div>
 <div class="bg-white py-6 px-5 mb-5 rounded-lg flex justify-between h-[450px] animate-pulse">
<div class="w-5/6 ">
  <div class="flex">
  <div class="pl-2 m-[12px] border-2 relative border-gray-300 rounded-md bg-white flex items-center justify-center cursor-pointer w-[20px] h-[20px]"/>
    <hr :class="text" class="w-[120px]"></div>
  <div class="grid grid-cols-2 grid-rows-3 max-w-[250px] mt-2">
    <hr :class="text" class="w-[80px]">
    <hr :class="text" class="w-[120px]">
    <hr :class="text" class="w-[70px]">
    <hr :class="text" class="w-[100px]">
    <hr :class="text" class="w-[90px]">
    <hr :class="text" class="w-[70px]">
  </div>
  <div class="mt-7">
  <hr :class="text" class="w-[170px]"></div>
  <div class="mt-32">
  <hr  class="w-full"></div>
  <div class="flex bg-gray-100 rounded-lg w-1/2 m-auto mt-[3%] w-1/2 h-[45px]">
  </div>
</div>
   <div class="flex flex-col min-w-[200px] items-end">
     <div class="flex py-0.5 items-center justify-center text-sm hover:bg-white bg-green-100 hover:bg-opacity-90 font-medium  min-h-[45px] w-[181px] rounded-lg "></div>
     <div class="flex py-0.5 items-center justify-center text-sm mt-2 bg-gray-100 hover:bg-opacity-90 font-medium  min-h-[45px] w-[181px] rounded-lg "></div>
   </div>
 </div>
</template>

<script>
export default {
  data: () => ({
    classes: 'animate-pulse bg-white my-1 border border-gray-300 rounded-lg pl-[31px] pr-[6px] py-[11px] mb-[4px]',
    classesDark: 'dark:bg-slate-900 dark:border-gray-700',
    text: 'block h-[10px] bg-neutral-300  mt-4 rounded-[10px]',
    placeholder: 'block h-[10px] bg-neutral-300  mt-2 rounded-[10px]',
    checkbox: 'block mr-[10px] flex-none border-2 border-gray-300 rounded-md bg-white h-[20px] w-[20px] leading-[20px]',
    tags: 'mt-2 w-[100px] rounded-[4px] mr-1  h-[22px]'
  })
}
</script>
