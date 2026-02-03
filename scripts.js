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
    this.swapLanguages = $('#swapLanguages')

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
  
    this.swapLanguages.addEventListener('click', () => this.swapLanguages())
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

    if (sourceLanguage === targetLanguage) return text

    // Check translation availability
    try {
      const status = await window.Translator.availability({
        sourceLanguage,
        targetLanguage
      })

      if (status === 'unavailable') {
        throw new Error(`Translation from ${sourceLanguage} to ${targetLanguage} is unavailable for the selected languages.`)
      }
    } catch (error) {
      console.error('Error checking translation availability.', error)

      throw new Error(`Translation from ${sourceLanguage} to ${targetLanguage} is unavailable for the selected languages.`)
    }

    // Translation instance management
    const status = await window.Translator.availability({
      sourceLanguage,
      targetLanguage
    })
    console.log('status', status);
    
    const translatorKey = `${sourceLanguage}-${targetLanguage}`

    try {
      if (!this.currentTranslator || this.currentTranslatorKey !== translatorKey) {
        // Liberate previous translator
        if (this.currentTranslator) {
          this.currentTranslator.destroy()
        }

        console.log('status', status);
        
        this.currentTranslator = await window.Translator.create({
          sourceLanguage,
          targetLanguage,
          monitor: (monitor) => {
            monitor.addEventListener('downloadprogress', (e) => {
              this.outputText.innerHTML = `<span class="loading">Download model: ${Math.floor(e.loaded * 100)}%</span>`
            })
          }
        })
      }
      
      console.log('status', status);
      

      this.currentTranslatorKey = translatorKey

      const translation = await this.currentTranslator.translate(text)
      return translation
    } catch (error) {
      console.error('Error during translation.', error)
      return 'Error during translation.'
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