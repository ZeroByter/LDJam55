const alphabet = "qwertyuiopasdfghjklzxcvbnm0123456789";

export const randomId = (length = 6) => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return result;
}