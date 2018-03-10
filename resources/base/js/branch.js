/**
 * Created by Txm on 2017/12/9.
 * 处理分支小说
 */

// 判断是否为选项
function isOption(chat) {
    let nextId = chat.next_chat_ids;
    return nextId && nextId.split(",").length === 1;
}

function isEnd(chat) {
    return chat.next_chat_ids == -1;
}
// 判断是否是头节点


class Branch {
    constructor(chats) {
        this.chats = chats;

        let chatIds = [];
        let headIds = [];

        this.chats.forEach((item)=>{
            let id = (item.id || index) + "";
            chatIds.push(id);

            let nextId = item.next_chat_ids;
            if (nextId && nextId != -1){
                headIds.push(nextId);
            }
        });

        this.chatIds = chatIds;
        this.headIds = headIds;

        this.nodes = [];
        this.branchOptions = [];
    }

    isHead(chat) {
        return chat && this.headIds.indexOf(chat.id + "") > -1;
    }

    // 根据选项的id加载后续的内容
    getChapter(headId) {
        let chatIds = this.chatIds,
            chats   = this.chats;

        // 注意数据类型
        let start = headId ? chatIds.indexOf(headId + "") : 0,
            i     = start,
            len   = chats.length,
            end   = len;
        for (; i < chats.length; ++i) {
            let item = chats[i],
                ids  = item.next_chat_ids;
            if (ids) {
                // 结束
                if (parseInt(ids, 10) === -1) {
                    end = Math.min(i + 1, len - 1);
                    break
                }

                ids = ids.split(",");

                if (ids.length === 1) {
                    let j = i;

                    // 分支选项之间连续
                    while (isOption(chats[j])) {
                        let option = chats[j];
                        option.isBranchOption = true;

                        this.branchOptions.push(option);
                        j++;

                        if(this.isHead(chats[j])){
                            break;
                        }
                    }

                    end = j;
                    break;
                }
            }
        }

        let chapter = chats.slice(start, end);

        return this.formatChapter(chapter);
    }
    getBranchOptions(){
        return this.branchOptions;
    }
    // 获取一段内容后，提取内容和选项
    formatChapter(nodes){
        let options = this.branchOptions;

        let len = nodes.length;
        let optionIndex = len - options.length;
        let chats = nodes.slice(0, optionIndex);

        if(options.length){
            // 正在进行选项的角色占位数据，当选择之后会用选择的数据进行替换
            let placeholder = Object.assign({}, options[0]);

            placeholder.content = "..."
            placeholder.isLoading = true;

            chats.push(placeholder)
        }

        return chats;
    }

    // 选择分支后
    afterChoice(checkedItem) {
        this.branchOptions = [];
    }

    // 重新阅读
    reset() {
        return this.getChapter();
    }
}

module.exports = (chats) => {
    return new Branch(chats);
}