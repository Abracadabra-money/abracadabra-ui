<template>
  <div class="lock-info">
    <div>
      <div class="info-row">
        <h4 class="sub-title">Locked Balance</h4>
        <div class="lock-amount">
          <img
            class="claim-info-icon"
            src="@/assets/images/tokens/SPELL.png"
            alt="Spell token icon"
          />

          {{ formatTokenBalance(Number(lockAmount)) }}
        </div>
      </div>
      <p class="lock-text">
        Locked funds will be automatically converted to Staking status upon
        timer completion
      </p>

      <div class="lock-list">
        <div
          class="lock-item"
          v-for="userLock in userLocks"
          :key="userLock.unlockTime"
        >
          <div class="lock-row">
            <div class="locked-amount">
              <img
                class="lock-icon"
                src="@/assets/images/tokens/SPELL.png"
                alt="Spell token icon"
              />

              {{ formatTokenBalance(userLock.amount) }}
            </div>
            <div class="locked-status">
              <div class="timer-wrap" v-if="userLock?.isLocked">
                <Timer
                  small
                  padding="0px 4px"
                  :endDateTimestamp="userLock.unlockTime"
                />
                <div class="description">Unlocks in</div>
              </div>

              <!-- <div class="unlocking" v-else-if="!lockData?.isUnlocking">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M19.5 7.5H9V5.25C9 4.45435 9.31607 3.69129 9.87868 3.12868C10.4413 2.56607 11.2044 2.25 12 2.25C13.4409 2.25 14.7375 3.28125 15.015 4.64906C15.0562 4.84234 15.172 5.01155 15.3373 5.11991C15.5026 5.22827 15.7039 5.26702 15.8976 5.22774C16.0913 5.18846 16.2616 5.07433 16.3716 4.91014C16.4816 4.74596 16.5224 4.545 16.485 4.35094C16.0612 2.26406 14.175 0.75 12 0.75C10.8069 0.751241 9.66303 1.22575 8.81939 2.06939C7.97575 2.91303 7.50124 4.05691 7.5 5.25V7.5H4.5C4.10218 7.5 3.72064 7.65804 3.43934 7.93934C3.15804 8.22064 3 8.60218 3 9V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V9C21 8.60218 20.842 8.22064 20.5607 7.93934C20.2794 7.65804 19.8978 7.5 19.5 7.5ZM19.5 19.5H4.5V9H19.5V19.5ZM12 10.5C11.3696 10.5002 10.7604 10.7273 10.2836 11.1397C9.80684 11.552 9.4944 12.1222 9.40339 12.746C9.31238 13.3698 9.44887 14.0055 9.78793 14.5369C10.127 15.0683 10.646 15.46 11.25 15.6403V17.25C11.25 17.4489 11.329 17.6397 11.4697 17.7803C11.6103 17.921 11.8011 18 12 18C12.1989 18 12.3897 17.921 12.5303 17.7803C12.671 17.6397 12.75 17.4489 12.75 17.25V15.6403C13.354 15.46 13.873 15.0683 14.2121 14.5369C14.5511 14.0055 14.6876 13.3698 14.5966 12.746C14.5056 12.1222 14.1932 11.552 13.7164 11.1397C13.2396 10.7273 12.6304 10.5002 12 10.5ZM12 14.25C11.7775 14.25 11.56 14.184 11.375 14.0604C11.19 13.9368 11.0458 13.7611 10.9606 13.5555C10.8755 13.35 10.8532 13.1238 10.8966 12.9055C10.94 12.6873 11.0472 12.4868 11.2045 12.3295C11.3618 12.1722 11.5623 12.065 11.7805 12.0216C11.9988 11.9782 12.225 12.0005 12.4305 12.0856C12.6361 12.1708 12.8118 12.315 12.9354 12.5C13.059 12.685 13.125 12.9025 13.125 13.125C13.125 13.4234 13.0065 13.7095 12.7955 13.9205C12.5845 14.1315 12.2984 14.25 12 14.25Z"
                          fill="white"
                        />
                      </svg>

                      Unlocking
                    </div> -->

              <div class="unlocked" v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 21.75C13.9284 21.75 15.8134 21.1782 17.4168 20.1068C19.0202 19.0355 20.2699 17.5127 21.0078 15.7312C21.7458 13.9496 21.9389 11.9892 21.5627 10.0979C21.1865 8.20656 20.2579 6.46927 18.8943 5.10571C17.5307 3.74215 15.7934 2.81355 13.9021 2.43735C12.0108 2.06114 10.0504 2.25423 8.26884 2.99218C6.48726 3.73013 4.96452 4.97982 3.89317 6.58319C2.82183 8.18657 2.25 10.0716 2.25 12C2.25273 14.585 3.28084 17.0634 5.10872 18.8913C6.93661 20.7192 9.41498 21.7473 12 21.75ZM12 3.75C13.6317 3.75 15.2267 4.23386 16.5835 5.14038C17.9402 6.0469 18.9976 7.33537 19.622 8.84286C20.2464 10.3504 20.4098 12.0092 20.0915 13.6095C19.7731 15.2098 18.9874 16.6799 17.8336 17.8336C16.6798 18.9874 15.2098 19.7732 13.6095 20.0915C12.0092 20.4098 10.3504 20.2464 8.84286 19.622C7.33537 18.9976 6.0469 17.9402 5.14038 16.5835C4.23385 15.2268 3.75 13.6317 3.75 12C3.75248 9.81273 4.62247 7.71575 6.16911 6.16911C7.71575 4.62248 9.81273 3.75249 12 3.75ZM12.75 11.25V16.5C12.75 16.6989 12.671 16.8897 12.5303 17.0303C12.3897 17.171 12.1989 17.25 12 17.25C11.8011 17.25 11.6103 17.171 11.4697 17.0303C11.329 16.8897 11.25 16.6989 11.25 16.5V11.25C11.25 11.0511 11.329 10.8603 11.4697 10.7197C11.6103 10.579 11.8011 10.5 12 10.5C12.1989 10.5 12.3897 10.579 12.5303 10.7197C12.671 10.8603 12.75 11.0511 12.75 11.25ZM10.875 7.875C10.875 7.6525 10.941 7.43499 11.0646 7.24999C11.1882 7.06498 11.3639 6.92079 11.5695 6.83564C11.775 6.75049 12.0012 6.72821 12.2195 6.77162C12.4377 6.81503 12.6382 6.92218 12.7955 7.07951C12.9528 7.23684 13.06 7.4373 13.1034 7.65553C13.1468 7.87376 13.1245 8.09996 13.0394 8.30552C12.9542 8.51109 12.81 8.68679 12.625 8.81041C12.44 8.93402 12.2225 9 12 9C11.7016 9 11.4155 8.88148 11.2045 8.6705C10.9935 8.45952 10.875 8.17337 10.875 7.875Z"
                    fill="#67A069"
                  />
                </svg>

                Unlocked
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-list" v-if="!userLocks.length">
        <img
          class="empty-icon"
          src="@/assets/images/stake/empty-lock.png"
          alt=""
        />
        <div class="empty-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from "moment";
