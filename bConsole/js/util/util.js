function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2])
	}
	return null
}

function isEmpty(str_txt){
	return str_txt == null || str_txt == undefined || str_txt === ""
}