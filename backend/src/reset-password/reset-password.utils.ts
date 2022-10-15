import { randomBytes, createHmac } from 'node:crypto';

const getBytes = (size: number) =>
  new Promise<Buffer>((resolve, reject) => {
    randomBytes(size, (err, buffer) => {
      if (err) {
        return reject(err);
      }

      return resolve(buffer);
    });
  });

export const hashToken = (token: string) =>
  createHmac('sha256', token).digest('hex');

export const getToken = async () => {
  const bytes = await getBytes(16);

  const token = bytes.toString('hex');
  const hashedToken = hashToken(token);

  return { hashedToken, token };
};
