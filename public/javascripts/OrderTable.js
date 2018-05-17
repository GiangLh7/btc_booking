class Utils {

  static removeClass(el, cssClass) {
    el.className = el.className.replace(cssClass, '');
  }

  static addClass(el, cssClass) {
    el.className += ` ${cssClass}`;
  }

  /**
   * register event listener
   * @param {DOM} el - element to listen
   * @param {string} type - event to listen
   * @param {function} handler - handler when event occurs
   */
  static addEvent(el, type, handler) {
    if (el.attachEvent) {
      el.attachEvent(`on${type}`, handler);
    } else {
      el.addEventListener(type, handler);
    }
  }

  /**
   * unregister event listener
   * @param {DOM} el - element to listen
   * @param {string} type - event to listen
   * @param {function} handler - handler when event occurs
   */
  static removeEvent(el, type, handler){
    // if (el.removeEventListener) not working in IE11
    if (el.detachEvent) {
      el.detachEvent(`on${type}`, handler);
    }
    else {
      el.removeEventListener(type, handler);
    }
  }

  static triggerEvent(el, type){
    if (document.createEvent) {
      var e = document.createEvent('HTMLEvents');
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
    }
    else {
      var e = document.createEventObject();
      e.eventType = type;
      el.fireEvent('on'+e.eventType, e);
    }
  }
}

class OrderBookTable {
	constructor(tableId, tableData) {
		this.sortKey = "bid";
		this.tableId = tableId;
		this.tableData = tableData || [];
		this.sortOrder = -1;
		this.sortTableData(this.sortKey);
		this.render();
	}
	
	setDataTable(tableData) {
    this.tableData = tableData;
    this.sortTableData(this.sortKey);
    this.render();
	}

	add(data) {
		const table = document.getElementById(this.tableId).querySelectorAll("table")[0];
		let tempIdx = 0;
		
		for(var i = 0, l = this.tableData.length; i < l; i++) {
			const temp = this.tableData[i];
			if ( (data[this.sortKey] <= temp[this.sortKey] && this.sortOrder < 0) || (data[this.sortKey] >= temp[this.sortKey] && this.sortOrder > 0) ){
				tempIdx = i+1;				
			}
		}
		
		this.tableData.splice(tempIdx, 0, data);

		//const frag = document.createDocumentFragment();
		//this.constructDataItem(data);
		const row = table.insertRow(tempIdx+1);
    row.innerHTML = `<td></td>
        <td>${(data.size * data.bid).toFixed(3).toLocaleString()}</td>
        <td>${data.size.toFixed(3).toLocaleString()}</td>
        <td>${data.bid.toFixed(3).toLocaleString()}</td>
        <td></td>`;
	}

	render() {
		const table = document.getElementById(this.tableId);
		if (!table) {
			return;
		}

		let html = [`<table class="table table-striped">
      <thead>
        <tr>
          <th>*</th>          
          <th>TOTAL</th>
          <th>SIZE (BTC)</th>
          <th>BID (SGD)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>`];

    let runningTotal = 0;
		this.tableData.forEach((data) => {
      runningTotal += data.size * data.bid;
			html.push(this.renderDataItem(data, runningTotal));
		});

    html.push(`</tbody></table>`);

		table.innerHTML = html.join('');
	}	

	renderDataItem(data) {
    const dataRow = `<tr class="data-row" data-key="${data.key}">
        <td></td>
        <td>${(data.size * data.bid).toFixed(3).toLocaleString()}</td>
        <td>${data.size.toFixed(3).toLocaleString()}</td>
        <td>${data.bid.toFixed(3).toLocaleString()}</td>
        <td></td>
    </tr>`;
		return dataRow;
	}

	sortTableData(colNo) {
		return this.tableData.sort((a, b) => {
			if (a[colNo] < b[colNo]) {
				return -1 * this.sortOrder;
			}
			if (a[colNo] > b[colNo]) {
                return this.sortOrder;
            }
            return 0;
		});
	}
}

(function(){  
    window.OrderBookTable = OrderBookTable;
})();
