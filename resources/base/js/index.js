/**
 * Created by Txm on 2017/12/13.
 */

let Sys = require("../../common/js/system-config")

Promise.all([
    Sys.import("vue"),
    Sys.import("jquery"),
    Sys.import("clipboard"),
    Sys.import("layer")
]).then(([Vue, $, Clipboard, layer]) => {
    let getBranch = require("./branch")
    Sys.import("velocity");
    let chatModel = {
        getChats(params) {
            return $.get(`/webview/api/getSharedChats`, params);
        }
    };
    let recordModel = {
        key: 'activityNovel',
        getAll(){
            let record = localStorage.getItem(this.key)
            record = record && JSON.parse(record) || {};
            return record
        },
        setItem(novelId){
            let record = this.getAll()
            record[novelId] = 1;
            localStorage.setItem(this.key, JSON.stringify(record))
        },
        getItem(novelId){
            let record = this.getAll()
            return record[novelId]
        }
    }

    let vm = new Vue({
        el: "#J_wrap",
        data(){
            return {
                novelId: SCOPE.novelId,
                isLimit: SCOPE.isLimit,
                chapterNodes: [],
                branch: {},

                nodes: [], // 展示的对话
                branchOptions: [],

                isOptionsVisible: false, // 底部选项栏
                isToastVisible: false, // 弹出框
                isGuideVisible: true, // 引导图

                isReadEnd: false, // 支线是否阅读完毕
            }
        },
        mounted(){
            let novelId = this.novelId;

            if (this.isLimit && recordModel.getItem(novelId)){
                // 只能阅读一次
                this.hideGuide()
                this.isToastVisible = true
            }else {
                this.getData().then(res => {
                    this.initBranch();

                    this.$nextTick(() => {
                        this.listen()
                    })
                })
            }
        },
        methods: {
            getData(){
                let params = {
                    novelId: this.novelId,
                };

                return chatModel.getChats(params).then(res => {
                    let data = res.data;
                    this.chapterNodes = data.novel;
                })
            },
            initBranch(){
                this.branch = getBranch(this.chapterNodes);

                this.nodes = this.branch.getChapter();

                this.branchOptions = this.branch.getBranchOptions();

            },

            formatContent(content, index){
                // 预览换行符
                let res = content.replace(/[\r\n]/g, "<br>");

                // 替换图片资源路径
                if (/\.(png|jpg|jpeg|gif)$/i.test(res)) {
                    res = `<img style="max-width: 14rem" src="http://img.duihua.doufu.la/${(res)}" />`;
                }
                return res;
            },

            choiceBranch(item){
                this.isOptionsVisible = false;

                let ids = item.next_chat_ids;

                if (ids && item.isBranchOption) {
                    this.branch.afterChoice(item);

                    let nextChapter = this.branch.getChapter(ids);
                    let length = nextChapter.length;

                    if (length){
                        if (parseInt(nextChapter[length - 1].next_chat_ids) === -1){
                            this.isReadEnd = true;
                        }

                        let len = this.nodes.length;

                        this.nodes[len - 1] = item;
                        this.nodes = this.nodes.concat(nextChapter);

                        let options =  this.branch.getBranchOptions();

                        this.branchOptions = options;

                        if (options.length === 1){
                            this.choiceBranch(options[0]);
                        }
                    }
                }
            },
            reset(){
                this.nodes = this.branch.reset();
            },

            // 切换弹窗
            closeToast(){
                this.isToastVisible = false;
            },

            // 隐藏引导图
            hideGuide(){
                if( this.isGuideVisible){
                    this.isGuideVisible = false;
                }
            },

            scroll(){

            },
            listen(){
                // todo 从 jquery 迁移到 Vue
                let $toast  = $(".toast"),
                    $invite = $(".invite"),
                    $window = $(window);

                let $page = $("#J_wrap");

                let index = 1;

                const DURATION = 300;
                // 关闭引导图
                function hideGuide() {
                    $(".guide").addClass("hide");
                }

                $page.on("click", ()=>{
                    this.hideGuide();

                    if ($page.hasClass("velocity-animating") || this.isOptionsVisible) {
                        return;
                    }

                    // todo 性能
                    let $listItem = $(".list_item");
                    let $item = $listItem.eq(index);

                    if (index === this.nodes.length - 1){
                        if(this.isReadEnd){
                            this.isToastVisible = true

                            // 活动小说只能一次
                            if (this.isLimit){
                                recordModel.setItem(this.novelId)
                            }
                        }

                        this.isOptionsVisible = true;
                    }

                    //=====动画====//
                    $item.css({
                        display: 'flex',
                        opacity: '0'
                    });

                    let delta = $page.outerHeight() - $window.height();
                    if (delta > 0) {
                        $page.velocity('scroll', {
                            offset: Math.ceil(delta),
                            duration: DURATION,
                            complete: function () {
                                $item.velocity({
                                    'opacity': 1
                                }, DURATION);
                            }
                        });
                    } else {
                        // 前几个不需要滚动的元素
                        $item.velocity({
                            'opacity': 1
                        }, DURATION);
                    }

                    index++;
                });
            }
        },
    });

    let clipboard = new Clipboard('#J_copy',{
        text: function text() {
            return $("#J_inviteNum").text();
        }
    });

    clipboard.on("success", e=>{
        layer.msg(`复制成功`);
    });

    // clipboard.on("error", e=>{
    //     console.log("复制失败");
    // })
})

