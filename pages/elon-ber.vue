<template>
  <div class="container-page py-10">
    <div v-if="!ready" class="card h-40 animate-pulse bg-navy-soft/40" />

    <div v-else-if="!user" class="card mx-auto max-w-md p-8 text-center">
      <span class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange-soft text-orange">
        <PackagePlus :size="24" />
      </span>
      <h1 class="mt-4 text-xl font-extrabold text-navy">{{ t('create.loginTitle') }}</h1>
      <p class="mt-1.5 text-sm text-ink-2">
        {{ t('create.loginText') }}
      </p>
      <NuxtLink :to="{ path: '/kirish', query: { next: '/elon-ber' } }" class="btn-primary mt-5 w-full">
        {{ t('profile.login') }}
      </NuxtLink>
    </div>

    <template v-else>
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-[30px] font-extrabold tracking-tight text-navy">{{ t('create.title') }}</h1>
          <p class="mt-1.5 text-[15px] text-ink-2">{{ t('create.subtitle') }}</p>
        </div>
        <NuxtLink to="/profil" class="btn-ghost px-4 py-2.5 text-sm">{{ t('create.cancel') }}</NuxtLink>
      </div>

      <form class="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]" @submit.prevent="submit">
        <div class="space-y-5">
          <section class="card p-6">
            <div class="flex items-center gap-3">
              <span class="grid h-8 w-8 place-items-center rounded-lg bg-navy text-sm font-bold text-white">1</span>
              <h2 class="text-lg font-bold text-navy">{{ t('create.s1') }}</h2>
            </div>

            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label class="label" for="pickup-city">{{ t('create.fromCity') }}</label>
                <select id="pickup-city" v-model="form.pickupCity" class="field">
                  <option value="">{{ t('common.select') }}</option>
                  <option v-for="city in cityOptions()" :key="city.value" :value="city.value">{{ city.label }}</option>
                </select>
                <p v-if="errors.pickupCity" class="mt-1 text-[13px] font-medium text-bad">{{ errors.pickupCity }}</p>
              </div>
              <div>
                <label class="label" for="dropoff-city">{{ t('create.toCity') }}</label>
                <select id="dropoff-city" v-model="form.dropoffCity" class="field">
                  <option value="">{{ t('common.select') }}</option>
                  <option v-for="city in cityOptions()" :key="city.value" :value="city.value">{{ city.label }}</option>
                </select>
                <p v-if="errors.dropoffCity" class="mt-1 text-[13px] font-medium text-bad">{{ errors.dropoffCity }}</p>
              </div>
              <div>
                <label class="label" for="pickup-address">{{ t('create.pickupAddress') }}</label>
                <input id="pickup-address" v-model="form.pickupAddress" class="field" :placeholder="t('create.pickupAddressPh')" />
              </div>
              <div>
                <label class="label" for="dropoff-address">{{ t('create.dropoffAddress') }}</label>
                <input id="dropoff-address" v-model="form.dropoffAddress" class="field" :placeholder="t('create.dropoffAddressPh')" />
              </div>
            </div>
          </section>

          <section class="card p-6">
            <div class="flex items-center gap-3">
              <span class="grid h-8 w-8 place-items-center rounded-lg bg-navy text-sm font-bold text-white">2</span>
              <h2 class="text-lg font-bold text-navy">{{ t('create.s2') }}</h2>
            </div>

            <div class="mt-5 space-y-4">
              <div>
                <label class="label" for="cargo-title">{{ t('create.cargoName') }}</label>
                <input id="cargo-title" v-model="form.title" class="field" :placeholder="t('create.cargoNamePh')" />
                <p v-if="errors.title" class="mt-1 text-[13px] font-medium text-bad">{{ errors.title }}</p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="label" for="cargo-type">{{ t('create.cargoType') }}</label>
                  <select id="cargo-type" v-model="form.cargoType" class="field">
                    <option v-for="type in CARGO_TYPES" :key="type" :value="type">{{ cargoTypeLabel(type) }}</option>
                  </select>
                </div>
                <div>
                  <label class="label" for="cargo-vehicle">{{ t('create.vehicleNeeded') }}</label>
                  <select id="cargo-vehicle" v-model="form.requiredVehicleType" class="field">
                    <option value="">{{ t('common.select') }}</option>
                    <option v-for="type in VEHICLE_TYPES" :key="type" :value="type">{{ vehicleLabel(type) }}</option>
                  </select>
                  <p v-if="errors.requiredVehicleType" class="mt-1 text-[13px] font-medium text-bad">{{ errors.requiredVehicleType }}</p>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                <div>
                  <label class="label" for="cargo-weight">{{ t('create.weight') }}</label>
                  <input id="cargo-weight" v-model="form.weightTonnes" type="number" min="0" step="0.1" class="field" placeholder="20" />
                  <p v-if="errors.weightKg" class="mt-1 text-[13px] font-medium text-bad">{{ errors.weightKg }}</p>
                </div>
                <div>
                  <label class="label" for="cargo-volume">{{ t('create.volume') }}</label>
                  <input id="cargo-volume" v-model="form.volumeM3" type="number" min="0" step="1" class="field" placeholder="80" />
                </div>
                <div>
                  <label class="label" for="cargo-trucks">{{ t('create.trucksNeeded') }}</label>
                  <input id="cargo-trucks" v-model="form.trucksNeeded" type="number" min="1" max="50" step="1" class="field" placeholder="1" />
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="label" for="pickup-date">{{ t('create.pickupDate') }}</label>
                  <input id="pickup-date" v-model="form.pickupDate" type="date" :min="today" :disabled="form.readyToLoad" class="field disabled:cursor-not-allowed disabled:opacity-50" />
                  <label class="mt-2 flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
                    <input v-model="form.readyToLoad" type="checkbox" class="h-4 w-4 accent-orange" />
                    {{ t('create.readyToLoad') }}
                  </label>
                  <p class="mt-1 text-[12px] text-ink-3">{{ t('create.readyHint') }}</p>
                </div>
                <div>
                  <label class="label" for="pickup-time">{{ t('create.pickupTime') }}</label>
                  <input id="pickup-time" v-model="form.pickupTime" type="time" :disabled="form.readyToLoad" class="field disabled:cursor-not-allowed disabled:opacity-50" />

                  <span class="label mt-3 block">{{ t('create.additionalLoad') }}</span>
                  <div class="inline-flex overflow-hidden rounded-lg border border-line">
                    <button
                      type="button"
                      class="px-5 py-2 text-sm font-semibold transition"
                      :class="form.isAdditionalLoad ? 'bg-navy text-white' : 'bg-white text-ink hover:bg-surface-2'"
                      @click="form.isAdditionalLoad = true"
                    >
                      {{ t('create.yes') }}
                    </button>
                    <button
                      type="button"
                      class="border-l border-line px-5 py-2 text-sm font-semibold transition"
                      :class="!form.isAdditionalLoad ? 'bg-navy text-white' : 'bg-white text-ink hover:bg-surface-2'"
                      @click="form.isAdditionalLoad = false"
                    >
                      {{ t('create.no') }}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="label" for="cargo-description">{{ t('create.description') }}</label>
                <textarea
                  id="cargo-description"
                  v-model="form.description"
                  rows="3"
                  class="field resize-y"
                  :placeholder="t('create.descriptionPh')"
                />
              </div>
            </div>
          </section>

          <section class="card p-6">
            <div class="flex items-center gap-3">
              <span class="grid h-8 w-8 place-items-center rounded-lg bg-navy text-sm font-bold text-white">3</span>
              <h2 class="text-lg font-bold text-navy">{{ t('create.s3') }}</h2>
            </div>

            <div class="mt-5 space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="label" for="cargo-price">{{ t('create.price') }}</label>
                  <div class="flex gap-2">
                    <input id="cargo-price" v-model="form.price" type="number" min="0" step="any" class="field min-w-0 flex-1" placeholder="5000000" />
                    <select id="cargo-currency" v-model="form.currency" class="field w-[104px] shrink-0" :aria-label="t('currency.viewIn')">
                      <option v-for="code in CURRENCY_CODES" :key="code" :value="code">{{ code }}</option>
                    </select>
                  </div>
                  <p v-if="errors.price" class="mt-1 text-[13px] font-medium text-bad">{{ errors.price }}</p>
                </div>
                <div>
                  <label class="label" for="cargo-advance">{{ t('create.advance') }} <span class="font-normal text-ink-3">· {{ form.currency }}</span></label>
                  <input id="cargo-advance" v-model="form.advanceAmount" type="number" min="0" step="any" class="field" placeholder="0" />
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface-2 p-4">
                  <input v-model="form.priceNegotiable" type="checkbox" class="mt-1 h-4 w-4 accent-orange" />
                  <span>
                    <span class="block text-sm font-semibold text-ink">{{ t('create.negotiable') }}</span>
                    <span class="block text-[13px] text-ink-2">{{ t('create.negotiableHint') }}</span>
                  </span>
                </label>
                <div>
                  <label class="label" for="cargo-payment">{{ t('create.paymentMethod') }}</label>
                  <select id="cargo-payment" v-model="form.paymentMethod" class="field">
                    <option value="CASH">{{ t('payment.cash') }}</option>
                    <option value="TRANSFER">{{ t('payment.transfer') }}</option>
                    <option value="MIXED">{{ t('payment.mixed') }}</option>
                  </select>
                </div>
              </div>

              <div>
                <span class="label">{{ t('create.imagesOptional') }}</span>
                <div class="grid gap-3 sm:grid-cols-[repeat(3,1fr)]">
                  <div
                    v-for="(image, index) in images"
                    :key="index"
                    class="relative aspect-[4/3] overflow-hidden rounded-xl border border-line"
                  >
                    <img :src="image.url" :alt="image.alt" class="h-full w-full object-cover" />
                    <button
                      type="button"
                      class="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                      :aria-label="t('create.removeImage')"
                      @click="images.splice(index, 1)"
                    >
                      <X :size="14" />
                    </button>
                  </div>

                  <label
                    v-if="images.length < 3"
                    class="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line-strong bg-surface-2 text-ink-2 transition hover:border-navy hover:text-navy"
                  >
                    <ImagePlus :size="22" />
                    <span class="text-[13px] font-semibold">{{ t('create.addImage') }}</span>
                    <span class="text-[11px] text-ink-3">{{ t('cargo.optionalPhoto') }}</span>
                    <input type="file" accept="image/*" multiple class="hidden" @change="onFiles" />
                  </label>
                </div>
                <p class="mt-2 text-[12px] text-ink-3">{{ t('create.imageHint') }}</p>
              </div>
            </div>
          </section>
        </div>

        <aside class="space-y-4 lg:sticky lg:top-[88px]">
          <div class="card p-5">
            <h2 class="text-sm font-bold uppercase tracking-wider text-ink-2">{{ t('create.preview') }}</h2>

            <div class="mt-4 rounded-xl border border-line bg-surface-2 p-4">
              <div class="flex items-center justify-between gap-2">
                <span class="inline-flex items-center gap-1 text-[12px] font-bold" :class="form.readyToLoad ? 'text-ok' : 'text-ink-3'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="form.readyToLoad ? 'bg-ok' : 'bg-ink-3'" />
                  {{ form.readyToLoad ? t('cargo.ready') : formatDate(form.pickupDate) }}
                </span>
                <span class="rounded-full bg-navy-soft px-2.5 py-0.5 text-[11px] font-bold text-navy">
                  {{ paymentLabel(form.paymentMethod) }}
                </span>
              </div>

              <div class="mt-2 flex items-center gap-2 text-[15px] font-extrabold text-navy">
                <span class="truncate">{{ form.pickupCity ? cityLabel(form.pickupCity) : t('filter.from') }}</span>
                <Truck :size="16" class="shrink-0 text-orange" />
                <span class="truncate">{{ form.dropoffCity ? cityLabel(form.dropoffCity) : t('filter.to') }}</span>
              </div>

              <p class="mt-1 truncate text-[14px] font-bold text-ink">{{ form.title || t('create.cargoName') }}</p>

              <div class="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold text-ink-2">
                <span class="rounded-full bg-white px-2 py-0.5">{{ form.weightTonnes ? form.weightTonnes + ' ' + t('unit.ton') : '—' }}</span>
                <span v-if="form.volumeM3" class="rounded-full bg-white px-2 py-0.5">{{ form.volumeM3 }} m³</span>
                <span class="rounded-full bg-white px-2 py-0.5">{{ form.requiredVehicleType ? vehicleLabel(form.requiredVehicleType) : '—' }}</span>
              </div>

              <p class="mt-3 text-[17px] font-extrabold text-navy">
                {{ form.priceNegotiable || !form.price ? t('cargo.negotiable') : formatMoney(Number(form.price)) + ' ' + form.currency }}
              </p>
              <p v-if="form.advanceAmount" class="mt-0.5 text-[12px] text-ink-2">
                {{ t('detail.advance') }}: {{ formatMoney(Number(form.advanceAmount)) }} {{ form.currency }}
              </p>
            </div>

            <div class="mt-4 space-y-1.5 text-[13px] text-ink-2">
              <p>{{ t('detail.trucksNeeded') }}: <span class="font-semibold text-ink">{{ form.trucksNeeded || 1 }}</span></p>
              <p>{{ t('detail.additionalLoad') }}: <span class="font-semibold text-ink">{{ form.isAdditionalLoad ? t('create.yes') : t('create.no') }}</span></p>
              <p>{{ t('create.owner') }}: <span class="font-semibold text-ink">{{ user.fullName }}</span></p>
            </div>

            <p v-if="submitError" class="mt-4 rounded-lg bg-bad-bg px-3 py-2 text-sm font-medium text-bad">{{ submitError }}</p>

            <button type="submit" class="btn-primary mt-4 w-full" :disabled="submitting">
              {{ submitting ? t('create.submitting') : t('create.submit') }}
            </button>
            <p class="mt-3 text-center text-[12px] leading-relaxed text-ink-3">
              {{ t('create.moderationNote') }}
            </p>
          </div>
        </aside>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ImagePlus, PackagePlus, Truck, X } from 'lucide-vue-next';
