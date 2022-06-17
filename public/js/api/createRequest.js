/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
 const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    const fd = new FormData();
  
    if (options.method === 'GET') {
      for (let key in options.data) {
        options.url += `?${key}=${options.data[key]}&`;
      }
    }
  
    xhr.open(options.method, options.url);
  
    if (options.method === 'GET') {
      xhr.send();
    } else {
      for (let key in options.data) {
        fd.append(key, options.data[key]);
      }
      xhr.send(fd);
    }
  
    xhr.onload = () => {
      // console.log(xhr.response);
      options.callback(null, xhr.response);
    };
  };