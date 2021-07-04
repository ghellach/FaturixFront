
const urlsLocal = {
    APP_URL: "http://localhost:3000",
    API_URL: "http://localhost:8506"
}
const urlsLan = {
    APP_URL: "http://10.0.0.180:3000",
    API_URL: "http://10.0.0.180:8506"
}

export const initialState = () => {
    return {
        APP_NAME: "Faturix",
        APP_VERSION: "0.0.1",
        ...urlsLan,
        //...urlsLocal,
    }
}