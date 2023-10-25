export interface ContractLib {
  [key: number]: any;
}

export const ChainID = {
  Sepolia: 11155111,
};

export const OctoDefiContracts: ContractLib = {
  11155111: {
    Factory: "0xD9dAD33994fC4207838d90cC83E9F9CfCD295417",
    EntryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    StrategyBuilder: "0xb454B56C61E24e48A10174411748e0d09F838F99",
    UniswapV2Router: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
  },
};

export const ERC20TokenContracts: ContractLib = {
  11155111: {
    DFI: "0xd0f0De5C3d552a303E862c446D070531f734C10B",
    DUSD: "0xF14b3F72b99027d258fcFeB09e5263F045D546A6",
  },
};
