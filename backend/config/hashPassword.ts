import argon2 from "argon2";
const hashPassword = async (password:string) => {
    try {
        const hash = await argon2.hash(password);
        console.log("password successfully hashed");
        return hash;
    } catch (err) {
        console.log("error hashing password");
        // Handle error
    }

}
export default hashPassword;