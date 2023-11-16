import FormInput from "../form-input/form-input.component";
import Button from "../button/button.component";
import { useState } from "react";
import { getRedirectResult } from "firebase/auth";
import {
  auth,
  signInWithGoogleRedirect,
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
} from "../utils/firebase/firebase.utils";
import { useEffect } from "react";
import "./sign-in-form.styles.scss";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  async function getResponse() {
    const response = await getRedirectResult(auth);
    if (response) {
      await createUserDocumentFromAuth(response.user);
    }
  }

  useEffect(() => {
    getResponse();
  }, []);

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      resetFormFields();
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-login-credentials":
          alert("No user found with that email");
          break;
        case "auth/wrong-password":
          alert("Incorrect password for email");
          break;
        default:
          console.log(error);
      }
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />
        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" onClick={signInWithGoogleRedirect} buttonType="google">
            Google Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
