import axios from "axios";
import { formatToFixed } from "@/helpers/filters";
const url = "https://api-deusd-prod-public.elixir.xyz/public/deusd_apy";

export const getElixirApy = async (): Promise<number> => {
  try {
    const { data } = await axios.get(url);

    return Number(formatToFixed(data.deusd_apy, 2));
  } catch (error) {
    return 0;
  }
};
