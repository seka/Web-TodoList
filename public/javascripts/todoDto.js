function makeDto(task, limit, priority, check) {
    return {
        task       : task     || ""
        , limit    : limit    || ""
        , priority : priority || 'low'
        , check    : check    || false
    };
}
