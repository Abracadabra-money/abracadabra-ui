import { lock } from "@/helpers/mimSavingRate/actions/lock";
import { stake } from "@/helpers/mimSavingRate/actions/stake";
import { withdraw } from "@/helpers/mimSavingRate/actions/withdraw";
import { getRewards } from "@/helpers/mimSavingRate/actions/getRewards";
import { withdrawWithRewards } from "@/helpers/mimSavingRate/actions/withdrawWithRewards";

export default { stake, lock, withdraw, getRewards, withdrawWithRewards };
