<template>
  <div class="home-view">
    <section class="main-section">
      <video
        v-if="!isMobile"
        class="video-bg"
        loop
        height="100%"
        autoplay
        muted
      >
        <source src="../assets/videos/animation.fix.mp4" />
      </video>

      <transition name="fade">
        <div class="scroll-block" v-if="showScrollBlock">
          <p class="scroll-text">Scroll To Learn More</p>
          <div class="line"></div>
        </div>
      </transition>

      <div class="content-wrap">
        <div class="title-wrap">
          <h1>Abracadabra.Money</h1>
          <h2>Make your Interest bearing assets liquid</h2>
        </div>
        <div class="btns-wrap">
          <BaseButton
            primary
            :width="isMobile ? '288px' : '200px'"
            @click="toBorrowPage"
          >
            Borrow
          </BaseButton>
          <BaseButton
            primary
            :width="isMobile ? '288px' : '200px'"
            @click="toLeveragePage"
          >
            Leverage Up
          </BaseButton>
        </div>
      </div>
    </section>
    <section class="section-1">
      <img
        src="@/assets/images/home/section-line.png"
        alt=""
        class="section-line"
      />
      <img src="@/assets/images/home/section-1-bg.png" alt="" class="bg-img" />
      <div class="content-wrap">
        <div class="info-wrap">
          <h3>Borrow the Stablecoin $MIM</h3>
          <p>
            Use your favourite assets as collateral to borrow Magic Internet
            Money, a leading decentralised and collateral-backed stablecoin.
          </p>
          <p class="highlited">
            While in our markets, your collateral keeps growing at the same rate
            as if it was in your wallet!
          </p>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://docs.abracadabra.money/intro/lending-markets"
            class="link"
            >Read more</a
          >
        </div>
        <div class="image-wrap">
          <img
            src="@/assets/images/home/section-1-img.png"
            alt=""
            class="main-img"
          />
        </div>
      </div>
    </section>
    <section class="section-2">
      <img
        src="@/assets/images/home/section-line.png"
        alt=""
        class="section-line"
      />
      <img src="@/assets/images/home/section-2-bg.png" alt="" class="bg-img" />

      <div class="content-wrap">
        <div class="image-wrap">
          <img
            src="@/assets/images/home/section-2-img.png"
            alt=""
            class="main-img"
          />
        </div>
        <div class="info-wrap">
          <h3>Our Pegged Assets</h3>
          <p>
            Magic Internet Money ($MIM) and Magic Internet Gold ($MIG) are the
            pillars of the Abracadabra ecosystem. Our tokens are paired to the
            dollar and the ounce of gold.
          </p>
          <p class="highlited">
            USE THEM TO STORE VALUE, EARN YIELD OR PARTICIPATE IN MANY OTHER
            DEFI OPPORTUNITIES!
          </p>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://docs.abracadabra.money/tokens/tokenomics#the-mim-token"
            class="link"
            >Read more</a
          >
        </div>
      </div>
    </section>
    <section class="section-3">
      <img
        src="@/assets/images/home/section-line.png"
        alt=""
        class="section-line"
      />
      <img src="@/assets/images/home/section-3-bg.png" alt="" class="bg-img" />
      <img src="@/assets/images/home/magic-wand.png" alt="" class="magic-img" />
      <div class="content-wrap">
        <div class="info-wrap">
          <h3>Leverage And Farming Opportunities</h3>
          <p>
            ENJOY THE BEST STABLE YIELD THANKS TO OUR BUILT-IN LEVERAGE ENGINE,
            AND OUR DEFI KNOWLEDGE!
          </p>
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://docs.abracadabra.money/intro/leveraged-positions"
            class="link"
            >Read more about Abracadabra Ecosystem</a
          >
        </div>
      </div>
    </section>
  </div>
</template>
<script>
const BaseButton = () => import("@/components/base/BaseButton");

export default {
  data() {
    return {
      isMobile: false,
      lastKnownScrollPosition: 0,
    };
  },
  computed: {
    showScrollBlock() {
      return this.lastKnownScrollPosition === 0;
    },
  },
  methods: {
    toBorrowPage() {
      this.$router.push({ name: "Borrow" });
    },
    toLeveragePage() {
      this.$router.push({ name: "Leverage" });
    },
    onResize() {
      this.isMobile = window.innerWidth < 980;
    },
    onScroll() {
      this.lastKnownScrollPosition = window.scrollY;
    },
  },
  created() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
  },
  components: {
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.scroll-block {
  position: absolute;
  bottom: 35px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  .scroll-text {
    font-weight: 200;
    font-size: 12px;
    line-height: 1.8;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .line {
    margin-top: 8px;
    margin-left: auto;
    margin-right: auto;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0)
    );
    width: 1px;
    height: 24px;
  }
}

