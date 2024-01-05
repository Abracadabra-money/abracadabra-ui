<template>
  <a
    class="empower-card"
    href="https://www.tally.xyz/profile/0xa71a021ef66b03e45e0d85590432dfcfa1b7174c?governanceId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
    target="_blank"
    rel="noreferrer noopener"
  >
    <h3 class="title text">
      <span class="primary">Empower</span> the ecosystem
    </h3>

    <div class="description">
      <p class="text">Delegate Your <span class="primary small">ARB</span></p>
      <p class="text">to <span class="primary small">Abracadabra</span> DAO</p>
    </div>
  </a>
</template>

<style lang="scss" scoped>
.empower-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 20px 10px 20px;
  height: 160px;
  max-width: 416px;
  width: 100%;
  background-image: url("@/assets/images/cauldrons/background-empower.png");
  border-radius: 16px;
  border: 1px solid #2d4a96;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  background-position: 100% 50%;
  backdrop-filter: blur(12.5px);
  background-repeat: no-repeat;
  background-size: cover;
  transition: 0.3s;
}

.empower-card:hover {
  border: 1px solid #526fbc;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.21);
}

.title {
  gap: 9px;
  font-weight: 600;
  line-height: 150%;
  text-transform: uppercase;
}

.primary {
  font-size: 26px;
  font-weight: 600;
  line-height: 24px;
  text-transform: uppercase;
  background: -webkit-linear-gradient(#7098ff, #a077f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.small {
  font-size: 18px;
}

.text {
  color: var(--additional-ffffff, #fff);
  font-weight: 500;
  line-height: 150%;
  gap: 4px;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 1024px) {
  .empower-card {
    max-width: 100%;
  }
}
</style>
