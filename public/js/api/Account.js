
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

  /**
   * Получает информацию о счёте
   * */
  static get(id, callback){
    return createRequest({ method: 'GET', url: this.URL + "/" + id, callback });
  }
};