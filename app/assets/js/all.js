
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
const mapId = L.map('mapId', { zoomControl: false }).setView([0, 0], 16);

// 告訴電腦你要誰的圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors:<a href="https://github.com/fred39392001">ABow_Chen</a>'
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

const marker = L.marker([0, 0] , {icon:violetIcon}).addTo(mapId);


//定位使用者位置
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;
  map.setView([userLat, userLng], 13);
  marker.setLatLng([userLat,userLng]).bindPopup(
      `<h6>你的位置</h6>`)
      .openPopup();
  });
} 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapId);

const greenIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const greyIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//設定一個放資料的全域變數
let data = [];

//取得 JSON 資料
function getData(){
  const xhr = new XMLHttpRequest();
  xhr.open('get', 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json');
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
        <h4 class="mb-1">${data[i].properties.name}</h4>
        <span>${data[i].properties.phone}</span>
      </div>
      <p>成人口罩: ${data[i].properties.mask_adult}</p>
      <p>兒童口罩: ${data[i].properties.mask_child}</p>
      <span>更新時間: ${data[i].properties.updated}</span>
      `
    ));
    }
    mapId.addLayer(markers);
    addCountyList();
    updateList(data);
  }
}


let markers = new L.MarkerClusterGroup().addTo(mapId);
let county = document.querySelector('.county');
let town = document.querySelector('.town');
county.addEventListener('change', filterCountyList);
town.addEventListener('change', filterTownList);
// 加入城市 option
//「陣列（Array）」的元素不會重複，可以使用 Set
//Set 的特色是有 has() 這個方法，可以快速判斷該 Set 中是否包含某個元素，重點不是讓我們把 Set 中的元素取出來用。
function addCountyList(){
  let countryName = new Set();
  let countryList = data.filter(item => !countryName.has(item.properties.county) ? countryName.add(item.properties.county) : false);
  let countryStr = '';
  countryStr += `<option value="" disabled selected> -- 請選擇 -- </option>`;
  countryList.forEach(item => {
    if(item.properties.county !== ''){
      countryStr += `
        <option value="${item.properties.county}">${item.properties.county}</option>
      `
    }
  });
  county.innerHTML = countryStr;
}

// 顯示城市資料，城市 chang
function filterCountyList(e){
  let countryVal = e.target.value;
  let allTown = [];
  data.forEach(item => {
    if(item.properties.county === countryVal){
      allTown.push(item);
    }
  });
  addTownList(allTown);
  updateList(allTown);
}

// 加入地區
  function addTownList(allTown){
    let townName = new Set();
    let townList = allTown.filter(item => !townName.has(item.properties.town) ? townName.add(item.properties.town): false);
    let townStr = ''
    townList.forEach(item => {
      townStr += `
        <option value="${item.properties.town}">${item.properties.town}</option>
      `
    });
    town.innerHTML = townStr;
  }

// 顯示地區資料
function filterTownList(e){
  let geoData = {};
  let filteredTown = [];
  data.forEach(item => {
    if(item.properties.town === e.target.value){
      filteredTown.push(item);
      geoData = item
    }
  });
  updateList(filteredTown);
  geo(geoData);
}

// 更新資料
let list = document.querySelector('.list');

function updateList(townList){
  let str = '';
  str += `
    <div class="d-flex flex-colum justify-content-center align-items-center mt-3">
      <h4 class="text-center mb-4">
          取得口罩的藥局有<span class="text-success">${townList.length}</span>家
      </h4>
    </div>
  `
  townList.forEach(item =>{
    str += `
    <div class="card text-center mb-2 mx-2 table-bordered">
      <div class="card-header">
        ${item.properties.name}
      </div>
      <div class="card-body d-flex align-items-start flex-column">
        <div>
          <i class="fas fa-map-marker-alt geoIcon text-danger"></i>
          <span class="mb-2 ml-2">${item.properties.address}</span>
        </div>
        <div class="mt-3">
          <i class="fas fa-phone text-success"></i>
          <span>${item.properties.phone}</span>
        </div>
      </div>
      <div class="card-footer text-muted d-flex justify-content-around">
        <div class="p-2 rounded-pill btn btn-secondary btn-sm">成人: ${item.properties.mask_adult}</div>
        <div class="p-2 rounded-circle btn btn-success marker_icon btn-sm forward" data-locate="${[item.geometry.coordinates[1], item.geometry.coordinates[0]]}" data-name="${item.properties.name}">前往</div>
        <div class="p-2 rounded-pill btn btn-secondary btn-sm">兒童: ${item.properties.mask_child}</div>
      </div>
  </div>
  
    `
  });
  list.innerHTML = str;
}

//geoData為地區資料的參數
function geo(geoData){
  let name = geoData.properties.town;
  mapId.setView([geoData.geometry.coordinates[1], geoData.geometry.coordinates[0]], 11);
  L.marker([geoData.geometry.coordinates[1], geoData.geometry.coordinates[0]])
  .addTo(mapId)
  .bindPopup(name)
  .openPopup();
}
$(list).delegate(`.marker_icon`, `click`, function (e) {
  let tempdata = e.target.dataset.locate;
  let tempName = e.target.dataset.name;
  let str = tempdata.split(",");
  let numA = parseFloat(str[0]);
  let numB = parseFloat(str[1]);
  let location = [numA, numB];
  mapId.setView(location, 20);
      L.marker(location)
      .addTo(mapId)
      .bindPopup(tempName)
      .openPopup();
});


init();
// 畫布按鈕開關 

let toggle = document.querySelector('.c-sideButton');
const Psidebar = document.querySelector('.p-sidebar');

toggle.onclick = function(e){
  Psidebar.classList.toggle('panelClose');
}

//------------------------------------------12/4 search

let search = document.querySelector('#search');


const searchAddress = (e) => {
  if(e.target.nodeName !== 'A'){
    return;
  }
  const searchText = document.querySelector('#searchText').value;
  
  if(searchText === ''){
    alert('請輸入資料，無法搜尋空白!');
  }else{
    const townList = data.filter((element) => element.properties.address.match(searchText));
  console.log(townList);

  //getData(townList);
  }
};

search.addEventListener('click', searchAddress);
