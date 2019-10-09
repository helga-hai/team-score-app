/*const apiConfig = {
    protocol: 'http',
    host: 'localhost',
    port: 5000
}*/

const apiConfig = {
    protocol: 'https',
    host: 'sandbbl.pythonanywhere.com',
    port: ''
}

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const getPath = () => IS_DEVELOPMENT ? `${apiConfig.protocol}://${apiConfig.host}:${apiConfig.port}` : '';

export default class {
    static fetch(url, options = {headers: {}}) {
        if (!url) return;
        if (options.body) {
            options.body = JSON.stringify(options.body)
        }
        
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/json';
        //options.mode = 'no-cors';

        let token = window.localStorage.getItem('jwt');
        console.log('options.headers.authorization',options.headers.authorization)
        if (options.headers.authorization === undefined) {
            options.headers.authorization = token ? `Play ${token}`: '';
        }
        
        return new Promise((resolve, reject) => {
            return fetch(`${getPath() + url}`, options).then(resp => {
                if (resp.status === 200) {
                    console.log(resp.status);
                    resolve(resp)
                } else {
                    reject(resp.statusText)
                }
            })
        })
        .then(resp => resp.json())
        .catch(err => console.log(err));
    }

    static loadConfigs() {
        if (IS_DEVELOPMENT) return;
        fetch('/configs')
            .then(resp => resp.json())
            .then(value => {
                apiConfig.port = value && value.PORT;
            })
            .catch(err => console.warn(err))
    }

    static setToken(value) {
        value ? window.localStorage.setItem("jwt", value) : window.localStorage.removeItem("jwt")
    }
}