import { formatUnits } from "viem";
import { defineAsyncComponent, PropType } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import type { LockerInfo } from "@/helpers/bSpell/types";

export default {
  props: {
    lockerInfo: {
      type: Object as PropType<LockerInfo>,
      required: true,
    },
  },

  computed: {
    userLocks() {
      if (!this.lockerInfo) return [];

      return this.lockerInfo.lockInfo.userLocks.map(
        ({ unlockTime, amount }) => {
          const currentTimestamp = moment();

          const unixUnlockTime = unlockTime
            ? moment.unix(Number(unlockTime))
            : moment.unix(0);

          return {
            isLocked: unixUnlockTime.isAfter(currentTimestamp),
            amount: formatUnits(amount, 18),
            unlockTime: Number(unlockTime),
          };
        }
      );
    },

    lockAmount() {
      return formatUnits(this.lockerInfo?.lockInfo?.lockAmount || 0n, 18);
    },
  },

  methods: {
    formatTokenBalance,
  },

  components: {
    Timer: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/stake/earnPoints/Timer.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lock-info {
  min-height: 260px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.lock-amount {
  gap: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.lock-text {
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 16px;
}

.lock-list {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.lock-item {
  height: 60px;
  padding: 9px 16px 9px 12px;
  border-radius: 10px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.locked-amount {
  gap: 8px;
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 500;
  line-height: normal;
}

.lock-icon {
  width: 24px;
  height: 24px;
}

.lock-row {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.description {
  text-align: center;
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
}

.unlocking,
.unlocked {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.unlocked {
  color: #67a069;
}

.empty-list {
  gap: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  max-width: 124px;
  width: 100%;
}

.empty-text {
  max-width: 256px;
  width: 100%;
  font-weight: 400;
  line-height: normal;
}
</style>
