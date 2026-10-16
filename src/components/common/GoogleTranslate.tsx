import React, { useEffect, useState, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export const GoogleTranslate: React.FC<{ variant?: 'header' | 'mobile' }> = ({ variant = 'header' }) => {
  const [selectedLang, setSelectedLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize current language from cookie or localStorage
  useEffect(() => {
    const getStoredLang = (): string => {
      const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
      if (match && match[1]) {
        const parts = match[1].split('/');
        return parts[parts.length - 1] || 'en';
      }
      return localStorage.getItem('kretz_selected_language') || 'en';
    };

    const current = getStoredLang();
    setSelectedLang(current);
  }, []);

  // Dynamically load Google Translate script if not present
  useEffect(() => {
    const initScript = () => {
      if (document.getElementById('google-translate-script')) return;

      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,fr,es,de,it,ar,zh-CN,ru,pt',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
          } catch (e) {
            console.warn('Google Translate initialization notice:', e);
          }
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    initScript();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem('kretz_selected_language', langCode);
    setIsOpen(false);

    // Set cookie for Google Translate
    const domain = window.location.hostname;
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;

    // Attempt to trigger the underlying Google Translate select if rendered
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      // Reload smoothly so translation applies across all components
      window.location.reload();
    }
  };

  const activeLangOption = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden container for standard Google Translate element */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Luxury Styled Language Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#E3E8E3] hover:border-[#182D2A] bg-white text-xs font-semibold text-[#182D2A] transition-all shadow-xs cursor-pointer ${
          variant === 'mobile' ? 'w-full justify-between' : ''
        }`}
        title="Translate Website"
        aria-label="Select Language"
      >
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#27845D]" />
          <span className="text-sm leading-none">{activeLangOption.flag}</span>
          <span className="font-semibold text-xs text-[#182D2A] uppercase tracking-wider">
            {activeLangOption.code.toUpperCase()}
          </span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#69736F] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Language Selector Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#E3E8E3] shadow-xl py-2 z-50 animate-fade-in text-left">
          <div className="px-3 py-1.5 border-b border-[#E3E8E3]/60 mb-1 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#69736F]">
              Real-Time Translation
            </span>
            <span className="text-[9px] font-bold text-[#27845D] bg-[#27845D]/10 px-1.5 py-0.5 rounded-full">
              Google Translate
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-gray-50">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === selectedLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#182D2A]/5 text-[#182D2A] font-bold'
                      : 'text-[#48534F] hover:bg-[#F6F7F4] hover:text-[#182D2A]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span className="flex flex-col">
                      <span className="leading-tight">{lang.nativeName}</span>
                      <span className="text-[10px] text-[#8C9692] font-normal">{lang.name}</span>
                    </span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#27845D] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
