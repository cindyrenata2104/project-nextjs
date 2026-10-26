interface PaginationProps {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
}
const Pagination = (props: PaginationProps) => {
    return (
        <div>
            Halaman  {props.currentPage} dari {props.totalPages}
            <button
                onClick={() => props.onPageChange(props.currentPage - 1)}
                disabled={props.currentPage === 1}>
                sebelumnya
            </button>
            <button

                onClick={() => props.onPageChange(props.currentPage + 1)}
                disabled={props.currentPage === props.totalPages}
            >
                Berikutnya
            </button>
        </div>
    )
}
export default Pagination