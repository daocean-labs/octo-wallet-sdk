export interface ContractLib {
  [key: number]: any;
}

export const ChainID = {
  Daocean: 1337,
};

export const OctoDefiContracts: ContractLib = {
  1337: {
    EntryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    Factory: "0xD52d8bb7Ec439DAA364a3b6517005EeEc9324B06",
  },
};

export const ERC20TokenContracts: ContractLib = {
  11155111: {
    DFI: "0xd0f0De5C3d552a303E862c446D070531f734C10B",
    DUSD: "0xF14b3F72b99027d258fcFeB09e5263F045D546A6",
  },
};
