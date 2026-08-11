import {
  useActionState,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWalletRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckCircleRounded,
  EmailRounded,
  LockRounded,
  VisibilityRounded,
  VisibilityOffRounded,
  TrendingUpRounded,
  CreditCardRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router";

import { useDispatch } from "react-redux";

import authApi from "../../api/authApi";
import { setCredentials } from "../../redux/slices/authSlice";

import "./Login.css";

// ============================================================
// LOGIN ACTION
// ============================================================

async function handleLoginAction(previousState, formData) {
  const email = formData.get("email")?.trim();
  const password = formData.get("password");
  const rememberMe = formData.get("rememberMe") === "on";

  // ----------------------------------------------------------
  // Client validation
  // ----------------------------------------------------------

  if (!email || !password) {
    return {
      success: false,
      data: null,
      error: "Please enter your email and password.",
      message: null,
    };
  }

  if (!email.includes("@")) {
    return {
      success: false,
      data: null,
      error: "Please enter a valid email address.",
      message: null,
    };
  }

  try {
    const response = await authApi.login({
      email,
      password,
      rememberMe,
    });

    if (response?.success && response?.data?._id) {
      return {
        success: true,
        data: response.data,
        error: null,
        message: "Login successful. Redirecting...",
      };
    }

    return {
      success: false,
      data: null,
      error:
        response?.message ||
        "Invalid email or password. Please try again.",
      message: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Unable to connect to the server. Please try again.",
      message: null,
    };
  }
}

// ============================================================
// LOGIN COMPONENT
// ============================================================

const LoginAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    handleLoginAction,
    {
      success: false,
      data: null,
      error: null,
      message: null,
    }
  );

  // ==========================================================
  // REDIRECT AFTER SUCCESS
  // ==========================================================

  useEffect(() => {
    if (!state?.success || !state?.data) {
      return;
    }

    dispatch(
      setCredentials({
        user: state.data,
        token: state.data.token,
      })
    );

    navigate("/dashboard", {
      replace: true,
    });
  }, [
    state?.success,
    state?.data,
    dispatch,
    navigate,
  ]);

  // ==========================================================
  // PASSWORD TOGGLE
  // ==========================================================

  const handleTogglePassword = () => {
    setShowPassword((current) => !current);
  };

  // ==========================================================
  // BACK TO LANDING
  // ==========================================================

  const handleBackToHome = () => {
    navigate("/");
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box className="finora-login-page">

      {/* ======================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <Box className="login-background-shape login-shape-one" />
      <Box className="login-background-shape login-shape-two" />

      {/* ======================================================
          PAGE
      ====================================================== */}

      <Box className="finora-login-wrapper">

        {/* ====================================================
            BACK TO HOME
        ==================================================== */}

        <Button
          className="login-back-button"
          startIcon={<ArrowBackRounded />}
          onClick={handleBackToHome}
        >
          Back to Finora
        </Button>

        {/* ====================================================
            AUTH CARD
        ==================================================== */}

        <Card
          className="finora-login-card"
          elevation={0}
        >

          {/* ==================================================
              LEFT BRAND PANEL
          ================================================== */}

          <Box className="login-brand-panel">

            <Box className="login-brand-content">

              {/* Logo */}

              <Box className="login-brand-logo">
                <AccountBalanceWalletRounded />
              </Box>

              <Typography
                component="h1"
                className="login-brand-name"
              >
                Finora
              </Typography>

              <Typography className="login-brand-tagline">
                Take control of your money.
              </Typography>

              <Typography className="login-brand-description">
                Manage your income, expenses, loans and EMIs
                from one simple financial workspace.
              </Typography>

              {/* Financial preview */}

              <Box className="login-finance-preview">

                <Box className="login-preview-header">
                  <Typography>
                    Financial overview
                  </Typography>

                  <span>
                    This month
                  </span>
                </Box>

                <Typography className="login-preview-balance">
                  ₹84,250
                </Typography>

                <Typography className="login-preview-label">
                  Total balance
                </Typography>

                <Box className="login-preview-chart">
                  <span style={{ height: "38%" }} />
                  <span style={{ height: "52%" }} />
                  <span style={{ height: "45%" }} />
                  <span style={{ height: "68%" }} />
                  <span style={{ height: "58%" }} />
                  <span style={{ height: "82%" }} />
                  <span style={{ height: "72%" }} />
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  className="login-preview-stats"
                >
                  <Box>
                    <TrendingUpRounded />

                    <Box>
                      <Typography>
                        Income
                      </Typography>

                      <strong>
                        ₹52,800
                      </strong>
                    </Box>
                  </Box>

                  <Box>
                    <CreditCardRounded />

                    <Box>
                      <Typography>
                        EMI
                      </Typography>

                      <strong>
                        ₹8,450
                      </strong>
                    </Box>
                  </Box>
                </Stack>

              </Box>

              {/* Benefits */}

              <Stack
                spacing={1.5}
                className="login-benefits"
              >
                <Box>
                  <CheckCircleRounded />
                  <Typography>
                    Track loans and EMIs
                  </Typography>
                </Box>

                <Box>
                  <CheckCircleRounded />
                  <Typography>
                    Understand your spending
                  </Typography>
                </Box>

                <Box>
                  <CheckCircleRounded />
                  <Typography>
                    Monitor your financial growth
                  </Typography>
                </Box>
              </Stack>

            </Box>

          </Box>

          {/* ==================================================
              RIGHT LOGIN PANEL
          ================================================== */}

          <CardContent className="login-form-panel">

            <Box className="login-form-wrapper">

              {/* Mobile logo */}

              <Box className="mobile-login-brand">

                <Box className="mobile-login-logo">
                  <AccountBalanceWalletRounded />
                </Box>

                <Typography>
                  Finora
                </Typography>

              </Box>

              {/* Header */}

              <Box className="login-form-header">

                <Typography
                  component="h2"
                  className="login-form-title"
                >
                  Welcome back
                </Typography>

                <Typography className="login-form-description">
                  Sign in to continue managing your finances.
                </Typography>

              </Box>

              {/* =================================================
                  ALERTS
              ================================================= */}

              {state?.error && (
                <Alert
                  severity="error"
                  className="login-alert"
                >
                  {state.error}
                </Alert>
              )}

              {state?.success && state?.message && (
                <Alert
                  severity="success"
                  className="login-alert"
                >
                  {state.message}
                </Alert>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <Box
                component="form"
                action={formAction}
                noValidate
                className="login-form"
              >

                {/* Email */}

                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isPending}
                  required
                  className="login-field"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRounded />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Password */}

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  disabled={isPending}
                  required
                  className="login-field"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRounded />
                        </InputAdornment>
                      ),

                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="button"
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            onClick={
                              handleTogglePassword
                            }
                            disabled={isPending}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffRounded />
                            ) : (
                              <VisibilityRounded />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* Remember / Forgot */}

                <Box className="login-form-options">

                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        value="on"
                        disabled={isPending}
                        className="login-checkbox"
                      />
                    }
                    label="Remember me"
                  />

                  <Link
                    component="button"
                    type="button"
                    underline="hover"
                    className="forgot-password-link"
                    onClick={() => {
                      // Connect your forgot-password flow here.
                    }}
                  >
                    Forgot password?
                  </Link>

                </Box>

                {/* Submit */}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isPending}
                  className="login-submit-button"
                  endIcon={
                    !isPending && (
                      <ArrowForwardRounded />
                    )
                  }
                >
                  {isPending ? (
                    <>
                      <CircularProgress
                        size={20}
                        color="inherit"
                      />

                      <span className="login-loading-text">
                        Signing in...
                      </span>
                    </>
                  ) : (
                    "Sign in to Finora"
                  )}
                </Button>

              </Box>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <Box className="login-divider">
                <Divider />

                <span>
                  New to Finora?
                </span>

                <Divider />
              </Box>

              {/* Signup */}

              <Button
                fullWidth
                variant="outlined"
                className="login-signup-button"
                onClick={() => {
                  // Connect your registration route here.
                }}
              >
                Create an account
              </Button>

              {/* Security note */}

              <Typography className="login-security-note">
                Your financial information stays private
                and secure.
              </Typography>

            </Box>

          </CardContent>

        </Card>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <Typography className="login-copyright">
          © {new Date().getFullYear()} Finora ·
          Personal finance made simpler.
        </Typography>

      </Box>
    </Box>
  );
};

export default LoginAuth;