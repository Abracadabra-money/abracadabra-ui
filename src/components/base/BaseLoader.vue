<template>
  <div class="spinner">
    <i v-for="i in 100" :key="i">
      <b></b>
    </i>
  </div>
</template>

<script>
export default {
  name: "BaseLoader",
};
</script>

<style lang="scss" scoped>
$particles: 100; // has to match nodes in dom
$particleSize: 6px;
$radius: 100;
$lapDuration: 3s;

.spinner {
  position: relative;
  perspective: 200px;
  padding: 120px;
  width: 0;
}
i {
  display: block;
  position: absolute;
  opacity: 1;

  b {
    display: block;
    width: $particleSize;
    height: $particleSize;
    border-radius: $particleSize;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 14px rgba(255, 255, 255, 1);

    animation-name: spin;
    animation-duration: $lapDuration;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
}

@for $i from 1 through $particles {
  i:nth-child(#{$i}) {
    $angle: math.div($i, $particles) * 360;

    transform: rotate(#{$angle}deg) translate3d(#{$radius}px, 0, 0);

    b {
      animation-delay: $i * math.div($lapDuration, ($particles - 2));
    }
  }
}

@keyframes spin {
  0% {
    transform: scale(1);
  }
  15% {
    transform: translate(math.div(-$particleSize,2), math.div(-$particleSize,2)) scale(3);
  }
  50% {
    transform: scale(1);
  }
}

@media (max-width: 860px) {
  .spinner {
    transform: scale(0.8);
  }
}
</style>
