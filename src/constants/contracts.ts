import { StrategyBuilderFacet__factory } from "../typechain";
import { Interface } from "ethers";

export interface ContractLib {
  [key: number]: any;
}

export const ChainID = {
  Daocean: 1337,
};

export const OctoDefiContracts: ContractLib = {
  1337: {
    EntryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    Factory: "0x9Bcb695Ea0BBeC9f35417A6B36Bd8C936dafdD20",
  },
};

export const ERC20TokenContracts: ContractLib = {
  11155111: {
    DFI: "0xd0f0De5C3d552a303E862c446D070531f734C10B",
    DUSD: "0xF14b3F72b99027d258fcFeB09e5263F045D546A6",
  },
};

export interface FacetData {
  name: string;
  interface: Interface;
  description: string;
}

export interface Facets {
  [key: string]: FacetData;
}

export interface DeployedFacets {
  [key: number]: Facets
}

export const octoDefiFacets: DeployedFacets = {
  1337: {
    '0x89CD9aec31F1C06773cFCb91f58cC7DA9b976352': {
      name: 'StrategyBuilderFacet',
      interface: StrategyBuilderFacet__factory.createInterface(),
      description: 'The strategy builder enable the creation of own defi strategies',
    },
  }
};

export function getFacetAddressByName(facets: DeployedFacets, name: string, chainId: number) {
  if (chainId in facets) {
    for (const address in facets) {
      if (facets[chainId][address].name === name) {
        return address
      }
    }
  }
  return null
}