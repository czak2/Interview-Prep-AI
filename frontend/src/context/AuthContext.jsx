import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      await checkAuth();

      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await API.get("/auth/me");
        setUser(data.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup: async (fullName, email, password) => {
          try {
            const { data } = await API.post("/auth/signup", {
              fullName,
              email,
              password,
            });
            return { success: true };
          } catch (error) {
            return {
              success: false,
              message: error.response?.data?.message || "Signup failed",
            };
          }
        },
        logout: async () => {
          try {
            localStorage.removeItem("token");
            setUser(null);
            setIsAuthenticated(false);

            await API.get("/auth/logout");

            window.location.href = "/";
          } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/";
          }
        },
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
