import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";

import { CopyToClipboard } from "react-copy-to-clipboard"; 
import { Link } from "react-router-dom";
import CountUp from "react-countup"; 
//STYLESHEET

import "../styles/pages/dashboard.scss";

//IMPORTING PATTERNS

import Modal from "../patterns/modal"; 

//IMPORTING MEDIA ASSETS

import logo from "../assets/logos/logo.png"; 
import user from "../assets/icons/user.svg"; 
import copy from "../assets/icons/copy.svg"; 
 
import { abi, address, avalancheMainNet, avalancheTestNet } from "../utils/constants";
import UserModal from "../patterns/userModal"; 
import { unatomic } from "../utils/util"; 

 

const Dashboard = () => { 

  const [initialLoad, setInitialLoad] = useState(true);
  const [userProfile, setUserProfile] = useState(false); 
  const [isAddressCopied, setIsAddressCopied] = useState(false);  
  const [dogexBalance, setDogexBalance] = useState();
  

  const { active, library, account } = useWeb3React();
  //const account = "0x996a5e55a3407Fea2A68f9670E3D39EF9ebad9E5";

  const web3 = new Web3(library);
  const contract = new web3.eth.Contract(abi, address);
  const bnb = {
    address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    decimal: 18
  };  

  const getReinvestingInfo = () => {
    return contract.methods.isReinvest(account).call();
  };

  const getReferalEarnings = async () => {
    return unatomic(
      await contract.methods.getReferralEarnings(account).call(),
      9
    );
  };

  const getTotalDividendDistributed = async () => {
    return unatomic(
      await contract.methods.getTotalDividendsDistributed().call(),
      18
    );
  };

  const getWithdrawable = async () => {
    return unatomic(
      await contract.methods.withdrawableDividendOf(account).call(),
      18
    );
  };

  const getDogexBalance = async () => {
    return unatomic(await contract.methods.balanceOf(account).call(), 9);
  };

  useEffect(async () => {
    setInitialLoad(true);
    setTimeout(() => {
      setInitialLoad(false);
    }, 2000);
    if (active) {
      const bal = await getDogexBalance();
      setDogexBalance(bal); 
      console.log("Balance in Activee: ", bal);      
    }
  }, [active, account, library]);   

  //RENDER SCREEN HEADER

  const renderHeader = (
    <div className="screen_header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" width={53} />
          <p className="title">DOGEDEALER</p>
        </Link>
      </div>
      <div>
        <div className="connect" onClick={() => setUserProfile(true)}>
          <p className="text_greendark_14">{`${account?.slice(
            0,
            4
          )}...${account?.slice(account?.length - 4)}`}</p>
          <span className="text_accent_primary_14">
            <CountUp
              start={0}
              end={dogexBalance}
              decimals={dogexBalance > 0 ? 4 : 0}
              duration={2}
            />{" "}
          </span>
        </div>
        <img src={user} alt="user" width={24} />
      </div>
    </div>
  );
  
  //RENDER USER PROFILE

  const renderUserProfile = (
    <>
      <div className="user_profile">
        <p className="text_greendark_14_normal">Current balance</p>
        <p
          className="text_accent_primary_14"
          style={{ fontSize: 22, marginBottom: 10 }}
        >
          <CountUp end={dogexBalance} decimals={dogexBalance > 0 ? 2 : 0} />{" "}
          Coins
        </p>
        <p className="text_greendark_14_normal">Metamask ID</p>
        <div>
          <span
            className="text_accent_primary_14"
            style={{ fontSize: 22 }}
          >{`${account?.slice(0, 4)}...${account?.slice(
            account?.length - 15
          )}`}</span>
          <CopyToClipboard text={account}>
            <img
              src={copy}
              alt="copy"
              width={22}
              onClick={() => {
                setIsAddressCopied(true);
                setTimeout(() => {
                  setIsAddressCopied(false);
                }, 3000);
              }}
            />
          </CopyToClipboard>
          <span className={isAddressCopied ? "copy_text active" : "copy_text"}>
            copied
          </span>
        </div>
      </div>
    </>
  );
 

  //RENDER SCREEN

  const renderScreen = (
    <div className="dashboard">
      {renderHeader}
       
    </div>
  );

  //INITIAL PAGE LOAD

  if (initialLoad) {
    return <Modal />;
  }

  //RENDER IF USER IS INACTIVE

  if (!active) {
    return (
      <Modal
        variant="connectwallet"
        title="Select your wallet"
        description="connect your crypto wallet to continue"
        buttonText="CONNECT WALLET"
      />
    );
  }

  return (
    <>
      {renderScreen}      
      <UserModal
        title="Your account"
        description="your account details at a glance"
        content={renderUserProfile}
        isModal={userProfile}
        setIsModal={setUserProfile}
      />
            
    </>
  );
};

export default Dashboard;
