const en = {
    main: {
        serverError: "An unknown error has occured",
        backTo: to => `Back to ${to}.`
    },
    auth: {
        login: {
            top: "Login to your Business Panel",
            emailAddress: "Email Address",
            password: "Password",
            login: "Login",
            bottom: "New to Faturix? Sign-up for a 30 days free trial.",
            new: "Signup",
            alert: {
                emailNotFound: "This email address is not present in our records.",
                accountSuspended: "Your account is suspended. Contact our support team.",
                passwordIncorrect: "This password is incorrect",
                accountNotActivated: "Your account is not activated",
            }
        },
        
    },
    my: {
        name: "Main Screen",
        top: name => `Hello ${name} !`
    }
}

export default en;