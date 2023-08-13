<script lang="ts" setup>
import { ref } from 'vue'

const years = ref(Array.from({ length: 40 }, (_, i) => i + 1990))
const monthsOfYear = ref(Array.from({ length: 12 }, (_, i) => i + 1))
const monthAbbreviations = ref([ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ])

const birthmonths = ref([
  { year: 1993, month: 12 },
  { year: 1994, month: 8 },
  { year: 2015, month: 4 },
  { year: 2016, month: 11 },
  { year: 2019, month: 6 }
])
</script>

<template>
  <div class="w-full">
    <div v-for="year of years" class="w-full flex flex-nowrap p-5 items-center" :class="{ 'bg-gray-100': year == 2023 }">
      <div>{{ year }}</div>
      <div v-for="month of monthsOfYear" class="w-1/12 flex justify-center items-center">
        <div class="p-3 w-12 h-12 flex justify-center items-center rounded-full bg-gray-200"
            :class="{
              'bg-green-500': birthmonths.some(birthmonth => birthmonth.year == year && birthmonth.month == month)
            }"
        >
          {{ monthAbbreviations[month - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>
