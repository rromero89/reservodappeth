import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { numFormatter } from "../utils/util";
import Web3 from "web3";

//IMPORTING STYLESHEET

import "../styles/components/leaderboardData.scss";

//IMPORTING COMPONENTS

import HashLinks from "./hashLinks";

//IMPORTING MEDIA ASSETS

import dogeSmall from "../assets/icons/dogeSmall.svg";
import axios from "axios";

function LeaderboardData({ title, value }) {
  const [data, setData] = useState(0);

  useEffect(() => {
    handleReferrer();
  }, []);

  const handleReferrer = async () => {
    try {
      console.log(value.leader, "addres");
      const {
        data: { result }
      } = await axios.get(
        `https://j4m1t.sse.codesandbox.io/getReferrals/${value.leader}`
      );
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="leaderBoard">
      <div className="header">
        <p className="text_accent_primary_14">place {title}#</p>
        <HashLinks variant="primary" data={value.leader} />
      </div>
      <div>
        <div>
          <p className="text_accent_primary_22">{numFormatter(value.earn)}</p>
          <p className="leaderDoge">
            <img src={dogeSmall} alt="doge" />
            <span className="text_accent_primary_687">DOGE</span>
          </p>
          <p className="text_accent_primary_14R">EARNED</p>
        </div>
        <div>
          <p className="text_accent_primary_22">{numFormatter(data)}</p>
          <p className="text_accent_primary_11R">Referrals</p>
          <p className="text_accent_primary_14R">COMPLETED</p>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardData;
