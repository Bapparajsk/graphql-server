import {sendOTPInEmail} from "../src/lib/bullmq/producer";

const init = async () => {
    await sendOTPInEmail({
        email: "bappa@gmail.com",
        otp: "123456"
    });
};

init();