import type { Cargo, CargoImage, CargoPaymentMethod } from '~/types/cargo';
import { CARGO_TYPES, VEHICLE_TYPES } from '~/shared/constants';
import { CURRENCY_CODES, type CurrencyCode } from '~/shared/currency';

const { t, cityLabel, cityOptions, vehicleLabel, paymentLabel, cargoTypeLabel, formatMoney, formatDate } = useI18n();
const { user, restore } = useAuth();
const router = useRouter();

const ready = ref(false);
const submitting = ref(false);
const submitError = ref('');
const errors = ref<Record<string, string>>({});
const images = ref<CargoImage[]>([]);

const today = new Date().toISOString().slice(0, 10);

const form = reactive({
  title: '',
  cargoType: CARGO_TYPES[0],
  requiredVehicleType: '',
  weightTonnes: '',
  volumeM3: '',
  trucksNeeded: '1',
  description: '',
  pickupCity: '',
  dropoffCity: '',
  pickupAddress: '',
  dropoffAddress: '',
  pickupDate: today,
  pickupTime: '09:00',
  readyToLoad: true,
  isAdditionalLoad: false,
  price: '',
  currency: 'UZS' as CurrencyCode,
  priceNegotiable: false,
  advanceAmount: '',
  paymentMethod: 'CASH' as CargoPaymentMethod,
});

