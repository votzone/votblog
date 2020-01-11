var appid = BASE64.decodeStr(getQueryString("psw")) 
var restkey = BASE64.decodeStr(getQueryString("psw2")) 
Bmob.initialize(appid, restkey);
let LoanItem = Bmob.Object.extend("LoanItem")

function upload(loan_name, iconUrl, loan_url, loan_tags, loan_desc, loan_edu, loan_apply_num, ismargin
				,loan_rate, loan_rate_p,loan_intro, loan_strategy, loan_periods){
	let loanitem = new LoanItem();
	loanitem.set("name",loan_name)
	loanitem.set("iconUrl",iconUrl)
	loanitem.set("loanUrl",loan_url)
	loanitem.set("tag",loan_tags)
	loanitem.set("desc",loan_desc)
	loanitem.set("content1",loan_edu)
	loanitem.set("content4",loan_apply_num)
	loanitem.set("isMagrinTop",ismargin)
	loanitem.set("content3",loan_rate)
	loanitem.set("content2",loan_rate_p)
	loanitem.set("intro",loan_intro)
	loanitem.set("strategy",loan_strategy)
	loanitem.set("periods",loan_periods)
	loanitem.set("order",15)
	loanitem.save(null,{
		success: function(gameScore){
			showhint("上传成功！")
			// submit_once_flag = false
		},
		error: function(gameScore, error){
			showhint("上传失败！"+error.description)
			submit_once_flag = false
		}
	})
}
function showhint(hint_txt){
	$(".hint").text(hint_txt)
	$(".hint").fadeToggle(1000);
	$(".hint").fadeToggle(1000);
}


var submit_once_flag = false
$(document).ready(function(){
	if(submit_once_flag){
		return
	}
	submit_once_flag = true
	// set app number
	let apply_num =parseInt( Math.random() *2000 +8000)
	$('input:text[name="loan_apply_num"]').val(apply_num)
	console.log(appid, restkey)
	$("#switch_icon_type").click(function(){
		$("#icon_type_1").toggle()
		$("#icon_type_2").toggle()
		$("#icon_type_1").val("")
		$("#icon_type_2").val("")
	})
	$(".input_btn.submit_btn").click(function(){
		// 展示的值
		let loan_name = $('input:text[name="loan_name"]').val();

		if(isEmpty(loan_name)){
			showhint("请输入产品名称！")
			return
		}

		let iconFile = $('input:file[name="loan_icon_path"]').get(0).files[0]
		
		let iconUrl = $('input:text[name="loan_icon_url"]').val();

		if((isEmpty(iconFile) && isEmpty(iconUrl))){
			showhint("请输入产品图标！")
			return
		}
		
		let loan_url = $('input:text[name="loan_url"]').val();

		if(isEmpty(loan_url)){
			showhint("请输入产品URL！")
			return
		}
		let loan_tags = $('input:text[name="loan_tags"]').val();
		let loan_desc = $('input:text[name="loan_desc"]').val();
		if(isEmpty(loan_desc)){
			showhint("请输入一句话描述！")
			return
		}
		let loan_edu = $('input:text[name="loan_edu"]').val();
		if(isEmpty(loan_edu)){
			showhint("请输入额度！")
			return
		}
		let loan_apply_num = $('input:text[name="loan_apply_num"]').val();
		if(isEmpty(loan_apply_num)){
			showhint("请输入申请人数！")
			return
		}
		let ismargin = $('input:radio[name="ismargin"]:checked').val();
		ismargin = ismargin === 'not_hide'

		// 审核的值
		let loan_rate = $('input:text[name="loan_rate"]').val();
		if(isEmpty(loan_rate)){
			showhint("请输入贷款利率！")
			return
		}

		let loan_rate_p = $('input:radio[name="rate_p"]:checked').val();
		if(loan_rate_p === 'monthly'){
			loan_rate_p = "参考月利率"
		}else{
			loan_rate_p = "参考日利率"
		}
		let loan_intro = $('input:text[name="loan_intro"]').val();
		if(isEmpty(loan_intro)){
			showhint("请输入产品介绍！")
			return
		}
		let loan_strategy = $('input:text[name="loan_strategy"]').val();
		if(isEmpty(loan_strategy)){
			showhint("请输入申请攻略！")
			return
		}
		let loan_periods = $('input:text[name="loan_periods"]').val();
		if(isEmpty(loan_periods)){
			showhint("请输入贷款周期！")
			return
		}
		console.log(iconUrl)
		if(iconFile == null || iconFile == undefined){
			console.log('no file choosed')
		}
		console.log(loan_name,iconUrl ,loan_url,loan_tags,loan_desc,loan_edu,loan_apply_num,ismargin)
		console.log(loan_rate, loan_rate_p, loan_intro ,loan_strategy,loan_periods)

		if(!isEmpty(iconFile)){
			var name = iconFile.name;
    		var file = new Bmob.File(name, iconFile);
    		file.save().then(function(obj){
				upload(loan_name, obj.url(), loan_url, loan_tags, loan_desc, loan_edu, loan_apply_num, ismargin
				,loan_rate, loan_rate_p,loan_intro, loan_strategy, loan_periods)
    		},function(error){
    			showhint("图标上传失败！")
    			submit_once_flag = false
    		});

		}else{
			upload(loan_name, iconUrl, loan_url, loan_tags, loan_desc, loan_edu, loan_apply_num, ismargin
				,loan_rate, loan_rate_p,loan_intro, loan_strategy, loan_periods)
		}


	})
})