<template>
    <div class="icon-wrap" :style="`width: ${size}px; height: ${size}px;`">
      <svg
        class="exclamation-mark-icon"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.25 6C8.25 5.586 8.586 5.25 9 5.25C9.414 5.25 9.75 5.586 9.75 6V9.75C9.75 10.164 9.414 10.5 9 10.5C8.586 10.5 8.25 10.164 8.25 9.75V6ZM8.25 12C8.25 11.586 8.586 11.25 9 11.25C9.414 11.25 9.75 11.586 9.75 12C9.75 12.414 9.414 12.75 9 12.75C8.586 12.75 8.25 12.414 8.25 12ZM9 15C5.69175 15 3 12.3082 3 9C3 5.69175 5.69175 3 9 3C12.3082 3 15 5.69175 15 9C15 12.3082 12.3082 15 9 15ZM9 1.5C4.85775 1.5 1.5 4.85775 1.5 9C1.5 13.1423 4.85775 16.5 9 16.5C13.1423 16.5 16.5 13.1423 16.5 9C16.5 4.85775 13.1423 1.5 9 1.5Z"
          :fill="color"
        />
        <mask
          id="mask0_1824_23700"
          style="mask-type: luminance"
          maskUnits="userSpaceOnUse"
          x="1"
          y="1"
          width="16"
          height="16"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.25 6C8.25 5.586 8.586 5.25 9 5.25C9.414 5.25 9.75 5.586 9.75 6V9.75C9.75 10.164 9.414 10.5 9 10.5C8.586 10.5 8.25 10.164 8.25 9.75V6ZM8.25 12C8.25 11.586 8.586 11.25 9 11.25C9.414 11.25 9.75 11.586 9.75 12C9.75 12.414 9.414 12.75 9 12.75C8.586 12.75 8.25 12.414 8.25 12ZM9 15C5.69175 15 3 12.3082 3 9C3 5.69175 5.69175 3 9 3C12.3082 3 15 5.69175 15 9C15 12.3082 12.3082 15 9 15ZM9 1.5C4.85775 1.5 1.5 4.85775 1.5 9C1.5 13.1423 4.85775 16.5 9 16.5C13.1423 16.5 16.5 13.1423 16.5 9C16.5 4.85775 13.1423 1.5 9 1.5Z"
            :fill="color"
          />
        </mask>
        <g mask="url(#mask0_1824_23700)"></g>
      </svg>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    props: {
      size: { type: String, default: "19" },
      color: { type: String, default: "rgba(212, 212, 213, 1)" }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .icon-wrap {
    display: flex;
    align-items: center;
  }
  
  .exclamation-mark-icon {
    width: 100%;
  }
  </style>
  