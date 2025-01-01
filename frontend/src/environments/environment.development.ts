const API_URI = 'https://servicenexus.shuttleapp.rs/tf2sc'

export const environment = {
    production: false,
    apiUri: API_URI,
    routes: {
        loadouts: `${API_URI}/loadouts`,
        weapons: `${API_URI}/weapons`,
    }
};
