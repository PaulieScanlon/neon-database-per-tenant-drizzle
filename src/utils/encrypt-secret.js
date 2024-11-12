import sodium from 'libsodium-wrappers';

export const encryptSecret = async (publicKey, secretValue) => {
  await sodium.ready;
  const publicKeyBinary = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
  const secretValueBinary = sodium.from_string(secretValue);
  const encryptedBinary = sodium.crypto_box_seal(secretValueBinary, publicKeyBinary);
  return sodium.to_base64(encryptedBinary, sodium.base64_variants.ORIGINAL);
};
