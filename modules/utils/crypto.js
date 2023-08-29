import { AES, enc }  from 'crypto-js';
const ENCRYPTION_KEY = "keyhere";

const { encrypt, decrypt } = AES;

export const encrypt_value = (value) => {
  let v = JSON.stringify(value);
  return encrypt(v, ENCRYPTION_KEY).toString();
};
export const decrypt_value = (value) => {
  let bytes = decrypt(value.toString(), ENCRYPTION_KEY);
  return bytes.toString(enc.Utf8);
};
