import { type InterpretParams, interpret } from "revm-interpreter-js";
import {
  encodeFunctionData,
  type Abi,
  type AbiStateMutability,
  type Address,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type DecodeFunctionResultParameters,
  type EncodeFunctionDataParameters,
  type Hex,
  hexToBytes,
  decodeFunctionResult,
  type DecodeFunctionResultReturnType,
  type ByteArray,
  isBytes,
} from "viem";

export function interpretContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi> | undefined = undefined,
  const args extends ContractFunctionArgs<
    abi,
    AbiStateMutability,
    functionName extends ContractFunctionName<abi>
    ? functionName
    : ContractFunctionName<abi>
  > = ContractFunctionArgs<
    abi,
    AbiStateMutability,
    functionName extends ContractFunctionName<abi>
    ? functionName
    : ContractFunctionName<abi>
  >
>(
  parameters: EncodeFunctionDataParameters<abi, functionName> & {
    from?: Address | ByteArray;
    value?: bigint;
    targetAddress?: Address | ByteArray;
    bytecodeAddress?: Address | ByteArray;
    code: Hex | ByteArray;
    gasLimit?: bigint;
    staticCall?: boolean;
    specificationName?: InterpretParams["specificationName"];
  }
): DecodeFunctionResultReturnType<abi, functionName, args> {
  const tryToBytes = (
    value: Hex | ByteArray | undefined
  ): ByteArray | undefined =>
    value !== undefined
      ? isBytes(value)
        ? value
        : hexToBytes(value)
      : undefined;
  const encodedData = encodeFunctionData({
    abi: parameters.abi,
    functionName: parameters.functionName,
    args: parameters.args,
  } as EncodeFunctionDataParameters);
  const interpretResult = interpret(
    {
      bytecode: isBytes(parameters.code) ? parameters.code : hexToBytes(parameters.code),
      data: hexToBytes(encodedData),
      value: parameters.value,
      from: tryToBytes(parameters.from),
      targetAddress: tryToBytes(parameters.targetAddress),
      bytecodeAddress: tryToBytes(parameters.bytecodeAddress),
      gasLimit: parameters.gasLimit,
      staticCall: parameters.staticCall,
      specificationName: parameters.specificationName,
    });
  return decodeFunctionResult({
    abi: parameters.abi,
    functionName: parameters.functionName,
    data: interpretResult as unknown as Hex,
  } as DecodeFunctionResultParameters) as DecodeFunctionResultReturnType<
    abi,
    functionName,
    args
  >;
}
