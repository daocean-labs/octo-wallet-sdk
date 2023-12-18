import { JsonRpcProvider, ZeroAddress } from "ethers"
import { DiamondLoupeFacet__factory, StrategyBuilderFacet__factory } from "../typechain"


export interface Tactic {
    name: string,
    functionSelector: string,
    callData?: string,
    arguments: any[]
}

export interface Strategy {
    strategyId: number,
    tactics: Tactic[]
}



export class StrategyBuilder {
    private isInstalled: boolean
    private strategies: Strategy[]


    private constructor(
        isInstalled: boolean,
        strategies: Strategy[]
    ) {
        this.isInstalled = isInstalled
        this.strategies = strategies
    }

    public static async init(
        walletAddress: string,
        publicProvider: JsonRpcProvider
    ) {

        if (walletAddress != ZeroAddress) {

            const builder = StrategyBuilderFacet__factory.connect(walletAddress, publicProvider)

            const filter = builder.filters.StrategyAdded()

        }

    }

}