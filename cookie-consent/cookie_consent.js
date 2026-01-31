(function() {
  'use strict';

  // ========== CONFIGURAZIONE ==========
  const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';
  const COOKIE_EXPIRY_DAYS = 365;

  // ========== UTILITY FUNCTIONS ==========
  function setCookie(name, value, days) {
    try {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      // Codifica il valore per evitare problemi con caratteri speciali
      const encodedValue = encodeURIComponent(value);
      // Usa Secure solo se siamo su HTTPS
      const secureFlag = window.location.protocol === 'https:' ? ';Secure' : '';
      document.cookie = name + "=" + encodedValue + ";" + expires + ";path=/;SameSite=Lax" + secureFlag;
      return true;
    } catch (e) {
      console.error('Errore nel salvataggio del cookie:', e);
      return false;
    }
  }

  function getCookie(name) {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const value = c.substring(nameEQ.length, c.length);
          return decodeURIComponent(value);
        }
      }
      return null;
    } catch (e) {
      console.error('Errore nella lettura del cookie:', e);
      return null;
    }
  }

  function savePreferences(preferences) {
    try {
      const prefsString = JSON.stringify(preferences);
      setCookie(COOKIE_CONSENT_KEY, prefsString, COOKIE_EXPIRY_DAYS);
      localStorage.setItem(COOKIE_CONSENT_KEY, prefsString);
      console.log('✅ Preferenze cookie salvate:', preferences);
      return true;
    } catch (e) {
      console.error('❌ Errore nel salvataggio delle preferenze:', e);
      return false;
    }
  }

  function loadPreferences() {
    const cookiePrefs = getCookie(COOKIE_CONSENT_KEY);
    const localPrefs = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (cookiePrefs) {
      try {
        return JSON.parse(cookiePrefs);
      } catch (e) {
        console.warn('Errore nel parsing delle preferenze cookie:', e);
      }
    }
    
    if (localPrefs) {
      try {
        return JSON.parse(localPrefs);
      } catch (e) {
        console.warn('Errore nel parsing delle preferenze localStorage:', e);
      }
    }
    
    return null;
  }

  // ========== GESTIONE TRACKING ==========
  function enableGoogleAnalytics() {
    // Abilita Google Analytics/Tag Manager se già presente
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
    
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'cookie_consent_update',
        'analytics_storage': 'granted'
      });
    }
    
    console.log('✅ Google Analytics abilitato');
  }

  function enableGoogleAds() {
    // Abilita Google Ads e personalizzazione annunci
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
    
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'cookie_consent_update',
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
    
    console.log('✅ Google Ads e personalizzazione annunci abilitati');
  }

  function disableGoogleAds() {
    // Disabilita Google Ads
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
    
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'cookie_consent_update',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
    
    console.log('❌ Google Ads disabilitato');
  }

  function disableGoogleAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        'event': 'cookie_consent_update',
        'analytics_storage': 'denied'
      });
    }
    
    console.log('❌ Google Analytics disabilitato');
  }

  function enableMetaPixel() {
    // Abilita Meta Pixel se già presente
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'grant');
      console.log('✅ Meta Pixel abilitato');
    } else {
      console.log('⚠️ Meta Pixel non trovato');
    }
  }

  function disableMetaPixel() {
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'revoke');
      console.log('❌ Meta Pixel disabilitato');
    }
  }

  function applyTrackingPreferences(preferences) {
    // Cookie necessari sono sempre attivi
    if (preferences.necessary) {
      // I cookie necessari sono sempre abilitati
    }

    // Cookie analitici
    if (preferences.analytics) {
      enableGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }

    // Cookie marketing
    if (preferences.marketing) {
      enableMetaPixel();
      // Abilita anche Google Ads quando i cookie marketing sono accettati
      enableGoogleAds();
    } else {
      disableMetaPixel();
      disableGoogleAds();
    }
  }

  // ========== UI FUNCTIONS ==========
  function updateToggleUI(category, active) {
    const toggle = document.querySelector(`[data-toggle="${category}"]`);
    if (toggle) {
      if (active) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    }
  }

  function loadPreferencesToUI(preferences) {
    updateToggleUI('necessary', true); // Sempre attivo
    // Di default tutti sono attivi se non specificato
    updateToggleUI('analytics', preferences.analytics !== undefined ? preferences.analytics : true);
    updateToggleUI('marketing', preferences.marketing !== undefined ? preferences.marketing : true);
  }

  function getCurrentPreferences() {
    return {
      necessary: true, // Sempre true
      analytics: document.querySelector('[data-toggle="analytics"]')?.classList.contains('active') || false,
      marketing: document.querySelector('[data-toggle="marketing"]')?.classList.contains('active') || false
    };
  }

  // Timer per chiusura automatica
  let autoCloseTimer = null;
  let countdownInterval = null;
  let countdownSeconds = 8;

  function updateTimerDisplay(seconds) {
    const timerElement = document.getElementById('cookie-timer');
    if (timerElement) {
      timerElement.textContent = seconds + 's';
      timerElement.style.display = 'block';
    }
  }

  function startCountdown() {
    countdownSeconds = 8;
    const timerElement = document.getElementById('cookie-timer');
    if (timerElement) {
      timerElement.style.display = 'block';
      updateTimerDisplay(countdownSeconds);
    }

    countdownInterval = setInterval(() => {
      countdownSeconds--;
      updateTimerDisplay(countdownSeconds);
      
      if (countdownSeconds <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        if (timerElement) {
          timerElement.style.display = 'none';
        }
      }
    }, 1000);
  }

  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    const timerElement = document.getElementById('cookie-timer');
    if (timerElement) {
      timerElement.style.display = 'none';
    }
  }

  function showBanner() {
    const overlay = document.getElementById('cookie-consent-overlay');
    const banner = document.getElementById('cookie-consent-banner');
    if (overlay && banner) {
      // Rimuovi classe fade-out se presente
      banner.classList.remove('fade-out');
      
      overlay.classList.add('active');
      banner.style.display = 'block';
      banner.style.opacity = '0';
      banner.style.animation = 'fadeInBanner 0.4s ease-out forwards';
      
      // NON bloccare lo scroll - permettere sempre lo scroll
      
      // Avvia countdown visuale
      startCountdown();
      
      // Timer per chiusura automatica dopo 8 secondi
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
      
      autoCloseTimer = setTimeout(() => {
        // Chiudi automaticamente il banner dopo 8 secondi
        hideBanner();
      }, 8000); // 8 secondi
    }
  }

  function hideBanner(savePreferencesOnClose = true) {
    // Cancella il timer se esiste
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
    
    // Ferma il countdown
    stopCountdown();
    
    const overlay = document.getElementById('cookie-consent-overlay');
    const banner = document.getElementById('cookie-consent-banner');
    const mini = document.getElementById('cookie-consent-mini');
    
    // Se il banner viene chiuso automaticamente o manualmente, salva le preferenze di default
    if (savePreferencesOnClose) {
      const currentPrefs = getCurrentPreferences();
      savePreferences(currentPrefs);
    }
    
    if (overlay && banner) {
      // Aggiungi animazione fade out
      banner.classList.add('fade-out');
      overlay.classList.add('fade-out');
      
      // Dopo l'animazione, nascondi completamente
      setTimeout(() => {
        overlay.classList.remove('active', 'fade-out');
        banner.style.display = 'none';
        banner.classList.remove('fade-out');
        banner.style.animation = '';
        document.body.style.overflow = ''; // Assicura che lo scroll sia sempre abilitato
      }, 300); // Tempo dell'animazione fadeOut
    }
    
    // Mostra il banner mini se necessario (solo su desktop)
    const isMobile = window.innerWidth <= 768;
    if (mini && !isMobile) {
      setTimeout(() => {
        mini.classList.add('active');
      }, 600); // Aspetta che il fade out finisca
    }
  }

  function showMiniBanner() {
    const mini = document.getElementById('cookie-consent-mini');
    if (mini) {
      mini.classList.add('active');
    }
  }

  function hideMiniBanner() {
    const mini = document.getElementById('cookie-consent-mini');
    if (mini) {
      mini.classList.remove('active');
    }
  }

  // ========== EVENT HANDLERS ==========
  function initEventHandlers() {
    // Toggle switches
    document.querySelectorAll('.cookie-toggle').forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        const category = this.getAttribute('data-toggle');
        
        // I cookie necessari non possono essere disattivati
        if (category === 'necessary') {
          return;
        }
        
        this.classList.toggle('active');
      });
    });

    // Pulsante Accetta Tutti
    const acceptAllBtn = document.getElementById('cookie-accept-all');
    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', function() {
        const preferences = {
          necessary: true,
          analytics: true,
          marketing: true
        };
        
        if (savePreferences(preferences)) {
          applyTrackingPreferences(preferences);
          hideBanner(false); // false = già salvato, non salvare di nuovo
        } else {
          alert('Errore nel salvataggio delle preferenze. Riprova.');
        }
      });
    }

    // Pulsante Salva Preferenze
    const acceptSelectedBtn = document.getElementById('cookie-accept-selected');
    if (acceptSelectedBtn) {
      acceptSelectedBtn.addEventListener('click', function() {
        const preferences = getCurrentPreferences();
        if (savePreferences(preferences)) {
          applyTrackingPreferences(preferences);
          hideBanner(false); // false = già salvato, non salvare di nuovo
        } else {
          alert('Errore nel salvataggio delle preferenze. Riprova.');
        }
      });
    }

    // Pulsante Personalizza (toggle)
    const settingsToggle = document.getElementById('cookie-settings-toggle');
    if (settingsToggle) {
      settingsToggle.addEventListener('click', function() {
        const body = document.querySelector('.cookie-consent-body');
        if (body) {
          body.style.display = body.style.display === 'none' ? 'block' : 'none';
        }
      });
    }

    // Banner mini - Accetta
    const miniAccept = document.getElementById('cookie-mini-accept');
    if (miniAccept) {
      miniAccept.addEventListener('click', function() {
        const preferences = {
          necessary: true,
          analytics: true,
          marketing: true
        };
        if (savePreferences(preferences)) {
          applyTrackingPreferences(preferences);
          hideMiniBanner();
        }
      });
    }

    // Banner mini - Impostazioni
    const miniSettings = document.getElementById('cookie-mini-settings');
    if (miniSettings) {
      miniSettings.addEventListener('click', function() {
        hideMiniBanner();
        showBanner();
      });
    }

    // Click sull'overlay per chiudere (opzionale)
    const overlay = document.getElementById('cookie-consent-overlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          // Non chiudere automaticamente, richiedi una scelta
          // hideBanner();
        }
      });
    }
  }

  // ========== RILEVAMENTO MODALITÀ EMBED ==========
  function detectEmbedMode() {
    // Controlla se lo script è dentro un container specifico (es. Code Embed)
    const wrapper = document.querySelector('.cookie-consent-wrapper');
    if (!wrapper) return false;
    
    const container = wrapper.parentElement;
    
    // Se il parent ha una classe/id specifica o è un container con dimensioni limitate
    if (container) {
      const containerStyles = window.getComputedStyle(container);
      const containerRect = container.getBoundingClientRect();
      
      // Rileva se è embeddato controllando:
      // 1. Se ha classi/id che indicano un embed
      // 2. Se ha position relative/absolute (tipico dei Code Embed)
      // 3. Se le dimensioni sono limitate (non full viewport)
      const isEmbedded = container.id?.toLowerCase().includes('embed') || 
                        container.classList.toString().toLowerCase().includes('embed') ||
                        containerStyles.position === 'relative' ||
                        (containerStyles.position === 'absolute' && containerRect.width < window.innerWidth);
      
      if (isEmbedded) {
        document.body.classList.add('cookie-consent-embedded');
        wrapper.classList.add('cookie-consent-embedded');
        return true;
      }
    }
    
    return false;
  }

  // ========== INIZIALIZZAZIONE ==========
  function init() {
    const isEmbedded = detectEmbedMode();
    const savedPreferences = loadPreferences();
    
    if (savedPreferences) {
      // Preferenze già salvate, applica e NASCONDI il banner
      loadPreferencesToUI(savedPreferences);
      applyTrackingPreferences(savedPreferences);
      
      // Nascondi esplicitamente il banner principale
      const overlay = document.getElementById('cookie-consent-overlay');
      const banner = document.getElementById('cookie-consent-banner');
      if (overlay) overlay.classList.remove('active');
      if (banner) banner.style.display = 'none';
      
      if (!isEmbedded) {
        // Mostra solo il banner mini per modificare le preferenze (solo se non embeddato)
        setTimeout(() => {
          showMiniBanner();
        }, 2000);
      }
    } else {
      // Nessuna preferenza salvata, mostra il banner completo con tutti i cookie abilitati di default
      const defaultPreferences = {
        necessary: true,
        analytics: true,
        marketing: true
      };
      
      loadPreferencesToUI(defaultPreferences);
      // Applica subito i cookie di default
      applyTrackingPreferences(defaultPreferences);
      // NON salvare subito - aspetta che l'utente interagisca o che scada il timer
      // savePreferences(defaultPreferences); // Commentato - salveremo solo quando chiude
      
      // Mostra il banner dopo un breve delay
      setTimeout(() => {
        showBanner();
      }, isEmbedded ? 100 : 1000);
    }

    initEventHandlers();
  }

  // Avvia quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Funzione di test per verificare il salvataggio
  function testCookieConsent() {
    const COOKIE_KEY = 'cookie_consent_preferences';
    console.group('🧪 Test Cookie Consent');
    
    // Verifica cookie
    const cookieValue = getCookie(COOKIE_KEY);
    console.log('1. Cookie salvato:', cookieValue);
    
    // Verifica localStorage
    const localValue = localStorage.getItem(COOKIE_KEY);
    console.log('2. LocalStorage salvato:', localValue);
    
    // Verifica preferenze caricate
    const prefs = loadPreferences();
    console.log('3. Preferenze caricate:', prefs);
    
    // Verifica tutti i cookie
    console.log('4. Cookie completo:', document.cookie);
    
    // Verifica stato toggle
    const analyticsToggle = document.querySelector('[data-toggle="analytics"]');
    const marketingToggle = document.querySelector('[data-toggle="marketing"]');
    console.log('5. Stato toggle Analytics:', analyticsToggle?.classList.contains('active'));
    console.log('6. Stato toggle Marketing:', marketingToggle?.classList.contains('active'));
    
    // Verifica Google Consent Mode
    console.log('\n📊 Google Consent Mode:');
    if (typeof gtag !== 'undefined') {
      console.log('   - gtag disponibile: ✅');
      // Prova a leggere lo stato del consent (se supportato)
      try {
        if (window.dataLayer) {
          const consentEvents = window.dataLayer.filter(item => 
            item.event === 'cookie_consent_update' || 
            item.analytics_storage || 
            item.ad_storage
          );
          if (consentEvents.length > 0) {
            console.log('   - Ultimo evento consent:', consentEvents[consentEvents.length - 1]);
          }
        }
      } catch (e) {
        console.log('   - Impossibile leggere stato consent direttamente');
      }
    } else {
      console.log('   - gtag disponibile: ❌ (Google Analytics/Tag Manager non caricato)');
    }
    
    // Verifica Google Ads specifici
    console.log('\n📢 Google Ads Cookie Status:');
    if (prefs && prefs.marketing) {
      console.log('   - Marketing cookies: ✅ ATTIVI');
      console.log('   - ad_storage: ✅ dovrebbe essere "granted"');
      console.log('   - ad_user_data: ✅ dovrebbe essere "granted"');
      console.log('   - ad_personalization: ✅ dovrebbe essere "granted"');
    } else {
      console.log('   - Marketing cookies: ❌ DISATTIVATI');
      console.log('   - ad_storage: ❌ dovrebbe essere "denied"');
      console.log('   - ad_user_data: ❌ dovrebbe essere "denied"');
      console.log('   - ad_personalization: ❌ dovrebbe essere "denied"');
    }
    
    console.groupEnd();
    
    return {
      cookie: cookieValue,
      localStorage: localValue,
      preferences: prefs,
      allCookies: document.cookie,
      analyticsActive: analyticsToggle?.classList.contains('active'),
      marketingActive: marketingToggle?.classList.contains('active'),
      googleAdsEnabled: prefs && prefs.marketing === true
    };
  }

  // Funzione per verificare lo stato di Google Consent Mode
  function checkGoogleConsentStatus() {
    console.group('🔍 Verifica Google Consent Mode');
    
    if (typeof gtag === 'undefined') {
      console.warn('⚠️ Google Tag Manager/Analytics non è caricato');
      console.log('   Per verificare i cookie di Google Ads, assicurati che gtag sia caricato');
      console.groupEnd();
      return null;
    }
    
    // Verifica dataLayer per eventi di consent
    if (typeof dataLayer !== 'undefined' && dataLayer.length > 0) {
      console.log('📋 Eventi nel dataLayer:');
      const consentEvents = dataLayer.filter(item => 
        item.event === 'cookie_consent_update' || 
        item.analytics_storage !== undefined || 
        item.ad_storage !== undefined
      );
      
      if (consentEvents.length > 0) {
        console.log('   Trovati', consentEvents.length, 'eventi di consent:');
        consentEvents.forEach((event, index) => {
          console.log(`   Evento ${index + 1}:`, {
            analytics_storage: event.analytics_storage || 'non specificato',
            ad_storage: event.ad_storage || 'non specificato',
            ad_user_data: event.ad_user_data || 'non specificato',
            ad_personalization: event.ad_personalization || 'non specificato',
            event: event.event || 'N/A'
          });
        });
        
        const lastEvent = consentEvents[consentEvents.length - 1];
        console.log('\n✅ Stato attuale Google Ads:');
        console.log('   - ad_storage:', lastEvent.ad_storage || 'non impostato');
        console.log('   - ad_user_data:', lastEvent.ad_user_data || 'non impostato');
        console.log('   - ad_personalization:', lastEvent.ad_personalization || 'non impostato');
        console.log('   - analytics_storage:', lastEvent.analytics_storage || 'non impostato');
        
        console.groupEnd();
        return lastEvent;
      } else {
        console.log('   Nessun evento di consent trovato nel dataLayer');
      }
    } else {
      console.log('   dataLayer non disponibile o vuoto');
    }
    
    // Verifica preferenze salvate
    const prefs = loadPreferences();
    console.log('\n📝 Preferenze salvate:');
    console.log('   - Marketing cookies:', prefs?.marketing ? '✅ ATTIVI' : '❌ DISATTIVATI');
    console.log('   - Analytics cookies:', prefs?.analytics ? '✅ ATTIVI' : '❌ DISATTIVATI');
    
    if (prefs?.marketing) {
      console.log('\n💡 I cookie di Google Ads DOVREBBERO essere attivi');
      console.log('   Se non vedi gli eventi nel dataLayer, potrebbe essere che:');
      console.log('   1. Google Tag Manager non è ancora caricato');
      console.log('   2. Gli eventi sono stati inviati prima del caricamento di questo script');
      console.log('   3. Prova a ricaricare la pagina dopo aver accettato i cookie');
    }
    
    console.groupEnd();
    return prefs;
  }

  // Funzione per resettare e testare di nuovo
  function resetCookieConsent() {
    const COOKIE_KEY = 'cookie_consent_preferences';
    document.cookie = COOKIE_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem(COOKIE_KEY);
    console.log('✅ Preferenze resettate. Ricarica la pagina per vedere il banner.');
    location.reload();
  }

  // Esponi funzioni globali per modifiche manuali
  window.cookieConsent = {
    show: showBanner,
    hide: hideBanner,
    updatePreferences: function(prefs) {
      savePreferences(prefs);
      applyTrackingPreferences(prefs);
      loadPreferencesToUI(prefs);
    },
    getPreferences: loadPreferences,
    test: testCookieConsent,
    reset: resetCookieConsent,
    checkGoogleAds: checkGoogleConsentStatus
  };
  
  // Verifica che sia stato esposto correttamente
  console.log('✅ Cookie Consent inizializzato.');
  console.log('📋 Comandi disponibili:');
  console.log('   - cookieConsent.test() - Test completo delle preferenze');
  console.log('   - cookieConsent.checkGoogleAds() - Verifica stato Google Ads/Consent Mode');
  console.log('   - cookieConsent.getPreferences() - Mostra preferenze salvate');

})();
