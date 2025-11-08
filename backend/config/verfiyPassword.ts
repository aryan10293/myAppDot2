import argon2 from "argon2";
// hashed equals the password from my database
// plaintext equals the password the user provides
const verifyPassword = async (hashedPassword:string, plainTextPassword:string) => {
    try {
        return  await argon2.verify(hashedPassword, plainTextPassword);;
    } catch (err) {
        console.log("wrong password", err);
        return false; 
        // Handle error
    }
};
export default verifyPassword;