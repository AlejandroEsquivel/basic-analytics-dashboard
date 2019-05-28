import rp from 'request-promise';

export default class AnalyticsClient {

    constructor(host){
        this.host  = new URL(host || 'https://www.googleapis.com/analytics/v3/');
    }

    request(endpoint, params, method){

        const { token } = params;

        let options;
        let url = new URL(endpoint,this.host);

        method = (method || 'get').toUpperCase();
        
        options = {
            method,
            url,
            headers: {
                Authorization: `Bearer ${token}`
            },
            json: true
        };

        if(method==='GET'){
            options.qs = params;
        }
        else if(method==='POST'){
            options.body = params;
        }
        
        return rp(options);
    }

    getAccounts(token){
        return this.request(`management/accounts`,{ token });
    }

    getProperties(token, accountId){
        return this.request(`management/accounts/${accountId}/webproperties`, { token });
    }

    getViews(token, accountId, webPropertyId){
        return this.request(`management/accounts/${accountId}/webproperties/${webPropertyId}/profiles`, { token });
    }

    getMetrics(token,viewId, metrics, startDate, endDate, dimensions){
        let params = {
            token,
            ids: `ga:${viewId}`,
            'start-date': startDate,
            'end-date': endDate,
            metrics,
            dimensions
        }

        return this.request(`data/ga`, params);
    }
}