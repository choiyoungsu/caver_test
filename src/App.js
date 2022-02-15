import './App.css';
import Caver from 'caver-js';
import React, { useEffect, useState } from "react";
import { fetchRudolph } from './api/UseCaver';
import { Row, Col, Modal, Alert, Card, Container, Nav, Button, Form } from "react-bootstrap";
const DEFAULT_USER_ADDRESS = "CONNECT WALLET";

function App() {
  // if (typeof window.klaytn !== 'undefined') {
  //   // Kaikas user detected. You can now use the provider.
  //   const provider = window['klaytn']
  // }


  // const getUserAddress = () => {
  //   onConfirm: () => {
  //   }
  // }

  const [userAccount, setUserAccount] = useState(DEFAULT_USER_ADDRESS);
  const [nfts, setNfts] = useState([]); // {d: '101', Uri:''}
  const rows = nfts.slice(nfts.length / 2);

  const getUserAccount = async () => {
    const _accounts = await window.klaytn.enable();
    const _account = _accounts[0];
    setUserAccount(_account);
  }

  const fetchRudolphNFTs = async () => {
    const _nfts = await fetchRudolph(userAccount);
    setNfts(_nfts);
  }

  return (
    <div className="App">
      <div style={{ backgroundColor: "black", padding: 10 }}>
        <button onClick={() => {
          getUserAccount();
          console.log(window.klaytn.selectedAddress);
          console.log(window.klaytn.networkVersion);
          console.log(userAccount);
        }}
          style={{
            backgroundColor: "yellow",
            borderColor: "yellow",
            padding: 10,
            fontSize: 16,
            width: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}>
          {userAccount}
        </button>
        <br /><br /><br />
        <button onClick={() => {
          fetchRudolphNFTs();
        }}
          style={{
            backgroundColor: "skyblue",
            borderColor: "skyblue",
            padding: 10,
            fontSize: 16,
            width: 200
          }}>
          show nft
        </button>
      </div>

      <div className="container" style={{ padding: 0, width: "100%" }}>
            {rows.map((o, rowIndex) => (
              <Row key={`row_${rowIndex}`}>
                <Col style={{ marginRight: 0, paddingRight: 0 }}>
                  <Card>
                    <Card.Img src={nfts[rowIndex * 2].imageurl}/>
                  </Card>
                </Col>

                <Col>
                  {nfts.length > rowIndex * 2 + 1 ? (
                    <Card>
                      <Card.Img className="img-responsive" src={nfts[rowIndex * 2 + 1].imageurl} />
                    </Card>
                  ) : null}
                </Col>
              </Row>
            ))}

          </div>
    </div >
  );
}

export default App;
