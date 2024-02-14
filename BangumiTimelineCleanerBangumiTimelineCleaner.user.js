// ==UserScript==
// @name         BangumiTimelineCleaner
// @namespace    https://github.com/Adachi-Git/BangumiTimelineCleaner
// @version      0.1
// @description  删除页面中所有时间线记录
// @author       Adachi
// @match *://bangumi.tv/user/*/timeline
// @match *://bgm.tv/user/*/timeline
// @match *://chii.in/user/*/timeline
// @grant        none
// @license MIT

// ==/UserScript==
(function() {
    'use strict';

    // 提取页面中的 gh 参数值
    var gh = window.location.href.match(/gh=([^&]+)/);
    gh = gh ? gh[1] : ''; // 如果匹配到 gh 参数，则提取其值，否则为空字符串

    // 创建一个按钮元素
    var deleteTimelineButton = document.createElement('button');
    deleteTimelineButton.textContent = '删除时间线记录';
    deleteTimelineButton.style.position = 'fixed';
    deleteTimelineButton.style.top = '10px';
    deleteTimelineButton.style.left = '10px';
    deleteTimelineButton.style.zIndex = '9999';

    // 将按钮添加到页面上
    document.body.appendChild(deleteTimelineButton);

    // 添加点击事件监听器
    deleteTimelineButton.addEventListener('click', function() {
        // 弹出确认对话框
        var confirmDelete = confirm('确定要开始删除时间线条目吗？');
        if (confirmDelete) {
            // 获取当前页面的 Referer 并提取 Host
            var host = window.location.hostname;

            // 提取当前页面的所有 Cookie
            var cookies = document.cookie;

            // 获取当前浏览器的 User-Agent
            var userAgent = navigator.userAgent;

            // 查找所有带有类名为 "tml_del" 的删除按钮
            var deleteButtons = document.querySelectorAll('.tml_del');

            var counter = 0;

            // 遍历每个删除按钮
            function deleteTimeline() {
                if (counter < deleteButtons.length) {
                    var button = deleteButtons[counter];
                    var tmlid = button.id.split('_')[1];

                    // 发送确认删除请求
                    fetch(button.href + '?gh=' + gh + '&ajax=1', {
                        method: 'GET',
                        headers: {
                            'Accept': '*/*',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Accept-Language': 'zh-CN,zh;q=0.9',
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Cookie': cookies,
                            'Host': host,
                            'Referer': window.location.href,
                            'Sec-Fetch-Dest': 'empty',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Site': 'same-origin',
                            'User-Agent': userAgent,
                            'X-Requested-With': 'XMLHttpRequest',
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('确认删除请求失败');
                        }
                        console.log('时间线条目删除成功:', tmlid); // 打印删除成功的时间线条目的 tmlid
                        counter++;
                        if (counter % 10 === 0) {
                            setTimeout(deleteTimeline, 1000); // 每删10次停止一秒
                        } else {
                            deleteTimeline();
                        }
                    })
                    .catch(error => {
                        console.error('确认删除请求错误:', error);
                        // 如果删除请求出错，则尝试重新删除
                        deleteTimeline();
                    });
                }
            }

            deleteTimeline();
        }
    });

})();
