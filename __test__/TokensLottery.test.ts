import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import { TokensLotteryClient } from '../contracts/clients/TokensLotteryClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: TokensLotteryClient;

describe('Simulación del contrato inteligente TokensLottery', () => {
  beforeEach(fixture.beforeEach);

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount } = fixture.context;
    const { algorand } = fixture;

    appClient = new TokensLotteryClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );

    await appClient.create.createApplication({});
    await appClient.appClient.fundAppAccount(algokit.microAlgos(250_000));
  });

  test('Emision de Billetes de Loteria', async () => {
    const assetId = await appClient.emitTicket(
      { name: 'Loteria', unitName: 'Billete', quantity: 1000, cost: 1_000_000 },
      { sendParams: { fee: algokit.microAlgos(12_000) } }
    );
    expect(assetId).not.toBeUndefined();
  });
  test('Venta de Billetes de Loteria', async () => {
    await fixture.beforeEach();
    await appClient.seellTicket({ quantity: 2 }, { sendParams: { fee: algokit.microAlgos(12_000) } });
  });
});
