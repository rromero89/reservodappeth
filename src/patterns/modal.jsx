import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Web3 from "web3";
import { abi, address } from "../utils/constants";
import { useWeb3React } from "@web3-react/core";

//STYLESHEET

import "../styles/patterns/modal.scss";

//IMPORTING MEDIA ASSETSS

import metamask from "../assets/logos/metamaskwallet.svg";
import trustwallet from "../assets/logos/trustwallet.svg";
import logo from "../assets/logos/logo.png";
import radio from "../assets/icons/radio.svg";
import greenhash from "../assets/icons/greenhash.svg";
import initialload from "../assets/icons/initialload.svg";
import auditedcontract from "../assets/images/auditedcontract.svg";
import copyref from "../assets/images/copyref.svg";

//IMPORTING UTILITY PACKAGES

import { injected, walletconnect } from "../utils/connector";

const Modal = ({
  variant,
  onClick,
  title,
  description,
  buttonText,
  chainId,
  referrerAddress,
  setReferrerAddress,
  setIsProcessing,
  setIsSuccess,
  setIsError,
}) => {
  const [isMetamask, setIsMetamask] = useState(false);
  const [isTrustWallet, setIsTrustWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWallet = (wallet) => {
    if (wallet === "metamask") {
      setIsMetamask(true);
      setIsTrustWallet(false);
    }
    if (wallet === "trustwallet") {
      setIsMetamask(false);
      setIsTrustWallet(true);
    }
  };

  const { library, account, activate } = useWeb3React();

  const handleAcceptReferrer = async () => {
    setIsLoading(true);
    console.log(referrerAddress);
    //if referer = '0x0000000000000000000000000000000000000000' proceed else cant add referer
    try {
      await new new Web3(library).eth.Contract(abi, address).methods
        .setReferrer(("ing", referrerAddress))
        .send({ from: account });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const renderModalHeader = (
    <div className="modal_header">
      <div>
        <p className="text_accent_primary_14">{title}</p>
        <p className="text_accent_primary_10">{description}</p>
      </div>
    </div>
  );

  const renderButton = (
    <>
      <button
        className="btn_primary"
        onClick={
          isMetamask
            ? () => activate(injected)
            : isTrustWallet
            ? () => activate(walletconnect)
            : null
        }
      >
        {buttonText}
      </button>
    </>
  );
  const renderConnectWallet = (
    <div className="backdrop">
      <div className="modal">
        {renderModalHeader}
        <div className="modal_connectwallets">
          <div
            onClick={() => handleWallet("metamask")}
            style={{ border: isMetamask && "2px solid #FFA725" }}
          >
            <p className="text_accent_primary_14">Metamask</p>
            <img src={metamask} alt="metamask logo" width={36} />
          </div>
          <div
            onClick={() => handleWallet("trustwallet")}
            style={{ border: isTrustWallet && "2px solid #FFA725" }}
          >
            <p className="text_accent_primary_14">Trust Wallet</p>
            <img src={trustwallet} alt="trustwallet logo" width={36} />
          </div>
        </div>
        {renderButton}
      </div>
    </div>
  );

  const renderAcceptReferrer = (
    <div className="backdrop">
      <div className="modal">
        <div className="referrer_header">
          <div>
            <p className="text_accent_primary_14" style={{ fontSize: 16 }}>
              {title}
            </p>
            <p className="text_accent_primary_12">{description}</p>
          </div>
          <img src={logo} alt="logo" width={45} />
          <div className="block_right">
            <img src={auditedcontract} alt="audited" />
          </div>
        </div>
        <p className="text_accent_primary_14" style={{ margin: "1em 0" }}>
          Your referrer is
        </p>
        <div className="referrer_block">
          <div>
            <div className="ref_address">
              <img src={greenhash} alt="metamask logo" width={15} />
              <p className="text_greendark_14">{`${referrerAddress?.slice(
                0,
                8
              )}...${referrerAddress?.slice(referrerAddress?.length - 3)}`}</p>
            </div>
            <CopyToClipboard text={referrerAddress}>
              <img
                src={copyref}
                alt="copy"
                width={24}
                style={{ marginLeft: 16, cursor: "pointer" }}
              />
            </CopyToClipboard>
          </div>
          <div  className="switch_referrer">
            <p style={{cursor:'pointer'}} onClick={()=> {window.open('https://dessertswap.finance/audits/DogeDealer%20BEP-20%20Audit%2010098859.pdf')}} >Dessert Finance Audit</p>
          </div>
        </div>
        <button
          className="btn_primary"
          style={{ pointerEvents: isLoading && "none" }}
          disabled={isLoading}
          onClick={() => handleAcceptReferrer()}
        >
          {isLoading ? "ACCEPTING NOW" : buttonText}
        </button>
      </div>
    </div>
  );

  const renderAddReferrer = (
    <div className="backdrop">
      <div className="modal">
        {renderModalHeader}
        <div className="add_referrer">
          <p className="text_accent_primary_14">Referrer</p>
          <p>
            <input placeholder="Paste address here" />
          </p>
        </div>
        <button className="btn_primary">{buttonText}</button>
      </div>
    </div>
  );

  const renderWrongNetwork = (
    <div className="backdrop">
      <div className="modal">
        {renderModalHeader}
        {/* <div className="wrong_network_block">
          <p>
            <img src={radio} alt="radio" />
            <span>Ropsten Test Network</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Kovan Test Network</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Binance Smart Mainnet</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Gorelli test network</span>
          </p>
          <p>
            <img src={radio} alt="radio" />
            <span>Etherium Mainnet</span>
          </p>
        </div> */}
      </div>
    </div>
  );

  const renderInitailLoad = (
    <div className="backdrop">
      <div className="initial_load_modal">
        <img src={logo} alt="logo" width={200} />
        <p>D O G E D E A L E R</p>
        <img
          src={initialload}
          alt="loader"
          width={45}
          style={{ marginTop: 40 }}
        />
      </div>
    </div>
  );

  switch (variant) {
    case "connectwallet":
      return renderConnectWallet;
    case "acceptReferrer":
      return renderAcceptReferrer;
    case "addReferrer":
      return renderAddReferrer;
    case "wrongNetwork":
      return renderWrongNetwork;
    default:
      return renderInitailLoad;
  }
};

export default Modal;
