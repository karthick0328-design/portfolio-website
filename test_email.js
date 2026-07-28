const http = require('https');

const data = JSON.stringify({
    service_id: 'service_7zhwkid',
    template_id: 'template_wcjq1db',
    user_id: 'A0ZK2jOkKkHNn09hb', // public key
    template_params: {
        user_name: 'Agent Test',
        user_email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message body'
    }
});

const options = {
    hostname: 'api.emailjs.com',
    port: 443,
    path: '/api/v1.0/email/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
