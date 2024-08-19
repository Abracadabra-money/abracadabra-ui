import { hexToBytes } from "viem";

export const decimalMathLensContract = {
  abi: [
    {
      type: "function",
      name: "divCeil",
      inputs: [
        {
          name: "target",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "d",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "divFloor",
      inputs: [
        {
          name: "target",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "d",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "mulCeil",
      inputs: [
        {
          name: "target",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "d",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "mulFloor",
      inputs: [
        {
          name: "target",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "d",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "powFloor",
      inputs: [
        {
          name: "target",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "e",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "reciprocalCeil",
      inputs: [
        {
          name: "target",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "reciprocalFloor",
      inputs: [
        {
          name: "target",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      stateMutability: "pure",
    },
  ],
  code: hexToBytes(
    "0x6080604052348015600e575f80fd5b506103d78061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061007a575f3560e01c8063342b3c4911610058578063342b3c49146100c957806379796a09146100dc57806382251512146100ef578063dbedc81514610102575f80fd5b806309e1d9691461007e5780631bcaa471146100a35780632e962105146100b6575b5f80fd5b61009161008c3660046102df565b610115565b60405190815260200160405180910390f35b6100916100b13660046102ff565b610129565b6100916100c43660046102df565b610133565b6100916100d73660046102ff565b61013e565b6100916100ea3660046102df565b610148565b6100916100fd3660046102df565b610153565b6100916101103660046102df565b61015e565b5f6101208383610169565b90505b92915050565b5f61012382610186565b5f61012083836101a0565b5f610123826101be565b5f61012083836101d8565b5f610120838361026d565b5f6101208383610284565b5f610120670de0b6b3a7640000610180848661032a565b90610298565b5f6101236ec097ce7bc90715b34b9f100000000083610298565b5f816101b4670de0b6b3a76400008561032a565b6101209190610355565b5f610123826ec097ce7bc90715b34b9f1000000000610355565b5f815f036101ef5750670de0b6b3a7640000610123565b816001036101fe575081610123565b5f6102138461020e600286610355565b6101d8565b9050670de0b6b3a7640000610228828061032a565b6102329190610355565b905061023f600284610368565b60010361026657670de0b6b3a7640000610259858361032a565b6102639190610355565b90505b9050610123565b5f61012082610180670de0b6b3a76400008661032a565b5f670de0b6b3a76400006101b4838561032a565b5f806102a48385610355565b90505f6102b1848361032a565b6102bb908661037b565b905080156102d7576102ce82600161038e565b92505050610123565b509050610123565b5f80604083850312156102f0575f80fd5b50508035926020909101359150565b5f6020828403121561030f575f80fd5b5035919050565b634e487b7160e01b5f52601160045260245ffd5b808202811582820484141761012357610123610316565b634e487b7160e01b5f52601260045260245ffd5b5f8261036357610363610341565b500490565b5f8261037657610376610341565b500690565b8181038181111561012357610123610316565b808201808211156101235761012361031656fea26469706673582212208c57d6a47f6afeb3f89dfb2a192740562e1d51011162702d28185830b10fc85564736f6c634300081a0033"
  ),
} as const;
