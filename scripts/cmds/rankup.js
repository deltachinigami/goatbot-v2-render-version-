const deltaNext = global.GoatBot.configCommands.envCommands.rank.deltaNext;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
const { drive } = global.utils;

module.exports = {
	config: {
		name: "rankup",
		version: "1.2",
		author: "NTKhang", // edited by Elohime hatake
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Bật/tắt thông báo level up",
			en: "Turn on/off level up notification"
		},
		longDescription: {
			vi: "Bật/tắt thông báo level up",
			en: "Turn on/off level up notification"
		},
		category: "rank",
		guide: {
			en: "{pn} [on | off]"
		},
		envConfig: {
			deltaNext: 5
		}
	},

	langs: {
		vi: {
			syntaxError: "Sai cú pháp, chỉ có thể dùng {pn} on hoặc {pn} off",
			turnedOn: "Đã bật thông báo level up",
			turnedOff: "Đã tắt thông báo level up",
			notiMessage: "🎉🎉 chúc mừng bạn đạt level %1"
		},
		en: {
			syntaxError: "𝐬𝐲𝐧𝐭𝐚𝐱 𝐞𝐫𝐫𝐨𝐫, 𝐨𝐧𝐥𝐲 𝐮𝐬𝐞 {pn} 𝐨𝐧 𝐨𝐫 {pn} 𝐨𝐟𝐟",
			turnedOn: "✅| 𝐭𝐮𝐫𝐧𝐞𝐝 𝐨𝐧 𝐥𝐞𝐯𝐞𝐥 𝐮𝐩 𝐧𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧",
			turnedOff: "❎| 𝐭𝐮𝐫𝐧𝐞𝐝 𝐨𝐟𝐟 𝐥𝐞𝐯𝐞𝐥 𝐮𝐩 𝐧𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧",
			notiMessage: " 𝐦𝐨𝐧 𝐦𝐚î𝐭𝐫𝐞 𝐞𝐥𝐨𝐡𝐢𝐦𝐞 𝐭𝐞 𝐝𝐢𝐬 𝐟𝐞𝐥𝐢𝐜𝐢𝐭𝐚𝐭𝐢𝐨𝐧 🎊🎉, 𝐭'𝐞𝐬 𝐩𝐚𝐬𝐬é 𝐚𝐮 𝐧𝐢𝐯𝐞𝐚𝐮 %1"
		}
	},

	onStart: async function ({ message, event, threadsData, args, getLang }) {
		if (!["on", "off"].includes(args[0]))
			return message.reply(getLang("syntaxError"));
		await threadsData.set(event.threadID, args[0] == "on", "settings.sendRankupMessage");
		return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
	},

	onChat: async function ({ threadsData, usersData, event, message, getLang }) {
		const threadData = await threadsData.get(event.threadID);
		const sendRankupMessage = threadData.settings.sendRankupMessage;
		if (!sendRankupMessage)
			return;
		const { exp } = await usersData.get(event.senderID);
		const currentLevel = expToLevel(exp);
		if (currentLevel > expToLevel(exp - 1)) {
			const forMessage = {
				body: getLang("notiMessage", currentLevel)
			};
			if (threadData.data.rankup?.attachments?.length > 0) {
				const files = threadData.data.rankup.attachments;
				const attachments = files.reduce((acc, file) => {
					acc.push(drive.getFile(file, "stream"));
					return acc;
				}, []);
				forMessage.attachment = (await Promise.allSettled(attachments))
					.filter(({ status }) => status == "fulfilled")
					.map(({ value }) => value);
			}
			message.reply(forMessage);
		}
	}
};
