interface PaginationProps {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
}
const Pagination = (props: PaginationProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <p className="text-sm text-gray-600">
                Halaman <span className="font-semibold text-gray-900">{props.currentPage}</span> dari{' '}
                <span className="font-semibold text-gray-900">{props.totalPages > 0 ? props.totalPages : 1}</span>
            </p>
            <div className="inline-flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => props.onPageChange(props.currentPage - 1)}
                    disabled={props.currentPage <= 1}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Sebelumnya</span>
                </button>
                <button
                    type="button"
                    onClick={() => props.onPageChange(props.currentPage + 1)}
                    disabled={props.currentPage >= props.totalPages || props.totalPages === 0}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                    <span>Berikutnya</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
export default Pagination