import crypto from 'crypto';
import utils from 'util';

const randomBytesAsync = utils.promisify(crypto.randomBytes);

// usage -- await createRandomString(10);
export async function createRandomString(
  desiredLength: number,
  charsDictionary?: string,
  desiredEncoding?: string
): Promise<string> {
  // returns a promise which renders a crypto string
  let chars = charsDictionary;
  if (!chars) {
    // provide default dictionary of chars if not supplied
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  let encoding = desiredEncoding;
  if (!encoding) {
    // provide default dictionary of chars if not supplied
    encoding = 'base64';
  }
  const charsLength = chars.length;
  if (charsLength > 256) {
    throw new Error('chars length greater than 256 characters masks desired key unpredictability');
  }
  const randomBytes = await randomBytesAsync(desiredLength);
  let value = '';
  for (let i = 0; i < desiredLength; i++) {
    value += chars[randomBytes.readUInt8(i) % charsLength];
  }
  return value;
}
