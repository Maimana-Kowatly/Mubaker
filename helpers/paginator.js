exports.paginator = (items, current_page, per_page_items) => {
    let page = current_page || 1,
        per_page = per_page_items || 10,
        offset = (page - 1) * per_page,
        paginatedItems = items.slice(offset).slice(0, per_page_items),
        total_pages = Math.ceil(items.length / per_page);
    return {
        page: page,
        limit: per_page,
        previous_page: page - 1 ? page - 1 : null,
        next_page: (total_pages > page) ? parseInt(page) + 1 : null,
        total_items: items.length,
        total_pages: total_pages,
        data: paginatedItems
    };
}