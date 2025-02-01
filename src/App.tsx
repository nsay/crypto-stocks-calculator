import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tooltip, OverlayTrigger, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [investment, setInvestment] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(1);
  const [tradingSize, setTradingSize] = useState<number>(0);

  const [makerFee, setMakerFee] = useState<number>(0);
  const [takerFee, setTakerFee] = useState<number>(0);
  const [fundingFee, setFundingFee] = useState<number>(0);
  const [totalFees, setTotalFees] = useState<number>(0);

  const [position, setPosition] = useState<string>('long');

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
    let calculatedPriceChange: number = 0;
    if (position === 'long') {
      calculatedPriceChange = ((sellPrice - buyPrice)/buyPrice);
    } else if (position === 'short') {
      calculatedPriceChange = ((buyPrice - sellPrice)/sellPrice);
    }
    //calculate the percentage difference of buy and sell price
    setPriceChange(roundToTwoDecimals(calculatedPriceChange * 100));

    //calculate unrealized pnl
    const calculatedUnrealized = tradingSize * calculatedPriceChange;
    setUnrealizedPnl(roundToTwoDecimals(calculatedUnrealized));

    //calculate unrealized pnl percentage
    const calculatedUnrealizedPriceChange = ((calculatedUnrealized)/investment) * 100;
    setUnrealizedPriceChange(roundToTwoDecimals(calculatedUnrealizedPriceChange));

    //calculate realized pnl
    const calculatedRealized = calculatedUnrealized - calculatedTotalFees;
    setRealizedPnl(roundToTwoDecimals(calculatedRealized));

    //calculate realized pnl percentage
    const calculatedRealizedPriceChange = ((calculatedRealized/investment)) * 100;
    setRealizedPriceChange(roundToTwoDecimals(calculatedRealizedPriceChange));

    //calculate result
    const calculatedResult = investment + calculatedRealized;
    setResult(roundToTwoDecimals(calculatedResult));

  }, [investment, leverage, tradingSize, makerFee, takerFee, fundingFee, position, buyPrice, sellPrice]);

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
        <h6 className="mb-3 title primary-color">Leverage Mode</h6>
        <Container className="mb-3">
          <Row>
            <Col>
            <div className="mb-3 input-section">
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
            <div className="mb-3 input-section">
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
              <div className="mb-3 input-section">
              <label>Maker Fee (%)</label>
                <OverlayTrigger
                  placement="top" 
                  overlay={<Tooltip id="tooltip-buy-price">Limit Orders</Tooltip>}>
                    <FontAwesomeIcon icon={faCircleInfo} />
                </OverlayTrigger>
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
            <div className="mb-3 input-section">
            <label>Taker Fee (%)</label>
              <OverlayTrigger
                  placement="top" 
                  overlay={<Tooltip id="tooltip-buy-price">Market Orders</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleInfo} />
              </OverlayTrigger>
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
            <div className="mb-3 input-section">
            <label>Funding Fee (%)</label>
              <OverlayTrigger
                  placement="top" 
                  overlay={<Tooltip id="tooltip-buy-price">Fee occurs every 8 hours.</Tooltip>}>
                  <FontAwesomeIcon icon={faCircleInfo} />
              </OverlayTrigger>
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
    
        <ButtonGroup className="mb-3">
          <ToggleButton
            id="toggle-long"
            type="radio"
            variant={position === "long" ? "success" : "outline-success"}
            checked={position === "long"}
            value="long"
            onChange={() => setPosition('long')}>
            Long
          </ToggleButton>
          <ToggleButton
            id="toggle-short"
            type="radio"
            variant={position === "short" ? "danger" : "outline-danger"}
            checked={position === "short"}
            value="short"
            onChange={() => setPosition('short')}>
            Short
          </ToggleButton>
        </ButtonGroup>

        <Container className="mb-3">
          <Row>
            <Col>
            <div className="mb-3 input-section">
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
            <div className="mb-3 input-section">
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
              {(!isNaN(priceChange) && priceChange !== null) ? (priceChange > 0 ? `+${priceChange}` : priceChange) : 0}%
            </span>
          </h5>
          <h5>
            <span className="secondary-color">Unrealized PnL: </span>
            <span className={unrealizedPnl < 0 ? "text-danger" : unrealizedPnl > 0 ? "text-success" : ""}>
              ${!isNaN(unrealizedPnl) && unrealizedPnl !== null ? (unrealizedPnl > 0 ? `+${unrealizedPnl}` : unrealizedPnl) : 0}&nbsp;
              ({!isNaN(unrealizedPriceChange) && unrealizedPriceChange !== null ? (unrealizedPriceChange > 0 ? `+${unrealizedPriceChange}` : unrealizedPriceChange): 0}%)
            </span>
          </h5>
          <h5>
            <span className="secondary-color">Fees: </span> 
            <span className="text-danger">${totalFees}</span>
          </h5>
          <h5>
            <span className="secondary-color">Realized PnL: </span> 
            <span className={realizedPnl < 0 ? "text-danger" : realizedPnl > 0 ? "text-success" : ""}>
              ${!isNaN(realizedPnl) && realizedPnl !== null ? (realizedPnl > 0 ? `+${realizedPnl}` : realizedPnl) : 0}&nbsp;
              ({!isNaN(realizedPriceChange) && realizedPriceChange !== null ? (realizedPriceChange > 0 ? `+${realizedPriceChange}` : realizedPriceChange): 0}%)
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
