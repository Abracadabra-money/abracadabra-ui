import { Contract } from "ethers";
import { tenderlySimulate } from "../src/utils/tenderly/simulation";
const MAX_GAS = 100000;

class AbraContract {
  constructor(address, abi, provider) {
    this.isSimulate = false;
    this.estimateGas = {};

    const contractInstance = new Contract(address, abi, provider);
    Object.keys(contractInstance).forEach((each) => {
      if (each != "estimateGas") this[each] = contractInstance[each];
    });

    Object.keys(contractInstance.estimateGas).forEach((each) => {
      this.estimateGas[each] = async (...params) => {
        try {
          const estimatedGas = await contractInstance.estimateGas[each](
            ...params
          );
          return estimatedGas;
        } catch (e) {
          const hijackSmartContractMethod = async (...params) => {
            try {
              let paramsCopy = [...params];
              const transactionOpts = paramsCopy.pop();
              const networkId = transactionOpts.network_id;
              delete transactionOpts.network_id;
              const transactionParameters = paramsCopy;
              const unsignedTx = await this.populateTransaction[each](
                ...transactionParameters,
                transactionOpts
              );
              const tenderlySimTxParameters = {
                ...transactionOpts,
                network_id: networkId,
                input: unsignedTx.data,
                to: this.address,
                save: true,
              };
              const res = await tenderlySimulate(tenderlySimTxParameters);
              if (res.data.simulation.status === false) {
                const simulationId = res.data.simulation.id;
                const simulationErrorMsg = res.data.simulation.error_message;
                throw {
                  simulationId,
                  simulationErrorMsg,
                };
              }
            } catch (e) {
              console.log("tenderly simulation failed", e);
              throw e;
            }
          };
          this[each] = hijackSmartContractMethod;
        }
        return MAX_GAS;
      };
    });
  }
}

export default AbraContract;
