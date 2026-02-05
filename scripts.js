import { $ } from "./dom.js";


class GoogleTranslator {
  static SUPPORTED_LANGUAGES = [
    'en',
    'es',
    'fr',
    'de',
    'zh',
    'ja',
    'ko',
    'ru',
    'it',
    'pt'
  ]

  static FULL_LANGUAGES_CODES = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    ru: 'ru-RU',
    it: 'it-IT',
    pt: 'pt-BR'
  }

  static DEFAULT_SOURCE_LANGUAGE = 'auto'
  static DEFAULT_TARGET_LANGUAGE = 'en'

  constructor() {
    this.init()
    this.setupListeners()

    this.translationTimeout = null
    this.currentTranslator = null
    this.currentTranslatorKey = null
    this.currentDetector = null
  }

  init () {
    // DOM Elements
    this.inputText = $('#inputText')
    this.outputText = $('#outputText')

    this.sourceLanguage = $('#sourceLanguage')
    this.targetLanguage = $('#targetLanguage')
    this.swapLanguagesButton = $('#swapLanguages')

    this.micButton = $('#micButton')
    this.copyButton = $('#copyButton')
    this.clearButton = $('#clearButton')

    // Set default languages
    this.targetLanguage.value = GoogleTranslator.DEFAULT_TARGET_LANGUAGE
    
    this.checkAPISupport()
  }

  setupListeners() { 
    this.inputText.addEventListener('input', () => {
      this.debounceTranslate()
    })

    this.sourceLanguage.addEventListener('change', () => this.translate())
    this.targetLanguage.addEventListener('change', () => this.translate())
  
    this.swapLanguagesButton.addEventListener('click', () => this.swapLanguages())
  }

  debounceTranslate() {
    clearTimeout(this.translationTimeout)
    this.translationTimeout = setTimeout(() => {
      this.translate()
    }, 500)
  }

  async getTranslation(text) {
    const sourceLanguage = this.sourceLanguage.value
    const targetLanguage = this.targetLanguage.value

    if (!text || sourceLanguage === targetLanguage) return text

    // ---------- Support detection ----------
    if (!window.Translator) {
      throw new Error("Built-in Translator API not supported in this browser.")
    }

    // Detect Edge browser
    const isEdge = navigator.userAgent.includes("Edg")
    if (isEdge) {
      throw new Error("Translator API is currently unstable in Microsoft Edge. Please use Chrome.")
    }

    // ---------- Availability ----------
    const availability = await window.Translator.availability({
      sourceLanguage,
      targetLanguage
    })

    if (availability === "unavailable") {
      throw new Error(`Translation unavailable for ${sourceLanguage} → ${targetLanguage}`)
    }

    const translatorKey = `${sourceLanguage}-${targetLanguage}`

    try {

      // ---------- Translator cache ----------
      const needsNewTranslator =
        !this.currentTranslator ||
        this.currentTranslatorKey !== translatorKey

      if (needsNewTranslator) {

        // Destroy previous instance
        if (this.currentTranslator) {
          await this.currentTranslator.destroy()
        }

        // Create translator
        this.currentTranslator = await window.Translator.create({
          sourceLanguage,
          targetLanguage,
          monitor: (monitor) => {
            monitor.addEventListener("downloadprogress", (e) => {
              this.outputText.textContent =
                `Downloading model: ${Math.floor(e.loaded * 100)}%`
            })
          }
        })

        // ---------- Warm-up ----------
        // Some browsers require an initial dummy translation to load the model properly.
        await this.currentTranslator.translate(" ")

        this.currentTranslatorKey = translatorKey
      }

      // ---------- Real translation ----------
      return await this.currentTranslator.translate(text)

    } catch (error) {
      console.error("Translation error:", error)
      throw error
    }
  }

  async translate() {
    const text = this.inputText.value.trim()

    if (!text) {
      this.outputText.textContent = ''
      return
    }

    this.outputText.textContent = 'Translating...'

    try {
      const translatedText = await this.getTranslation(text)
      this.outputText.textContent = translatedText
    } catch (error) {
      console.error('Error translating text.', error)
      this.outputText.textContent = 'Error translating text.'
    }
  }

  swapLanguages() {
    const sourceLang = this.sourceLanguage.value
    const targetLang = this.targetLanguage.value

    // Google Translate behavior
    // If source is auto → do nothing
    if (sourceLang === GoogleTranslator.DEFAULT_SOURCE_LANGUAGE) {
      return
    }

    // ---------- Swap languages ----------
    this.sourceLanguage.value = targetLang
    this.targetLanguage.value = sourceLang

    // ---------- Swap text ----------
    const inputText = this.inputText.value
    const outputText = this.outputText.textContent

    this.inputText.value = outputText || ''
    this.outputText.textContent = inputText || ''

    // ---------- Reset translator cache ----------
    if (this.currentTranslator) {
      this.currentTranslator.destroy()
      this.currentTranslator = null
      this.currentTranslatorKey = null
    }

    // ---------- Re-translate if text exists ----------
    if (this.inputText.value.trim()) {
      this.translate()
    }
  }

  checkAPISupport() {
    this.hasNativeTranslator = 'Translator' in window
    this.hasNativeDetector = 'LanguageDetector' in window

    if (!this.hasNativeTranslator || !this.hasNativeDetector) { 
      console.warn('Native translation or detection APIs are not supported.')
    } else {
      console.log('✅ Native AI APIs are supported.')
    }
  }
}


const googleTranslator = new GoogleTranslator();