import jwt from "jsonwebtoken";
function createToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.SECRET_KEY!, { expiresIn: "15m" });
}
export default createToken;