import { createClient } from "@layerzerolabs/scan-client";
import { getMessagesBySrcTxHash } from "@layerzerolabs/scan-client";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";

export const layerzerolabs = async (srcChainId: any, txHash: any) => {
  console.log("srcChainId", srcChainId);

  const client = createClient("testnet");
  console.log("layerzerolabs", client);
  const { messages } = await client.getMessagesBySrcTxHash(txHash);
  console.log("messages1111", messages);

  console.log("txHash", txHash);
  //   todo dstChainId
  const messages2 = await getMessagesBySrcTxHash(106, txHash);

  console.log("messages", messages2);

  const testWaitTrans = await waitForMessageReceived(srcChainId, txHash);

  console.log("DELIVERED", testWaitTrans);
};

// message
// {
//     "messages": [
//         {
//             "srcUaAddress": "0x41d5a04b4e03dc27dc1f5c5a576ad2187bc601af",
//             "dstUaAddress": "0xb3a66127ccb143bfb01d3aecd3ce9d17381b130d",
//             "updated": 1686063681,
//             "created": 1686063680,
//             "srcChainId": 102,
//             "dstChainId": 106,
//             "srcTxHash": "0xd6207153584b58372c1ce8920f702fe1d48c41b7d060b7185881446a77d7585d",
//             "srcBlockHash": "0x8559cc0975b2b255e81bb71dca3c8b7950e1d0666884c40ce4787eea192a1ecc",
//             "srcBlockNumber": "28867305",
//             "srcUaNonce": 11,
//             "status": "INFLIGHT"
//         }
//     ]
// }

// DELIVERED
// {
//     "srcUaAddress": "0x41d5a04b4e03dc27dc1f5c5a576ad2187bc601af",
//     "dstUaAddress": "0xb3a66127ccb143bfb01d3aecd3ce9d17381b130d",
//     "updated": 1686063765,
//     "created": 1686063680,
//     "srcChainId": 102,
//     "dstChainId": 106,
//     "dstTxHash": "0xc66d59a1b7f9da87805ffea4056608a9042774ccf0e96e92e6fd11decd32b075",
//     "dstTxError": null,
//     "srcTxHash": "0xd6207153584b58372c1ce8920f702fe1d48c41b7d060b7185881446a77d7585d",
//     "srcBlockHash": "0x8559cc0975b2b255e81bb71dca3c8b7950e1d0666884c40ce4787eea192a1ecc",
//     "srcBlockNumber": "28867305",
//     "srcUaNonce": 11,
//     "status": "DELIVERED"
// }
