const TelegramBot = require('node-telegram-bot-api');
const token = '7844172149:AAFS7z2EFzw6CiXFQBr_IM8TCTrjm43jZLc';  // 替换为你的机器人token

// 定义不同反馈类型的群组ID
const playGroupId = -2484631181; // 播放问题反馈群组
const subGroupId = -2468427572;  // 字幕问题反馈群组
const remGroupId = -2484631181;  // 催更请求反馈群组

const bot = new TelegramBot(token, {polling: true});

// 设置命令菜单
bot.setMyCommands([
    {command: '/start', description: '开始使用机器人'},
    {command: '/help', description: '查看帮助信息'},
    {command: '/play', description: '报告影片播放问题'},
    {command: '/sub', description: '报告缺少字幕'},
    {command: '/rem', description: '请求催更影片'}
]);

// 处理/start命令
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `欢迎使用反馈机器人！\n\n可用命令：\n/play - 报告播放问题\n/sub - 报告字幕缺失\n/rem - 请求催更\n/help - 查看帮助`;
    bot.sendMessage(chatId, welcomeMessage);
});

// 处理/help命令
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `使用说明：\n\n1. 播放问题反馈(/play)：\n请提供影片名称和错误代码\n\n2. 字幕缺失反馈(/sub)：\n请提供影片名称\n\n3. 催更请求(/rem)：\n请提供影片名称和集数`;
    bot.sendMessage(chatId, helpMessage);
});

// 处理/play命令
bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '请输入影片名称和错误代码，格式：影片名+错误代码');
    
    bot.once('message', (msg) => {
        if (msg.text.startsWith('/')) return;
        
        const userId = msg.from.id;
        const username = msg.from.username || '匿名用户';
        const reportTime = new Date().toLocaleString('zh-CN');
        const message = `播放问题报告\n提交时间: ${reportTime}\n用户ID: ${userId}\n用户名: @${username}\n内容: ${msg.text}`;
        
        bot.sendMessage(playGroupId, message)
            .then(() => {
                bot.sendMessage(chatId, '您的播放问题已成功发送给管理员，我们会尽快处理！');
            })
            .catch(error => {
                bot.sendMessage(chatId, '发送失败，请稍后重试');
                console.error('发送消息失败:', error);
            });
    });
});

// 处理/sub命令
bot.onText(/\/sub/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '请输入缺少字幕的影片名称');
    
    bot.once('message', (msg) => {
        if (msg.text.startsWith('/')) return;
        
        const userId = msg.from.id;
        const username = msg.from.username || '匿名用户';
        const reportTime = new Date().toLocaleString('zh-CN');
        const message = `字幕缺失报告\n提交时间: ${reportTime}\n用户ID: ${userId}\n用户名: @${username}\n内容: ${msg.text}`;
        
        bot.sendMessage(subGroupId, message)
            .then(() => {
                bot.sendMessage(chatId, '您的字幕缺失报告已成功发送给管理员，我们会尽快处理！');
            })
            .catch(error => {
                bot.sendMessage(chatId, '发送失败，请稍后重试');
                console.error('发送消息失败:', error);
            });
    });
});

// 处理/rem命令
bot.onText(/\/rem/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '请输入要催更的影片名称和集数，格式：影片名+集数');
    
    bot.once('message', (msg) => {
        if (msg.text.startsWith('/')) return;
        
        const userId = msg.from.id;
        const username = msg.from.username || '匿名用户';
        const reportTime = new Date().toLocaleString('zh-CN');
        const message = `催更请求\n提交时间: ${reportTime}\n用户ID: ${userId}\n用户名: @${username}\n内容: ${msg.text}`;
        
        bot.sendMessage(remGroupId, message)
            .then(() => {
                bot.sendMessage(chatId, '您的催更请求已成功发送给管理员，我们会尽快处理！');
            })
            .catch(error => {
                bot.sendMessage(chatId, '发送失败，请稍后重试');
                console.error('发送消息失败:', error);
            });
    });
});

// 错误处理
bot.on('polling_error', (error) => {
    console.error('Bot轮询错误:', error);
});

// 处理未知命令
bot.onText(/\/.*/, (msg) => {
    const command = msg.text.split(' ')[0];
    if (!['/start', '/help', '/play', '/sub', '/rem'].includes(command)) {
        bot.sendMessage(msg.chat.id, '未知命令，请使用 /help 查看可用命令');
    }
});