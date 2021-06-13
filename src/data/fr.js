const fr = {
    main: {
        serverError: "Une erreur inconnue est arrivée",
        backTo: to => `Retour à ${to}.`,
        products: "Produits",
        change_company: "Aller à un autre espace"
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
        one: "Espace de",
        top: name => `Bonjour ${name} !`
    },
    create: {
        top: name => `Salut ${name} !`,
        text_first: "Bienvenue à Faturix. Vous pouvez commencer en créant un espace de gestion de commerce.",
        placeHolder_name: "Nom de commerce",
        next_button: "Créer",
        alert: {
            sameNameCompany: "Vous avez déja un espace de gestion de commerce avec exactement le même nom."
        }
    },
    select: {
        text_first: "Choisissez l'espace auquel vous voulez accéder.",
        next_button: "Accéder",
    },
    product: {
        mainBack: "la liste des produits",
        product: "Produit",
        unitPrice: "Prix unitaire",
        unitTaxes: "Taxes",
        qrCode: "Code QR",
        barCode: "Code barre",
        0: "Disponible",
        1: "En stock",
        2: "En rupture de stock",
        3: "Archivé",
        4: "Version précédente d'un produit",
        5: "Produit suspendu",
        actionsType: {
            quantityUpdate: "Mise à jour de la quantité",
            productUpdate: "Mise à jour de produit"
        },
        editProduct: "Modifier le produit",
        editQuantity: "Modifier la quantité",
        viewProduct: "Voir Product",
        a: {
            addNew: "Ajouter un nouveau produit",
            name: "Nom",
            price: "Prix",
            currency: "Devise",
            taxes: "Taxes",
            taxesDescription: "* Les taxes sont appliquées dépendement de la localité du client définie lors de la génétation de la facture.",
            commonTax: "Ajouter une taxe de vente",
            specialTax: "Ajouter une taxe spéciale",
            toQuantityModal: "Continuer vers quantités",
            saveUpdates: "Enregistrer les modifications",
        },
        q: {
            savedToCluster: "enregistré avec succès !",
            toProductsPage: "Aller à la page des produits",
            close: "Fermer",
            saving: "Entrain d'enregistrer",
            quantity: "Quantités",
            units: "Unités: ",
            or: "Ou",
            clickAgain: "Recliquez pour enregistrer",
            withDefinite: "Enregistrer la quantité",
            withIndefinite: "Produit toujours disponible",
            withOutOfStock: "Produit en rupture de stock",

        }
    }
}

export default fr;