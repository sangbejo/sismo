import { dataProviders } from "@group-generators/helpers/data-providers";
import { SupportedNetwork } from "@group-generators/helpers/data-providers/big-query/big-query";
import { BigNumberish } from "ethers";
import { Tags, ValueType, GroupWithData, AccountSource } from "topics/group";
import {
  GenerationContext,
  GenerationFrequency,
  GroupGenerator,
} from "topics/group-generator";
import { tornadoContractAddresses } from "./contracts";

const generator: GroupGenerator = {
  generationFrequency: GenerationFrequency.Once,

  generate: async (context: GenerationContext): Promise<GroupWithData[]> => {
    const bigQueryProviderMainnet = new dataProviders.BigQueryProvider({
      network: SupportedNetwork.MAINNET,
    });

    const tornadoDepositFunctionABI =
      "function deposit(bytes32 _commitment) external payable nonReentrant";

    type TornadoDepositFunctionType = {
      commitment: string;
      leafIndex: number;
      timestamp: BigNumberish;
    };

    for (const mainnetPoolContract of tornadoContractAddresses.ethereum) {
      const tornadoCashDepositorsMainnet =
        bigQueryProviderMainnet.getEvents<TornadoDepositFunctionType>({
          contractAddress: mainnetPoolContract,
          eventABI: tornadoDepositFunctionABI,
        });
    }

    return [
      {
        name: "im-a-tornado-cash-user-so-what",
        timestamp: context.timestamp,
        data,
        accountSources: [AccountSource.ETHEREUM],
        valueType: ValueType.Score,
        tags: [Tags.User],
      },
    ];
  },
};

export default generator;
