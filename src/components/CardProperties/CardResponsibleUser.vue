<template>
  <Popper
    class="light"
    :disabled="!canEdit"
  >
    <div
      class="rounded-[6px] text-[12px] px-[8px] py-[5px] font-[500]"
      :class="{ 'bg-[#7B94EB] text-white': !responsible, 'bg-[#F4F5F7] text-[#575758]': responsible, 'cursor-pointer': canEdit }"
    >
      <!-- Empty label for responsible user -->
      <div
        v-if="!responsible"
        class="flex items-center"
      >
        <svg
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          class="mr-[7px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5631 7.94595C11.1349 7.56757 10.6352 7.18919 10.1356 6.96216C10.0642 6.96216 9.99287 6.88649 9.9215 6.88649C9.70737 6.88649 9.49325 7.03784 9.3505 7.26487C9.27912 7.41622 9.27912 7.64324 9.3505 7.7946C9.42187 7.94595 9.49325 8.0973 9.636 8.0973C10.0642 8.24865 10.4211 8.55135 10.778 8.85405C11.1349 9.23243 11.349 9.68649 11.349 10.2162V12.4108C11.349 12.6378 11.2062 12.7135 11.0635 12.7135H1.99887C1.78475 12.7135 1.71337 12.5622 1.71337 12.4108V10.2162C1.71337 9.68649 1.9275 9.23243 2.28437 8.85405C2.71262 8.47568 4.06875 7.49189 6.4955 7.49189C8.42262 7.49189 10.0642 5.82703 10.0642 3.78378C10.0642 1.74054 8.494 0 6.4955 0C4.56837 0 2.92675 1.66487 2.92675 3.70811C2.92675 4.76757 3.355 5.75135 4.06875 6.50811C2.64125 6.88649 1.78475 7.56757 1.42787 7.94595C0.856875 8.47568 0.5 9.30811 0.5 10.2162V12.4108C0.5 13.3189 1.21375 14 1.99887 14H10.9921C11.8486 14 12.491 13.2432 12.491 12.4108V10.2162C12.5624 9.30811 12.2055 8.47568 11.5631 7.94595ZM6.4955 6.20541C5.21075 6.20541 4.14012 5.07027 4.14012 3.70811C4.14012 2.34595 5.21075 1.21081 6.4955 1.21081C7.78025 1.21081 8.85087 2.34595 8.85087 3.70811C8.85087 5.07027 7.85162 6.20541 6.4955 6.20541Z"
            fill="white"
          />
        </svg>
        Ответственный
      </div>
      <!-- Show response user -->
      <div
        v-if="responsible"
        class="flex items-center group"
      >
        <img
          v-if="userPhoto"
          :src="userPhoto"
          class="mr-[4px] rounded-[6px] border-[1px] border-[#979799]"
          :class="{'group-hover:hidden': canEdit }"
          width="20"
          height="20"
        >
        <div
          class="items-center justify-center p-[4.5px] mr-[4px] hidden"
          :class="{'group-hover:flex': canEdit }"
          @click.stop="$emit('changeResponsible', '')"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class=""
          >
            <path
              d="M6.17983 5.00341L9.76317 1.42841C9.92009 1.27149 10.0082 1.05866 10.0082 0.836743C10.0082 0.614825 9.92009 0.401996 9.76317 0.245076C9.60625 0.0881567 9.39342 0 9.1715 0C8.94958 0 8.73675 0.0881567 8.57983 0.245076L5.00483 3.82841L1.42983 0.245076C1.27291 0.0881567 1.06008 -1.65342e-09 0.838165 0C0.616247 1.65342e-09 0.403418 0.0881567 0.246499 0.245076C0.0895788 0.401996 0.00142217 0.614825 0.00142217 0.836743C0.00142217 1.05866 0.0895788 1.27149 0.246499 1.42841L3.82983 5.00341L0.246499 8.57841C0.168392 8.65588 0.106397 8.74805 0.0640893 8.8496C0.0217821 8.95115 0 9.06007 0 9.17008C0 9.28009 0.0217821 9.38901 0.0640893 9.49056C0.106397 9.59211 0.168392 9.68427 0.246499 9.76174C0.323968 9.83985 0.416135 9.90185 0.517685 9.94415C0.619234 9.98646 0.728156 10.0082 0.838165 10.0082C0.948175 10.0082 1.0571 9.98646 1.15865 9.94415C1.2602 9.90185 1.35236 9.83985 1.42983 9.76174L5.00483 6.17841L8.57983 9.76174C8.6573 9.83985 8.74947 9.90185 8.85102 9.94415C8.95257 9.98646 9.06149 10.0082 9.1715 10.0082C9.28151 10.0082 9.39043 9.98646 9.49198 9.94415C9.59353 9.90185 9.6857 9.83985 9.76317 9.76174C9.84127 9.68427 9.90327 9.59211 9.94558 9.49056C9.98788 9.38901 10.0097 9.28009 10.0097 9.17008C10.0097 9.06007 9.98788 8.95115 9.94558 8.8496C9.90327 8.74805 9.84127 8.65588 9.76317 8.57841L6.17983 5.00341Z"
              fill="#7E7E80"
            />
          </svg>
        </div>

        {{ userName }}
      </div>
    </div>
    <template
      #content="{ close }"
    >
      <div class="max-h-[156px] overflow-y-scroll">
        <div
          v-for="(employee, index) in employeesByEmail"
          :key="index"
        >
          <div
            class="flex items-center text-[#4C4C4D] font-[400] text-[13px] leading-[14px] px-[6px] py-[4px] hover:bg-[#F4F5F7] rounded-[6px] cursor-pointer"
            @click="$emit('changeResponsible', employee.email), close()"
          >
            <img
              :src="employee.fotolink"
              class="rounded-[7px] mr-[5px]"
              width="24"
              height="24"
            >
            {{ employee.name }}
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    responsible: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    employeesByEmail: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['changeResponsible'],
  computed: {
    userName () {
      return this.employeesByEmail[this.responsible.toLowerCase()]?.name || this.responsible
    },
    userPhoto () {
      return this.employeesByEmail[this.responsible.toLowerCase()]?.fotolink ?? ''
    }
  }
}
</script>

<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 8px;
  --popper-theme-padding: 10px 10px;
  --popper-theme-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 3px 5px rgba(0, 0, 0, 0.12);
}
</style>
