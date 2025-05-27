<template>
  <div class="container" :style="{ fontSize: `${(size / 3).toFixed(2)}px` }">
    <div class="components" :style="{ backgroundColor: isDark ? 'rgba(25,30,50,1)' : 'rgba(70, 133, 192,1)' }" @click="toggleTheme">
      <div class="main-button" :style="mainButtonStyle">
        <div class="moon" v-for="i in 3" :key="i" :style="{ opacity: isDark ? 1 : 0 }"></div>
      </div>
      <div class="daytime-background" v-for="(bg, i) in 3" :key="'bg' + i" :style="daytimeStyles[i]"></div>
      <div class="cloud" :style="{ transform: `translateY(${isDark ? 80 : 10}em)` }">
        <div class="cloud-son" v-for="i in 6" :key="'cloud' + i"></div>
      </div>
      <div class="cloud-light" :style="{ transform: `translateY(${isDark ? 80 : 10}em)` }">
        <div class="cloud-son" v-for="i in 6" :key="'cloud-light' + i"></div>
      </div>
      <div class="stars" :style="{ transform: `translateY(${isDark ? -62.5 : -125}em)`, opacity: isDark ? 1 : 0 }">
        <div class="star" v-for="(star, i) in stars" :key="'star' + i" :class="star.size" :style="star.style">
          <div class="star-son" v-for="j in 4" :key="'star-son' + i + j"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: 'light' },
  size: { type: Number, default: 2 },
});
const emit = defineEmits(['change']);
const isDark = ref(props.modelValue === 'dark');

const mainButtonStyle = computed(() => ({
  transform: `translateX(${isDark.value ? 110 : 0}em)`,
  backgroundColor: isDark.value ? 'rgba(195, 200,210,1)' : 'rgba(255, 195, 35,1)',
  boxShadow: isDark.value
    ? '3em 3em 5em rgba(0, 0, 0, 0.5), inset -3em -5em 3em -3em rgba(0, 0, 0, 0.5), inset 4em 5em 2em -2em rgba(255, 255, 210,1)'
    : '3em 3em 5em rgba(0, 0, 0, 0.5), inset -3em -5em 3em -3em rgba(0, 0, 0, 0.5), inset 4em 5em 2em -2em rgba(255, 230, 80,1)',
}));

const daytimeStyles = computed(() => [
  { transform: `translateX(${isDark.value ? 110 : 0}em)` },
  { transform: `translateX(${isDark.value ? 80 : 0}em)` },
  { transform: `translateX(${isDark.value ? 50 : 0}em)` },
]);

const stars = ref([
  { size: 'big', style: { top: '11em', left: '39em' } },
  { size: 'big', style: { top: '39em', left: '91em' } },
  { size: 'medium', style: { top: '26em', left: '19em' } },
  { size: 'medium', style: { top: '37em', left: '66em' } },
  { size: 'small', style: { top: '21em', left: '75em' } },
  { size: 'small', style: { top: '51em', left: '38em' } },
]);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  emit('change', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  setInterval(() => {
    document.querySelectorAll('.cloud-son').forEach((el) => {
      const directions = ['2em', '-2em'];
      el.style.transform = `translate(${directions[Math.floor(Math.random() * 2)]}, ${directions[Math.floor(Math.random() * 2)]})`;
    });
  }, 1000);
});

watch(
  () => props.modelValue,
  (val) => (isDark.value = val === 'dark')
);
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  transition: all 0.7s;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.container {
  position: relative;
  width: 180em;
  height: 70em;
  display: inline-block;
  transform: translate3d(0, 0, 0);
}
.components {
  position: fixed;
  width: 180em;
  height: 70em;
  border-radius: 100em;
  box-shadow: inset 0 0 5em 3em rgba(0, 0, 0, 0.5);
  overflow: hidden;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1, 1);
  cursor: pointer;
}
.main-button {
  margin: 7.5em 0 0 7.5em;
  width: 55em;
  height: 55em;
  border-radius: 50%;
  transition: 1s;
  transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}
