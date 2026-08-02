(function () {
  const url = 'https://qpsglpeuuvimtvyljtma.supabase.co';
  const key = 'sb_publishable_cV28IR4s0MCaYP2b5FYBhg_hBmjLO3E';
  const sdk = window.supabase;

  if (sdk && typeof sdk.from === 'function') {
    window.__FLOORMITRA_SUPABASE_CLIENT = sdk;
    window.supabase = {
      createClient: function () {
        return sdk;
      }
    };
  } else {
    window.supabase = {
      createClient: function () {
        return {
          from: function () {
            return {
              select: function () {
                return Promise.resolve({ data: [], error: null });
              },
              eq: function () {
                return this;
              },
              maybeSingle: function () {
                return Promise.resolve({ data: null, error: null });
              },
              upsert: function () {
                return Promise.resolve({ data: null, error: null });
              }
            };
          }
        };
      }
    };
  }

  window.__FLOORMITRA_SUPABASE = { url, key, mode: window.supabase ? 'sdk' : 'disabled' };
})();
