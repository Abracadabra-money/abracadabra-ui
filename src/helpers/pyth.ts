import type { Hex } from "viem";
import axios from "axios";

const hermesEndpoint = "https://hermes.pyth.network";

const hermesApi = axios.create({
  baseURL: hermesEndpoint,
});

type GetPythFeedDataReturnType<T extends Hex[]> = {
  binary: {
    encoding: "hex";
    data: {
      [Index in keyof T]: Lowercase<Hex>;
    };
  };
  parsed: {
    [Index in keyof T]: {
      id: Lowercase<T[Index]>;
      price: {
        price: bigint,
        conf: bigint,
        expo: number,
        publish_time: number
      },
      ema_price: {
        price: bigint,
        conf: bigint,
        expo: number,
        publish_time: number
      },
      metadata: {
        slot: number,
        proof_available_time: number,
        prev_publish_time: number
      }
    }
  }
};

export async function getPythFeedData<T extends Hex[]>(feedIds: [...T]) {
  const { data } = await hermesApi.get("v2/updates/price/latest", {
    params: {
      ids: feedIds,
      encoding: "hex",
      parsed: true,
      ignore_invalid_price_ids: false,
    },
  });
  return {
    binary: {
      ...data.binary,
      data: data.binary.data.map((b: any) => `0x${b}`),
    },
    parsed: data.parsed.map((parsed: any) => ({
      ...parsed,
      id: `0x${parsed.id}`,
      price: {
        ...parsed.price,
        price: BigInt(parsed.price.price),
        conf: BigInt(parsed.price.conf),
      },
      price_ema: {
        ...parsed.ema_price,
        price: BigInt(parsed.ema_price.price),
        conf: BigInt(parsed.ema_price.conf),
      },
    })),
  } as GetPythFeedDataReturnType<T>;
}
