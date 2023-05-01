import React from "react";
import Feature from "../Features/Feature";

import { MdMessage,MdCloudQueue,MdDeviceHub,MdFingerprint } from "react-icons/md";

const Features = () => {
  return (
    <div className="features-wrapper">
      <div className="title-large">Features like never before</div>
      <div className="title-small">
       completely Decentralized voting using blockchain technology
      </div>
      <div className="mobile-wrapper">
        <div>
          <Feature title=  "EPIC + AADHAR aUTHENTICATION & verification" icon={<MdFingerprint/>}align="right" >
            <p  > 
            Epic is an identity card issued in India for voting purposes. Aadhar is a 12-digit unique identification number used for identity verification. The two are linked by the government to ensure the accuracy of voter information.
            
            </p>
          </Feature>
        </div>

        <div className="mobile-container">
          <img src="/mobile2.png" />
        </div>

        <div>
          <Feature title="2-FA using OTP" icon={<MdMessage />} align="left">
            <p>
            Two-factor authentication(2FA) using a one-time password (OTP) sent to the voter's registered mobile phone. The OTP code is valid for a limited time and a single use. This adds an extra layer of security to the voting process, encouraging the true voter to cast their ballot.            </p>
          </Feature>
        </div>
        <div>
          <Feature title="Ethereum server deployment" icon={<MdDeviceHub/>} align="right">
            <p>
            Votereum's deployment on the Ethereum blockchain provides decentralized and immutable record-keeping and ensures a reliable and secure platform for trustworthy online voting.

            </p>
          </Feature>
        </div>
        <div>
          <Feature
            title="Filecoin-enabled hosting infrastructure"
            icon={<MdCloudQueue />}
            align="left"
          >
            <p>
            Deploying frontend on Filecoin provides decentralized and secure hosting, distributing frontend across a storage provider network for reliability and cost-effectiveness. This approach resists censorship and data loss, offering a more secure and efficient way to host frontend on the internet.
            </p>
          </Feature>
        </div>
      </div>
    </div>
  );
};

export default Features;
