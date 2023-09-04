"use strict";

document.write('<img>'); //判斷日期(顯示星期幾)

function renderDay() {
  var _date = new Date();

  var _day = _date.getDay();

  document.querySelector('.demo').textContent = _day; //判斷基數 or 偶數並顯示可否購買

  if (_day == 1 || _day == 3 || _day == 5) {
    document.querySelector('.odd').style.display = 'block';
  } else if (_day == 2 || _day == 4 || _day == 6) {
    document.querySelector('.even').style.display = 'block';
  } else {
    document.querySelector('.sunday').style.display = 'block';
  }
} // 顯示出西元年月日


function renderDayVids() {
  var _date = new Date();

  var _year = _date.getFullYear(); //month是從 0 開始，所以要加 1 


  var _month = _date.getMonth() + 1;

  var _day = _date.getDate();

  document.querySelector('.vids').textContent = "".concat(_year, "-0").concat(_month, "-").concat(_day);
} //初始化，當網頁一開始載入時會先執行


function init() {
  //執行函式
  renderDay();
  renderDayVids();
  getData();
} //設定一個放資料的全域變數


var data; //取得資料

function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json', true);
  xhr.send(); //確定有無回傳資料

  xhr.onload = function () {
    //若是 ajax 的資料尚未載入則先呈現loading的畫面
    document.querySelector('.c-loading').style.display = 'none'; //console.log(xhr.responseText);

    data = JSON.parse(xhr.responseText); //預設顯示的值為臺北市

    renderList("臺北市");
  };
} // 顯示回傳 xhr 資料並組字串寫入網頁中


function renderList(city) {
  var ary = data.features;
  var str = ''; // console.log(ary);
  //組字串

  for (var i = 0; ary.length > i; i++) {
    //設定area區域的顯示規則，若抓取的資料和傳入的參數一樣就將資料顯示在網頁上
    if (ary[i].properties.county == city) {
      str += "<li>".concat(ary[i].properties.county, " : ").concat(ary[i].properties.name, "\uFF0C\u6210\u4EBA\u53E3\u7F69 : ").concat(ary[i].properties.mask_adult, "\u500B\uFF0C\n      \u5152\u7AE5\u53E3\u7F69 : ").concat(ary[i].properties.mask_child, "\u500B</li>");
    }
  }

  document.querySelector('.list').innerHTML = str;
}

init(); //監聽 area 範圍若發生改變時將改變的值以參數方式傳給顯示網頁的函數

document.querySelector('.area').addEventListener('change', function (e) {
  // console.log(e.target.value);
  //此函式是將回傳值寫入網頁中(台北、台中、高雄)
  renderList(e.target.value);
}); // 地圖 map
// 設定一個地圖，把這地圖定位在 #mapId，
// 先定位 center 座標，zoom 定位 16，zoom:縮放等級

var mapId = L.map('mapId', {
  center: [25.04828, 121.51435],
  zoom: 16
}); // 告訴電腦你要誰的圖資

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapId);
//# sourceMappingURL=all.js.map