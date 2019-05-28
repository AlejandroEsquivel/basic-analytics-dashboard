import q from 'q';
import moment from 'moment';

const MONTHS_ALIAS = ['This Month','1 Month Ago','2 Months Ago','3 Months Ago','4 Months Ago'];

export default class AnalyticsController {

    constructor(dependencies){
        const { client } = dependencies;
        this.client = client;

        ['getAccounts','getProperties','getViews','getMetrics'].forEach(method=>{
            this[method] = this[method].bind(this);
        })
        
    }

    getToken(req,res,next) {
        const token = req.headers['token'];
        
        if(!token){
            const err = new Error('Token not provided.');
            next(err);
        }

        return token;
    }
    
    getAccounts (req,res,next) {
        const token = this.getToken(req,res,next);

        this.client.getAccounts(token)
            .then(results=>res.status(200).json(results))
            .catch(next);
    }

    getProperties (req,res,next) {
        const token = this.getToken(req,res,next);

        const { accountId } = req.params;

        this.client.getProperties(token,accountId)
            .then(results=>res.status(200).json(results))
            .catch(next);

    }

    getViews (req,res,next) {

        const token = this.getToken(req,res,next);

        const { accountId, webPropertyId } = req.params;

        this.client.getViews(token,accountId,webPropertyId)
            .then(results=>res.status(200).json(results))
            .catch(next);

    }

    getMetrics(req,res,next){
        const token = this.getToken(req,res,next);

        const { viewId } = req.params;

        const metrics = ['ga:sessions','ga:bounceRate','ga:pageviews'];
        const MAX_RESULTS = 10;

        const nthMonthsAgoMetrics = (monthsAgo)=>{
            monthsAgo = monthsAgo || 0;
            
            const startDate = moment().subtract(monthsAgo,'months').startOf('month').format('YYYY-MM-DD')
            const endDate =  moment().subtract(monthsAgo,'months').endOf('month').format('YYYY-MM-DD')

            return this.client.getMetrics(token,viewId, metrics.join(',') , startDate, endDate)
                .then(res=>{
                    return res.rows.length ? res.rows[0] : [];
                })
                .then(res=>{
                    let expandedResult = {
                        monthsAgo,
                        alias: MONTHS_ALIAS[monthsAgo],
                        sessions: null,
                        bounceRate: null
                    }
                    if(res.length){
                        expandedResult.sessions = res[0];
                        expandedResult.bounceRate = parseFloat(res[1]).toFixed(2);
                    }
                    return expandedResult;
                })
                .then((expandedResult)=>{
                    return this.client
                        .getMetrics(token,viewId, `ga:pageViews` ,startDate,endDate,`ga:pagePath`)
                        .then(pageData=>{
                            let pageViews = [];

                            if(pageData.rows.length){
                                //intentionally block scoped
                                let rows = pageData.rows;
                                if(rows.length){
                                    pageViews = rows
                                        .map(row=>({
                                            path: row[0],
                                            views: row[1]
                                        }))
                                        .sort((a,b)=>{
                                            return b.views - a.views;
                                        });
                                    
                                    if(pageViews.length>MAX_RESULTS){
                                        pageViews.splice(MAX_RESULTS);
                                    }
                                }                                
                            }

                            expandedResult.pageViews = pageViews;

                            return expandedResult;
                        })
                })
        };

        q.all([
            nthMonthsAgoMetrics(1),
            nthMonthsAgoMetrics(2),
            nthMonthsAgoMetrics(3),
            nthMonthsAgoMetrics(4)
        ])
        .then(resultsPartition=>{
            return res.status(200).json(resultsPartition.reduce((acc,metricsResult)=>{
                acc[metricsResult.alias] = metricsResult;
                return acc;
            },{}));
        })
        .catch(next);

    }
}