const API_URI = 'https://servicenexus-hhq1.shuttle.app/tf2sc'

export const environment = {
    production: true,
    apiUri: API_URI,
    routes: {
        loadouts: `${API_URI}/loadouts`,
        weapons: `${API_URI}/weapons`,
    }
};
