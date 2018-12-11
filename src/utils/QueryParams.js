class QueryParams {
    static all() {
        let queryString = window.location.search;
        let params = {};
        if (queryString && queryString.length > 0) {
            if (queryString.startsWith('?')) {
                queryString = queryString.substring(1);
            }
            let queries = queryString.split('&');
            queries.forEach(query => {
                let data = query.split('=');
                if (data.length === 2) {
                    params[data[0]] = decodeURIComponent(data[1]);
                }
            });
        }
        return params;
    }

    static get(name) {
        return QueryParams.all()[name];
    }
}

export default QueryParams;