import { lock } from "@/helpers/mimSavingRate/actions/lock";
import { stake } from "@/helpers/mimSavingRate/actions/stake";
import { stakeLocked } from "@/helpers/mimSavingRate/actions/stakeLocked";
import { withdraw } from "@/helpers/mimSavingRate/actions/withdraw";
import { getRewards } from "@/helpers/mimSavingRate/actions/getRewards";
import { withdrawWithRewards } from "@/helpers/mimSavingRate/actions/withdrawWithRewards";

export default { stake, lock, stakeLocked, withdraw, getRewards, withdrawWithRewards };
