import { useState, useEffect } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { Button, Drawer, Typography, Spin, Result } from "antd";
import { injected } from "./injectedConnectors";
import {celoTesNet } from "./constants";

function MetamaskProvider() {
  const ethereum = window.ethereum;
  const { Title } = Typography;
  const [open, setOpen] = useState(false);

  const handleToggleDrawer = () => setOpen(!open);

  var web3;
  var accounts;
  var connected;

  const errorMessages = [
    {
      code: 503,
      status: "warning",
      title: "Servicio no disponible",
      description:
        "Metamask no se encuentra instalado en tu navegador, por favor instalalo desde su pagina oficial.",
      hrefs: [
        {
          url: "https://metamask.io/",
          title: "Ir al sitio",
        },
      ],
    },
    {
      code: 502,
      status: "warning",
      title: "Implementacion erronea",
      description:
        "Metamask no se encuentra instalado en tu navegador, por favor instalalo desde su pagina oficial.",
      hrefs: [
        {
          url: "https://metamask.io/",
          title: "Ir al sitio",
        },
      ],
    },
    {
      code: 500,
      status: "error",
      title: "No se pudo ejecutar",
      description: "",
      hrefs: [],
    },
  ];

  const [error, setError] = useState(null);

  const errorData = errorMessages.find((item) => item.code === error) || {};
  const options =
    errorData.hrefs &&
    errorData.hrefs.map((item) => (
      <a target="_blank" href={item.url} rel="noreferrer">
        <Button type="ghost">{item.title}</Button>
      </a>
    ));

  const [loading, setLoading] = useState(false);

  // aquí podemos desestructurar varias cosas de web3React como
  // activo (que es verdadero si el usuario está conectado y falso en caso contrario)
  // activar y desactivar que usamos para instanciar y romper a los usuarios
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();

  //set up an elemnt in local storage that we use to hold the connected account
  var acc = localStorage.getItem("account");

  //function that initialises web3.js
  const connectWalletHandler = async () => {
    if (ethereum && ethereum.isMetaMask) {
      console.log("connectWalletHandler");
      web3 = new Web3(ethereum);
      ethereum.request({
        method: "wallet_addEthereumChain",
        params: [celoTesNet],
      });
      accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
    } else {
      console.log("Need to install MetaMask");
      // setErrorMessage('Please install MetaMask browser extension to interact');
    }
    console.log(web3.eth.currentProvider);
  };

  //function that is called on page load if and only if their exists and
  //item for the user accoun tin local storage
  async function connectOnLoad() {
    console.log("connectOnLoad");
    try {
      //here we use activate to create the connection
      await activate(injected);
      connected = true;
    } catch (ex) {
      console.log(ex);
    }

    //we use web3.eth to get the accounts to store it in local storage
    web3 = new Web3(ethereum);
    var accounts1 = await web3.eth.getAccounts();
    localStorage.setItem("account", accounts1);
    acc = accounts1;
  }

  //here we use a useEffect so that on page load we can check if there is
  //an account in local storage. if there is we call the connect onLoad func
  //above which allows us to presist the connection and i also call connectWalletHandler
  //which sets up web3.js so we can call web3.eth.getAccounts()
  useEffect(() => {
    if (acc != null) {
      connectOnLoad();
    }
    //llama automaticamente a MetaMask, al instante de cargar la Página.
    connectWalletHandler();
  }, []);

  //however in the case where there is no item in local storage we use this
  //function to connect which is called when we click the connect button. its
  //essentially the same but we check if local storage is null if it is we activate
  //if its not then we disconnect. And when we disconnect we remove the acccount from local storage
  async function connectOnClick() {
    if (ethereum && ethereum.isMetaMask) {
      web3 = new Web3(window.ethereum);

      if (localStorage.getItem("account") == null) {
        console.log("connectOnClick");
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [celoTesNet],
        });
        /*
        window.ethereum.request({
          method: "eth_requestAccounts",
        });
*/
        setLoading(true);
        try {
          await activate(injected);
          connected = true;
          handleToggleDrawer();
        } catch (ex) {
          console.log(ex);
        }
        // window.location.reload();
        var accounts1 = await web3.eth.getAccounts();

        localStorage.setItem("account", accounts1);
        acc = accounts1;
        setTimeout(function () {
          setLoading(false);
        }, 1600); //wait 2 seconds
        console.log(web3.eth.currentProvider);
      } else {
        disconnect();
        connected = false;
      }
    } else {
      console.log("Need to install MetaMask");
    }
  }

  async function disconnect() {
    try {
      console.log("disconnect");
      deactivate();
      localStorage.removeItem("account");
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    //remember the active boolean from useReactWeb3() stores a bool
    //depending on if the user is or is not connected there for we can
    //use this as a conditon to render the button saying "Connect Wallet"
    //or displaying their address as the text.
    <div>
      {active ? (
        <button onClick={connectOnClick}>
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </button>
      ) : (
        <button onClick={connectOnClick}>Connect Wallet</button>
      )}

      <Drawer
        title="My Wallet"
        open={open}
        placement="right"
        closable
        onClose={handleToggleDrawer}
        width={400}
      >
        <div className="styles.Loading">
          <Title level={5}>o Valora</Title>
          {!loading && !error && (
            <Button
              type="primary"
              size="large"
              shape="round"
              onClick={connectOnClick}
            >
              VALORA
            </Button>
          )}
          {loading && <Spin size="large" tip="Loading..." />}
        </div>
        {!loading && error && (
          <Result
            status={errorData.status}
            title={errorData.title}
            subTitle={errorData.description}
            extra={options}
          />
        )}
      </Drawer>
    </div>
  );
}

export default MetamaskProvider;