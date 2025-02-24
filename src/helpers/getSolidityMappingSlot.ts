import {
  numberToHex,
  keccak256,
  encodeAbiParameters,
  type AbiParameter,
  type AbiParameterKind,
  type AbiParameterToPrimitiveType,
  type Hex,
  hexToBigInt,
} from "viem";

type AbiParametersToPrimitiveTypes<
  abiParameters extends readonly AbiParameter[],
  abiParameterKind extends AbiParameterKind = AbiParameterKind,
> = {
    [key in keyof abiParameters]: AbiParameterToPrimitiveType<
      abiParameters[key],
      abiParameterKind
    >
  };

type GetSolidityMappingSlotParams<TParams extends readonly AbiParameter[]> = {
  slot: bigint;
  params: TParams;
  values: [...AbiParametersToPrimitiveTypes<TParams>]
}

export function getSolidityMappingSlot<
  const TParams extends readonly AbiParameter[],
>({ slot, params, values }: GetSolidityMappingSlotParams<TParams>
): bigint {
  if (params.length < 1) {
    throw Error("Bad params");
  }
  if (params.length !== values.length) {
    throw Error("Bad values");
  }
  let ret: Hex = numberToHex(slot, { size: 32 });
  for (const index in params) {
    ret = keccak256(
      encodeAbiParameters(
        [params[index], { type: "bytes32" }],
        [values[index], ret]
      )
    );
  }
  return hexToBigInt(ret);
}
