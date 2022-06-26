import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signin, signup } from '../../redux/reducers/user';

// after:content-['*'] after:ml-0.5 after:text-red-500

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmedPassword: '' };

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const switchMode = () => {
        setIsSignup(!isSignup);
        setErrorMessage('');
        console.log(isSignup);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const submitFormData = async () => {
        console.log(formData);

        // check empty fields
        const isSignUpEmptyField = Object.values(formData).some(val => val === '');
        const isLoginEmptyField = !formData.email.length || !formData.password.length;
        const isPasswordsEqual = formData.password === formData.confirmedPassword;

        if (isSignup && isSignUpEmptyField) {
            setErrorMessage("Please Fill Out All Required Fields");
            return;
        }
        if (isSignup && !isPasswordsEqual) {
            setErrorMessage("Passwords don't match");
            return;
        }
        if (isLoginEmptyField) {
            console.log(isLoginEmptyField);
            setErrorMessage("Please Fill Out All Required Fields");
            return;
        }

        // sign in / sign up
        let res;
        if (isSignup) {
            res = await dispatch(signup({ formData, navigate }));
        } else {
            res = await dispatch(signin({ formData, navigate }));
            console.log("res", res);
        }

        if (res.payload?.message) {
            setErrorMessage(res.payload.message);
        }
    }

    return (
        <div>
            <div className="w-2/5 h-fit m-auto fixed inset-0 p-12 shadow-lg rounded-lg border border-black/1 text-center flex flex-col">
                <h1 className="text-center text-4xl mb-5">{isSignup ? "Sign Up" : "Login"}</h1>
                {
                    isSignup &&
                    <div className="flex w-full">
                        <input className="mr-2 w-1/2 my-3 px-5 py-2 outline-primary/75 outline-offset-0 outline-1 border rounded-full border-black/10" name="firstName" placeholder="First Name" onChange={handleChange} required />
                        <input className="w-1/2 my-3 px-5 py-2 outline-primary/75 outline-offset-0 outline-1 border rounded-full border-black/10" name="lastName" placeholder="Last Name" onChange={handleChange} required />         
                    </div>
                }
                <input className="my-3 px-5 py-2 outline-primary/75 outline-offset-0 outline-1 border rounded-full border-black/10" name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
                <input className="my-3 px-5 py-2 outline-primary/75 outline-offset-0 outline-1 border rounded-full border-black/10" name="password" type="password" placeholder="Password" onChange={handleChange} required />
                {
                    isSignup && 
                    <>
                        <input className="my-3 px-5 py-2 outline-primary/75 outline-offset-0 outline-1 border rounded-full border-black/10" name="confirmedPassword" placeholder="Confirm Password" onChange={handleChange} required />
                    </>
                }
                { errorMessage && (
                    <div className="text-red-600 text-left italic">
                            {"*" + errorMessage}
                    </div>)
                }
                <button className="my-5 px-4 py-2 border rounded-full text-white bg-primary hover:bg-primary/90" onClick={submitFormData}>{isSignup ? "Sign Up" : "Login"}</button>
                <button className="m-auto text-secondary hover:text-black/60" onClick={switchMode}>
                    { isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default Login;