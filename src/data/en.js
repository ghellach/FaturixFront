const en = {
    main: {
        serverError: "An unknown error has occured.",
        backTo: to => `Back to ${to}.`,
        products: "Products",
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
        one: "Panel of",
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
    },
    product: {
        viewDetails: "View details",
        mainBack: "the Products List",
        product: "Product",
        unitPrice: "Unit Price",
        unitTaxes: "Taxes",
        qrCode: "QR Code",
        barCode: "Bar code",
        0: "Available",
        1: "In stock",
        2: "Not in stock",
        3: "Archived",
        4: "Previous version of this product",
        5: "Suspended Product",
        actionsType: {
            quantityUpdate: "Quantity update",
            productUpdate: "Product update"
        },
        editProduct: "Edit product",
        editQuantity: "Edit quantity",
        viewProduct: "View Product",
        a: {
            addNew: "Add a new product",
            name: "Name",
            price: "Price",
            currency: "Currency",
            taxes: "Taxes",
            taxesDescription: "* Taxes are applied depending on the customer's location defined at invoice time.",
            commonTax: "Add a common tax",
            specialTax: "Add special tax",
            toQuantityModal: "Continue to quantity",
            saveUpdates: "Save updates",
        },
        q: {
            savedToCluster: "saved to the cluster successfully !",
            toProductsPage: "Go to the product's page",
            close: "Close",
            saving: "Saving",
            quantity: "Quantity",
            units: "Units: ",
            or: "Or",
            clickAgain: "Click again to save",
            withDefinite: "Save the product's quantity",
            withIndefinite: "Product always availabe",
            withOutOfStock: "Product out of stock",

        },
        err: {
            sameQuantity: "The old and the new quantities are the same.",
            cannotUpdate: "This product cannot be modified."
        }
    },
    invoice: {
        name: "Invoice",
        new: "New Invoice",
        addProduct: "Add a product",

        addTax: "Add tax",

        percentage: "Percentage",
        amount: "Amount",
        remove: "Remove",

        subTotal: "Sub total",
        grossTotal: "Gross Total",

        price: "Price",
        taxes: "Taxes",
        quantity: "Quantity",
        reduction: "Reduction",

        // for change modal
        modify: "Modify",
        cancel: "Cancel",
        save: "Save",

        //for fetch modal
        lookUp: "Lookup a product",
        enterName: "Enter the name",

        // customer card
        customerInfo: "Customer's info",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phoneNumber: "Phone Number",
        address: "Address",

        // saving options

        saveDraft: "Save as draft",
        save: "Save",
        saveAndSend: "Save and send to customer",
        send: "Send to customer",



    }
}

export default en;