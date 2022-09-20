import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import MyButton from "../../Ui/MyButton/MyButton";
import Countdown from "react-countdown";
import cl from "./MyAuctions.module.css";
import { useRef } from "react";
import ProviderContext from "../../context/ProviderContext";
import AuthContext from "../../context/AuthContext";

const MyAuctions = ({ auction }) => {
  const { accounts } = useContext(AuthContext);
  const { nftContract, auctionContract } = useContext(ProviderContext);
  const [bids, setBids] = useState("");
  const [time, setTime] = useState("");
  const [isWithdraw, setIsWithdraw] = useState(false);
  const titleRef = useRef();
  const titleRef1 = useRef();

  function getTimeLeft() {
    const test = 1663595990 * 1000;
    const endtime = auction.totalTime * 1000;
    const currentTime = new Date().getTime();
    const leftTime = endtime - currentTime;
    console.log(
      "🚀 ~ file: MyAuctions.jsx ~ line 8 ~ timer ~ endtime",
      1663619436 > 1663619419
    );

    leftTime > 0 ? setTime(leftTime + 1000) : setTime(0);
  }

  async function endAuction(e) {
    try {
      //////////////////////////////////////////////////////////////////////////////////////maybe not tight Id
      const auctionId = titleRef.current.props.databoard;
      console.log(
        "🚀 ~ file: MyAuctions.jsx ~ line 36 ~ endAuction ~ auctionId",
        auctionId
      );
      console.log(
        "🚀 ~ file: MyAuctions.jsx ~ line 36 ~ endAuction ~ auctionId",
        auctionId
      );
      const timestamp = await auctionContract.time();
      const endedAuction = await auctionContract.endAuction(auctionId);
      await auctionContract.on("EndAuction", (endTime) => {
        console.log("timeStamp:", endTime);
      });

      if (auction.highestBidder !== accounts[0]) {
        const myBids = await auctionContract.bids(accounts, auctionId);
        setBids(myBids);
        myBids > 0 ? setIsWithdraw(true) : setIsWithdraw(false);
      } else {
        console.log("you got your money already");
      }
    } catch (err) {
      console.log("error", err);
    }
  }

  async function withdraw() {
    if (bids > 0) {
      const auctionId = titleRef.current.props.databoard;
      const returnBids = await auctionContract.withdraw(auctionId);
    } else {
      console.log("you have not bidded!");
    }
  }
  async function getAuctions(e) {
    const auctionId = e.target.attributes.getNamedItem("data-index").value;
    const result = await auctionContract.auctions(auctionId);

    console.log(
      "🚀 ~ file: MyAuctions.jsx ~ line 69",
      e.target.attributes.getNamedItem("data-index").value
    );
    console.log(
      "🚀 ~ file: MyAuctions.jsx ~ line 59 ~ useEffect ~ result",
      result
    );
  }

  useEffect(() => {
    getTimeLeft();
  }, [auction]);
  return (
    <>
      <div className={cl.col}>
        <div className={cl.item}>
          <div className={cl.image}>
            <img src={auction.image}></img>
            <p>{auction.totalTime}</p>
          </div>
          <div className={cl.info}>
            <div className={cl.title}>{auction.title}</div>
            <div className={cl.text}>{auction.text}</div>
            <div data-auctionId={auction.auctionId} className={cl.leftTime}>
              {time > 0 && !isWithdraw ? (
                <Countdown
                  databoard={Number(auction.auctionId)}
                  ref={titleRef}
                  onComplete={(e) => {
                    endAuction(e);
                  }}
                  date={Date.now() + time}
                />
              ) : (
                <MyButton onClick={withdraw}>Withdraw</MyButton>
              )}
            </div>
            <div className={cl.timePassed}></div>
            <div className={cl.bidder}>
              <label for="bidder">
                bidder
                <input name="bidder" />
              </label>
            </div>
            <div data-auctionId={auction.auctionId} className={cl.stop}>
              <button
                onClick={(e) => {
                  getAuctions(e);
                }}
                data-index={Number(auction.auctionId)}
              >
                Stop Auction
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAuctions;
