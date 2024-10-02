<template>
  <div class="pills-potions" v-if="isPillsPotions">
    <div class="row">
      Earning Pills Potions

      <a
        class="potion-link"
        href="https://usual.money/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 9.75C21 9.94891 20.921 10.1397 20.7803 10.2803C20.6397 10.421 20.4489 10.5 20.25 10.5C20.0511 10.5 19.8603 10.421 19.7197 10.2803C19.579 10.1397 19.5 9.94891 19.5 9.75V5.56125L13.2816 11.7806C13.1408 11.9214 12.95 12.0004 12.7509 12.0004C12.5519 12.0004 12.361 11.9214 12.2203 11.7806C12.0796 11.6399 12.0005 11.449 12.0005 11.25C12.0005 11.051 12.0796 10.8601 12.2203 10.7194L18.4387 4.5H14.25C14.0511 4.5 13.8603 4.42098 13.7197 4.28033C13.579 4.13968 13.5 3.94891 13.5 3.75C13.5 3.55109 13.579 3.36032 13.7197 3.21967C13.8603 3.07902 14.0511 3 14.25 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75V9.75ZM17.25 12C17.0511 12 16.8603 12.079 16.7197 12.2197C16.579 12.3603 16.5 12.5511 16.5 12.75V19.5H4.5V7.5H11.25C11.4489 7.5 11.6397 7.42098 11.7803 7.28033C11.921 7.13968 12 6.94891 12 6.75C12 6.55109 11.921 6.36032 11.7803 6.21967C11.6397 6.07902 11.4489 6 11.25 6H4.5C4.10218 6 3.72064 6.15804 3.43934 6.43934C3.15804 6.72064 3 7.10218 3 7.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H16.5C16.8978 21 17.2794 20.842 17.5607 20.5607C17.842 20.2794 18 19.8978 18 19.5V12.75C18 12.5511 17.921 12.3603 17.7803 12.2197C17.6397 12.079 17.4489 12 17.25 12Z"
            fill="white"
          />
        </svg>
      </a>
    </div>
    <div><span class="potion-x">1x</span> Multiplier</div>
  </div>
</template>

<script>
export default {
  props: {
    pool: { type: Object },
  },

  computed: {
    isPillsPotions() {
      return this.pool.config.id === 2 && this.pool.config.chainId === 1;
    },
  },
};
</script>

<style scoped>
.pills-potions {
  z-index: 1;
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    linear-gradient(270deg, #915eff -3.8%, #d040c6 100%),
    linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  line-height: normal;
}

.row {
  gap: 4px;
  display: flex;
  align-items: center;
}

.potion-link {
  display: flex;
}

.potion-x {
  font-weight: 600;
}

@media screen and (max-width: 420px) {
  .pills-potions {
    gap: 4px;
    flex-direction: column;
  }
}
</style>
