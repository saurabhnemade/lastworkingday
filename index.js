var email = require('emailjs'),
    fs = require('fs'),
    commandLineArgs = require('command-line-args'),
    getUsage = require('command-line-usage');

var optionDefinition = [
  { name: 'messageFile', alias: 'm', type: String, multiple: false},
  { name: 'from', alias: 'f', type: String, multiple: false },
  { name: 'toFile', alias: 't', type: String, multiple: false },
  { name: 'replyTo', alias: 'r', type: String },
  { name: 'subject', alias: 's', type: String },
  { name: 'smtp', alias: 'e', type: String }
];

const sections = [
  {
    header: 'Last Day Email Sender',
    content: 'A very simple utitlity to send email on Last day of work'
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'messageFile',
        alias: 'm',
        description: 'File containing text of email you want to send',
        type: String
      },
      {
        name: 'from',
        alias: 'f',
        description: 'Email id from which you want to send email',
        type: String
      },
      {
        name: 'toFile',
        alias: 't',
        description: 'File containing email addresses separated by comma to which email need to be send',
        type: String
      },
      {
        name: 'replyTo',
        alias: 'r',
        description: 'Reply-To header of email address. Multiple allowed with comma seprator',
        type: String
      },
      {
        name: 'subject',
        alias: 's',
        description: 'Subject of email',
        type: String
      },
      {
        name: 'smtp',
        alias: 'e',
        description: 'A valid smtp server from which email need to be sent',
        type: String
      }
    ]
  }
];

const usage = getUsage(sections);

var options = commandLineArgs(optionDefinition);

if(options.hasOwnProperty('messageFile') == false ||
   options.hasOwnProperty('from') == false ||
   options.hasOwnProperty('toFile') == false ||
   options.hasOwnProperty('replyTo') == false ||
   options.hasOwnProperty('subject') == false ||
   options.hasOwnProperty('smtp') == false){
   console.log(usage);
   process.exit(1);
}

if(fileExists(options.messageFile) == false){
  console.log(usage);
  throw new Error("messageFile: " + options.messageFile + " does not exists");
  process.exit(1);
}

if(fileExists(options.toFile) == false){
  console.log(usage);
  throw new Error("toFile: " + options.toFile + " does not exists");
  process.exit(1);
}

var message = fs.readFileSync(options.messageFile).toString();
var to = fs.readFileSync(options.toFile).toString();

var server = email.server.connect({
  host: options.smtp,
  ssl: false
});


server.send({
  //"text": message,
  attachment:
   [
      {data:message, alternative:true},
   ],
  "from": options.from,
  "to": to,
  "reply-to" : options.replyTo,
  "subject": options.subject,
}, function(err, message){
  if(err){
    console.log('Error occured');
    console.log(err);
    process.exit(1);
  }
  else{
    console.log('Email Sent Successfully...');
  }
});


function fileExists(filePath)
{
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}
