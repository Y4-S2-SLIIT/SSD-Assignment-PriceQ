import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import UserService from "../services/user.service";
import Button from "react-bootstrap/Button"; // Import Bootstrap Button for consistent styling

export default function GoogleLoginButton() {
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const responseMessage = (response) => {
        setIsLoading(true); // Set loading to true
        const decodedToken = jwtDecode(response.credential);

        UserService.getUserByEmail(decodedToken.email)
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Parse the JSON body
                } else {
                    throw new Error('Failed to fetch user data');
                }
            })
            .then((data) => {
                if (data.status) {
                    Swal.fire({
                        icon: "success",
                        title: "Successful",
                        text: "Login Successfully!",
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true,
                    });
                    sessionStorage.setItem("userid", data.data.id);
                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 1500);
                } else {
                    const data = {
                        firstName: decodedToken.given_name,
                        lastName: decodedToken.family_name,
                        email: decodedToken.email,
                        image: decodedToken.picture,
                        isoAuth: true,
                    };
                    UserService.register(data)
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); // Parse the JSON body
                            } else {
                                throw new Error('Failed to register user');
                            }
                        })
                        .then((data) => {
                            sessionStorage.setItem("userid", data.id);
                            Swal.fire({
                                icon: "success",
                                title: "Successful",
                                text: "New User Registered Successfully!",
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(() => {
                                window.location.href = "/dashboard";
                            });
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error occurred during login!",
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .finally(() => {
                setIsLoading(false); // Set loading to false after the process
            });
    };

    const errorMessage = (error) => {
        console.log(error);
        setIsLoading(false); // Set loading to false if error occurs
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Google Login Failed!",
            showConfirmButton: false,
            timer: 1500,
        });
    };

    return (
        <div id="signInButton">
            {isLoading ? (
                <Button variant="primary" disabled>
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    ></span>
                    &nbsp;
                    &nbsp;
                    Loading...
                </Button>
            ) : (
                <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            )}
        </div>
    );
}