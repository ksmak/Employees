'use client';

export default function Menu() {
    return (
        <ul className="flex justify-center items-center text-sm">
            <li>
                <a href="/employees" className="text-gray-800 underline">
                    Сотрудники
                </a>
            </li>
            <li>
                <a href="/dictionaries" className="ml-4 text-gray-800 underline">
                    Справочники
                </a>
            </li>
            <li>
                <a href="/queries" className="ml-4 text-gray-800 underline">
                    Запросы
                </a>
            </li>
            <li>
                <a href="/reports" className="ml-4 text-gray-800 underline">
                    Отчеты
                </a>
            </li>
        </ul>
    );
}