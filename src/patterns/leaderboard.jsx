import React, { useEffect, useState } from "react";

//IMPORTING STYLESHEET

import "../styles/patterns/leaderboard.scss";

//IMPORTING COMPONENTS

import LeaderboardData from "../components/leaderboardData";

//IMPORTING MEDIA ASSETS

import chevrondown from "../assets/icons/chevrondown.svg";
import loader from "../assets/icons/loader.gif";
// import down from "../assets/icons/down.svg";

const Leaderboard = ({
  allTimeLeaderboard,
  dailyLeaderboard,
  weeklyLeaderboard,
  monthlyLeaderboard,
  isLoading,
}) => {
  const [selected, setSelected] = useState("All Time");
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const handleDropdown = (value) => {
    if (value === "daily") setSelected("daily");
    if (value === "weekly") setSelected("weekly");
    if (value === "monthly") setSelected("monthly");
    if (value === "All Time") setSelected("All Time");

    setIsDropdownActive(false);
  };

  const renderDropDownLists = (
    <div
      className={isDropdownActive ? "dropdown_lists active" : "dropdown_lists"}
    >
      <p onClick={() => handleDropdown("All Time")}>All Time</p>
      <p onClick={() => handleDropdown("daily")}>Daily</p>
      <p onClick={() => handleDropdown("weekly")}>weekly</p>
      <p onClick={() => handleDropdown("monthly")}>monthly</p>
    </div>
  );

  const renderAlltimeLeaderboard = (
    <>
      {allTimeLeaderboard.slice(0, 10).map((value, index) => {
        return (
          <LeaderboardData
            title={index + 1}
            value={value}
            key={index.toString()}
          />
        );
      })}
    </>
  );

  const renderDailyLeaderboard = (
    <>
      {dailyLeaderboard.length > 0 ? (
        dailyLeaderboard.slice(0, 10).map((value, index) => {
          return (
            <LeaderboardData
              title={index + 1}
              value={value}
              key={index.toString()}
            />
          );
        })
      ) : (
        <div className="flex_center">No rewards yet</div>
      )}
    </>
  );

  const renderWeeklyLeaderboard = (
    <>
      {weeklyLeaderboard.slice(0, 10).map((value, index) => {
        return (
          <LeaderboardData
            title={index + 1}
            value={value}
            key={index.toString()}
          />
        );
      })}
    </>
  );

  const renderMonthlyLeaderboard = (
    <>
      {monthlyLeaderboard.slice(0, 10).map((value, index) => {
        return (
          <LeaderboardData
            title={index + 1}
            value={value}
            key={index.toString()}
          />
        );
      })}
    </>
  );
  return (
    <div>
      <div className="leaderboard webLeaderboard">
        <div className="leaderboard-head">
          <p className="text_lite_16">Leaderboard</p>
          <p className="text_lite_12">
            the best sellers are listed here. Start refering to see yourself
            here.
          </p>
        </div>
        <div
          className="dropdown"
          onClick={() => setIsDropdownActive(!isDropdownActive)}
        >
          <p>
            <span className="text_accent_primary_14">{selected}</span>
            <img src={chevrondown} alt="dropdown" width={20} />
          </p>
          {renderDropDownLists}
        </div>
        {isLoading ? (
          <div className="leaderboard_loader text_accent_primary_14">
            <img src={loader} alt="loader" width={30} />
          </div>
        ) : (
          <div className="list">
            {
              {
                daily: renderDailyLeaderboard,
                weekly: renderWeeklyLeaderboard,
                monthly: renderMonthlyLeaderboard,
                "All Time": renderAlltimeLeaderboard,
              }[selected]
            }
          </div>
        )}
        {/* {allTimeLeaderboard?.length > 10 && (
          <div
            className="referralFoot"
            onClick={() => setDataLength(dataLength + 10)}
          >
            <span className="text_accent_primary_12">view more</span>
            <img src={down} alt="down" />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Leaderboard;
