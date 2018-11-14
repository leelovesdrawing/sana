
const Discord = require('discord.js');
const economy = require('discord-eco');
const fs = require('fs'); // Make sure you call the fs file


const client = new Discord.Client();

const modRole = 'MOMMY MOMO^^';


const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));

// This will run when a message is recieved...
client.on('message', message => {

    
    let prefix = '.';
    let msg = message.content.toUpperCase();
    
    let cont = message.content.slice(prefix.length).split(" "); // This slices off the prefix, then stores everything after that in an array split by spaces.
    let args = cont.slice(1); // This removes the command part of the message, only leaving the words after it seperated by spaces

    

    
    if (msg.startsWith(`${prefix}BUY`)) { // We need to make a JSON file that contains the items

        
        let categories = []; // Lets define categories as an empty array so we can add to it.

        
        if (!args.join(" ")) { // Run if no item specified...

            
            for (var i in items) { // We can do this by creating a for loop.

                
                if (!categories.includes(items[i].type)) {
                    categories.push(items[i].type)
                }

            }

            
            const embed = new Discord.RichEmbed()
                .setDescription(`Available Items`)
                .setColor(0xFEB5FF)

            for (var i = 0; i < categories.length; i++) { // This runs off of how many categories there are. - MAKE SURE YOU DELETE THAT = IF YOU ADDED IT.

                var tempDesc = '';

                for (var c in items) { // This runs off of all commands
                    if (categories[i] === items[c].type) {

                        tempDesc += `${items[c].name} - $${items[c].price} - ${items[c].desc}\n`; // Remember that \n means newline

                    }

                }

                // Then after it adds all the items from that category, add it to the embed
                embed.addField(categories[i], tempDesc);

            }

            // Now we need to send the message, make sure it is out of the for loop.
            return message.channel.send({
                embed
            }); // Lets also return here.

            // Lets test it! x2

        }

        // Buying the item.

        // Item Info
        let itemName = '';
        let itemPrice = 0;
        let itemDesc = '';

        for (var i in items) { // Make sure you have the correct syntax for this.
            if (args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) { // If item is found, run this...
                itemName = items[i].name;
                itemPrice = items[i].price;
                itemDesc = items[i].desc;
            }
        }

        // If the item wasn't found, itemName won't be defined
        if (itemName === '') {
            return message.channel.send(`**Item ${args.join(" ").trim()} not found.**`)
        }

        // Now, lets check if they have enough money.
        economy.fetchBalance(message.author.id + message.guild.id).then((i) => { // Lets fix a few errors - If you use the unique guild thing, do this.
            if (i.money <= itemPrice) { // It's supposed to be like this instead...

                return message.channel.send(`**I Am Sorry But, You don't have enough Sana Coins for this item.**`);
            }

            economy.updateBalance(message.author.id + message.guild.id, parseInt(`-${itemPrice}`)).then((i) => {

                message.channel.send('**You bought ' + itemName + '!**');

                // You can have IF statements here to run something when they buy an item.
                if (itemName === 'Black Role') {
                    message.guild.members.get(message.author.id).addRole(message.guild.roles.find("name", "Black")); // For example, when they buy the helper role it will give them the helper role.
                }

            })

        })

    }

    // Ping - Let's create a quick command to make sure everything is working!
    if (message.content.toUpperCase() === `${prefix}SANAPING`) {
        message.channel.send('**IVE BEEN PINGED!!**');
    }

    // Add / Remove Money For Admins
    if (msg.startsWith(`${prefix}SANAADD`)) {

        // Check if they have the modRole
        if (!message.member.roles.find("name", modRole)) { // Run if they dont have role...
            message.channel.send('**You need the role `' + modRole + '` to use this command...**');
            return;
        }

        // Check if they defined an amount
        if (!args[0]) {
            message.channel.send(`**You need to define an amount. Usage: ${prefix}SANASET <amount> <user>**`);
            return;
        }

        // We should also make sure that args[0] is a number
        if (isNaN(args[0])) {
            message.channel.send(`**The amount has to be a number. Usage: ${prefix}SANABAL <amount> <user>**`);
            return; // Remember to return if you are sending an error message! So the rest of the code doesn't run.
        }

        // Check if they defined a user
        let defineduser = '';
        if (!args[1]) { // If they didn't define anyone, set it to their own.
            defineduser = message.author.id;
        } else { // Run this if they did define someone...
            let firstMentioned = message.mentions.users.first();
            defineduser = firstMentioned.id;
        }

        // Finally, run this.. REMEMBER IF you are doing the guild-unique method, make sure you add the guild ID to the end,
        economy.updateBalance(defineduser + message.guild.id, parseInt(args[0])).then((i) => { // AND MAKE SURE YOU ALWAYS PARSE THE NUMBER YOU ARE ADDING AS AN INTEGER
            message.channel.send(`**User defined had ${args[0]} added/subtraction from their account.**`)
        });

    }

    // Balance & Money
    if (msg === `${prefix}SANABAL` || msg === `${prefix}SANACOINS`) { // This will run if the message is either ~BALANCE or ~MONEY

        // Additional Tip: If you want to make the values guild-unique, simply add + message.guild.id whenever you request.
        economy.fetchBalance(message.author.id + message.guild.id).then((i) => { // economy.fetchBalance grabs the userID, finds it, and puts the data with it into i.
            // Lets use an embed for This
            const embed = new Discord.RichEmbed()
                .setDescription(`**${message.guild.name} Sana Coins!**`)
                .setColor(0xFFD2B2) // You can set any HEX color if you put 0x before it.
                .addField('Sana Holder', message.author.username, true) // The TRUE makes the embed inline. Account Holder is the title, and message.author is the value
                .addField('Sana Balance', i.money, true)

            // Now we need to send the message
            message.channel.send({
                embed
            })

        })

    }

});

client.login(process.env.NTEyMTE2Mzg3MTc1NzI3MTIy.Ds00qw.j6qZ2-o1eGo-lYvWqUnA9uOqT70);
