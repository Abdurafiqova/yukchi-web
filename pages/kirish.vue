<template>
  <div class="container-page flex min-h-[72vh] items-center justify-center py-12">
    <div class="w-full max-w-md">
      <div class="card p-7">
        <div class="flex items-center justify-between">
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-orange text-lg font-extrabold text-white">Y</span>
          <span class="text-[12px] font-semibold uppercase tracking-wider text-ink-3">{{ t('login.step', { step, total: 2 }) }}</span>
        </div>

        <template v-if="step === 1">
          <h1 class="mt-5 text-[24px] font-extrabold leading-tight text-navy">{{ t('login.title') }}</h1>
          <p class="mt-1.5 text-sm text-ink-2">{{ t('login.subtitle') }}</p>

          <form class="mt-6 space-y-4" @submit.prevent="requestCode">
            <div>
              <label class="label" for="login-name">{{ t('login.name') }}</label>
              <input id="login-name" v-model="fullName" class="field" placeholder="Aziz Tursunov" autocomplete="name" />
            </div>

            <div>
              <label class="label" for="login-phone">{{ t('login.phone') }}</label>
              <div class="flex items-center gap-2 rounded-xl border border-line bg-white px-4 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10">
                <span class="border-r border-line py-3 pr-3 text-[15px] font-semibold text-ink-2">+998</span>
                <input
                  id="login-phone"
                  v-model="phone"
                  type="tel"
                  inputmode="numeric"
                  maxlength="12"
                  placeholder="90 123 45 67"
                  class="w-full border-0 bg-transparent py-3 text-[15px] outline-none placeholder:text-ink-3/70"
                  autocomplete="tel-national"
                />
              </div>
            </div>

            <p v-if="error" class="rounded-lg bg-bad-bg px-3 py-2 text-sm font-medium text-bad">{{ error }}</p>

            <button type="submit" class="btn-primary w-full" :disabled="sending">
              {{ sending ? t('login.sending') : t('login.sendCode') }}
            </button>
          </form>

          <p class="mt-4 text-center text-[12px] leading-relaxed text-ink-3">
            {{ t('login.terms') }}
          </p>
        </template>

        <template v-else>
          <h1 class="mt-5 text-[24px] font-extrabold leading-tight text-navy">{{ t('login.enterCode') }}</h1>
          <p class="mt-1.5 text-sm text-ink-2">
            {{ t('login.sentTo', { phone: '+998 ' + phone }) }}
          </p>

          <div v-if="devCode" class="mt-4 rounded-xl border border-navy/15 bg-navy-soft px-4 py-3">
            <p class="text-[12px] font-semibold uppercase tracking-wider text-navy">{{ t('login.demo') }}</p>
            <p class="mt-0.5 text-sm text-ink-2">
              {{ t('login.demoCode', { code: devCode }) }}
            </p>
          </div>

          <form class="mt-6 space-y-4" @submit.prevent="verify">
            <div>
              <label class="label" for="login-code">{{ t('login.codeLabel') }}</label>
              <input
                id="login-code"
                v-model="code"
                type="text"
                inputmode="numeric"
                maxlength="6"
                class="field text-center text-xl font-bold tracking-[0.4em]"
                placeholder="000000"
                autocomplete="one-time-code"
              />
            </div>

            <p v-if="error" class="rounded-lg bg-bad-bg px-3 py-2 text-sm font-medium text-bad">{{ error }}</p>

            <button type="submit" class="btn-primary w-full" :disabled="sending || code.length < 6">
              {{ sending ? t('login.verifying') : t('login.verify') }}
            </button>
          </form>

          <div class="mt-4 flex items-center justify-between text-sm">
            <button type="button" class="font-medium text-ink-2 hover:text-navy" @click="step = 1">← {{ t('login.changePhone') }}</button>
            <button type="button" class="font-semibold text-navy hover:text-orange" @click="requestCode">{{ t('login.resend') }}</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SessionUser } from '~/types/cargo';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { setSession, loggedIn } = useAuth();

const step = ref(1);
const fullName = ref('');
const phone = ref('');
const code = ref('');
const devCode = ref('');
const error = ref('');
const sending = ref(false);

onMounted(() => {
  if (loggedIn.value) router.replace(String(route.query.next ?? '/profil'));
});

async function requestCode() {
  error.value = '';
  code.value = '';
  sending.value = true;
  try {
    const res = await $fetch<{ devCode: string }>('/api/auth/request-otp', {
      method: 'POST',
      body: { phone: phone.value },
    });
    devCode.value = res.devCode;
    step.value = 2;
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? t('login.errorSend');
  } finally {
    sending.value = false;
  }
}

async function verify() {
  error.value = '';
  sending.value = true;
  try {
    const res = await $fetch<{ user: SessionUser; token: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: { phone: phone.value, code: code.value, fullName: fullName.value },
    });
    setSession(res.user, res.token);
    await router.push(String(route.query.next ?? '/profil'));
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? t('login.errorCode');
  } finally {
    sending.value = false;
  }
}

useSeoMeta({
  title: () => t('login.seoTitle'),
  description: () => t('login.seoDescription'),
});
</script>
