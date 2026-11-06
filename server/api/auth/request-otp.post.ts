import { issueOtp, normalizePhone } from '~/server/utils/otp';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ phone?: string }>(event);
  const phone = normalizePhone(body.phone ?? '');
  if (!phone) {
    throw createError({ statusCode: 422, statusMessage: 'Telefon raqam noto‘g‘ri' });
  }

  const code = issueOtp(phone);
  return {
    ok: true,
    phone,
    devCode: code,
    expiresIn: 120,
    hint: 'Demo rejim: SMS yuborilmadi, kod ekranda ko‘rsatiladi.',
  };
});
