import axios from "axios";
import type { ActionConfig } from "../actions/createPool";
import { graphAPIs } from "@/constants/pools/poolCreation";

export const fetchPoolsByInfo = async (chainId: number, { baseToken, quoteToken }: ActionConfig, first = 1000) => {

    const subgraphUrl = graphAPIs[chainId as keyof typeof graphAPIs]

    try {
        const query = `
{
  pairs(first: ${first},
        where: {
                and:[
                        {
                            removed:false
                        }, 
                        {
                            or:[
                                {
                                    and:[
                                            {
                                                baseToken:"${baseToken}"
                                            },
                                            {
                                                quoteToken:"${quoteToken}"
                                            }
                                        ]
                                },
                                {
                                    and:[
                                            {
                                                baseToken:"${quoteToken}"
                                            },
                                            {
                                                quoteToken:"${baseToken}"    
                                            }
                                        ]
                                }
                            ]
                        }
                    ]
                }
        ) {
    id
    i
    k
    lpFeeRate
  }
}`;

        const { data } = await axios.post(subgraphUrl, { query });

        const pools = data.data.pairs;

        return pools;
    } catch (error) {
        console.log("fetchPoolsByInfo err:", error);
    }
};

