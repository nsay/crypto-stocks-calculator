import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [investment, setInvestment] = useState<number | string>("");
  const [leverage, setLeverage] = useState<number | string>("");
  const [tradingSize, setTradingSize] = useState<number | string>("");
  const [makerFee, setMakerFee] = useState<number | string>("");
  const [takerFee, setTakerFee] = useState<number | string>("");
  const [fundingFee, setFundingFee] = useState<number | string>("");
  const [buyPrice, setBuyPrice] = useState<number | string>("");
  const [sellPrice, setSellPrice] = useState<number | string>("");
  const [totalFees, setTotalFees] = useState<number | null>(null);
  const [percent, setPercent] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {

    //set fee decimals
    const makerFeeDecimal = makerFee !== "" ? Number(makerFee) : 0;
    const takerFeeDecimal = takerFee !== "" ? Number(takerFee) : 0;
    const fee = makerFee !== "" ? makerFeeDecimal : takerFeeDecimal;
    const fundingFeeDecimal = Number(fundingFee);
    
    //calculate trading size
    const calculatedTradingSize = Number(investment) * Number(leverage);
    setTradingSize(calculatedTradingSize);

    //calculate totals fees
    const openFee = calculatedTradingSize * fee/100;
    const totalFundingFee = calculatedTradingSize * fundingFeeDecimal/100;
    const closingFee = calculatedTradingSize * fee/100;
    const totalFees = openFee + totalFundingFee + closingFee;
    setTotalFees(totalFees);

    //calculate totals profit/loss
    const percentChange = ((Number(sellPrice) - Number(buyPrice)) / Math.abs(Number(buyPrice))) * 100;
    setPercent(percentChange);

    //calculate totals profit/loss
    const pl = (Number(sellPrice) / Number(buyPrice)) * 100;
    const totalProfitLoss = pl - totalFees;

    setResult(totalProfitLoss);
  }, [investment, leverage, tradingSize, makerFee, takerFee, fundingFee, buyPrice, sellPrice]);

  const handleMakerFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMakerFee(value === "" ? "" : Number(value));
    if (value !== "") {
      setTakerFee(""); // Clear taker fee if maker fee is filled
    }
  };

  const handleTakerFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTakerFee(value === "" ? "" : Number(value));
    if (value !== "") {
      setMakerFee(""); // Clear maker fee if taker fee is filled
    }
  };

  return (
    <Container className="center-container">
      <div className="form-container">
        <h2 className="mb-3">Crypto Profit/Loss Calculator</h2>

        <Container className="mb-3">
          <Row>
            <Col>
              <label>Investment</label>
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-control"
              />
            </Col>
            <Col>
              <label>Leverage</label>
              <input
                type="number"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value === "" ? "" : Number(e.target.value))}
                className="form-control"
              />
            </Col>
          </Row>
        </Container>
  
        <div className="mb-3">
          <label>Trading Size</label>
          <div>{tradingSize}</div>
        </div>

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
                  disabled={takerFee !== ""}
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
                disabled={makerFee !== ""}
                step="0.01" 
              />
            </div>
            </Col>
          </Row>
        </Container>
       
        <div className="mb-3">
          <label>Funding Fee (%) <br /> (1x8hr Period)</label>
          <input
            type="number"
            value={fundingFee}
            onChange={(e) => setFundingFee(e.target.value === "" ? "" : Number(e.target.value))}
            className="form-control"
            step="0.01" 
          />
        </div>

        <div className="mb-3">
          <label>Buy Price</label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Sell Price</label>
          <input
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="form-control"
          />
        </div>

        <div className="mt-4">
          <h4>Percent Change: {percent}%</h4>
          <h4>Total Fees: {totalFees}</h4>
          <h4>Total Profit/Loss: {result}</h4>
        </div>
      </div>
    </Container>
  );
};

export default App;
