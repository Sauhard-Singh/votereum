import React from "react";
import styled from "styled-components";

import { FaGithub,FaLinkedin } from "react-icons/fa";
import india from '../india.png'
import { ReactComponent as linkedin } from './linkedin.svg';
import { ReactComponent as github } from './github.svg';

type Props = {
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const SocialIcon: React.FC<Props> = ({ href, icon: Icon }) => (
  <a href={href}>
    <Icon style={{height: '45px',paddingRight: '10px'}} />
  </a>
);


const Footer = () => {

  return (


      <footer style={{ backgroundColor:"#4daaa7" ,textAlign:"center",height: "50px"  }}>
<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%'}}>
       
        
<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%'}}>
        <SocialIcon href="https://www.linkedin.com/in/sauhard-singh-093/" icon={linkedin} />
        <SocialIcon href="https://github.com/Sauhard-Singh" icon={github} />
      </div>

       
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%'}}>
          
         <div>
            <p  style={{color: 'white'}}>
              @ {new Date().getFullYear()} - Proudly Made in India 
            </p>
          </div>

          <div>
           <p><img src={india} alt="" style={{width: '50px', marginLeft: '5px'}} />
            </p>
          </div>


        </div>

</div>
      </footer>
     
  );
};


export default Footer;
