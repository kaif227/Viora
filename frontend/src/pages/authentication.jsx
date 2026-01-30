import * as React from "react";
import { useState, useMemo, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Snackbar } from "@mui/material";
import { AuthContext } from "../context/authConext.jsx";


const defaultTheme = createTheme();

export default function Authentication() {
  // initialize to empty strings to avoid controlled/uncontrolled warnings
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0); // 0 = login, 1 = register
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const {handleRegister, handleLogin} = useContext(AuthContext);
  
  const validateForm = () => {
    if (formState === 0) {
      // Login validation
      if (!username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!password.trim()) {
        setError("Password is required");
        return false;
      }
    } else {
      // Register validation
      if (!name.trim()) {
        setError("Full Name is required");
        return false;
      }
      if (!username.trim()) {
        setError("Username is required");
        return false;
      }
      if (!password.trim()) {
        setError("Password is required");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    setError("");
    setMessage("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try{
      if(formState===0){
        let result = await handleLogin(username,password);
        setMessage(result||"Logged in Successfully");
        setOpen(true);
        setLoading(false);
      }
      if(formState===1){
        let result = await handleRegister(name,username,password);
        console.log(result);
        setMessage(result||"Registered Successfully");
        setOpen(true);
        setFormState(0);
        setName("");
        setUsername("");
        setPassword("");
        setLoading(false);
      }
    }catch(err){
      let message = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
      setLoading(false);
    }

    
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh", position: "relative" }}
      >
        <CssBaseline />

        {/* Left side image / hero */}
        <Grid
          size={{ xs: 0, sm: 4, md: 7 }}
          sx={{
            display: { xs: "none", sm: "block" },
            height: "100vh",
            backgroundImage:
              "url(https://plus.unsplash.com/premium_photo-1720428645152-6197a8a296f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmlkZW8lMjBjYWxsJTIwYXBwJTIwbGFuZGluZyUyMHBhZ2V8ZW58MHx8MHx8fDA%3D)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            position: "absolute",
            width: { sm: "33.333%", md: "58.333%" },
            height: "100vh",
            // backgroundImage: `url("${randomImageUrl}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />

        {/* Right side form */}
        <Grid
          size={{ xs: 12, sm: 8, md: 5 }}
          component={Paper}
          elevation={6}
          square
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box
            sx={{
              mx: 4,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: { xs: 6, sm: 8 },
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Box sx={{ mb: 2 }}>
              <Button
                variant={formState === 0 ? "contained" : "text"}
                onClick={() => {
                  setFormState(0);
                  // setError("");
                }}
                sx={{ mr: 1 }}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : "text"}
                onClick={() => {
                  setFormState(1);
                  // setError("");
                }}
              >
                Sign Up
              </Button>
            </Box>

            <Box
              component="form"
              noValidate
              sx={{ mt: 1, width: "100%", maxWidth: 420 }}
            >
              {formState === 1 && ( // show full name field only in register mode that why we dont ned two form
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                  
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                
                label="Username"
                name="username"
                value={username}
                autoFocus={formState === 0}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Box
                  sx={{
                    color: "error.main",
                    mt: 1,
                    mb: 1,
                    fontSize: "0.95rem",
                  }}
                >
                  {error}
                </Box>
              )}

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : formState === 0
                  ? "Login"
                  : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </ThemeProvider>
  );
}
