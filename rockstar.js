const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
var config = require('./config.json')
let token = config.token
client.commands = new Discord.Collection()


/////CONNECT TO FOLDER COMMANDS
fs.readdir('./commands', (err,files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(`.`).pop() === 'js')
    if (jsfile.length <= 0) return console.log('Команды не найдены!')

    console.log(`Loading ${jsfile.length} commands`)
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`)
        client.commands.set(props.help.name, props)
    })
})

/////STATUS BOT
client.on("ready", () => {
    client.login(config.token);
    console.log(`Готов работать! ${client.user.tag}`)
    client.user.setStatus("online");
    client.user.setActivity("Visual Studio Code", {type: `PLAYING`})
});

/////DISCONNECT TO THE CHANNEL
client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.find(ch => ch.name === '🎅│общий-чат');
    //const channel = member.guild.channels.find(ch => ch.name === '📖│logs');
    if (!channel) return;

    let disconnect = new Discord.RichEmbed()
    .addField('**THE PARTICIPANT LEFTT:**' ,`**К сожалению нас покинул один из участник!\nВозращайся скорее, мы будет тебя ждать**`)
    .addField('**Участник**', `${member}`)
    .addField(`**ID**`, `**${member.id}**`)
    .setColor(0xFF0000)
    channel.send({embed: disconnect}); 
});

/////WELCOME TO THE CHANNEL
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === '🎅│общий-чат');
    //const channel = member.guild.channels.find(ch => ch.name === '📖│logs');
    if (!channel) return;

    let invite = new Discord.RichEmbed()
    .addField('**NEW PARTICIPANT:**' ,`**К нам присоеденился новый пользователь!\nПривет, мы рады тебя видеть у нас на сервере, надеемся что тебе тут все понравится и ты будет счастлив**`)
    .addField('**Участник:**', `${member}`)
    .addField(`**ID**`, `**${member.id}**`)
    .setColor(0xFF0000)
    channel.send({embed: invite}); 
    member.addRole(`682555475283410995`);
}); 

/////MY AVATAR
client.on('message', message => {
    let prefix = config.prefix
    let messageArray = message.content.split(' ')
    let command = messageArray[0]
    let args = messageArray.slice(1)

    let command_file = client.commands.get(command.slice(prefix.length))
    if  (command_file) command_file.run(client, message, args)

    if (message.content.startsWith(prefix + 'my_avatar')) {
        message.reply(message.author.avatarURL);
    }
});



client.login(config.token)