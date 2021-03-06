import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from "react-google-login";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Icon from './Icon';
import { signin, signup } from '../../actions/auth';
// import { AUTH } from '../../constants/actionTypes';
import useStyles from "./styles";
import Input from "./Input";

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  //Classes  
  const classes = useStyles();

  //Dispatch
  const dispatch = useDispatch();

  //State
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState)

  //history
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    if(isSignup){
      dispatch(signup(formData, history))
    } else{
      dispatch(signin(formData, history))
    }
  }

  function handleChange(e) {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  function switchMode() {
    setIsSignup((previsSignup) => !previsSignup);
  }

  function handleShowPassword() {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }

  async function googleSuccess(res) {
      const result = res?.profileObj
      const token = res?.tokenId

      try{
          dispatch({type: 'AUTH', data : {result, token}})
          history.push('/')

      }catch(err){
        console.log(err.message);
      }
 
  }

  function googleError() {
      console.log('Google Sing In was unsuccessful. Please try again later')
  }
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignup && (
            <>
              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
              <Input name="lastName" label="Last Name" handleChange={handleChange} half />
            </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In' }
          </Button>
          <GoogleLogin
            clientId="595076153921-rrfp3jves6mcv1pg40s6av6152phbui0.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
