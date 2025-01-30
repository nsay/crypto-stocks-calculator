import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [investment, setInvestment] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(0);
  const [tradingSize, setTradingSize] = useState<number>(0);

  const [makerFee, setMakerFee] = useState<number>(0);
  const [takerFee, setTakerFee] = useState<number>(0);
  const [fundingFee, setFundingFee] = useState<number>(0);
  const [totalFees, setTotalFees] = useState<number>(0);

  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);

  const [priceChange, setPriceChange] = useState<number>(0);
  const [unrealizedPriceChange, setUnrealizedPriceChange] = useState<number>(0);
  const [unrealizedPnl, setUnrealizedPnl] = useState<number>(0);
  const [realizedPriceChange, setRealizedPriceChange] = useState<number>(0);
  const [realizedPnl, setRealizedPnl] = useState<number>(0);
  const [result, setResult] = useState<number>(0);
  useEffect(() => {

    //calculate fee
    const makerFeeDecimal = makerFee !== 0 ? makerFee : 0;
    const takerFeeDecimal = takerFee !== 0 ? takerFee : 0;
    const calculatedMakerTakerFee = makerFee !== 0 ? makerFeeDecimal : takerFeeDecimal;
    
    //calculate trading size
    const calculatedTradingSize = investment * leverage;
    setTradingSize(calculatedTradingSize);

    //calculate totals fees
    const totalOpenFee = (calculatedTradingSize * calculatedMakerTakerFee)/100;
    const totalFundingFee = (calculatedTradingSize * fundingFee)/100;
    const totalClosingFee = (calculatedTradingSize * calculatedMakerTakerFee)/100;
    const calculatedTotalFees = totalOpenFee + totalFundingFee + totalClosingFee;
    setTotalFees(calculatedTotalFees);

    //calculate the percentage difference of buy and sell price
    const calculatedPriceChange = ((sellPrice - buyPrice)/buyPrice)*100
    setPriceChange(roundToTwoDecimals(calculatedPriceChange));

    //calculate unrealized pnl percentage
    const calculatedUnrealizedPriceChange = ((calculatedPriceChange * leverage))/100 * investment;
    setUnrealizedPriceChange(roundToTwoDecimals(calculatedUnrealizedPriceChange));
    
    //calculate unrealized pnl
    const calculatedUnrealized = (investment * calculatedUnrealizedPriceChange)/100;
    setUnrealizedPnl(roundToTwoDecimals(calculatedUnrealized));

    //calculate realized pnl percentage
    const calculatedRealizedPriceChange = ((calculatedPriceChange * leverage))/100 * investment - calculatedTotalFees;
    setRealizedPriceChange(roundToTwoDecimals(calculatedRealizedPriceChange));

    //calculate realized pnl
    const calculatedRealized = (investment * calculatedUnrealizedPriceChange)/100 - calculatedTotalFees;
    setRealizedPnl(roundToTwoDecimals(calculatedRealized));

    //calculate result
    const calculatedResult = investment + calculatedRealized;
    setResult(roundToTwoDecimals(calculatedResult));

  }, [investment, leverage, tradingSize, makerFee, takerFee, fundingFee, buyPrice, sellPrice]);

  const handleMakerFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMakerFee(value === "" ? 0 : Number(value));
    if (value !== "") {
      setTakerFee(0); // Clear taker fee if maker fee is filled
    }
  };

  const handleTakerFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTakerFee(value === "" ? 0 : Number(value));
    if (value !== "") {
      setMakerFee(0); // Clear maker fee if taker fee is filled
    }
  };

  const roundToTwoDecimals = (num: number) => {
    return Math.round(num * 100) / 100;
  };

  return (
    <Container className="center-container">
      /****** INPUTS ******/
      <div className="form-container">
        <h2 className="mb-3 title primary-color">Crypto Profit/Loss Calculator</h2>

        <Container className="mb-3">
          <Row>
            <Col>
            <div className="mb-3">
              <label>Investment</label>
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control"
                />
            </div>
            </Col>
            <Col>
            <div className="mb-3">
              <label>Leverage</label>
                <input
                  type="number"
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control"
                />
            </div>
            </Col>
            <Col>
            <div className="mb-3">
              <label>Trading Size</label>
              <h4 className="primary-color">{tradingSize}</h4>
            </div>
            </Col>
          </Row>
        </Container>
  
        <Container className="mb-3">
          <Row>
            <Col>
              <div className="mb-3">
                <label>Maker Fee (%) <br /> (Limit Orders)</label>
                <input
                  type="number"
                  value={makerFee}
                  onChange={handleMakerFeeChange}
                  className="form-control"
                  disabled={takerFee !== 0}
                  step="0.01" 
                />
              </div>  
            </Col>
            <Col>
            <div className="mb-3">
              <label>Taker Fee (%) <br /> (Market Orders)</label>
              <input
                type="number"
                value={takerFee}
                onChange={handleTakerFeeChange}
                className="form-control"
                disabled={makerFee !== 0}
                step="0.01" 
              />
            </div>
            </Col>
            <Col>
            <div className="mb-3">
              <label>Funding Fee (%) <br /> (1x8hr Period)</label>
              <input
                type="number"
                value={fundingFee}
                onChange={(e) => setFundingFee(e.target.value === "" ? 0 : Number(e.target.value))}
                className="form-control"
                step="0.01" 
              />
            </div>
            </Col>
          </Row>
        </Container>

        <Container className="mb-3">
          <Row>
            <Col>
            <div className="mb-3">
              <label>Buy Price</label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                className="form-control"
              />
            </div>
            </Col>
            <Col>
            <div className="mb-3">
              <label>Sell Price</label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                className="form-control"
              />
            </div>
            </Col>
          </Row>
        </Container>

        <div className="result primary-color">
          <h4 className="mb-3 title">
            Investment Result
          </h4>
          <h5>
            <span className="secondary-color">Price Change: </span> 
            <span className={priceChange < 0 ? "text-danger" : priceChange > 0 ? "text-success" : ""}>
              {!isNaN(priceChange) && priceChange !== null ? priceChange : 0}%
            </span>
          </h5>
          <h5>
            <span className="secondary-color">Unrealized PnL: </span>
            <span className={unrealizedPnl < 0 ? "text-danger" : unrealizedPnl > 0 ? "text-success" : ""}>
              ${!isNaN(unrealizedPnl) && unrealizedPnl !== null ? unrealizedPnl : 0}
              ({!isNaN(unrealizedPriceChange) && unrealizedPriceChange !== null ? unrealizedPriceChange : 0}%)
            </span>
          </h5>
          <h5>
            <span className="secondary-color">Fees: </span> 
            <span className="text-danger">${totalFees}</span>
          </h5>
          <h5>
            <span className="secondary-color">Realized PnL: </span> 
            <span className={realizedPnl < 0 ? "text-danger" : realizedPnl > 0 ? "text-success" : ""}>
              ${!isNaN(realizedPnl) && realizedPnl !== null ? realizedPnl : 0}
              ({!isNaN(realizedPriceChange) && realizedPriceChange !== null ? realizedPriceChange : 0}%)
            </span>
          </h5>
          <h5>
            <span className="secondary-color">Total: </span> 
            <span className={result < 0 ? "text-danger" : result > 0 ? "text-success" : ""}>
              ${!isNaN(result) && result !== null ? result : 0}
            </span>
          </h5>
        </div>
      </div>
    </Container>
  );
};

export default App;
