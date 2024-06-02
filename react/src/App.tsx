import { Turnstile } from "@marsidev/react-turnstile";
import axios from "axios";
import { useState } from "react";
import "./index.css";

function App() {
  const [token, setToken] = useState<string>("");
  return (
    <div className="">
      <Turnstile
        onSuccess={(token) => {
          setToken(token);
        }}
        siteKey="0x4AAAAAAAbvwW7RidTDwh2B"
      />

      <button
        onClick={() => {
          axios.post("http://localhost:3000/reset-password", {
            email: "gourav@gmail.com",
            otp: "123456",
            token: token,
          });
        }}
      >
        Update password
      </button>
    </div>
  );
}

export default App;
