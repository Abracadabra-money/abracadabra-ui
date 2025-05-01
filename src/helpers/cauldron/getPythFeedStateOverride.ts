import { pad, type Hex, encodePacked, parseAbiParameters, type StateOverride, numberToHex } from "viem";
import { getPythConfiguration } from "@/helpers/cauldron/getPythConfiguration";
import { getPythFeedData } from "@/helpers/pyth";
import { getSolidityMappingSlot } from "@/helpers/getSolidityMappingSlot";

export async function getPythFeedStateOverride<T extends Hex[]>(chainId: number, feedIds: [...T]): Promise<StateOverride[number]> {
  const { address, priceInfoSlot } = getPythConfiguration(chainId);
  const data = await getPythFeedData(feedIds);
  return {
    address,
    stateDiff: data.parsed.flatMap(({ id, price, ema_price }) => {
      const slot = getSolidityMappingSlot({
        slot: priceInfoSlot,
        params: parseAbiParameters("bytes32"),
        values: [id]
      });
      return [
        {
          slot: numberToHex(slot, { size: 32 }),
          value: pad(encodePacked(
            ['uint64', 'int64', 'int32', 'uint64'],
            [price.conf, price.price, price.expo, BigInt(price.publish_time)]
          )),
        }, {
          slot: numberToHex(slot + 1n, { size: 32 }),
          value: pad(encodePacked(
            ['uint64', 'int64'],
            [ema_price.conf, ema_price.price]
          )),
        },
      ]
    }),
  };
}