.moon {
  position: absolute;
  background-color: rgba(150, 160, 180, 1);
  box-shadow: inset 0 0 1em 1em rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  transition: 0.5s;
}
.moon:nth-child(1) {
  top: 7.5em;
  left: 25em;
  width: 12.5em;
  height: 12.5em;
}
.moon:nth-child(2) {
  top: 20em;
  left: 7.5em;
  width: 20em;
  height: 20em;
}
.moon:nth-child(3) {
  top: 32.5em;
  left: 32.5em;
  width: 12.5em;
  height: 12.5em;
}
.daytime-background {
  position: absolute;
  border-radius: 50%;
  transition: 1s;
  transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}
.daytime-background:nth-child(2) {
  top: -20em;
  left: -20em;
  width: 110em;
  height: 110em;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: -2;
}
.daytime-background:nth-child(3) {
  top: -32.5em;
  left: -17.5em;
  width: 135em;
  height: 135em;
  background-color: rgba(255, 255, 255, 0.1);
  z-index: -3;
}
.daytime-background:nth-child(4) {
  top: -45em;
  left: -15em;
  width: 160em;
  height: 160em;
  background-color: rgba(255, 255, 255, 0.05);
  z-index: -4;
}
.cloud,
.cloud-light {
  transform: translateY(10em);
  transition: 1s;
  transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}
.cloud-light{
  opacity: 0.5;
  position:absolute;
  right: 0em;
  bottom: 25em;
  z-index: -3;
}
.cloud-son {
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  z-index: -1;
  transition: transform 6s, right 1s, bottom 1s;
}
.cloud-son:nth-child(6n + 1) {
  right: -20em;
  bottom: 10em;
  width: 50em;
  height: 50em;
}
.cloud-son:nth-child(6n + 2) {
  right: -10em;
  bottom: -25em;
  width: 60em;
  height: 60em;
}
.cloud-son:nth-child(6n + 3) {
  right: 20em;
  bottom: -40em;
  width: 60em;
  height: 60em;
}
.cloud-son:nth-child(6n + 4) {
  right: 50em;
  bottom: -35em;
  width: 60em;
  height: 60em;
}
.cloud-son:nth-child(6n + 5) {
  right: 75em;
  bottom: -60em;
  width: 75em;
  height: 75em;
}
.cloud-son:nth-child(6n + 6) {
  right: 110em;
  bottom: -50em;
  width: 60em;
  height: 60em;
}
.cloud {
  z-index: -2;
}
.stars {
  transform: translateY(-125em);
  z-index: -2;
  transition: 1s;
  transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1);
}
.big {
  --size: 7.5em;
}
.medium {
  --size: 5em;
}
.small {
  --size: 3em;
}
.star {
  position: absolute;
  width: calc(2 * var(--size));
  height: calc(2 * var(--size));
}
.star:nth-child(1) {
  top: 11em;
  left: 39em;
  animation: star 3.5s infinite alternate linear;
}
.star:nth-child(2) {
  top: 39em;
  left: 91em;
  animation: star 4.1s infinite alternate linear;
}
.star:nth-child(3) {
  top: 26em;
  left: 19em;
  animation: star 4.9s infinite alternate linear;
}
.star:nth-child(4) {
  top: 37em;
  left: 66em;
  animation: star 5.3s infinite alternate linear;
}
.star:nth-child(5) {
  top: 21em;
  left: 75em;
  animation: star 3s infinite alternate linear;
}
.star:nth-child(6) {
  top: 51em;
  left: 38em;
  animation: star 2.2s infinite alternate linear;
}
.star-son {
  float: left;
}
.star-son:nth-child(1) {
  --pos: left 0;
}
.star-son:nth-child(2) {
  --pos: right 0;
}
.star-son:nth-child(3) {
  --pos: 0 bottom;
}
.star-son:nth-child(4) {
  --pos: right bottom;
}
.star-son {
  width: var(--size);
  height: var(--size);
  background-image: radial-gradient(circle var(--size) at var(--pos), transparent var(--size), #fff);
}
@keyframes star {
  0%,
  20% {
    transform: scale(0);
  }
  20%,
  100% {
    transform: scale(1);
  }
}
</style>
