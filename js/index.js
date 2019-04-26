//设置时间
function zero(num) {
	return num >= 10 ? num : "0" + num
}
setInterval(function() {
	let nowTime = new Date();
	let year = nowTime.getFullYear()
	let mouth = nowTime.getMonth()
	let today = nowTime.getDate()
	let hours = zero(nowTime.getHours())
	let minutes = zero(nowTime.getMinutes())
	let second = zero(nowTime.getSeconds())
	let nowmouth = mouth + 1;
	let nowtime = document.querySelector(".now-time");
	let nowdate = document.querySelector(".now-date");
	nowdate.innerText = year + "年" + nowmouth + "月" + today + "日";
	nowtime.innerText = hours + ":" + minutes + ":" + second;
}, 1000)

var baseUrl = "http://show.maiboparking.com/index/platform/";
var master = {
	income: "income_comparison",
	stopTime: "parking_length",
	stopInfo: "get_city_info",
	allPark: "get_city_info",
	marning: "device_warning",
	yestoday: "yesterday_operation",
	carImg: "get_now_parking_img_list",
	country: "get_country_parking"
};

function url(url, master) {
	return url + master;
}
//今日收入开始
let todayIncorme = function() {
	$.ajax({
		url: url(baseUrl, master.income),
		success: function(data) {
			$(".today-income .money-number").text(data.data.t_number);
			$(".today-income .money-rate span").text(data.data.ratio);
			if (data.data.ratio >= 0) {
				$(".today-income .money-rate img").attr("src", "images/up.png");;
			}
		}
	})
}
todayIncorme()
// setInterval(todayIncorme,3000)
//今日收入结束
//停车时长开始
function stopLength() {
	$.ajax({
		url: url(baseUrl, master.marning),
		success: function(data) {
			var str = "";
			data.data.forEach(function(val) {
				str +=
					`
	                       <li>
	                          <div class="top">
	                              <div class="top-title ${val.status==0?"error":""}"><span class="state ${val.status==0?"error":""}">${val.status_name}</span>巡逻人员：<span>${val.patrol_name}</span></div>
	                              <div class="top-time">${val.time}</div>
	                           </div>
	                           <div class="info">
	                               <div class="top-name">${val.park_name}</div>
	                               <div class="fault-info hidden1">${val.error}</div>
	                           </div>
	                        </li>
	            `
			})
			$(".equ-warning .details").html(str);
		}
	})
}
stopLength()
// setInterval(stopLength,3000)
//设备警告结束
//泊车位开始
function parking() {
	$.ajax({
		url: url(baseUrl, master.allPark),
		success: function(data) {
			$(".park-space .occupy_seat").text(data.data.occupy_seat);
			$(".park-space .total_seat").text(data.data.total_seat);
			$(".park-space .ratio").text(data.data.ratio + "%");
		}
	});
}
parking();
// setInterval(parking,3000)
//泊车位结束
//昨日运营情况开始
function stopcar() {
	$.ajax({
		url: url(baseUrl, master.yestoday),
		success: function(data) {
			var str = "";
			data.data.forEach(function(val) {
				str +=
					`
	                <li>
	                   <div class="top">
	                      <span>${val.name}</span>
	                   </div>
	                   <div class="info">
	                      <div class="top-name">进出车辆 <span class="num">${val.total_flow}</span></div>
	                      <div class="fault-info hidden1">总收入￥ <span class="price">${val.total_money}</span></div>
	                   </div>
	                 </li>
	            `
			})
			$(".yet-situation-box").html(str);
		}
	})
}
stopcar();
// setInterval(stopcar,3000)
//车辆信息开始
$.ajax({
	url: url(baseUrl, master.carImg),
	success: function(data) {
		var str = "";
		data.data.forEach(function(val) {
			str +=
				`
                 <li>
                     <p>${val.in_out_time}</p>
                     <div class="img"><img src=${val.photoFilepathIn} alt=""></div>
                     <h3>${val.name}</h3>
                     <div class="license">车牌：<span>${val.plate_num}</span></div>
                 </li>
            `;
		})
		$(".center .car-img>ul").html(str);
	}
});
//车辆信息结束
//内容滚动开始
setInterval(active, 500, ".equ-warning .details")
setInterval(active, 500, ".yet-situation .details")
setInterval(active1, 500, ".car-img>ul")

