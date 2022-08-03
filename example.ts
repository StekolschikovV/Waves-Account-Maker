import {wavesAccountMaker as WAM} from "./lib/index";


const run = async () => {
  WAM(
    2,
    [
      {
        amount: 1,
        assetId: null
      },
      {
        amount: 1,
        assetId: 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p'
      }
    ])
}

run()
