import { lock } from "@/helpers/stake/mimSavingRate/actions/lock";
import { stake } from "@/helpers/stake/mimSavingRate/actions/stake";
import { withdraw } from "@/helpers/stake/mimSavingRate/actions/withdraw";
import { getRewards } from "@/helpers/stake/mimSavingRate/actions/getRewards";
import { withdrawWithRewards } from "@/helpers/stake/mimSavingRate/actions/withdrawWithRewards";

export default { stake, lock, withdraw, getRewards, withdrawWithRewards };
