import Wrapper from "../assets/wrappers/LandingPage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Logo, Loading, Alert } from "../components";
import { useAppContext } from "../context/appContext";
const ValidateEmail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isLoading, validateEmail, showAlert } = useAppContext();

  useEffect(() => {
    if(showAlert){
      setTimeout(() => {
        navigate('/register');
      }, 5000)
    }
  })
  useEffect(() => {
    if (code) {
      validateEmail(code);
    }
  }, [code]);
  if (isLoading) {
    return <Loading center />;
  }
  return (
    <>
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
        <h1>Validate Email</h1>
          {showAlert && <Alert />}
          <div className="info">
            
          </div>
        </div>
      </Wrapper>
    </>
  );
};
export default ValidateEmail;
