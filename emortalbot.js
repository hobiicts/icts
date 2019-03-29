const { Client, Util } = require("discord.js");
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const client = new Client
const prefix = ";";
const queue = new Map();
const youtube = new YouTube(process.env.YTTOKEN);

client.on("ready", () => {
  console.log(`EmortalBot has started. USERS = ${client.users.size}, CHANNELS = ${client.channels.size}, GUILDS = ${client.guilds.size}`);
  client.user.setActivity(`;help | Serving *${client.guilds.size}* servers`);
});

client.on("guildCreate", () => {
  console.log(`Joined server. USERS = ${client.users.size}, CHANNELS = ${client.channels.size}, GUILDS = ${client.guilds.size}`);
  client.user.setActivity(`;help | Serving *${client.guilds.size}* servers`);
});

client.on("guildDelete", () => {
  console.log(`Left server. USERS = ${client.users.size}, CHANNELS = ${client.channels.size}, GUILDS = ${client.guilds.size}`);
  client.user.setActivity(`;help | Serving *${client.guilds.size}* servers`);
});

client.on("message", async message => {
  if (message.author.bot || message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const playargs = message.content.split(' ');
  const searchString = args.slice(1).join(' ');
  const command = args.shift().toLowerCase();
  const serverQueue = queue.get(message.guild.id);
  const url = playargs[1] ? playargs[1].replace(/<(.+)>/g, '$1') : '';

  if (command === "ping") {
    const m = await message.channel.send(":x: CaLcUlAtInG 0_o");
    m.edit(`**Pong!**\n:arrows_counterclockwise: Roundtrip Latency: **${m.createdTimestamp - message.createdTimestamp}ms.**\n🖥️ Discord API Latency: **${Math.round(client.ping)}ms**`)
  };
  if (command === "say") {
    const sayMessage = args.join(" ");
    message.delete();
    message.channel.send(sayMessage);
  };
  if (command === "kick") {
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply(":x: You do not have permission to use this command.");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member) return message.reply("**Command args:** ;kick <User (Name/Mention)> <Reason (Optional)>");
    if(!member.kickable) return message.reply(":x: I cannot kick this user. This may be because I do not have enough permissions, or they have a higher role than me.");
    let reason = args.slice(1).join(' ');
    if (!reason) reason = "No reason provided";
    await member.kick(reason).catch(error => message.reply(`An error occured. **${error}**`));

    const embed = new Discord.RichEmbed()
      .setTitle("Ban")
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColour(RANDOM)
      .setDescription("✅ Kick was successfull!")
      .setFooter("EmortalBOT | Created by NathIsEmortal#6187 | [Support Server](https://discord.gg/tVDgBFQ)")
      .setTimestamp()
      .addField("**Kicked User**", member.username, true)
      .addField("**Kicked By**", message.author.username, true)

    message.channel.send({embed});
  };
  if (command === "ban") {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply(":x: You do not have permission to use this command.");
    let member = message.mentions.members.first();
    if(!member) return message.reply("**Command args:** ;ban <User (Mention)> <Reason (Optional)>");
    if (!member.bannable) return message.reply(":x: I cannot ban this user. This may be because I do not have enough permissions, or they have a higher role than me.");
    let reason = args.slice(1).join(' ');
    if (!reason) reason = "No reason provided";
    await member.kick(reason).catch(error => message.reply(`An error occured. :arrow_right: **${error}**`));

    const embed = new Discord.RichEmbed()
      .setTitle("Ban")
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColour(RANDOM)
      .setDescription("✅ Ban was successfull!")
      .setFooter("EmortalBOT | Created by NathIsEmortal#6187 | [Support Server](https://discord.gg/tVDgBFQ)")
      .setTimestamp()
      .addField("**Banned User**", member.username, true)
      .addField("**Banned By**", message.author.username, true)

    message.channel.send({embed});
  };
  if (command === "purge") {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(":x: You do not have permission to use this command.");
    const deleteCount = parseInt(args[0], 10);
    if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply("Provide a number between **2** and **100**.");
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched).catch(error => message.reply(`An error occured. **${error}**`));
  };
  if (command === "tableflip") message.channel.send(`(╯°□°）╯︵ ┻━┻`);
  if (command === "unflip") message.channel.send(`┬─┬ ノ( ゜-゜ノ)`);
  if (command === "id") {
    let member = message.mentions.members.first()
    if (!member) return message.channel.send("Command args: ;id @NathIsEmortal#6187");
    message.channel.send(member.id);
  };
  if (command === "8ball") {
    let answers = ["It is certain.", "It is decidedly so.", "Without a doubt", "Yes - definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't Count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
    let number = Math.floor(Math.random() * 20) + 1;
    message.channel.send(answers[number]);
  };
  if (command === "coinflip") {
    let answers = ["Tails!", "Heads!"];
    let number = Math.floor(Math.random() * 2) + 1;
    message.channel.send(answers[number]);
  };
  if (command === "suggest") {
    const userid = "261498586611712000";
    let sText = args.join(" ");
    if (!sText) return message.channel.send("Command args: ;suggest <suggestion text>");
    client.fetchUser(userid)
      .then(user => {user.send(`Suggestion From ${message.author.username} - ${message.author.id}:\n${sText}`)})
      .catch(error => message.reply(`An error occured. **${error}**`));
  };
  if (command === "bugreport") {
    const userid = "261498586611712000";
    let rText = args.join(" ");
    if (!rText) return message.channel.send("Command args: ;report <bug report>");
    client.fetchUser(userid)
      .then(user => {user.send(`Bug report From ${message.author.username} - ${message.author.id}:\n${rText}`)})
      .catch(error => message.reply(`An error occured. **${error}**`));
  };
  if (command === "website") {
    message.channel.send("https://sites.google.com/view/emortalbot/home");
  };
  if (command === "help") {
    message.channel.send("https://sites.google.com/view/emortalbot/commands")
  }
  if (command === 'play') {
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send(':x: You must be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send(':x: I cannot connect to your voice channel!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send(':x: I cannot speak in this voice channel!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

**Please provide a number between 1 and 10 to select a video**
					`);

					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send(':x: No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send(':x: I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
	}
  if (command === "stop") {
    if (!message.member.voiceChannel) return message.channel.send(':x: You are not in a voice channel!');
		if (!serverQueue) return message.channel.send(':x: There is nothing playing that I could stop.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end(':octagonal_sign: Stop command has been used!');
    message.channel.send(`:octagonal_sign: Stopped!`);
		return undefined;
  };
  if (command === "skip") {
    if (!message.member.voiceChannel) return message.reply(":x: You are not in a Voice Channel!");
    if (!serverQueue) return message.reply(`:x: There is nothing to skip!`);
    serverQueue.connection.dispatcher.end();
    message.channel.send(`:track_next: Skipped!`)
  };
  if (command === "np") {
    if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
  };
  if (command === "queue") {
    if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
    `)
  };
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`:x: I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`:x: I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Now playing: **${song.title}**`);
}

client.login(process.env.TOKEN);
