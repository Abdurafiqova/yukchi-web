type OtpEntry = { code: string; expiresAt: number };

const state = globalThis as unknown as { __yukchiOtp?: Map<string, OtpEntry> };

function otpStore(): Map<string, OtpEntry> {
  if (!state.__yukchiOtp) state.__yukchiOtp = new Map();
  return state.__yukchiOtp;
}

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 9) return `+998${digits}`;
  if (digits.length === 12 && digits.startsWith('998')) return `+${digits}`;
  return '';
}

export function issueOtp(phone: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore().set(phone, { code, expiresAt: Date.now() + 2 * 60 * 1000 });
  return code;
}

export function consumeOtp(phone: string, code: string): boolean {
  const entry = otpStore().get(phone);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    otpStore().delete(phone);
    return false;
  }
  if (entry.code !== code.trim()) return false;
  otpStore().delete(phone);
  return true;
}
