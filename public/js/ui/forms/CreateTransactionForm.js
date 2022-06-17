/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList()
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    this.select = this.element.querySelector('.accounts-select');
    this.select.innerHTML = "";

    Account.list( User.current(), (err,response) => {
      response.data.map(item => this.select.insertAdjacentHTML('beforeend', `<option value="${item.id}">${item.name}</option>`));
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err,response) => {
      if (!response) {
        return;
      }

      this.element.reset();
      App.getModal("newExpense").close();
      App.getModal("newIncome").close();
      App.update();
    })
  }
}