import { useState } from "react";
import "./Auth.css";

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!email || !password) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      const validUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (validUser) {
        localStorage.setItem("userEmail", email);

        // 🔥 MOST IMPORTANT LINE
        setUser(email);

      } else {
        alert("Invalid credentials");
      }
    } else {
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Account created! Now login.");
      setIsLogin(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="left-panel">
          <h2>Hello, Welcome!</h2>
          <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

        <div className="right-panel">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn" onClick={handleSubmit}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Auth;
