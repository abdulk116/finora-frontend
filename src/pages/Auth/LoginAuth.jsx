import { useActionState, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountBalanceWallet,
  Lock,
  Email,
} from '@mui/icons-material';
import './Login.css';
import { useNavigate } from 'react-router';
import authApi from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';

// ----------------------------------------------------------------------
// 1. Server/Async Action Handler
// ----------------------------------------------------------------------
async function handleLoginAction(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const rememberMe = formData.get('rememberMe') === 'on';

  // Client validation within action
  if (!email || !password) {
    return {
      success: false,
      error: 'Please fill in both email and password.',
    };
  }

  try {
    // TODO: Replace this timeout with your actual backend API call
    // e.g., const res = await fetch('/api/login', { method: 'POST', body: formData });
    // await new Promise((resolve) => setTimeout(resolve, 1500));
    const res = await authApi?.login({ email, password });

    if (res?.success && res?.data?._id) {
      // Success response
      console.log('Finora Login Successful:', { email, rememberMe });
      return {
        success: true,
        data: res?.data,
        error: null,
        message: 'Logged in successfully! Redirecting...',
      };
    } else {
      return {
        success: false,
        error: res?.message || 'Invalid email or password. Please try again.',
      };
    }

  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Something went wrong. Please try again later.',
    };
  }
}

// ----------------------------------------------------------------------
// 2. Main Login Component
// ----------------------------------------------------------------------
const LoginAuth = () => {
  // Toggle password visibility (UI state stay local to React)
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // React 19 useActionState Hook
  // [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState(handleLoginAction, {
    success: false,
    error: null,
    message: null,
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  if (state?.success && state?.data) {
    dispatch(
      setCredentials({
        user: state?.data,
        token: state?.data?.token,
      })
    );
    navigate("/dashboard")
  }

  return (
    <div className="finora-login-container">
      <Card className="finora-login-card" elevation={4}>
        <CardContent sx={{ p: 4 }}>
          {/* Brand Logo & Header */}
          <Box className="finora-brand-header">
            <Box className="finora-logo-badge">
              <AccountBalanceWallet fontSize="large" color="primary" />
            </Box>
            <Typography variant="h4" component="h1" fontWeight="700" className="finora-title">
              Finora
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your loans, EMIs, and income effortlessly.
            </Typography>
          </Box>

          {/* Alert Feedback Messages */}
          {state?.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {state.error}
            </Alert>
          )}

          {state?.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {state.message}
            </Alert>
          )}

          {/* Form bounded directly to useActionState action */}
          <Box component="form" action={formAction} noValidate>
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email Address"
              type="email"
              disabled={isPending}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              disabled={isPending}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={isPending}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Remember Me & Forgot Password */}
            <Box className="finora-form-options">
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    color="primary"
                    disabled={isPending}
                  />
                }
                label="Remember me"
              />
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>

            {/* Submit Button showing pending state automatically */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isPending}
              className="finora-submit-btn"
              sx={{ mt: 2, mb: 2, py: 1.2, fontWeight: 600 }}
            >
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Log In to Finora'
              )}
            </Button>

            {/* Register Link */}
            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="#" underline="hover" fontWeight="600">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginAuth;