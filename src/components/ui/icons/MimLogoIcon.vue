<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :style="`width: ${width}px; height: ${height}px;`"
    :class="{ pointer: pointer }"
    viewBox="0 0 21 20"
    fill="none"
  >
    <g clip-path="url(#clip0_11377_71767)">
      <path d="M15.6025 19.5L20.3525 14.75H15.6025V19.5Z" fill="#4229EF" />
      <path d="M20.3525 10L15.6025 14.75H20.3525V10Z" fill="#5552FD" />
      <path d="M15.6025 14.75L20.3525 10H15.6025V14.75Z" fill="#9695F8" />
      <path d="M20.3525 5.25L15.6025 10H20.3525V5.25Z" fill="#BDBDFF" />
      <path d="M15.6025 10L20.3525 5.25H15.6025V10Z" fill="#FED84F" />
      <path d="M1.35254 5.25L6.10254 0.5V5.25H1.35254Z" fill="#4229EF" />
      <path d="M10.8525 0.5L6.10254 5.25V0.5H10.8525Z" fill="#5552FD" />
      <path d="M6.10254 5.25L10.8525 0.5V5.25H6.10254Z" fill="#9695F8" />
      <path d="M15.6025 0.5L10.8525 5.25V0.5H15.6025Z" fill="#BDBDFF" />
      <path d="M10.8525 5.25L15.6025 0.5V5.25H10.8525Z" fill="#FECE23" />
      <path d="M20.3525 0.5L15.6025 5.25V0.5H20.3525Z" fill="#FED84F" />
      <path d="M15.6025 5.25L20.3525 0.5V5.25H15.6025Z" fill="#FECE23" />
      <path d="M6.10254 14.75L1.35254 19.5V14.75H6.10254Z" fill="#FECE23" />
      <path d="M1.35254 19.5L6.10254 14.75V19.5H1.35254Z" fill="#FED84F" />
      <path d="M10.8525 14.75L6.10254 19.5V14.75H10.8525Z" fill="#FECE23" />
      <path d="M6.10254 19.5L10.8525 14.75V19.5H6.10254Z" fill="#9695F8" />
      <path d="M15.6025 14.75L10.8525 19.5V14.75H15.6025Z" fill="#625FFF" />
      <path d="M6.10254 10L1.35254 14.75H6.10254V10Z" fill="#FED84F" />
      <path d="M1.35254 14.75L6.10254 10H1.35254V14.75Z" fill="#9695F8" />
      <path d="M6.10254 5.25L1.35254 10H6.10254V5.25Z" fill="#625FFF" />
    </g>
    <defs>
      <clipPath id="clip0_11377_71767">
        <rect
          width="20"
          height="20"
          fill="white"
          transform="translate(0.852539)"
        />
      </clipPath>
    </defs>
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 21,
    },
    height: {
      type: Number,
      default: 20,
    },
    fill: {
      type: String,
      default: "white",
    },
    pointer: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
path {
  transition: all 0.3s ease;
}

.pointer {
  cursor: pointer;
}
</style>
