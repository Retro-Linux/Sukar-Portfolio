import {useState} from 'react'
import {useClient, type DocumentActionProps} from 'sanity'

export function TranslateAction(props: DocumentActionProps) {
  const client = useClient({apiVersion: '2024-01-01'})
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
        if (doc.medium && !doc.medium_ar) {
          patches.medium_ar = await translate(doc.medium as string);
        }

        if (Object.keys(patches).length > 0) {
          await client.patch(props.id).set(patches).commit();
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
