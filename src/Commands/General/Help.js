const Command = require('../../Structures/Command')
const Message = require('../../Structures/Message')

module.exports = class command extends Command {
    constructor() {
        super('help', {
            description: "Displays the bot's usable commands",
            category: 'general',
            exp: 20,
            usage: 'help || help <command_name>',
            aliases: ['h'],
            cooldown: 10
        })
    }

    /**
     * @param {Message} M
     * @param {import('../../Handlers/Message').args} args
     * @returns {Promise<void>}
     */

    execute = async (M, args) => {
        const { context } = args
        if (!context) {
            const commands = Array.from(this.handler.commands, ([command, data]) => ({
                command,
                data
            }))
            let text = `šš» (šĻš) Konichiwa! *@${M.sender.jid.split('@')[0]}*, I'm ${
                this.helper.config.name
            }\nMy prefix is - "${this.helper.config.prefix}"\n\nThe usable commands are listed below.`
            const categories = []
            for (const command of commands) {
                if (command.data.config.category === 'dev') continue
                if (categories.includes(command.data.config.category)) continue
                categories.push(command.data.config.category)
            }
            for (const category of categories) {
                const categoryCommands = []
                const filteredCommands = commands.filter((command) => command.data.config.category === category)
                text += `\n\n*āāāā° ${this.helper.utils.capitalize(category)} ā±āāā*\n\n`
                filteredCommands.forEach((command) => categoryCommands.push(command.data.name))
                text += `\`\`\`${categoryCommands.join(', ')}\`\`\``
            }
            text += `\n\nš *Note:* Use ${this.helper.config.prefix}help <command_name> for more info of a specific command. Example: *${this.helper.config.prefix}help hello*`
            return void (await M.reply(text, 'text', undefined, undefined, undefined, [M.sender.jid]))
        } else {
            const cmd = context.trim().toLowerCase()
            const command = this.handler.commands.get(cmd) || this.handler.aliases.get(cmd)
            if (!command) return void M.reply(`No command found | *"${context.trim()}"*`)
            return void M.reply(
                `š *Command:* ${this.helper.utils.capitalize(command.name)}\nš“ *Aliases:* ${
                    !command.config.aliases
                        ? ''
                        : command.config.aliases.map((alias) => this.helper.utils.capitalize(alias)).join(', ')
                }\nš *Category:* ${this.helper.utils.capitalize(command.config.category)}\nā° *Cooldown:* ${
                    command.config.cooldown ?? 3
                }s\nš *Usage:* ${command.config.usage
                    .split('||')
                    .map((usage) => `${this.helper.config.prefix}${usage.trim()}`)
                    .join(' | ')}\nš§§ *Description:* ${command.config.description}`
            )
        }
    }
}
