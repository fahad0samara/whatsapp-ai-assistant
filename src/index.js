const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create WhatsApp client
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// Generate QR Code
client.on('qr', (qr) => {
    console.log('QR Code received. Please scan with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Ready event
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Handle incoming messages
client.on('message', async msg => {
    // Get the sender's information
    const contact = await msg.getContact();
    console.log(`Message from ${contact.pushname || 'Unknown'}: ${msg.body}`);

    // Check if message starts with !
    if (msg.body.startsWith('!')) {
        const command = msg.body.slice(1).toLowerCase(); // Remove ! and convert to lowercase

        // Handle different commands
        switch(command) {
            case 'help':
                await msg.reply(
                    'Available commands:\n' +
                    '!help - Show this help message\n' +
                    '!hello - Get a greeting\n' +
                    '!time - Get current time\n' +
                    '!joke - Get a joke\n' +
                    '!quote - Get an inspirational quote'
                );
                break;

            case 'hello':
                await msg.reply(`Hello ${contact.pushname || 'there'}! 👋`);
                break;

            case 'time':
                const now = new Date();
                await msg.reply(`Current time is: ${now.toLocaleString()}`);
                break;

            case 'joke':
                const jokes = [
                    "Why don't programmers like nature? It has too many bugs! 🐛",
                    "Why did the programmer quit his job? Because he didn't get arrays! 😄",
                    "What's a programmer's favorite place? The Cookie Store! 🍪",
                    "Why do programmers prefer dark mode? Because light attracts bugs! 🌑"
                ];
                const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
                await msg.reply(randomJoke);
                break;

            case 'quote':
                const quotes = [
                    "The only way to do great work is to love what you do. - Steve Jobs",
                    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                    "Stay hungry, stay foolish. - Steve Jobs",
                    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
                ];
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                await msg.reply(randomQuote);
                break;

            default:
                await msg.reply("Unknown command. Type !help to see available commands!");
        }
    }
});

// Error handling
client.on('auth_failure', msg => {
    console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
});

// Initialize client
console.log('Starting WhatsApp client...');
try {
    client.initialize();
} catch (error) {
    console.error('Failed to initialize client:', error);
}
