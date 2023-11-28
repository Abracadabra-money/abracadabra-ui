<template >
    <ul class="farm-tooltip">
        <li class="tooltip-list-item">
            <span class="title">
                <BaseTokenIcon class="token-icon" size="20px" />
                Base APR
            </span>

            <span class="value">{{ baseApr }}%</span>
        </li>

        <li class="tooltip-list-item">
            <span class="title">
                <BaseTokenIcon class="token-icon" size="20px" />
                Boosted
            </span>

            <span class="value">{{ boosted }}%</span>
        </li>

        <li class="tooltip-list-item total">
            <span class="title">
                Total
            </span>

            <span class="value">{{ total }}%</span>
        </li>
    </ul>
</template>
<script>
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue"

export default {
    props: {
        baseApr: { type: Number, default: 0 },
        boosted: { type: Number, default: 0 }
    },

    computed: {
        total() { return this.baseApr + this.boosted; }
    },

    components: {
        BaseTokenIcon
    }
}
</script>
<style lang="scss" scoped>
.farm-tooltip {
    display: flex;
    flex-direction: column;
    width: 250px;
    padding: 12px;
    gap: 8px;
    border-radius: 12px;
    background: #15192A;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.tooltip-list-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    color: #878B93;
    font-size: 14px;
    font-weight: 400;
}

.value {
    color: white;
    font-size: 14px;
    font-weight: 500;
}

.total {
    padding: 8px 0 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
}
</style>