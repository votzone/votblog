window.onload = function() {
	Bmob.initialize(BASE64.decodeStr("ODlmMDcyNTBlMDQ3YjA3OGE4MGU0MGQyMTgwYmI1ZTY="), BASE64.decodeStr("YjkzNjlkNmZjZTc1MTlkZDhmODJlNzkwYjBiMWJjZDA="));
	var BannerItem = Bmob.Object.extend("BannerItem");
	var query = new Bmob.Query(BannerItem);
	query.equalTo("Disable", true);
	query.equalTo("forapp", "web");
	query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				$(".sw-slides").append('<li class="sw-slide"><a href="' + object.get("BannerActionUrl") + '"><img src="' + object.get("BannerImgUrl") + '" alt=""></a></li>')
			}
			$("#customizability").swipeslider({
				sliderHeight: "40%"
			})
		}
	});
	var DKRecommend = Bmob.Object.extend("DKRecommend");
	query = new Bmob.Query(DKRecommend);
	query.include("loan");
	query.ascending("order");
	query.find({
		success: function(results) {
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				var loanitem = object.get("loan");
				var str = '<li id="1" style="position:relative;"><a href="loanUrl"><div class="home_pro_img"><img src="iconUrl" alt="loan_name"></div><div class="home_pro_r"><div class="home_pro_title">loan_name</div><div class="home_pro_txt1"><div >loandesc</div></div><div class="home_pro_txt2"><div class="w260 fl">额度<span class="pl10 c_fb4e44">loanEdu</span></div></div></div></a>';
				var tagstr = '<span class="tag">loantag</span></li>';
				str = str.replace(/loanUrl/, loanitem.get("loanUrl"));
				str = str.replace(/iconUrl/, loanitem.get("iconUrl"));
				str = str.replace(/loan_name/, loanitem.get("name"));
				str = str.replace(/loan_name/, loanitem.get("name"));
				str = str.replace(/loandesc/, loanitem.get("desc"));
				str = str.replace(/loanEdu/, loanitem.get("content1"));
				str = str.replace(/applyNum/, loanitem.get("content4"));
				var tag = loanitem.get("tag");
				if (tag !== null && tag !== undefined && tag !== "" && tag != "undefined") {
					str = str + tagstr.replace(/loantag/, tag)
				}
				$(".home_pro").append(str)
			}
		}
	})
};