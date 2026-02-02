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

    this.currentTransaltor = null
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
      this.translateText()
    })

    this.sourceLanguage.addEventListener('change', () => this.translateText())
    this.targetLanguage.addEventListener('change', () => this.translateText())
  
    this.swapLanguages.addEventListener('click', () => this.swapLanguages())
  }

  translateText() {
    const text = this.inputText.value.trim()

    if (!text) {
      this.outputText.textContent = ''
      return
    }

    this.outputText.textContent = 'Translating...'

    try {
      const sourceLanguage = this.sourceLanguage.value 
      const targetLanguage = this.targetLanguage.value

      if (sourceLanguage === targetLanguage) {
        return this.outputText.textContent = text
      }

      // call translation AI API here
      setTimeout(() => {
        this.outputText.textContent = `${text} translated`
      }, 1000)
    } catch (error) {
      
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