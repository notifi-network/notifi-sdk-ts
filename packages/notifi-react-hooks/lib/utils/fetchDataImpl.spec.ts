import fetchDataImpl, { FetchDataState } from './fetchDataImpl';

describe('fetchDataImpl', () => {
  const service = {
    getAlerts: jest.fn().mockResolvedValue([]),
    getSources: jest.fn().mockResolvedValue([]),
    getSourceGroups: jest.fn().mockResolvedValue([]),
    getTargetGroups: jest.fn().mockResolvedValue([]),
    getEmailTargets: jest.fn().mockResolvedValue([]),
    getSmsTargets: jest.fn().mockResolvedValue([]),
    getTelegramTargets: jest.fn().mockResolvedValue([]),
  };

  const timeProvider = {
    now: jest.fn().mockReturnValue(2000),
  };

  beforeEach(() => {
    service.getAlerts.mockClear();
    service.getSources.mockClear();
    service.getSourceGroups.mockClear();
    service.getTargetGroups.mockClear();
    service.getEmailTargets.mockClear();
    service.getSmsTargets.mockClear();
    service.getTelegramTargets.mockClear();
    timeProvider.now.mockClear();
  });

  const expectServiceCalls = (count: number) => {
    expect(service.getAlerts).toHaveBeenCalledTimes(count);
    expect(service.getSources).toHaveBeenCalledTimes(count);
    expect(service.getSourceGroups).toHaveBeenCalledTimes(count);
    expect(service.getTargetGroups).toHaveBeenCalledTimes(count);
    expect(service.getEmailTargets).toHaveBeenCalledTimes(count);
    expect(service.getSmsTargets).toHaveBeenCalledTimes(count);
    expect(service.getTelegramTargets).toHaveBeenCalledTimes(count);
  };

  it('calls services once for multiple invocations', () => {
    let count = 0;
    const state: FetchDataState = {};
    const first = fetchDataImpl(service, timeProvider, state).then((_r) => {
      // First invocation will be called first
      expect(count).toEqual(0);
      count++;
    });
    const second = fetchDataImpl(service, timeProvider, state).then((_r) => {
      // Second invocation will be called second
      expect(count).toEqual(1);
      count++;
    });
    const third = fetchDataImpl(service, timeProvider, state).then((_r) => {
      // Third invocation will be called third
      expect(count).toEqual(2);
      count++;
    });

    return Promise.all([first, second, third]).then(() => {
      expectServiceCalls(1);
    });
  });

  it('returns cached data when cache is fresh', async () => {
    timeProvider.now.mockReturnValueOnce(4000);
    const state: FetchDataState = {};
    await fetchDataImpl(service, timeProvider, state);

    timeProvider.now.mockReturnValueOnce(4500); // Soon after finish
    await fetchDataImpl(service, timeProvider, state);

    expect(timeProvider.now).toHaveBeenCalledTimes(2);
    expectServiceCalls(1);
  });

  it('returns makes another request when cache is expired', async () => {
    timeProvider.now.mockReturnValueOnce(4000);
    const state: FetchDataState = {};
    await fetchDataImpl(service, timeProvider, state);

    timeProvider.now
      .mockReturnValueOnce(6000) // Compare against cache
      .mockReturnValueOnce(7000); // Set new success time
    await fetchDataImpl(service, timeProvider, state);

    expect(timeProvider.now).toHaveBeenCalledTimes(3);
    expectServiceCalls(2);
    expect(state.lastSuccessTime).toEqual(7000);
  });

  it('returns the applicableFilters from the sources', async () => {
    service.getSources.mockResolvedValueOnce([
      {
        id: 'some-source-id',
        name: 'A random source',
        type: 'SOLANA_WALLET',
        applicableFilters: [
          {
            id: 'some-filter-id',
            name: 'A filter',
            filterType: 'BALANCE',
          },
        ],
      },
    ]);

    const state: FetchDataState = {};
    const results = await fetchDataImpl(service, timeProvider, state);
    expect(results.filters).toStrictEqual([
      {
        id: 'some-filter-id',
        name: 'A filter',
        filterType: 'BALANCE',
      },
    ]);
  });
});
