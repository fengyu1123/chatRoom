<?php
namespace app\index\controller;
use think\Controller;
class Index extends Controller
{
    public function index()
    {
        //return '<style type="text/css">*{ padding: 0; margin: 0; } .think_default_text{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:)</h1><p> ThinkPHP V5<br/><span style="font-size:30px">十年磨一剑 - 为API开发设计的高性能框架</span></p><span style="font-size:22px;">[ V5.0 版本由 <a href="http://www.qiniu.com" target="qiniu">七牛云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="http://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script><script type="text/javascript" src="http://ad.topthink.com/Public/static/client.js"></script><thinkad id="ad_bd568ce7058a1091"></thinkad>';
		return $this->fetch();
	}

    public function demo(){
        echo 'Hello World';
    }
	
	public function swooleConn(){
		//创建websocket服务器对象，监听0.0.0.0:9502端口
		$ws = new swoole_websocket_server("0.0.0.0", 2000);

		//监听WebSocket连接打开事件
		$ws->on('open', function ($ws, $request) {
			var_dump($request->fd, $request->get, $request->server);
			$datas = array('msg'=>md5(rand(0,99999)),'name'=>chr(mt_rand(97,122)).$request->fd,'index'=>rand(0,1));
			$ws->push($request->fd,json_encode($datas));
		});

		//监听WebSocket消息事件
		$ws->on('message', function ($ws, $frame) {
			echo "Message: {$frame->data}\n";
			$ws->push($frame->fd, "server: {$frame->data}");
		});

		//监听WebSocket连接关闭事件
		$ws->on('close', function ($ws, $fd) {
			echo "client-{$fd} is closed\n";
		});

		$ws->start();

	}
}
