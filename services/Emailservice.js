var request = require('request');
var EmailService = function(key) {
    var self = this;
    self.apiKey = key;
    getApiUrl = function (category, method, returnType) {
        var type = returnType || 'json';
        return 'https://mandrillapp.com/api/1.0/' + category + '/' + method + '.' + type;
    };
    self.sendTemplate = function(data, callback) {
        data.key = this.apiKey;
        console.log(getApiUrl('messages', 'send-template'));
        console.log(JSON.stringify(data));
        request.post({url: getApiUrl('messages', 'send-template'), form: data}, callback);
    }
    return this;
}
var MandrillEmailService = new EmailService('SAMCBFVD5NEqlo8gRTidSw');
module.exports =  MandrillEmailService;


