import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { login, signup } from "../../actions/auth.js";
import useStyles from "./styles";
import Input from "./Input";
import TnC from "./TnC";
import ROLES from "../../utils/roles.js";

const Auth = () => {
  const initialFormData = {
    role: "",
    firstName: "",
    lastName: "",
    name: "",
    website: "",
    regNum: "",
    contactNum: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [agree, setAgree] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setIsSignup(!isSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);

    if (isSignup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(login(formData, history));
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheck = () => setAgree(!agree);

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign up" : "Login"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}>
                <InputLabel id="role">Role</InputLabel>
                <Select
                  labelId="role"
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  autoFocus
                  label="role">
                  <MenuItem value={ROLES.Student}>Student</MenuItem>
                  <MenuItem value={ROLES.StudentGroup}>Student Group</MenuItem>
                  <MenuItem value={ROLES.Organization}>Organization</MenuItem>
                </Select>
              </FormControl>
            )}
            {isSignup && formData.role === ROLES.Student && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            {isSignup &&
              (formData.role === ROLES.StudentGroup ||
                formData.role === ROLES.Organization) && (
                <>
                  <Input
                    name="name"
                    label="Group/Organization Name"
                    handleChange={handleChange}
                    fullWidth
                  />
                  <Input
                    name="website"
                    label="Group/Organization Website"
                    handleChange={handleChange}
                    fullWidth
                  />
                  {formData.role === "Organization" && (
                    <Input
                      name="regNum"
                      label="UEN/Charity or Society Registration Number"
                      handleChange={handleChange}
                      fullWidth
                    />
                  )}
                  {formData.role === "Organization" && (
                    <Input
                      name="contactNum"
                      label="Contact Number"
                      handleChange={handleChange}
                      fullWidth
                      type="tel"
                    />
                  )}
                </>
              )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Input
                helperText={
                  formData.password !== formData.confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                handleError={formData.password !== formData.confirmPassword}
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          {isSignup && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={agree}
                    onChange={handleCheck}
                    name="TnC"
                  />
                }
                label="I agree to the"
              />
              <TnC setAgree={setAgree} />
            </>
          )}
          <Button
            disabled={isSignup && !agree ? true : false}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            {isSignup ? "Sign Up" : "Login"}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;