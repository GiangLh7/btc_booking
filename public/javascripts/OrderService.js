class OrderService {
  static getOrders() {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
  
      request.open('GET', 'https://gile-btc-trading.herokuapp.com/api/trading/order', true);
      request.onload = function () {
        if(request.status != 200) {
          reject();
        }
        const data = JSON.parse(this.response);
        resolve(data);
      };
      request.send();
    });
  }
  
  static order(size, bid) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open('POST', 'https://gile-btc-trading.herokuapp.com/api/trading/order', true);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.onreadystatechange = function () {
        if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
          resolve(JSON.parse(request.response));
        }
        if (request.status !== 200) {
          reject();
        }
      };
      request.send(JSON.stringify({size: size, bid: bid}));
    });
  }
}