function validate(): boolean {
  const next: Record<string, string> = {};
  if (form.title.trim().length < 5) next.title = t('create.errTitle');
  if (!form.pickupCity) next.pickupCity = t('create.errFrom');
  if (!form.dropoffCity) next.dropoffCity = t('create.errTo');
  if (form.pickupCity && form.pickupCity === form.dropoffCity) next.dropoffCity = t('create.errSame');
  if (!(Number(form.weightTonnes) > 0)) next.weightKg = t('create.errWeight');
  if (!form.requiredVehicleType) next.requiredVehicleType = t('create.errVehicle');
  if (form.price === '' || Number(form.price) < 0) next.price = t('create.errPrice');
  errors.value = next;
  return Object.keys(next).length === 0;
}

async function onFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []).slice(0, 3 - images.value.length);
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const url = await compressImage(file);
    images.value.push({ url, alt: file.name });
  }
  input.value = '';
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = () => reject(new Error(t('create.errSave')));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error(t('create.errSave')));
    reader.readAsDataURL(file);
  });
}

async function submit() {
  submitError.value = '';
  if (!user.value) return;
  if (!validate()) return;

  submitting.value = true;
  try {
    const cargo = await $fetch<Cargo>('/api/cargos', {
      method: 'POST',
      body: {
        title: form.title,
        description: form.description,
        cargoType: form.cargoType,
        weightKg: Number(form.weightTonnes) * 1000,
        volumeM3: Number(form.volumeM3) || 0,
        requiredVehicleType: form.requiredVehicleType,
        price: Number(form.price),
        currency: form.currency,
        priceNegotiable: form.priceNegotiable,
        paymentMethod: form.paymentMethod,
        advanceAmount: Number(form.advanceAmount) || 0,
        trucksNeeded: Math.max(1, Number(form.trucksNeeded) || 1),
        isAdditionalLoad: form.isAdditionalLoad,
        readyToLoad: form.readyToLoad,
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        pickupCity: form.pickupCity,
        pickupAddress: form.pickupAddress,
        dropoffCity: form.dropoffCity,
        dropoffAddress: form.dropoffAddress,
        images: images.value,
        ownerName: user.value.fullName,
        ownerPhone: user.value.phone,
      },
    });
    await router.push(`/yuklar/${cargo.id}?yangi=1`);
  } catch (e: any) {
    const fieldErrors = e?.data?.data?.errors;
    if (fieldErrors) {
      errors.value = fieldErrors;
      submitError.value = t('create.errFields');
    } else {
      submitError.value = e?.data?.statusMessage ?? t('create.errSave');
    }
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  restore();
  ready.value = true;
});

useSeoMeta({
  title: () => t('create.seoTitle'),
  description: () => t('create.seoDescription'),
});
</script>
