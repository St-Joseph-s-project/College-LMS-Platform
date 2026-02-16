import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../../api/apiservice";
import { useAppDispatch } from "../../redux/hooks";
import { setJWTToken } from "../../redux/features/jwtSlice";
import { setPermissions } from "../../redux/features/permissionsSlice";


type loginResponseType = {
  message: String,
  data: {
    token: string,
    permissions: String[],
    role: String
  },
  statusCode: number
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: loginResponseType = await postApi({ url: "/auth/login", data: { email, password } });

      // Support multiple token shapes
      const token = data.data.token;
      const role = data.data.role;
      const permissions = data.data.permissions;

      // Save to redux
      dispatch(setJWTToken({ jwtToken: token }));
      dispatch(setPermissions({
        permissions: permissions,
        role: role
      }));
      if (role === "STUDENT") {
        navigate("/dashboard/student")
      } else {
        navigate("/dashboard/admin")
      }
    } catch (err) {
      // postApi shows toasts; keep UI simple
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24, border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <h2 style={{ marginBottom: 16 }}>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #cbd5e1" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, background: "#4f46e5", color: "white", border: "none", borderRadius: 4 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

//STUDENT, RBAC