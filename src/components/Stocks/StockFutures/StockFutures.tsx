import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import indices, { Index } from './indices';
import './StockFutures.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const StockFutures: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<Index | null>(null);
  const [contracts, setContracts] = useState<number>(0);
  const [fees, setFees] = useState<number>(0);
  const [totalFees, setTotalFees] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [ticks, setTicks] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    if (selectedIndex) {
      // Calculate total fees
      const calculateTotalFees = contracts * fees;
      setTotalFees(calculateTotalFees);
      
      // Calculate Points
      const calculateTotalPoints = sellPrice - buyPrice;
      setPoints(calculateTotalPoints);

      // Calculate Ticks
      const calculateTotalTicks = (calculateTotalPoints / selectedIndex!.tickSize);
      setTicks(calculateTotalTicks);

      // Calculate Result
      const calculateTotalResults = (calculateTotalPoints * selectedIndex!.pointValue * contracts);
      setResult(calculateTotalResults);
    }
  }, [buyPrice, contracts, fees, selectedIndex, sellPrice]);

  const handleSelect = (symbol: string | null) => {
    const selected = indices.find((index) => index.symbol === symbol);
    setSelectedIndex(selected || null);
  };

  return (
    <Container>
      <Row>
        {/* Left Column - Inputs */}
        <Col md={7}>
          <div className="mb-3">
            <Dropdown onSelect={(e) => handleSelect(e)}>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedIndex ? `${selectedIndex.name} (${selectedIndex.symbol})` : 'Select An Index'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {indices.map((index: Index) => (
                  <Dropdown.Item key={index.symbol} eventKey={index.symbol}>
                    {index.name} ({index.symbol})
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Row className="no-border">
            <Col md={4}>
              <div className="mb-3">
                <label>Point Value</label>
                <div className="primary-color">{selectedIndex?.pointValue}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label>Tick Value</label>
                <div className="primary-color">{selectedIndex?.tickValue}</div>
              </div>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <label>Tick Size</label>
                <div className="primary-color">{selectedIndex?.tickSize}</div>
              </div>
            </Col>
          </Row>
          <Row className="no-border">
            <Col md={6}>
              <div className="mb-3">
                <label># of Contracts</label>
                <input
                  type="number"
                  value={contracts}
                  onChange={(e) => setContracts(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control" />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label>Round trip fee</label>
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control" />
              </div>
            </Col>
          </Row>
          <Row className="no-border">
            <Col md={6}>
              <div className="mb-3">
                <label>Buy Price</label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control" />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <label>Sell Price</label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="form-control" />
              </div>
            </Col>
          </Row>
        </Col>

        {/* Right Column - Investment Results */}
        <Col md={5}>
          <div className="result primary-color">
            <h4 className="mb-3 title">Investment Result</h4>
            <h5>
              <span className="secondary-color">Points: </span>
              <span>{points}</span>
            </h5>
            <h5>
              <span className="secondary-color">Ticks: </span>
              <span>{ticks}</span>
            </h5>
            <h5>
              <span className="secondary-color">Fees: </span>
              <span className="text-danger">{totalFees}</span>
            </h5>
            <h5>
              <span className="secondary-color">Result (before fees): </span>
              <span className={result < 0 ? "text-danger" : result > 0 ? "text-success" : ""}>
                ${result}
              </span>
            </h5>
            <h5>
              <span className="secondary-color">Result (after fees): </span>
              <span className={result < 0 ? "text-danger" : result > 0 ? "text-success" : ""}>
                ${result - totalFees} 
              </span>
            </h5>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StockFutures;
