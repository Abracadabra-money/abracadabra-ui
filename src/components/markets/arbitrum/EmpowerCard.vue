<template>
    <a href="https://www.tally.xyz/profile/0xa71a021ef66b03e45e0d85590432dfcfa1b7174c?governanceId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
        class="empower-card">
        <p class="primary paragraph"> <strong class="prim">EMPOWER</strong> <br>
            THE ECOSYSTEM</p>
        <p class="secondary paragraph">Delegate <br> Your <strong class="sec">ARB</strong> to <br>
            <strong class="sec">Abracadabra</strong> DAO
        </p>
    </a>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.empower-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15px 20px 11px 20px;
    height: 201px;
    width: 302px;
    background-image: url('../../../assets/images/background-empower.png');
    border-radius: 16px;
    border: 1px solid #2D4A96;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
    backdrop-filter: blur(12.5px);
    color: white;
    opacity: 0.6;
    transition: 0.3s;
}

.empower-card:hover {
    opacity: 1;
}

.paragraph {
    width: 183px;
}

strong {
    background: -webkit-linear-gradient(#7098FF, #A077F5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.prim {
    font-size: 26px;
    font-weight: 600;
}

.sec {
    font-size: 18px;
    font-weight: 500;
}
</style>
  