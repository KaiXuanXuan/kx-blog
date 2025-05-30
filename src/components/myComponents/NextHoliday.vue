<template>
  <Card v-if="nextHoliday !== null" class="bg-pink gap-0 items-center justify-center text-white px-2 w-full">
    <div class="text-xl font-bold mb-4">{{ nextHoliday.name }}</div>
    <div class="text-sm">{{ nextHoliday.formateHolidayDate }}</div>
    <div class="text-center font-medium">还有  <span class="text-2xl">{{ nextHoliday.days }} </span> 天 🎉</div>
  </Card>
  <Card v-else class="w-full bg-pink items-center justify-center text-white">网络繁忙😿</Card>
</template>

<script setup>
import { getNextHoliday } from '@/api/holiday.js';
import { ref, onMounted } from 'vue';
import { Card } from '@/components/ui/card';

const nextHoliday = ref(null);

onMounted(() => {
  const now = formatDate(new Date());

  getNextHoliday(now).then((res) => {
    const { date, name } = res.holiday;
    const nowDateList = now.split('-');
    const holidayDateList = date.split('-');
    const formateHolidayDate = `${holidayDateList[0]}年${holidayDateList[1]}月${holidayDateList[2]}日`;

    // 计算距离下个节假日的天数
    const nowMonth = nowDateList[1];
    const holidayMonth = holidayDateList[1];
    const nowDay = nowDateList[2];
    const holidayDay = holidayDateList[2];
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let days = 0;
    for (let i = nowMonth; i < holidayMonth; i++) {
      days += monthDays[i];
    }
    days += holidayDay - nowDay;
    days -= 1;

    nextHoliday.value = { name, formateHolidayDate, days };
  });
})

const formatDate = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // 补零操作，确保月份和日期都是两位数
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  return `${year}-${month}-${day}`;
}

</script>

<style scoped>
.bg-pink {
  background: linear-gradient(135deg, rgb(255, 154, 158) 0%, rgb(250, 208, 196) 100%);
}
</style>