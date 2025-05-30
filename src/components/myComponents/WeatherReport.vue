<template>
  <div class="space-y-2 w-full">
    <Card v-if="getDataSuccess"
      class="items-center justify-center gap-1 bg-linear-to-br from-cyan-50 to-purple-50 h-full">
      <div class="p-2">
        <img :src="`/QWeather-Icons-1.6.0/icons/${weatherData.icon}.svg`" alt="" class="w-10 h-10" />
      </div>
      <div class="text-lg font-medium text-gray-900">{{ weatherData.text }} {{ weatherData.feelsLike }}℃</div>
      <div class="text-sm font-medium text-gray-800">{{ weatherData.windDir }} {{ weatherData.windSpeed }}<span
          class="text-xs">km/h</span></div>
    </Card>
    <Card v-else class="items-center justify-center bg-linear-to-br from-cyan-50 to-purple-50">
      <div class="text-base font-medium text-gray-600">🌤 天气尚未获取</div>
    </Card>

    <Collapsible v-model:open="isOpen" class="w-full space-y-2">
      <!-- 3日天气预报，暂时不启用 -->
      <!-- <CollapsibleTrigger class="w-full">
        <Card v-if="getDataSuccess" class="p-1 cursor-pointer bg-blue-300 text-white">3日天气</Card>
        <Card v-else @click="getWeather" class="p-1 cursor-pointer bg-blue-300 text-white">{{ isLoading == true ? '获取中..' : '获取天气' }}</Card> 
      </CollapsibleTrigger> -->
      <CollapsibleTrigger class="w-full">
        <Card v-if="getDataSuccess" class="p-1 cursor-pointer bg-blue-300 text-white">本日天气</Card>
        <Card v-else @click="getWeather" class="p-1  cursor-pointer bg-blue-300 text-white">{{ isLoading ==
          true ? '获取中..' : '获取天气' }}</Card>
      </CollapsibleTrigger>
      <CollapsibleContent class="space-y-2">
        <Card v-for="(item, key) in weatherReport" :key="key" class="p-2 gap-1">
          <div class="text-sm text-center font-medium">{{ item.date }}</div>
          <div class="flex items-center justify-center gap-4">
            <div class="flex items-center gap-1">
              <img :src="`/QWeather-Icons-1.6.0/icons/${item.iconDay}.svg`" alt="" class="w-4 h-4" />
              <span>{{ item.textDay }}</span>
            </div>
            <div class="flex items-center gap-1">
              <img :src="`/QWeather-Icons-1.6.0/icons/${item.iconNight}.svg`" alt="" class="w-4 h-4" />
              <span>{{ item.textNight }}</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-1">
            <span>{{ item.tempMin }}℃</span>
            <span>~</span>
            <span>{{ item.tempMax }}℃</span>
          </div>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Card } from '@/components/ui/card';
import { getWeatherData, getWeatherReport } from '@/api/weather';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'vue-sonner';

const getDataSuccess = ref(false);
const isOpen = ref(true);
const isLoading = ref(false);
const weatherData = ref({});
const weatherReport = ref([]);
const location = ref({});

onMounted(() => {
  // getLocation();
  initWeather();
});

const initWeather = () => {
  if (!navigator.geolocation) {
    toast.error('不支持地理位置获取', { description: '请升级浏览器或检查权限' });
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      location.value = { longitude, latitude };
      getWeather(); // 位置获取成功后立即调用
    },
    (error) => {
      toast.error('获取地理位置失败', {
        description: error.message || '请检查位置权限设置'
      });
    }
  );
}

function getLocation () {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition((position) => {
    const { longitude, latitude } = position.coords;
    location.value = { longitude, latitude };
  });
}

function getWeather () {
  if (isLoading.value) return;
  isLoading.value = true;

  if (Object.keys(location.value).length === 0) {
    toast.error('获取地理位置失败', {
      description: '网络异常或未开启位置权限，请稍后重试',
    });
    isLoading.value = false;
    return;
  }
  const { longitude, latitude } = location.value;

  // 调用接口获取天气数据
  getWeatherData(Number(longitude).toFixed(2), Number(latitude).toFixed(2)).then((res) => {
    const { text, feelsLike, windDir, windSpeed, icon } = res.now;
    weatherData.value = { text, feelsLike, windDir, windSpeed, icon };
    getDataSuccess.value = true;
    toast.success('获取天气信息成功');
    isLoading.value = false;
  });

  // 3日天气预报
  // getWeatherReport(Number(longitude).toFixed(2), Number(latitude).toFixed(2)).then((res) => {
  //   const { daily } = res;
  //   const result = [];
  //   for (let i = 0; i < daily.length; i++) {
  //     const { fxDate, iconDay, textDay, iconNight, textNight, tempMax, tempMin } = daily[i];
  //     let month = fxDate.split('-')[1];
  //     const day = fxDate.split('-')[2];
  //     if (month.includes('0')) {
  //       month = month.slice(1);
  //     }
  //     const date = month + '月' + day + '日';
  //     result.push({ date, iconDay, textDay, iconNight, textNight, tempMax, tempMin });
  //   }
  //   weatherReport.value = result;
  //   toast.success('获取天气预报成功');
  // });
}
</script>

<style lang="scss" scoped></style>
