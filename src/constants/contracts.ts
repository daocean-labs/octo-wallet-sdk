export interface ContractLib {
  [key: number]: any;
}

export const OctoDefiContracts: ContractLib = {
  1337: {
    EntryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    Factory: "0x9Bcb695Ea0BBeC9f35417A6B36Bd8C936dafdD20",
    Paymaster: "",
  },
  1131: {
    EntryPoint: "0x4F57D8D6AF4b2560323dF665D8E2b609B9DA9948",
    Factory: "0xEa813E39F69deA6D07889499c57381c6C6279724",
    Paymaster: "0xBc4aE6aacBA1b080C9B1E89fF4C120E15602bE7a",
  },
  11155111: {
    EntryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    Factory: "0xA59A4Ffe7E96F65bFD63cc671289b3a6D25998Fd",
    Paymaster: "0x544E2E7423166a0184f34629FB32eD2556947Cb2",
  },
};
