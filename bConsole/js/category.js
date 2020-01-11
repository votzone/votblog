function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2])
	}
	return null
}
function getCategoryName(category) {
	switch (category) {
	case "1":
		return "微额贷款";
		break;
	case "2":
		return "小额贷款";
		break;
	case "3":
		return "大额贷款";
		break;
	case "4":
		return "超大额贷款";
		break;
	case "11":
		return "放款快";
		break;
	case "12":
		return "门槛低";
		break;
	case "13":
		return "新品";
		break;
	case "10":
		return "全部贷款";
		break;
	default:
		return "贷款分类"
	}
}
function loadData() {
	Bmob.initialize(BASE64.decodeStr("ODlmMDcyNTBlMDQ3YjA3OGE4MGU0MGQyMTgwYmI1ZTY="), BASE64.decodeStr("YjkzNjlkNmZjZTc1MTlkZDhmODJlNzkwYjBiMWJjZDA="));
	var DKCategory = Bmob.Object.extend("DKCategory");
	var query = new Bmob.Query(DKCategory);
	query.include("loanItem");
	query.ascending("order");
	query.equalTo("categoryId", Number(category));
	query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				var loanitem = object.get("loanItem");
				var str = '<li id="1" style="position:relative;"><a href="loanUrl"><div class="home_pro_img"><img src="iconUrl" alt="loan_name"></div><div class="home_pro_r"><div class="home_pro_title">loan_name</div><div class="home_pro_txt1"><div >loandesc</div></div><div class="home_pro_txt2"><div class="w260 fl">额度<span class="pl10 c_fb4e44">loanEdu</span></div></div></div></a>';
				var tagstr = '<span class="tag">loantag</span></li>';
				str = str.replace(/loanUrl/, loanitem.get("loanUrl"));
				str = str.replace(/iconUrl/, loanitem.get("iconUrl"));
				str = str.replace(/loan_name/, loanitem.get("name"));
				str = str.replace(/loan_name/, loanitem.get("name"));
				str = str.replace(/loandesc/, loanitem.get("desc"));
				str = str.replace(/loanEdu/, loanitem.get("content1"));
				str = str.replace(/applyNum/, loanitem.get("content4"));
				$(".home_pro").append(str)
			}
		}
	})
}
var category = 10;
$(function() {
	category = getQueryString("category");
	var categoryName = getCategoryName(category);
	console.log(category);
	console.log(categoryName);
	document.title = categoryName + "-小熊用钱";
	$("span.title").text(getCategoryName(category));
	loadData()
});