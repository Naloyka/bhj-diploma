/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент отсутсвует!')
    }
    this.element = element;
    this.registerEvents();
    this.lastOptions = false;
  }



  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const btn = document.getElementsByClassName('btn-danger');

    if (!this.lastOptions) {
      Array.from(btn).forEach((i) => {
        if (i.classList.contains('remove-account')) {
          i.addEventListener('click', (e) => {
            e.preventDefault();
            this.removeAccount();
          })
        }
      })
    } else {
      Array.from(btn).forEach((i) => {
        if (i.classList.contains('transaction__remove')) {
          i.addEventListener('click', () => {
            let id = i.dataset.id;
            this.removeTransaction(id);
          })
        }
      })
    }
    //Array.from(btn).forEach((i)=>{
    //  if (i.classList.contains('remove-account')) {
    //    i.addEventListener('click', (e)=> {
    //      e.preventDefault();
    //
    //      this.removeAccount();
    //    })
    //  } else if (i.classList.contains('transaction__remove')) {
    //    i.addEventListener('click',()=>{
    //
    //      let id = i.dataset.id;
    //      console.log(id);
    //      this.removeTransaction(id);
    //    })
    //  }
    //})
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return false
    } else {
      console.log(this.lastOptions);
      let id = this.lastOptions.account_id
      let obj = { id };
      console.log(obj);
      if (window.confirm("Вы уверены?")) {
        Account.remove(obj, (err, response) => {
          this.clear();
          App.update();
        })
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction(id) {

    let obj = { id };

    if (window.confirm("Вы уверены?")) {
      Transaction.remove(obj, (err, response) => {

        if (response.success) {
          App.update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
   render(options){
    if(!options) {
      return;
    }

    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if(!response) {
        return;
      }
      this.renderTitle(response.data.name);
    });

    Transaction.list(options, (err, response) => {
      this.renderTransactions(response.data);
    });
  }

  
/**
 * Очищает страницу. Вызывает
 * TransactionsPage.renderTransactions() с пустым массивом.
 * Устанавливает заголовок: «Название счёта»
 * */
clear() {
  let data = [];
  this.renderTransactions(data);
  this.renderTitle('Название счета');
  this.lastOptions = false;
}

/**
 * Устанавливает заголовок в элемент .content-title
 * */
renderTitle(name) {
    const title = document.getElementsByClassName('content-title')[0];
    title.innerHTML = name;
  }

/**
 * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
 * в формат «10 марта 2019 г. в 03:20»
 * */
formatDate(date) {
  //const page = new TransactionsPage( document.getElementById( '#content' ));
  //page.formatDate( '2019-03-10 03:20:41' );
  let newDate = new Date(date);
  let arr = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  return `${newDate.getDate()} ${arr[newDate.getMonth()]} ${1900 + newDate.getYear()} года в ${newDate.getHours()}:${newDate.getMinutes()}`;
}

/**
 * Формирует HTML-код транзакции (дохода или расхода).
 * item - объект с информацией о транзакции
 * */
getTransactionHTML(item) {
  let element = `
    <div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
       ${item.sum}<span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>
    `
  return element
}

/**
 * Отрисовывает список транзакций на странице
 * используя getTransactionHTML
 * */
renderTransactions(data) {

  const section = document.querySelector('.content');
  section.innerHTML = "";
  data.forEach((i) => {

    let element = this.getTransactionHTML(i)
    section.innerHTML += element;
  })
  this.registerEvents();
}
}