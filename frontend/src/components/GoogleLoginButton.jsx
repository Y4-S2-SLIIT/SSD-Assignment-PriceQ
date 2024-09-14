import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

import UserService from "../services/user.service";

export default function GoogleLoginButton() {

    const responseMessage = (response) => {
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
                // Access the user data
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
                }
                else {
                    const data = {
                        firstName: decodedToken.given_name,
                        lastName: decodedToken.family_name,
                        email: decodedToken.email,
                        image: decodedToken.picture,
                        isoAuth: true,
                    }
                    UserService.register(data)
                        .then((response) => {
                            if (response.ok) {
                                return response.json(); // Parse the JSON body
                            } else {
                                throw new Error('Failed to fetch user data');
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
            });
    }


    const errorMessage = (error) => {
        console.log(error);
    };


    return (
        <div id="signInButton">
            <GoogleLogin
                onSuccess={responseMessage}
                onError={errorMessage}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}
