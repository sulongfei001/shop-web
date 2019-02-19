class Paging {
    static nextPageNo(length, pageSize) {
        return length % pageSize === 0 ? (length / pageSize + 1) : ((length - length % pageSize) / pageSize + 2);
    }
}

export default Paging;