// const API_URI = 'http://localhost:3000/api/v1'
const API_URI = 'https://tf2-subclass-creator.onrender.com/api/v1'
// const SHUTTLE_URI = 'https://servicenexus-hhq1.shuttle.app/tf2sc'
const AWS_URI = 'https://p7w81i8dr1.execute-api.eu-west-1.amazonaws.com/v1/api'
const ANALYTICS_API = 'G-4M85EFFZFC'

export const environment = {
    production: true,
    apiUri: API_URI,
    routes: {
        loadouts: `${API_URI}/loadouts`,
        weapons: `${API_URI}/weapons`,
        favs: `${AWS_URI}/fav`,
        users: `${API_URI}/users`
    },
    analytics: ANALYTICS_API
};
