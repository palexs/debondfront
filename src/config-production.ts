const configurations: { [env: string]: any } = {
  development: {
    externalTokens: {
      DAI: ["0x6B175474E89094C44Da98b954EedeAC495271d0F", 18],
      HUSD: ["0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6", 8],
      yCRV: ["0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8", 18],
      SUSD: ["0x57Ab1E02fEE23774580C119740129eAC7081e9D3", 18],
      USDC: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 6],
      USDT: ["0xdAC17F958D2ee523a2206206994597C13D831ec7", 6],
      "GOS_HUSD-LP": ["0x85C0594364353B888E4213E33dbD8Ecd653506a4", 18],
      "GOC_HUSD-LP": ["0xC33F68fBBCB529faB10aB5FcFD77BaD7cE9fbfFA", 18],
      "HT_HUSD-GLP": ["0xBe963435F750bB60e45fFa98318E74ea6E3aC0d7", 18],
      "GOT_HUSD-GLP": ["0xC31b9f33fB2C54B789C263781CCEE9b23b747677", 18],
      TEST: ["0x5C842C05BE04eA595a16bAc01fd523014433F146", 18],
    },
    baseLaunchDate: new Date("2020-11-26T00:00:00Z"),
    bondLaunchesAt: new Date("2020-12-03T15:00:00Z"),
    boardroomLaunchesAt: new Date("2020-12-11T00:00:00Z"),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  production: {
    externalTokens: {
      SASHTOKEN: ["0x6c487778eD557a62186054b75aA8F20332b5C487", 18],
      SGMTOKEN: ["0x04c2a99ddDb2a616E896C0Af3f44d8be89Bd94d6", 18],
      uniswapRouter: ["0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", 8],
      bank: ["0x4bdCf53a2B4Bc65BDf0d550CdEAF2DBcdF054a21", 18],
      bonds: ["0x5ee27377c193428BAB9F106549bb6282Dac5FE69", 18],
      dex: ["0x0CE819823B9BAb4bbb98833bc6E7A8D42d180273", 18],
      claim: ["0x55fa767b59110982D75442213B3d9626aB99dD08", 18],
      USDT: ["0x0B85692a66fF158c125174d884aB4a0633C592B6", 6],
      BNB: ["0x0B85692a66fF158c125174d884aB4a0633C592B6", 18],
      MDX: ["0x0B85692a66fF158c125174d884aB4a0633C592B6", 18],
      TEST: ["0x5C842C05BE04eA595a16bAc01fd523014433F146", 18],
      TokenAddress: ["0xb9C5A57c0AbcA2aa54995BC994A238e29433aFeE", 18],
      // bondsTest:["0xf7ac9db642Ab1Fda53DD652675959e8978e40776",18],
      bondsTest: ["0xaaAE67e18D2Fc9583A1513c4f5efeF7F913477e5", 18],
      // dexTest:["0xe04D4ac2d95b5107Ae947F98ae79Df10C549a897",18]
      dexTest: ["0xeFdcdBe1BC1eB3Ff011d1669D45F12095ce795bE", 18],
    },
    testAddress: {
      USDT: ["0xc158EB712eB387efDFa40b8C7b2f87C91C0a17F0", 18],
      USDC: ["0xd3E38F33dFe2E16E877D122b906EedBB7e3a38EB", 18],
      BUSD: ["0x53dcf6e25BE7f5966175784DBc3e16d0a3a0Ff84", 18],
      DAI: ["0x98f05b4661378ed1014727757E62593E0222da1F", 18],
      uniswapv2fatory: ["0x12Fc83c0F131C5D2402433D77a2cD2A9fDA9db41", 18],
      aridrop:["0x323F0e8Df8BE8D1b8AED9D5Ac5c0F2e7DE2031e8",18],
      gov:["0xFc19BeD96776975D29e691eDdf30dFB31bb5a621",18],
      bank:["0x0328a867c3aFD0792F8b849A71F6a0c98e3E5901",18],
      protocal:["0x3a0a5a1d4cf7dFD76cFF0c2d60cD8700995b9Dd2",18],
      sash:["0x48CFeB7F7bfC21a2B9455F986bECEAdE3044CEBD",18],
      sgm:["0x95112b620CCDd734a7C862C38ee7dCcFd3991F79",18],
      test:["0xd362cfD7a3eD45Bb96d861fcaDCEF2c02e407E56",18],
      // Loan:["0xAbDf627E4ce02F8204d8312c22812E6f0c158fad",18]
      Loan:["0x2e73B361aFF51C80d3908Fe89065121653Faf60F",18]
    },
  },
};

// export default configurations[process.env.NODE_ENV || "development"];
export default configurations["production"];
