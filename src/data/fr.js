const fr = {
    main: {
        serverError: "Une erreur inconnue est arrivé",
        backTo: to => `Back to ${to}.`
    },
    auth: {
        login: {
            top: "Connectez-vous à votre panel Business",
            emailAddress: "Adresse Courriel",
            password: "Mot de passe",
            login: "Connection",
            bottom: "Nouveau à Faturix ? Inscrivez-vous et essayez gratuitement pendant 30 jours.",
            new: "Inscription",
            alert: {
                emailNotFound: "Cet adresse courriel ne figure pas dans nos registres.",
                accountSuspended: "Votre compte est suspendu. Contactez l'équipe de support pour en savoir plus.",
                passwordIncorrect: "Le mot de passe entré est incorrect.",
                accountNotActivated: "Votre compte n'est pas activé.",
            }
        }
    },
    my: {
        name: "Écran Principal",
        top: name => `Bonjour ${name} !`
    }
}

export default fr;