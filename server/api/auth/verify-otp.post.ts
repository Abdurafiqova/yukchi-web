import type { SessionUser } from '~/types/cargo';
import { consumeOtp, normalizePhone } from '~/server/utils/otp';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ phone?: string; code?: string; fullName?: string }>(event);
  const phone = normalizePhone(body.phone ?? '');
  if (!phone) {
    throw createError({ statusCode: 422, statusMessage: 'Telefon raqam noto‘g‘ri' });
  }
  if (!consumeOtp(phone, body.code ?? '')) {
    throw createError({ statusCode: 401, statusMessage: 'Kod xato yoki muddati tugagan' });
  }

  const fullName = (body.fullName ?? '').trim();
  const user: SessionUser = {
    id: `u-${phone.slice(-4)}`,
    phone,
    fullName: fullName || 'Yukchi foydalanuvchisi',
    role: 'CARGO_OWNER',
    initials: (fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || 'YK') as string,
  };

  return { user, token: `demo.${Buffer.from(phone).toString('base64url')}.jwt` };
});
