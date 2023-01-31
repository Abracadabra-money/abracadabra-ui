const getInterest = async (cauldron) => {
  if (cauldron.accrueInfo) {
    const accrueInfo = await cauldron.accrueInfo();
    const interesPerSecond = accrueInfo.INTEREST_PER_SECOND;
    if (!interesPerSecond) return null;

    const seconds = 316880878;
    return +parseFloat(interesPerSecond / seconds).toFixed(2);
  }

  return null;
};

export { getInterest };
