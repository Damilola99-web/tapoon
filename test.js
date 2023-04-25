const axios = require('axios');

(async () => {
    const params = JSON.stringify({
        email: 'customer@email.com',
        amount: '20000',
    });

    const config = {
        headers: {
            Authorization:
                'Bearer sk_test_6ab42ca6540abb4b866242f32f6f86b48c9b39e9',
            'Content-Type': 'application/json',
        },
    };

   try {
    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        params,
        config
    );
    console.log(response.data);
   } catch (error) {
    console.log(error);
   }
})();
