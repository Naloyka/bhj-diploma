
/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
 class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */

   static URL = '/account';

  static get(id = '', callback){

    this.getURL = this.URL + `/${id}`; //формирование адреса для обращения на сервер, из которого необходимо получить определённый счёт

    createRequest({
      url: this.getURL,
      method: 'GET',
      responseType: 'json',
      data,  
      callback  
    });
    
    callback(err, response); 

  };
};