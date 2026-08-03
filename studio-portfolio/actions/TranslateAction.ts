import {useState} from 'react'
import {useDocumentOperation, type DocumentActionProps} from 'sanity'

export function TranslateAction(props: DocumentActionProps) {
  const {patch} = useDocumentOperation(props.id, props.type)
  const [isTranslating, setIsTranslating] = useState(false)

  const doc = props.draft || props.published

  return {
    label: isTranslating ? 'Translating...' : '🌐 Translate to Arabic',
    disabled: isTranslating || !doc || (!doc.title && !doc.description),
    onHandle: async () => {
      setIsTranslating(true)
      try {
        if (!doc) return;
        
        const translate = async (text: string) => {
          if (!text) return text;
          const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`);
          const data = await res.json();
          return data?.responseData?.translatedText || text;
        }

        let patches: any = {};
        
        if (doc.title && !doc.title_ar) {
          patches.title_ar = await translate(doc.title as string);
        }
        if (doc.description && !doc.description_ar) {
          patches.description_ar = await translate(doc.description as string);
        }

        if (Object.keys(patches).length > 0) {
          patch.set(patches);
          patch.execute();
        }
      } catch (err) {
        console.error('Translation failed', err)
      } finally {
        setIsTranslating(false)
        props.onComplete()
      }
    }
  }
}
