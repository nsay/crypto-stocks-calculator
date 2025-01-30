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
  const [totalFees, setTotalFees] = useState<number>(0);

  const [buyPrice, setBuyPrice] = useState<number | string>("");
  const [sellPrice, setSellPrice] = useState<number | string>("");

  const [priceChange, setPriceChange] = useState<number>(0);
  const [unrealizedPriceChange, setUnrealizedPriceChange] = useState<number>(0);
  const [unrealizedPnl, setUnrealizedPnl] = useState<number>(0);
  const [realizedPriceChange, setRealizedPriceChange] = useState<number>(0);
  const [realizedPnl, setRealizedPnl] = useState<number>(0);
  const [result, setResult] = useState<number>(0);
  useEffect(() => {

    //calculate fee
    const makerFeeDecimal = makerFee !== "" ? Number(makerFee) : 0;
    const takerFeeDecimal = takerFee !== "" ? Number(takerFee) : 0;
    const calculatedMakerTakerFee = makerFee !== "" ? makerFeeDecimal : takerFeeDecimal;
    
    //calculate trading size
    const calculatedTradingSize = Number(investment) * Number(leverage);
    setTradingSize(calculatedTradingSize);

    //calculate totals fees
    const totalOpenFee = (calculatedTradingSize * calculatedMakerTakerFee)/100;
    const totalFundingFee = (calculatedTradingSize * Number(fundingFee))/100;
    const totalClosingFee = (calculatedTradingSize * calculatedMakerTakerFee)/100;
    const calculatedTotalFees = totalOpenFee + totalFundingFee + totalClosingFee;
    setTotalFees(calculatedTotalFees);

    //calculate the percentage difference of buy and sell price
    const calculatedPriceChange = ((Number(sellPrice) - Number(buyPrice))/Number(buyPrice))*100
    setPriceChange(Number(calculatedPriceChange.toFixed(2)));

    //calculate unrealized pnl percentage
    const calculatedUnrealizedPriceChange = ((calculatedPriceChange * Number(leverage)))/100 * Number(investment);
    setUnrealizedPriceChange(Number(calculatedUnrealizedPriceChange.toFixed(2)));
    
    //calculate unrealized pnl
    const calculatedUnrealized = (Number(investment) * calculatedUnrealizedPriceChange)/100;
    setUnrealizedPnl(Number(calculatedUnrealized.toFixed(2)));

    //calculate realized pnl percentage
    const calculatedRealizedPriceChange = ((calculatedPriceChange * Number(leverage)))/100 * Number(investment) - calculatedTotalFees;
    setRealizedPriceChange(Number(calculatedRealizedPriceChange.toFixed(2)));

    //calculate realized pnl
    const calculatedRealized = (Number(investment) * calculatedUnrealizedPriceChange)/100 - calculatedTotalFees;
    setRealizedPnl(Number(calculatedRealized.toFixed(2)));

    //calculate result
    const calculatedResult = Number(investment) + Number(calculatedRealized);
    setResult(Number(calculatedResult.toFixed(2)));

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
          <h4>Investment Result</h4>
          <h4>Price Change: {priceChange}%</h4>
          <h4>Unrealized PnL: ${unrealizedPnl} ({unrealizedPriceChange}%)</h4>
          <h4>Fees: ${totalFees}</h4>
          <h4>Realized PnL: ${realizedPnl} ({realizedPriceChange}%)</h4>
          <h4>Total: ${result}</h4>
        </div>
      </div>
    </Container>
  );
};

export default App;
