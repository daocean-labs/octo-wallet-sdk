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
    Paymaster: "",
  },
  1131: {
    EntryPoint: "0x4F57D8D6AF4b2560323dF665D8E2b609B9DA9948",
    Factory: "0xEa813E39F69deA6D07889499c57381c6C6279724",
    Paymaster: "",
  },
  11155111: {
    EntryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    Factory: "0xA59A4Ffe7E96F65bFD63cc671289b3a6D25998Fd",
    Paymaster: "0xCbD4fa342d45DE78027672ae816b1067359Dfccb",
  },
};

export const ERC20TokenContracts: ContractLib = {
  11155111: {
    DFI: "0xd0f0De5C3d552a303E862c446D070531f734C10B",
    DUSD: "0xF14b3F72b99027d258fcFeB09e5263F045D546A6",
  },
};
