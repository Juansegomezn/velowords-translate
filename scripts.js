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

    this.recognition = null
    this.isListening = false
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
    this.copyButton.addEventListener('click', () => this.copyTranslation())
    this.micButton.addEventListener('click', () => this.toggleSpeechRecognition())
  }

  debounceTranslate() {
    clearTimeout(this.translationTimeout)
    this.translationTimeout = setTimeout(() => {
      this.translate()
    }, 500)
  }

  async getTranslation(text) {
    let sourceLanguage = this.sourceLanguage.value
    const targetLanguage = this.targetLanguage.value

    if (!text) return text

    // ---------- Auto detect ----------
    if (sourceLanguage === GoogleTranslator.DEFAULT_SOURCE_LANGUAGE) {

      this.outputText.textContent = "Detecting language..."

      const detectedLanguage = await this.detectLanguage(text)

      if (!detectedLanguage) {
        throw new Error("Could not detect language")
      }

      sourceLanguage = detectedLanguage
      this.sourceLanguage.value = detectedLanguage
    }

    if (sourceLanguage === targetLanguage) return text

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

  async detectLanguage(text) {
    if (!text || !this.hasNativeDetector) return null

    try {

      if (!this.currentDetector) {

        this.currentDetector = await window.LanguageDetector.create({
          monitor: () => {}
        })

        await this.currentDetector.detect(" ")
      }

      const results = await this.currentDetector.detect(text)

      if (!results || !results.length) return null

      const detected = results.find(r =>
        GoogleTranslator.SUPPORTED_LANGUAGES.includes(r.detectedLanguage)
      )

      return detected?.detectedLanguage ?? null

    } catch (error) {
      console.warn("Language detection failed:", error)
      return null
    }
  }

  async copyTranslation() {
    const text = this.outputText.textContent.trim()

    if (!text) return

    try {
      await navigator.clipboard.writeText(text)

      this.showCopyFeedback()

    } catch (error) {
      console.warn("Clipboard API failed, using fallback", error)

      // ---------- Fallback ----------
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)

      this.showCopyFeedback()
    }
  }

  showCopyFeedback() {
    const icon = this.copyButton.querySelector("span")

    if (!icon) return

    const originalIcon = icon.textContent

    icon.textContent = "check"

    setTimeout(() => {
      icon.textContent = originalIcon
    }, 1500)
  }

  initSpeechRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported")
      return null
    }

    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang =
      GoogleTranslator.FULL_LANGUAGES_CODES[this.sourceLanguage.value] || "en-US"

    return recognition
  }

  toggleSpeechRecognition() {
    if (this.isListening) {
      this.recognition?.stop()
      return
    }

    this.recognition = this.initSpeechRecognition()

    if (!this.recognition) return

    this.isListening = true
    this.updateMicUI(true)

    let finalTranscript = ""

    this.recognition.onresult = (event) => {

      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      this.inputText.value = finalTranscript + interimTranscript
      this.debounceTranslate()
    }

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error)
      this.stopSpeechRecognition()
    }

    this.recognition.onend = () => {
      this.stopSpeechRecognition()
    }

    this.recognition.start()
  }

  stopSpeechRecognition() {
    this.isListening = false
    this.updateMicUI(false)
  }

  updateMicUI(listening) {
    const icon = this.micButton.querySelector("span")

    if (!icon) return

    icon.textContent = listening ? "mic_off" : "mic"
  } 
}


const googleTranslator = new GoogleTranslator();