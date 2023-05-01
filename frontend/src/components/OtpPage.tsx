import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useEffect, useState, useContext } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { AuthContext } from "../contexts/Auth";
import { useNavigate } from "react-router";
import axios from "../axios";




const OtpPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setPh(authContext.mobile);
  }, []);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    console.log("This is onsignup")
    setLoading(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, ph, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }



  function  onOTPVerify () {
  setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res: any) => {
        axios.post('/auth/otp', { 
          AadharNumber: authContext.AadharNumber,
          Epic: authContext.Epic, 
          OtpVerify: true 
         })
         .then((response) => {
           console.log(response.data);
           console.log(res);
           setUser(res.user);
           setLoading(false);
           window.location.reload();
         })
         .catch((error) => {
           console.error(error);
         });
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  }
  
  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            👍Login Success
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full flex flex-col items-center">


                  <BsFillShieldLockFill size={50} className="mt-1"  />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center mt-4"                  style={{ fontSize: "2rem" }}

                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container mt-4"
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-3 text-white rounded"

                  style={{ border: "2px solid #4daaa7", fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}



                >
                  
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
                
              </>
            ) : (
            
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                 
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white text-center"
                  style={{ fontWeight: "bold", fontSize: "1.5rem"}}
                >
                  Send Otp to number {authContext.mobile}?
                </label>
                <br />
                
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                  style={{ fontWeight: "bold", fontSize: "1.2rem", padding: "0.8rem 1.5rem", border: "2px solid #4daaa7" }}

                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
               
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OtpPage;