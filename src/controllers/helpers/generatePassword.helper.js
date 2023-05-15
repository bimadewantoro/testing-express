const generatePassword = () => {
    // Generate a random password with 8-12 characters using numbers, uppercase and lowercase letters.
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let password = '';
    for (let i = 0; i < 8 + Math.floor(Math.random() * 5); i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Ensure that password contains at least one number
    const regex = /\d/;
    if (!regex.test(password)) {
        password = password.slice(0, -1) + Math.floor(Math.random() * 10);
    }
    return password;
};

module.exports = generatePassword;