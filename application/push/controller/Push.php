<?php
namespace app\push\controller;
use think\Controller;

use Workerman\Worker;
use GatewayWorker\Register;
use GatewayWorker\BusinessWorker;
//use GatewayWorker\Gateway;
use GatewayWorker\Lib\Gateway;
//控制器无需继承Controller
class Push extends Controller{

    public function index()
    {
        echo "Hello World;";
    }   

    public function hello () {
        $uid = $_GET['uid'];
        session('uid', $uid);

        return $this->fetch();
    }

    public function BindClientId () {
        
        $client_id = $_POST['client_id'];
        // 设置GatewayWorker服务的Register服务ip和端口，请根据实际情况改成实际值
		//$foo = new \first\second\Foo();
        Gateway::$registerAddress = '118.24.45.90:2000';

        $group_id = session('uid');
        // 假设用户已经登录，用户uid和群组id在session中
        // client_id与uid绑定
        //Gateway::bindUid($client_id, $bindUid.'hello');
        $message = ['code'=>2,'data'=>'成功推送'];
        // 加入某个群组（可调用多次加入多个群组）
        //Gateway::joinGroup($client_id, $group_id);
        Gateway::sendToClient($client_id, json_encode($message));
    }

    public function AjaxSendMessage () {
        $message = $_POST['message'];
        // 设置GatewayWorker服务的Register服务ip和端口，请根据实际情况改成实际值
        Gateway::$registerAddress = '118.24.45.90:8285';
        $group_id = session('uid');
        $message = ['code'=>2,'data'=>'成功推送'];
        //Gateway::sendToGroup($group_id,json_encode($message));

        GateWay::sendToAll(json_encode($message));
    }
}