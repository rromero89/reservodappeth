import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../utils/connector";

//STYLESHEET

import "../styles/pages/home.scss";

import Modal from "../patterns/modal";

const Home = () => {
  const [initialLoad, setInitialLoad] = useState(true);
  const { active, activate, account } = useWeb3React();

  useEffect(() => {
    setInitialLoad(true);
    setTimeout(() => {
      setInitialLoad(false);
    }, 3000);
  }, [])


  console.log(active, account);

  if (initialLoad) {
    return <Modal />;
  }

  if (!active) {
    return (
      <Modal
        variant="connectwallet"
        onClick={() => activate(injected)}
        title="Select your wallet"
        description="connect your crypto wallet to continue"
        buttonText="CONNECT WALLET"
      />
    );
  }  
};

export default Home;
