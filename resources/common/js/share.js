/**
 * Created by Txm on 2017/6/20.
 */


let $ = require("jquery");
let WhiteWhale = require("../../lib/whitewhale");

$(function () {

    let username = $("[name='username']").val(),
        usercode = $("[name='usercode']").val();

    // 分享
    let tencentOpts = {
        title: `${username}邀请你一起玩白鲸APP看对话小说`,
        desc: `注册请填邀请码${usercode}，送会员哦`,
        shareIcon: "http://img.duihua.doufu.la/weex/assets/common/app_icon.png",
        shareUrl: `http://duihua.doufu.la/webview/share_out_app?code=${usercode}`
    };

    let weiboOpts = {
        title: `${username}邀请你一起玩白鲸APP看对话小说`,
        desc: `看聊出来的好故事，玩#白鲸对话小说#（http://duihua.doufu.la/webview/share_out_app?code=${usercode}），注册后填我的邀请码，可以获得1天会员！你懂的(╭￣3￣)╭♡  @白鲸对话小说 `,
        shareIcon: "http://img.duihua.doufu.la/weex/assets/common/app_icon.png",
        shareUrl: `http://duihua.doufu.la/webview/share_out_app?code=${usercode}`
    };

    WhiteWhale.shareApp($(".invite_btn"), {
        shareToQQ: tencentOpts,
        shareToWechat: tencentOpts,
        shareToQZone: tencentOpts,
        shareToMoments: tencentOpts,

        shareToWeibo: weiboOpts
    });

});