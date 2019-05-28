import config from '~/app/config';
import axios from 'axios';

export default class APIClient {
    constructor(token,host){
        this.host = new URL(host || config.API_HOST);
        this.token = token;
    }

    request(endpoint, params, method){

        const token = this.token;

        let options;
        let url = new URL(endpoint,this.host);

        method = (method || 'get');
        
        options = {
            method,
            url,
            headers: {
                token
            }
        };

        if(method==='get' && params){
            const qs = Object.keys(params)
                .map(key=>`${key}=${params[key]}`)
                .join('&');

            if(qs){
                options.url = `${options.url}?${qs}`;
            }
        }
        else if(method==='post'){
            options.data = params;
        }
        
        return axios(options);
    }

    getAccounts(){
        return this.request(`/accounts`).then(res=>res.data.items)
    }

    getProperties(accountId){
        return this.request(`/accounts/${accountId}/properties`).then(res=>res.data.items)
    }

    getViews(accountId,webPropertyId){
        return this.request(`/accounts/${accountId}/properties/${webPropertyId}/views`).then(res=>res.data.items)
    }

    getMetrics(viewId, metrics, startDate, endDate){
        return this.request(`/views/${viewId}/metrics`).then(res=>res.data)
    }
}