function active(item) {
	if ($(item).height() < $(item).parent().height()) {
		return;
	}
	$(item).animate({
		top: "-=5px"
	}, 300, function() {
		if ($(item).position().top < ($(item).height() - $(item).parent().height()) * -1) {
			$(item).animate({
				top: 0
			}, 0);
		}
	});
}

function active1(item) {
	if ($(item).width() < $(item).parent().width()) {
		return;
	}
	$(item).animate({
		left: "-=5px"
	}, 300, function() {
		if ($(item).position().left < ($(item).width() - $(item).parent().width()) * -1) {
			$(item).animate({
				left: 0
			}, 0);
		}
	});
}
//内容滚动结束
//停车时长开始
var myChart1 = echarts.init(document.querySelector(".stop-time-box"));
option = {
	tooltip: {
		trigger: 'item',
		formatter: "时长：{b}<br />总计：{c}<br />占比：{d}%"
	},
	color: [
		'green',
		'yellow',
		'red',
		'yellowgreen',
		'blue'
	],
	series: [{
		type: 'pie',
		radius: ['50%', '70%'],
		avoidLabelOverlap: false,
		label: {
			emphasis: {
				show: true,
				textStyle: {
					fontWeight: 'bold'
				}
			}
		},
		labelLine: {
			normal: {
				show: true,
			}
		},
	}]
};
$.ajax({
	url: url(baseUrl, master.stopTime),
	success: function(res) {
		var data = [];
		res.data.forEach(function(val) {
			var b = {
				value: val.total,
				name: val.name,
			}
			data.push(b);
		})
		option.series[0].data = data;
		myChart1.setOption(option);
	}
});
//停车时长结束
//停车收费排行开始
var myChart2 = echarts.init(document.querySelector(".income-list-left"));
option2 = {
	tooltip: {
		trigger: 'item',
		formatter: "缴费类型：<br/>{b}{c}"
	},

	color: [
		'#ffbd3d',
		'#fffbbe'
	],
	legend: {
		x: '15%',
		bottom: "10%",
		itemWidth: 10,
		data: ["电子缴费", '现金缴费'],
		textStyle: {
			color: ["#ffffff"],
		}
	},
	series: [{
		type: 'pie',
		radius: ['50%', '70%'],
		avoidLabelOverlap: false,
		center: ["50%", "40%"],
		label: {
			normal: {
				show: false,
				position: 'center',
			},
			emphasis: {
				show: true,
				textStyle: {
					fontSize: '20',
					fontWeight: 'bold'
				}
			}
		},
		labelLine: {
			normal: {
				show: false
			}
		},
		data: [{
				value: 200,
				name: '现金缴费'
			},
			{
				value: 610,
				name: '电子缴费'
			},
		]
	}]
};
myChart2.setOption(option2)
var myChart3 = echarts.init(document.querySelector(".income-list-right"));
option3 = {
	tooltip: {
		trigger: 'item',
		formatter: "缴费类型：<br/>{b}{c}"
	},
	color: [
		'#009cff',
		'#b8e3ff'
	],
	legend: {
		x: '15%',
		bottom: "10%",
		itemWidth: 10,
		data: ["提前缴费", '出口缴费'],
		textStyle: {
			color: ["#ffffff"],
		}
	},
	series: [{
		type: 'pie',
		radius: ['50%', '70%'],
		avoidLabelOverlap: false,
		center: ["50%", "40%"],
		label: {
			normal: {
				show: false,
				position: 'center'
			},
		},
		label: {
			normal: {
				show: false,
				position: 'center',
			},
			emphasis: {
				show: true,
				textStyle: {
					fontSize: '20',
					fontWeight: 'bold'
				}
			}
		},
		data: [{
				value: 200,
				name: '提前缴费'
			},
			{
				value: 610,
				name: '出口缴费'
			},
		]
	}]
};
myChart3.setOption(option3)
// 停车收费排行结束
// 地图开始
var myChart4 = echarts.init(document.querySelector(".center .map"));
option4 = {
	tooltip: {
		trigger: 'item',
		triggerOn: 'none',
		formatter: function(param) {
			console.log(param)
			return `<div style="display: block; border-style: solid; white-space: nowrap; z-index: 9999999; background-color: rgba(50, 50, 50, 0.7); border-width: 1px; border-color: rgb(74, 223, 255); border-radius: 4px; color: rgb(255, 255, 255); font: 14px; padding: 20px;"><div class="modal">
                        <h2>${param.data.name}</h2>
                        <div class="text">今日收入</div>
                        <div class="money">${param.data.data.total_money}</div>
                        <div class="car">
                            <div class="left">
                                <span>总车位</span>
                                <span>${param.data.data.total_seat}</span>
                            </div>
                            <div class="right">
                                <span>空余</span>
                                <span>${param.data.data.surplus_seat}</span>
                            </div>
                        </div>
                        <div class="bottom">
                            <div>本日进场 ${param.data.data.in_number}</div>
                            <div>本日出场 ${param.data.data.out_number}</div>
                        </div>
                    </div></div>`
		},
	},
	geo: {
		map: 'china',
		label: {
			emphasis: {
				show: true
			}
		},
		itemStyle: {
			normal: {
				areaColor: '#194e7c',
				borderColor: "#111"
			},
			emphasis: {
				areaColor: '#64BDDA',
			}
		}
	},
	series: [{
		type: 'scatter',
		coordinateSystem: 'geo', //以什么为坐标，使用地理坐标系
		symbolSize: 8,
		itemStyle: {
			color: 'red'
		},
		 label: {
		    formatter: "停车场：{b}",
		    emphasis: {
		        show: true
		    },
		    position: "right"
		}
	}, {
		type: 'effectScatter',
		coordinateSystem: 'geo',
		color: "#07d4f4",
		symbolSize: 22,
		rippleEffect: {
			period: 4,
			scale: 3,
			brushType: 'stroke'
		},
		 label: {
		    formatter: "停车场：{b}",
		    show: true,
		    position: "right"
		}
	}, ]
}
let jiazhi = {
	"code":1,
	"data":[
		{"park_id":11442,"name":"1号停车场-A","baidumap_longitude":"108.909992538480","baidumap_latitude":"34.247720227097","province_code":"61",
			"value":11442},
		{"park_id":11443,"name":"1号停车场-B","baidumap_longitude":"108.910426220550","baidumap_latitude":"34.247517651721","province_code":"61","value":11443},
		{"park_id":11444,"name":"1号停车场-C","baidumap_longitude":"108.912329173510","baidumap_latitude":"34.246665836908","province_code":"61","value":11444},
		{"park_id":11445,"name":"1号停车场-D","baidumap_longitude":"108.912709635780","baidumap_latitude":"34.246507846277","province_code":"61","value":11445},
		{"park_id":12634,"name":"北京绿地中心","baidumap_longitude":"116.494875796240","baidumap_latitude":"40.006757991551","province_code":"11","value":12634},
		{"park_id":12834,"name":"绿地公园广场","baidumap_longitude":"121.385590267830","baidumap_latitude":"31.356351383284","province_code":"31","value":12834},
		{"park_id":12835,"name":"公元1860商务广场","baidumap_longitude":"121.430188440670","baidumap_latitude":"31.368648948595","province_code":"31","value":12835},
		{"park_id":12899,"name":"绿地浦创商务广场","baidumap_longitude":"121.520746904250","baidumap_latitude":"31.262965057743","province_code":"31","value":12899},
		{"park_id":12901,"name":"绿地领海国际","baidumap_longitude":"121.362748101580","baidumap_latitude":"31.326921841384","province_code":"31","value":12901},
		{"park_id":12902,"name":"松江伯顿商务广场","baidumap_longitude":"121.259597553760","baidumap_latitude":"31.027985710686","province_code":"31","value":12902},
		{"park_id":12903,"name":"嘉创国际商务广场","baidumap_longitude":"121.271230078230","baidumap_latitude":"31.379929335351","province_code":"31","value":12903},
		{"park_id":12904,"name":"嘉尚国际广场","baidumap_longitude":"121.272711771780","baidumap_latitude":"31.379184361475","province_code":"31","value":12904},
		{"park_id":12905,"name":"翡翠国际广场","baidumap_longitude":"121.485311784760","baidumap_latitude":"30.929781458624","province_code":"31","value":12905},
		{"park_id":12906,"name":"绿地未来中心","baidumap_longitude":"121.502136914400","baidumap_latitude":"30.926833883297","province_code":"31","value":12906},
		{"park_id":12907,"name":"东海岸时代广场","baidumap_longitude":"121.768171866590","baidumap_latitude":"31.157055467690","province_code":"31","value":12907},
		{"park_id":12915,"name":"海珀旭辉西区","baidumap_longitude":"121.470157480530","baidumap_latitude":"31.194332172957","province_code":"31","value":12915},
		{"park_id":12916,"name":"绿地北郊广场一期","baidumap_longitude":"121.391342322830","baidumap_latitude":"31.370059635096","province_code":"31","value":12916},
		{"park_id":13002,"name":"绿地汇创商务广场","baidumap_longitude":"121.470731977490","baidumap_latitude":"31.177655329072","province_code":"31","value":13002},
		{"park_id":12910,"name":"千玺广场","baidumap_longitude":"113.739961873750","baidumap_latitude":"34.782280620902","province_code":"41","value":12910},
		{"park_id":12911,"name":"绿地新都会","baidumap_longitude":"113.780836740300","baidumap_latitude":"34.781792833337","province_code":"41","value":12911},
		{"park_id":12912,"name":"绿地原盛国际","baidumap_longitude":"113.782108241390","baidumap_latitude":"34.780090648063","province_code":"41","value":12912},
		{"park_id":12913,"name":"绿地之窗","baidumap_longitude":"113.782941512630","baidumap_latitude":"34.773055530195","province_code":"41","value":12913},
		{"park_id":12914,"name":"绿地峰会天下","baidumap_longitude":"113.732979212950","baidumap_latitude":"34.788814817312","province_code":"41","value":12914}
	]
}
function convertData(data) {
	var data1 = [];
	data.forEach(function(val) {
		data1.push({
			name: val.name,
			value: [val["baidumap_longitude"] * 1, val["baidumap_latitude"] * 1, val["park_id"]],
			park_id: val.park_id
		})
	})
	return data1;
}
var sdata =convertData(jiazhi.data);
// console.log(sdata)
option4.series[0].data =convertData(jiazhi.data);
myChart4.setOption(option4);
// var n = 0;
// setInterval(function(){
// n++;	
// if(n >= (sdata.length)){
// 	n=0;
// }
// option4.series[1].data =[sdata[n]];
// myChart4.setOption(option4);
//  myChart4.dispatchAction({
// 	type: 'showTip',
// 	seriesIndex: 1,
// 	dataIndex: 0,
// });
// },5000)

var index = 0;
for(let i=0;i<sdata.length;i++){
	$.ajax({
	url:"http://show.maiboparking.com/index/platform/get_parking_info?park_id="+jiazhi.data[i].park_id,
	success:function(datas){
		index++;
		sdata[i].data = datas.data;
		// console.log(sdata)
		if(index == sdata.length){
			option4.series[1].data = [sdata[0]];
			myChart4.setOption(option4);
			var n = 0;
			setInterval(function(){
			n++;	
			if(n >= (option4.series[0].data.length)){
				n=0;
			}
			option4.series[1].data =[sdata[n]];
			// console.log(option4.series[1].data)
			myChart4.setOption(option4);
			 myChart4.dispatchAction({
				type: 'showTip',
				seriesIndex: 1,
				dataIndex: 0,
			});
			},2000)
		}
	}
})
}
