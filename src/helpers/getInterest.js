import Vue from "vue";

const getInterest = async (cauldron, interest) => {
  if (cauldron.accrueInfo) {
    const secondsInYear = 316880878;
    const accrueInfo = await cauldron.accrueInfo();
    const interesPerSecond = accrueInfo.INTEREST_PER_SECOND;

    if (!interesPerSecond) return interest;

    return Vue.filter("formatToFixed")(interesPerSecond / secondsInYear, 2);
  }

  return interest;
};

export { getInterest };
