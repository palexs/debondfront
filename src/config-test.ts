const configurations: { [env: string]: any } = {
  development: {
    externalTokens: {
      DAI: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18],
      HUSD: ['0x0f548051B135fa8f7F6190cb78Fd13eCB544fEE6', 8],
      yCRV: ['0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8', 18],
      SUSD: ['0x57Ab1E02fEE23774580C119740129eAC7081e9D3', 18],
      USDC: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6],
      USDT: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6],
      'GOS_HUSD-LP': ['0x85C0594364353B888E4213E33dbD8Ecd653506a4', 18],
      'GOC_HUSD-LP': ['0xC33F68fBBCB529faB10aB5FcFD77BaD7cE9fbfFA', 18],
      'HT_HUSD-GLP': ['0xBe963435F750bB60e45fFa98318E74ea6E3aC0d7', 18],
      'GOT_HUSD-GLP': ['0xC31b9f33fB2C54B789C263781CCEE9b23b747677', 18],
      TEST:['0x5C842C05BE04eA595a16bAc01fd523014433F146',18],
      BANKTEST:['0x6B402F0A733A18028C67f870E3Dd11AFBc48dd7A',18],
    },
    baseLaunchDate: new Date('2020-11-26T00:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
  },
  production: {
    externalTokens: {
      SASHTOKEN: ['0x6c487778eD557a62186054b75aA8F20332b5C487', 18],
      SGMTOKEN: ['0x04c2a99ddDb2a616E896C0Af3f44d8be89Bd94d6', 18],
      uniswapRouter: ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 8],
      bank: ['0x4bdCf53a2B4Bc65BDf0d550CdEAF2DBcdF054a21', 18],
      bonds: ['0x5ee27377c193428BAB9F106549bb6282Dac5FE69', 18],
      dex: ['0x0CE819823B9BAb4bbb98833bc6E7A8D42d180273', 18],
      claim: ['0x55fa767b59110982D75442213B3d9626aB99dD08', 18],
      USDT: ['0x0B85692a66fF158c125174d884aB4a0633C592B6', 6],
      BNB: ['0x0B85692a66fF158c125174d884aB4a0633C592B6', 18],
      MDX: ['0x0B85692a66fF158c125174d884aB4a0633C592B6', 18],
      TEST:['0x5C842C05BE04eA595a16bAc01fd523014433F146',18],
      BANKTEST:['0x6B402F0A733A18028C67f870E3Dd11AFBc48dd7A',18],
    }
  },
};


// export default configurations[process.env.NODE_ENV || "development"];
export default configurations["production"];
