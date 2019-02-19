class RegexPatterns {
    static phoneNumber() {
        return PHONE_NUMBER;
    }
}

const PHONE_NUMBER = '^[0-9]{11}$';

export default RegexPatterns;