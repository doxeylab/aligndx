export const TokenService = (length) => {
    const rand = () => {
        return Math.random(0).toString(36).substr(2);
    }

    var token_gen = (rand()+rand()+rand()+rand()).substr(0,length);

    return token_gen
};