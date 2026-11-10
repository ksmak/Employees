import DictionaryPanel from "@/app/ui/dictionaries/dictionary_panel"
import { getDictionary } from "@/app/lib/actions"

export default async function DictionariesPage({
    searchParams,
}: { searchParams: Promise<{ dict: string }> }) {
    const { dict } = await searchParams;
    if (!dict) {
        return (
            <DictionaryPanel
                dict=""
                data={[]}
            />
        )
    }
    const result = await getDictionary(dict)

    if (result.error) {
        return <div>Ошибка! {result.error}</div>
    }

    return (
        <DictionaryPanel
            dict={dict}
            data={result.dictionary || []}
        />
    )
}