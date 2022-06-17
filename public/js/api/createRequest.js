/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
 const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    xhr.responseType = options.responseType;

    if(options.method !== "GET"){
        xhr.open(options.method, options.url);

        const formData = new FormData();
        for(let key in options.data){
            formData.append(key, options.data[key]);
        }
        xhr.send(formData);
    } else {
        let myStr = "";
        for(let key in options.data){
            myStr = `?${key}=${options.data[key]}`;
        }
        xhr.open("GET", options.url + myStr);
        xhr.send();
    }

    xhr.onreadystatechange = () => {
        if(xhr.readyState == 4){
            options.callback(xhr.response.error, xhr.response)
        }
    }
};