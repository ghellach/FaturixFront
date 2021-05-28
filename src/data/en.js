const en = {
    main: {
        serverError: "An unknown error has occured",
        backTo: to => `Back to ${to}.`,
        change_company: "Switch to another panel"
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
    },
    create: {
        top: name => `Hello ${name} !`,
        text_first: "Welcome to Faturix. You can start by creating a commerce management space.",
        placeHolder_name: "Business Name",
        next_button: "Create",
        alert: {
            sameNameCompany: "You have a commerce management space with the exact same name."
        }
    },
    select: {
        text_first: "Select the management space you want to access.",
        next_button: "Access",
    }
}

export default en;