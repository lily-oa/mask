
document.write('<img>');

//判斷日期(顯示星期幾)，並讓它呈現國字的樣式
function renderDay() {
  const num = Date.now();
  let dd = new Date(num);
  let weekdays = '日,一,二,三,四,五,六'.split(',');
  let nowWeekday = weekdays[dd.getDay()];
  document.querySelector('.demo').textContent = nowWeekday;

  //判斷基數 or 偶數並顯示可否購買
  if (nowWeekday == '一' || nowWeekday == '三' || nowWeekday == '五') {
    document.querySelector('.odd').style.display = 'block';
  } else if ((nowWeekday == '二' || nowWeekday == '四' || nowWeekday == '六')) {
    document.querySelector('.even').style.display = 'block';
  } else {
    document.querySelector('.sunday').style.display = 'block';
  }

  // 顯示出西元年月日
  let Y = dd.getFullYear() + ' - ';
  //month是從 0 開始，所以要加 1 
  let M = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1) + ' - ';
  let D = dd.getDate() + '';
  document.querySelector('.vids').textContent = Y + M + D;
}

//初始化，當網頁一開始載入時會先執行
function init(){
  renderDay();
  getData();
}

// 地圖 map
// 設定一個地圖，把這地圖定位在 #mapId，
// 先定位 center 座標，zoom 定位 16，zoom:縮放等級
const mapId = L.map('mapId', {
  center: [25.04828, 121.51435],
  zoom: 16
});

// 告訴電腦你要誰的圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapId);

//-------------------------------------1105
// 紫色Icon(頁面載入時，沒有指定任何定位)
const violetIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const marker = L.marker([0, 0], {icon:violetIcon}).addTo(mapId);

//定位使用者位置
if('geolacation' in navigator){
  navigator.geolocation.getCurrentPosition(position => {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    mapId.setView([userLat, userLng], 13);
    marker.setLatLng([userLat, userLng]).bindPopup(
      `<h6>你的位置</h6>`
    ).openPopup();
  });
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreeMap</a> contributors'
}).addTo(mapId);
const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize:[25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize:[25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const grayIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize:[25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//設定一個放資料的全域變數
let data;

//取得 JSON 資料
function getData(){
  const xhr = new XMLHttpRequest();
  xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json', true);
  xhr.send();
  //確定有無回傳資料
  xhr.onload = function(){
    //若是 ajax 的資料尚未載入則先呈現loading的畫面
    document.querySelector('.c-loading').style.display = 'none';
    //console.log(xhr.responseText);
    
    data = JSON.parse(xhr.responseText).features;
    for(let i=0; data.length>i; i++){
      let iconColor;
      if(data[i].properties.mask_adult > 0 && data[i].properties.mask_child > 0){
        iconColor = greenIcon;
      }else if(data[i].properties.mask_adult === 0 && data[i].properties.mask_child > 0){
        iconColor = redIcon;
      }else{
        iconColor = greenIcon;
      }
      markers.addLayer(L.marker([data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]], {icon: iconColor})
      .bindPopup(
      `
      <div>
        <h6>${data[i].properties.name}</h6>
        <span>${data[i].properties.phone}</span>
      </div>
      <p>成人口罩: ${data[i].properties.mask_adult}</p>
      <p>兒童口罩: ${data[i].properties.mask_child}</p>
      <span>更新時間: ${data[i].properties.updated}</span>
      `
      
    ));
    }
    mapId.addLayer(markers);
    
  }
}

getData();
let markers = new L.MarkerClusterGroup().addTo(mapId);

//----------------------------------------1105
// 顯示回傳 xhr 資料並組字串寫入網頁中
function renderList(city){
  let ary = data.features;
  let str = '';
  // console.log(ary);
  //組字串
  for(let i = 0; ary.length>i ; i++){
    //設定area區域的顯示規則，若抓取的資料和傳入的參數一樣就將資料顯示在網頁上
    if(ary[i].properties.county == city){
      str += `
              <li class="card">
                <div class="card-body">
                  <h3 class="card-title">${ary[i].properties.name}</h3>
                  <p class='card-text'>${ary[i].properties.address}</p>
                  <p>${ary[i].properties.phone}</p>
                  <div class="d-flex mt-2">
                    <span class="h-flex-1 badge rounded-pill bg-info py-2 fs-sm-6 fs-md-5">成人口罩 ${ary[i].properties.mask_adult} 個</span>
                    <span class="h-flex-1 badge rounded-pill bg-warning py-2 ms-2 fs-sm-6 fs-md-5">兒童口罩 ${ary[i].properties.mask_child} 個</span>
                  </div>
                </div>
              </li>
            `
    }
  }
  document.querySelector('.list').innerHTML = str;
}

init();

//監聽 area 範圍若發生改變時將改變的值以參數方式傳給顯示網頁的函數
document.querySelector('.p-select').addEventListener('change', function(e){
  // console.log(e.target.value);
  //此函式是將回傳值寫入網頁中(台北、台中、高雄)
  renderList(e.target.value);
});

//-----------------------------------------------
// 畫布按鈕開關 

let toggle = document.querySelector('.c-sideButton');
const Psidebar = document.querySelector('.p-sidebar');

toggle.onclick = function(e){
  Psidebar.classList.toggle('panelClose');
}

//--------------------------------------------------