.section-1,
.section-2,
.section-3 {
  position: relative;

  .section-line {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: auto;
  }

  .info-wrap {
    width: 50%;
  }

  .image-wrap {
    width: 50%;

    .main-img {
      width: 90%;
      max-width: 350px;
      height: auto;
      object-fit: contain;
      display: block;
    }
  }

  .bg-img {
    position: absolute;
    width: 90%;
    max-width: 520px;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;
  }

  h3 {
    font-weight: 600;
    font-size: 24px;
    line-height: 1.5;
    letter-spacing: 0.025em;
    margin-bottom: 15px;
    color: #fff;
    text-transform: uppercase;
  }

  p {
    font-weight: 400;
    font-size: 18px;
    line-height: 1.8;
    letter-spacing: 0.02em;
    margin-bottom: 15px;
    color: #fff;

    &.highlited {
      text-transform: uppercase;
      color: #b2e1ff;
      font-weight: 600;
    }
  }

  .content-wrap {
    max-width: 1140px;
    width: 100%;
    margin: 0 auto;
    padding: 90px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }
}

.section-1 {
  background: linear-gradient(180deg, #434157 0%, rgba(68, 65, 88, 0) 100%),
    linear-gradient(
      237.96deg,
      rgba(68, 66, 89, 0.2) 8.14%,
      rgba(69, 66, 88, 0.08) 51.72%
    ),
    linear-gradient(
      102.08deg,
      #3f3d52 0.06%,
      #424056 2.47%,
      rgba(65, 63, 84, 0) 31.76%
    );

  .main-img {
    margin-left: auto;
  }
}

.section-2 {
  background: linear-gradient(180deg, #403e56 0%, rgba(68, 65, 88, 0) 100%);

  .content-wrap {
    padding: 95px 15px;
  }

  .bg-img {
    max-width: 660px;
  }
}

.section-3 {
  background: linear-gradient(180deg, #403e56 0%, rgba(68, 65, 88, 0) 100%),
    linear-gradient(
      231.81deg,
      rgba(68, 66, 89, 0.2) 35.11%,
      rgba(53, 51, 69, 0.122) 69.37%
    );
  .bg-img {
    max-width: 366px;
    z-index: 2;
  }

  h3 {
    color: #b2e1ff;
  }

  p {
    font-weight: 600;
    font-size: 20px;
    line-height: 1.8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .magic-img {
    position: absolute;
    width: 80%;
    max-width: 364px;
    top: 50%;
    right: 60%;
    transform: translateY(-50%);
  }

  .content-wrap {
    padding-top: 215px;
    padding-bottom: 300px;
    justify-content: center;

    .info-wrap {
      text-align: center;
    }
  }
}

.main-section {
  @media (max-width: 980px) {
    background-image: url("../assets/images/home-bg-full.png");
    padding: 0 10px;
    justify-content: center;
    text-align: center;
  }
  overflow-x: hidden;
  background-color: #4e4b64;
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;

  .content-wrap {
    max-width: 1140px;
    width: 100%;
    margin: 0 auto;
    padding: 100px 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    @media (max-width: 980px) {
      align-items: center;
      justify-content: center;
    }
    @media (max-width: 480px) {
      align-items: center;
      justify-content: center;
    }
  }

  .video-bg {
    position: absolute;
    min-height: calc(100% + 5px);
    min-width: 100%;
    object-fit: cover;
    right: 0;
    top: -5px;
  }

  .title-wrap {
    max-width: 620px;
    h1 {
      margin: 11px 0;
      font-family: "Prompt";
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      @media (max-width: 480px) {
        font-size: 16px;
        margin: 8px 0;
      }
    }
    h2 {
      font-family: "Prompt";
      font-style: normal;
      font-weight: 700;
      font-size: 40px;
      line-height: 58px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: -webkit-linear-gradient(
        107.5deg,
        #abdeff -3.19%,
        #5552fd 101.2%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      @media (max-width: 480px) {
        font-size: 24px;
        line-height: 34px;
      }
    }
    z-index: 2;
    margin-bottom: 32px;
  }

  .btns-wrap {
    @media (max-width: 980px) {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
  }
}

@media (max-width: 980px) {
  .section-1 .main-img,
  .section-2 .main-img {
    margin-left: auto;
    margin-right: auto;
  }

  .section-1 .bg-img,
  .section-2 .bg-img {
    display: none;
  }

  .section-1 .content-wrap,
  .section-2 .content-wrap,
  .section-3 .content-wrap {
    flex-direction: column;

    .info-wrap {
      order: 1;
      width: 100%;
      max-width: 550px;
      margin-bottom: 30px;
      text-align: center;
    }

    .image-wrap {
      order: 2;
      width: 100%;
      max-width: 350px;
    }
  }
}
@media (max-width: 640px) {
  .section-3 .bg-img {
    max-width: 290px;
  }

  .section-3 .content-wrap {
    padding-bottom: 250px;
  }

  .section-1,
  .section-2,
  .section-3 {
    h1 {
      font-size: 20px;
    }

    p {
      font-size: 16px;
    }
  }
}
</style>
