import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import { RouteProps } from "react-router";
import LoginLayout from "../layouts/Login";
import * as Yup from "yup";
import axios from "../axios";
import { AuthContext } from "../contexts/Auth";

const schema = Yup.object().shape({
  AadharNumber: Yup.string().min(12).required("Required"),
  Epic: Yup.string().min(10).required("Required"),
});

const Login = (props: RouteProps): JSX.Element => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [error, setError] = useState<any>("");

  return (
    <div>
      <LoginLayout error={error}>
        <div className="form-container">
          <Formik
            initialValues={{
              AadharNumber: "",
              Epic: "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              axios
                .post("/auth/login", { ...values })
                .then((res) => {
                  authContext.authenticate(res.data.user, res.data.accessToken);
                  axios.post('/auth/otp', { 
                    AadharNumber: values.AadharNumber,
                    Epic: values.Epic, 
                    OtpVerify: false 
                   })
                   .then((response) => {
                     console.log(response.data);
                      window.location.reload();
                   })
                   .catch((error) => {
                     console.error(error);
                   });
                })
                .catch((err) => {
                  let error = err.message;
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error);
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                });                
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit }) => (
              <form onSubmit={handleSubmit} >
                <div className="input-container">
                  <input
                    id="AadharNumber"
                    type="number"
                    placeholder="Enter Aadhar (12 digit number)"
                    style={{ fontWeight: "bold",fontSize:'20px' }}
                    {...getFieldProps("AadharNumber")}
                  />
                  <div className="form-error-text">
                    {touched.AadharNumber && errors.AadharNumber ? errors.AadharNumber : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="Epic"
                    type="text"
                    placeholder="Enter EPIC (10 digit alphanumeric)"
                    {...getFieldProps("Epic")}
                    style={{ fontWeight: "bold",fontSize:'20px' }}
                  />
                  <div className="form-error-text">
                    {touched.Epic && errors.Epic
                      ? errors.Epic
                      : null}
                  </div>
                </div>

                <button className="login-button button-primary" type="submit">
                  Login
                </button>
              </form>
            )}
          </Formik>  
        </div>
      </LoginLayout>
    </div>
  );
};

export default Login;
