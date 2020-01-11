# Webview
 浏览器未开启javascript
使用的js代码有问题，webview不兼容该代码。

1） 第一个坎：WebSettings

WebSettings webSettings = mWebView.getSettings();
webSettings.setJavaScriptEnabled(true);

2) 第二个坎： 有物
在运行脚本前，要有document对象，至少得load一个空白页

webView.loadData(“”,"text/html","UTF-8");

3）第三个坎： 异步
如果这么写是没戏的，因为第一个还没执行完呢

webView.loadData(“”,"text/html","UTF-8");
webView.loadUrl("javascript:alert('hello')");

解决这个问题。可以1）从界面按钮调用 2)延时调用。 3）在onPageFinished中调用

mWebView.setWebViewClient(new MyWebViewClient());
private class MyWebViewClient extends WebViewClient {
@Override
public void onPageFinished(WebView webView, String url) {
webView.loadUrl("javascript:"+script);
}
}

4）第四个坎：console/alert

以上三点完成后，js已经可以执行，可是为什么看不到console.log和alert呢？因为这2个要额外实现

mWebView.setWebChromeClient(new MyWebChromeClient()); //optional, for show console and alert
private class MyWebChromeClient extends WebChromeClient {
@Override
public boolean onConsoleMessage(ConsoleMessage cm) {
Log.d("test", cm.message() + " -- From line "
+ cm.lineNumber() + " of "
+ cm.sourceId() );
return true;
}

@Override
public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
return true;
}
}