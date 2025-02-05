import React, { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import './Stocks.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Stocks: React.FC = () => {
  const [shares, setShares] = useState<number>(0);

  const [buyCommission, setBuyCommission] = useState<number>(0);
  const [sellCommission, setSellCommission] = useState<number>(0);
  const [totalCommission, setTotalCommission] = useState<number>(0);

  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [totalBuyPrice, setTotalBuyPrice] = useState<number>(0);

  const [priceChange, setPriceChange] = useState<number>(0);
  const [pnl, setPnl] = useState<number>(0);

  const [result, setResult] = useState<number>(0);
  useEffect(() => {

    //calculate totals fees
    const totalBuyCommission = shares * buyCommission;
    const totalSellCommission = shares * sellCommission;
    const calculatedTotalFees = totalBuyCommission + totalSellCommission;
    setTotalCommission(calculatedTotalFees);

    //calculate total buy price
    const calculatedTotalBuyPrice = shares * buyPrice;
    setTotalBuyPrice(calculatedTotalBuyPrice);

    //calculate total sell price
    const calculatedTotalSellPrice = shares * sellPrice;

    //calculate the percentage difference of buy and sell price
    const calculatedPriceChange = ((sellPrice - buyPrice) / buyPrice);
    setPriceChange(roundToTwoDecimals(calculatedPriceChange * 100));

    //calculate pnl
    const calculatedPnl = (calculatedTotalSellPrice - calculatedTotalBuyPrice) - calculatedTotalFees;
    setPnl(calculatedPnl);

    //calculate result
    const calculatedResult = calculatedTotalBuyPrice + calculatedPnl;
    setResult(calculatedResult);
  }, [shares, buyCommission, sellCommission, buyPrice, sellPrice]);
  
  const roundToTwoDecimals = (num: number) => {
    return Math.round(num * 100) / 100;
  };
  
  return (
    <Container>
        <Row className="mb-3">
          <Col>
            <div className="mb-3 input-section">
              <label>Shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => {
                    const num = e.target.value === "" ? 0 : Number(e.target.value);
                    setShares(num);
                  }}
                  className="form-control"
                />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <div className="mb-3 input-section">
            <label>Buy Commission</label>
                <input
                  type="number"
                  value={buyCommission}
                  onChange={(e) => setBuyCommission(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control"
                />
            </div>
          </Col>
          <Col>
            <div className="mb-3 input-section">
              <label>Sell Commission</label>
                <input
                  type="number"
                  value={sellCommission}
                  onChange={(e) => setSellCommission(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control"
                />
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
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
        <div className="result primary-color">
          <h4 className="mb-3 title">
            Investment Result
          </h4>
          <h5>
            <span className="secondary-color">Investment: </span> 
            <span >${totalBuyPrice}</span>
          </h5>
          <h5>
            <span className="secondary-color">Price Change: </span> 
            <span className={priceChange < 0 ? "text-danger" : priceChange > 0 ? "text-success" : ""}>
              {(!isNaN(priceChange) && priceChange !== null) ? (priceChange > 0 ? `+${priceChange}` : priceChange) : 0}%
            </span>
          </h5>
          <h5>
            <span className="secondary-color">Fees: </span> 
            <span className="text-danger">${totalCommission}</span>
          </h5>
          <h5>
            <span className="secondary-color">PnL: </span> 
            <span className={pnl < 0 ? "text-danger" : pnl > 0 ? "text-success" : ""}>
              ${!isNaN(pnl) && pnl !== null ? pnl : 0}
            </span>
          </h5>
        <h5>
          <span className="secondary-color">Result: </span>
          <span className={result < 0 ? "text-danger" : result > 0 ? "text-success" : ""}>
            ${!isNaN(result) && result !== null ? result : 0}
          </span>
        </h5>
        </div>
    </Container>
  );
};

export default Stocks;
