export interface Index {
  symbol: string;
  name: string;
  pointValue: number;
  tickValue: number;
  tickSize: number;
}

const indices: Array<Index> = [
  {
    symbol: 'ES',
    name: 'S&P 500 E-Mini',
    pointValue: 50,
    tickValue: 12.5,
    tickSize: 0.25,
  },
  {
    symbol: 'MES',
    name: 'S&P 500 Micro E-mini',
    pointValue: 5,
    tickValue: 1.25,
    tickSize: 0.25,
  },
  {
    symbol: 'NQ',
    name: 'Nasdaq 100 E-Mini',
    pointValue: 20,
    tickValue: 5,
    tickSize: 0.25,
  },
  {
    symbol: 'MNQ',
    name: 'Nasdaq 100 Micro E-mini',
    pointValue: 2,
    tickValue: 0.5,
    tickSize: 0.25,
  },
  {
    symbol: 'GC',
    name: 'Gold',
    pointValue: 100,
    tickValue: 10,
    tickSize: 0.1,
  },
  {
    symbol: 'CL',
    name: 'Crude Oil',
    pointValue: 1000,
    tickValue: 10,
    tickSize: 0.01,
  },
  {
    symbol: 'YM',
    name: 'Dow E-Mini',
    pointValue: 5,
    tickValue: 5,
    tickSize: 1,
  },
];

export default indices;