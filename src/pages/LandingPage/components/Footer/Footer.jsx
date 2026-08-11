import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowForwardRounded,
  AccountBalanceWalletRounded,
  KeyboardArrowUpRounded
} from "@mui/icons-material";

import { useNavigate } from "react-router";

import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="finora-footer">

      {/* =====================================
          FINAL CTA
      ===================================== */}

      <section className="footer-cta-section">
        <Container
          maxWidth="lg"
          className="footer-container"
        >
          <Box className="footer-cta">

            {/* Decorative elements */}

            <Box className="cta-glow cta-glow-one" />
            <Box className="cta-glow cta-glow-two" />

            <Box className="cta-content">

              <Box className="cta-icon">
                <AccountBalanceWalletRounded />
              </Box>

              <Typography
                component="h2"
                className="cta-title"
              >
                Your money deserves
                <span>a better system.</span>
              </Typography>

              <Typography
                component="p"
                className="cta-description"
              >
                Track your income, expenses, loans and EMIs
                in one simple place. Start building a clearer
                picture of your financial future with Finora.
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                className="cta-actions"
              >
                <Button
                  variant="contained"
                  className="cta-primary-button"
                  onClick={handleLogin}
                  endIcon={
                    <ArrowForwardRounded />
                  }
                >
                  Get Started
                </Button>

                <Button
                  variant="outlined"
                  className="cta-secondary-button"
                  onClick={() =>
                    scrollToSection("analytics")
                  }
                >
                  Explore Finora
                </Button>
              </Stack>

              <Typography className="cta-note">
                Simple. Private. Built for your financial life.
              </Typography>

            </Box>
          </Box>
        </Container>
      </section>

      {/* =====================================
          FOOTER
      ===================================== */}

      <section className="footer-main">
        <Container
          maxWidth="lg"
          className="footer-container"
        >
          <Box className="footer-grid">

            {/* Brand */}

            <Box className="footer-brand">

              <Box
                className="footer-logo"
                onClick={scrollToTop}
              >
                <Box className="footer-logo-icon">
                  <AccountBalanceWalletRounded />
                </Box>

                <Typography>
                  Finora
                </Typography>
              </Box>

              <Typography className="footer-brand-description">
                A simple and intelligent way to manage
                your personal finances, loans and EMIs.
              </Typography>

            </Box>

            {/* Product */}

            <Box className="footer-column">

              <Typography className="footer-column-title">
                Product
              </Typography>

              <button
                onClick={() =>
                  scrollToSection("how-it-works")
                }
              >
                Features
              </button>

              <button
                onClick={() =>
                  scrollToSection("loans")
                }
              >
                Loans & EMI
              </button>

              <button
                onClick={() =>
                  scrollToSection("money-flow")
                }
              >
                Accounts
              </button>

              <button
                onClick={() =>
                  scrollToSection("analytics")
                }
              >
                Analytics
              </button>

            </Box>

            {/* Resources */}

            <Box className="footer-column">

              <Typography className="footer-column-title">
                Resources
              </Typography>

              <button
                onClick={() =>
                  scrollToSection("analytics")
                }
              >
                Reports
              </button>

              <button
                onClick={() =>
                  scrollToSection("money-flow")
                }
              >
                Income & Expenses
              </button>

              <button
                onClick={() =>
                  scrollToSection("loans")
                }
              >
                EMI Tracking
              </button>

              <button
                onClick={scrollToTop}
              >
                Back to top
              </button>

            </Box>

            {/* Account */}

            <Box className="footer-column">

              <Typography className="footer-column-title">
                Account
              </Typography>

              <button onClick={handleLogin}>
                Login
              </button>

              <button onClick={handleLogin}>
                Get Started
              </button>

            </Box>

          </Box>

          <Divider className="footer-divider" />

          <Box className="footer-bottom">

            <Typography>
              © {new Date().getFullYear()} Finora.
              All rights reserved.
            </Typography>

            <Typography>
              Built for better financial decisions.
            </Typography>

            <Button
              className="back-top-button"
              onClick={scrollToTop}
              endIcon={
                <KeyboardArrowUpRounded />
              }
            >
              Top
            </Button>

          </Box>

        </Container>
      </section>
    </footer>
  );
};

export default Footer;